var randomstring = require("randomstring");
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const status = config.get('status');
const messages = config.get('messages');

const md5 = require('md5');
const emailService = require('../../services/EmailService')
const smsService = require('../../services/SMSService')
const commonUtility = require('../../helpers/CommonUtility');
const baseController = require('../BaseController');
const logManager = require('../../helpers/LogManager');
const mongoose = require('mongoose');
const async = require('async');

var ObjectId = require('mongodb').ObjectID;
var templatesjs = require('templatesjs');

const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');

const Country = require('../../models/country');
const App = require('../../models/apps');
const KYCDocument = require('../../models/kycdocument');
const VerificationReasons = require('../../models/verificationReason');
const Admin = require('../../models/admin');
const File = require('../../models/files');
const ConfigDB = require('../../models/config');
const ProofDocuments = require('../../models/proofdocuments');

const notificationHelper = require('../../helpers/NotificationHelper');

class Web extends baseController {

    async PreInitialize(req, res) {

        try {
            var countries = await Country.find();
            var config = await commonUtility.GetInitConfig();

            var responseConfig = {};
            responseConfig.country = countries;
            responseConfig.configuration = config;

            return res.status(status.OK).jsonp(responseConfig);
            
        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async VerifyKYC(req, res) {

        //let baseURL = commonUtility.GetAppBaseUrl(req); //config.base_url
        //const appKey = req.params.key;

        req.checkBody("appKey", messages.req_app_key).notEmpty();
        //req.checkBody("reason_codes", messages.req_password).notEmpty();
        //req.checkBody("is_accepted", messages.req_password).notEmpty();
        //req.checkBody("comment", messages.req_password).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['appKey', 'reason_codes', 'is_accepted', 'comment']);

            const appKey = body.appKey;
            var userEmailId = "";
            let app_query = {
                key: appKey,
                isdelete: false
            }

            let configCol = await ConfigDB.findOne({});
            var appData = await App.findOne(app_query).populate('kycdoc_data').exec();

            if (!appData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            //check if it is already verified
            let alreadyVerified = (appData.status == config.APP_STATUSES.VERIFIED);
            if (alreadyVerified) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, "App is already verified");
            }

            userEmailId = appData.email;
            //var action = req.body.action;

            var reasonList = body.reason_codes;
            let isVerified = body.is_accepted;//(action.toUpperCase() == "VERIFY");

            //For Handling the Expired case..
            let isAlreadyVerified = false;

            // let basicDetails = appData.kycdoc_data.basic_info.details;
            let basicDetails = commonUtility.GetKycDocumentInfo(appData.kycdoc_data.basic_info, "BASIC");
            let addressDetails = commonUtility.GetKycDocumentInfo(appData.kycdoc_data.address_info, "ADDRESS");
            let identityDetails = commonUtility.GetKycDocumentInfo(appData.kycdoc_data.identity_info, "IDENTITY");

            var eKYCID = "";
            var appStatus = config.APP_STATUSES.REJECTED;
            var emailTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/kycRejected.html';
            var subject = 'EvolveChain KYC - Rejected';

            if (isVerified) {
                //generate eKYCID 
                eKYCID = commonUtility.GenerateKYCId(appData.country_iso, appData.kycdoc_data.basic_info.details.firstname);
                appStatus = config.APP_STATUSES.VERIFIED;
                emailTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/kycApproved.html';
                subject = 'EvolveChain KYC - Approved';
            }

            if (appData.ekyc_id != null && appData.ekyc_id != undefined && appData.ekyc_id != "") {
                isAlreadyVerified = true;
                eKYCID = appData.ekyc_id;
            }
            var appSetParams =
                {
                    $set:
                        {
                            'ekyc_id': eKYCID,
                            'status': appStatus,
                            verification_comment: body.comment,
                            verification_time: commonUtility.UtcNow(),
                            verification_by: "Admin",//set the email of approver
                            verification_reasons: reasonList
                        }
                }

            //send email 
            var template = fs.readFileSync(emailTemplateHtml, {
                encoding: 'utf-8'
            });
            var reasonDefinition = await VerificationReasons.find(
                { "code": { $in: reasonList } },
                { "reason": 1 }
            );
            var emailBody = ejs.render(template, {
                eKycId: eKYCID,
                expiryDays: configCol.app_expiration_days,
                APP_LOGO_URL: config.get('APP_LOGO_URL'),
                SITE_NAME: config.get('app_name'),
                CURRENT_YEAR: config.get('current_year'),
                REASON_LIST: reasonDefinition.map(x => x.reason)
            });

            if (isVerified && eKYCID != '') {

                if (isAlreadyVerified == true) {
                    var hlResult = await hyperLedgerService.UpdateEkycDetails(appData.ekyc_id, appData.email, appData.phone, appData.isd_code, appData.status, appData.country_iso, basicDetails, addressDetails, identityDetails);
                    var resultNotify = await this.NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams);
                }
                else {
                    var hlResult = await hyperLedgerService.PostEkycDetails(eKYCID, appData.email, appData.phone, appData.isd_code, appData.status, appData.country_iso, basicDetails, addressDetails, identityDetails);
                    if (hlResult && hlResult.eKYCID == eKYCID) {
                        var resultNotify = await this.NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams);
                    }
                    else
                        return this.SendErrorResponse(res, config.ERROR_CODES.ERROR);
                }
            }
            else {
                var resultNotify = await this.NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams);
            }

            var response = {
                'success': 1,
                'now': commonUtility.UtcNow(),
                "result": messages.success
            }
            return res.status(status.OK).jsonp(response);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
        //return res.redirect(req.baseUrl + "/verify/" + appKey);
    }

    async NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams) {
        var appSuccess = await App.update({ 'key': appKey }, appSetParams);
        var newNotificationQueue = await notificationHelper.AddNotificationQueue(appKey, userEmailId, emailBody, config.NOTIFICATION_TYPES.EMAIL, subject);
        return newNotificationQueue;
    }

    async Login(req, res) {

        req.checkBody("email_id", messages.req_email).notEmpty();
        req.checkBody("password", messages.req_password).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['email_id', 'password']);

            var conditions = {
                email_id: body.email_id,
                password: body.password
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            var token_id = commonUtility.GenerateUniqueToken();

            var parameters = {
                $set: { token: token_id }
            }
            await Admin.update(conditions, parameters);

            // return this.GetSuccessLoginResponse(token_id, res);
            var response = {
                'success': 1,
                'now': commonUtility.UtcNow(),
                'token': token_id,
                "result": messages.login_success
            }
            return res.status(status.OK).jsonp(response);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetApplication(req, res) {

        //  req.checkBody("status", messages.req_status).notEmpty();
        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var appData;

            if (body.status == null || body.status == undefined || body.status == "") {
                appData = await App.find();
            }

            if (body.status != null && body.status != undefined) {
                var conditions = {
                    status: body.status
                }
                appData = await App.find(conditions);
            }

            if (!appData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            var appDetails = [];

            for (var j = 0; j < appData.length; j++) {
                appDetails.push({
                    'email': appData[j].email,
                    'phone': appData[j].phone,
                    'isd_code': appData[j].isd_code,
                    'key': appData[j].key,
                    'ekyc_id': appData[j].ekyc_id,
                    'country_iso': appData[j].country_iso,
                    'name': appData[j].name,
                    'status': appData[j].status
                });
            }


            return this.GetSuccessResponse("GetApplication", appDetails, null, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetKYCVerificationInfo(req, res) {

        //let baseURL = commonUtility.GetAppBaseUrl(req); //config.base_url
        req.checkBody("appkey", messages.req_app_key).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['appkey']);
            let document_query = {
                app_key: body.appkey,
                isDelete: false
            }

            var docData = await KYCDocument.findOne(document_query).populate('app_data').exec();// => {

            if (!docData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            //Get exisitng reasons 
            let appReasons = docData.app_data.verification_reasons;
            let allReasons = await VerificationReasons.find();

            if (appReasons) {
                for (var j = 0; j < appReasons.length; j++) {
                    let idx = allReasons.findIndex(r => r.code == appReasons[j]);
                    allReasons[idx].state = true;
                }
            }


            let isVerified = (docData.app_data.status == config.APP_STATUSES.VERIFIED);
            let kycData = {
                app_key: docData.app_key,
                eKycId: isVerified ? docData.app_data.ekyc_id : docData.app_data.status,
                country_iso: docData.app_data.country_iso,
                is_verified: isVerified,
                hash: docData.hash,
                verification_comment: docData.verification_comment,
                verification_code: docData.app_data.verification_code,
                email: docData.app_data.email,
                phone: "+" + docData.app_data.isd_code + "-" + docData.app_data.phone,
                BasicInfo: await this.GetDocumentInfo(docData.basic_info, docData.app_data.country_iso, "BASIC"),
                IdentityInfo: await this.GetDocumentInfo(docData.identity_info, docData.app_data.country_iso, "IDENTITY"),
                AddressInfo: await this.GetDocumentInfo(docData.address_info, docData.app_data.country_iso, "ADDRESS"),
                FaceInfo: await this.GetDocumentInfo(docData.face_info, docData.app_data.country_iso, "FACE"),
                reasonList: allReasons
            }

            var response = {
                'success': 1,
                'now': commonUtility.UtcNow(),
                kycData: kycData
            }
            return res.status(status.OK).jsonp(response);

        } catch (e) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetDocumentInfo(docInfo, countryIso, docType) {
        let summaryInfo = {
            DocDetails: [],
            DocImages: []
        };

        if (docInfo.details != undefined) {
            var details = docInfo.details;
            let images = docInfo.images;
            var proofDocuments = [];
            if (docType == "IDENTITY" || docType == "ADDRESS") {
                proofDocuments = await ProofDocuments.find({ country_iso: countryIso });
            }

            let metaDataInfo = commonUtility.GetKycDocumentMetaDataInfo(docType);
            let detailKeys = Object.keys(details);
            Object.keys(metaDataInfo).forEach(function (key) {
                if (key == 'document_type') {
                    details[key] = proofDocuments.find(d => d.code == details[key]).name;
                }
                summaryInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': details[key] });
                // }
            });
            for (var j = 0; j < images.length; j++) {
                let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j].file_key;
                summaryInfo.DocImages.push({ 'url': imgUrl });

            }
        }
        return summaryInfo;
    }

    async GetAppDetailsByPhone(req, res) {
        try {
            let phone = req.params.phone;
            var appDetail = await App.findOne({ phone: phone });
            return res.status(status.OK).jsonp(appDetail);
        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetAppSummary(req, res) {

        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var countStatus = await App.aggregate([{ "$group": { _id: "$status", count: { $sum: 1 } } }])

            if (!countStatus) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            return this.GetCountSuccessResponse("GetAppSummary", countStatus, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetAppByCountry(req, res) {

        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var countCountry = await App.aggregate([{ "$group": { _id: "$country_iso", count: { $sum: 1 } } }])

            if (!countCountry) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            // return this.GetAppByCountrySuccessResponse(countCountry, res);
            return this.GetCountSuccessResponse("GetAppByCountry", countCountry, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetAppDetails(req, res) {


        req.checkBody("token", messages.req_admin_token).notEmpty();
        req.checkBody("key", messages.req_key).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var condition = {
                key: body.key
            }

            var appData = await App.findOne(condition).populate('kycdoc_data').exec();

            if (!appData)
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            var docData = appData.kycdoc_data;//await kyc_document.findOne(con);
            if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

            var iso = appData.country_iso.toUpperCase();
            const countryDocs = await ProofDocuments.find({ country_iso: { $eq: iso } });

            //Get the Country details from ISO
            var countryDetails = await Country.findOne({ "iso": iso });

            appData.documents = countryDocs;
            appData.countryDetails = countryDetails;
            // return this.GetAppDetailsSuccessResponse(appData, docData, res);
            return this.GetSuccessResponse("GetAppDetails", appData, docData, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    GetCountSuccessResponse(apiName, count, res) {
        var response = {};
        switch (apiName) {
            case "GetAppSummary":
                response = {
                    'success': 1,
                    'now': commonUtility.UtcNow(),
                    'countByStatus': count
                };
                break;
            case "GetAppByCountry":
                response = {
                    'success': 1,
                    'now': commonUtility.UtcNow(),
                    'countByStatus': count
                }
                break;
        }

        return res.status(status.OK).jsonp(response);
    }

    GetSuccessResponse(apiName, appEntity, docEntity, res) {
        var response = {};
        switch (apiName) {
            case "GetApplication":
                response = {
                    'success': 1,
                    'now': commonUtility.UtcNow(),
                    'appDetails': appEntity
                };
                break;
            case "GetAppDetails":
                response = {
                    "success": 1,
                    'now': commonUtility.UtcNow(),
                    "name": appEntity.name,
                    "email": appEntity.email,
                    "phone": appEntity.phone,
                    'country_code': appEntity.isd_code,
                    'app_key': appEntity.key,
                    "BasicInfo": commonUtility.GetKycDocumentInfo(docEntity.basic_info, "BASIC"),
                    "AddressInfo": commonUtility.GetKycDocumentInfo(docEntity.address_info, "ADDRESS"),
                    "IdentityInfo": commonUtility.GetKycDocumentInfo(docEntity.identity_info, "IDENTITY"),
                    "FaceInfo": commonUtility.GetKycDocumentInfo(docEntity.face_info, "FACE"),
                    'documents': appEntity.documents,
                    'country_details': appEntity.countryDetails,
                    'verification_code': docEntity.face_info.details.number
                }
                break;
        }

        return res.status(status.OK).jsonp(response);
    }

    async WelcomeApi(req, res) {

        try {

            // var response = {
            //     "success": 1,
            //     "message":"Welcome to EvolveChain"
            // }
            var response = "Welcome To EvolveChain";
            return res.status(status.OK).jsonp(response);


        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

}

module.exports = new Web();