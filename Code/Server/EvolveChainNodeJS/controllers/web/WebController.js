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
const Admin = require('../../models/admin');
const File = require('../../models/files');
const ConfigDB = require('../../models/config');
const ProofDocuments = require('../../models/proofdocuments');

const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
}

class Web  extends baseController{

    async PreInitialize(req, res) {

        var countries  = await Country.find();
        var config = await commonUtility.GetInitConfig();
        console.log(config);
        var responseConfig ={};
        responseConfig.country = countries;
        responseConfig.configuration = config;

        return res.status(status.OK).jsonp(responseConfig);
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
                $set: {token:token_id}
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

            if(body.status == null || body.status==undefined|| body.status=="")
            {
                appData = await App.find();
            }

            if(body.status!= null && body.status!=undefined){
                var conditions = {
                    status : body.status
                }
                appData = await App.find(conditions);
            }

            if (!appData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            var appDetails=[];

            for (var j = 0; j < appData.length; j++) {
                appDetails.push({
                    'email': appData[j].email,
                    'phone':appData[j].phone,
                    'isd_code':appData[j].isd_code,
                    'key':appData[j].key,
                    'ekyc_id':appData[j].ekyc_id,
                    'country_iso':appData[j].country_iso,
                    'name':appData[j].name,
                    'status':appData[j].status
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
                logManager.Log(`GetKYCVerificationInfo-Doc not found`);
                return res.redirect(baseURL);
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
            //res.render('web/verifiyKycDocuments.html', { kycData: kycData });
           // res. { kycData: kycData });
            return res.status(200).jsonp({ kycData: kycData });

        } catch (e) {
            logManager.Log(`GetKYCVerificationInfo-Exception: ${e}`);
            return res.redirect(baseURL);
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

            var countStatus = await App.aggregate([{"$group" : {_id:"$status", count:{$sum:1}}}])

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

            var countCountry = await App.aggregate([{"$group" : {_id:"$country_iso", count:{$sum:1}}}])

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

    GetSuccessResponse(apiName, appEntity, docEntity, res){
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
    async index(req, res) {
        try {
            fs.readFile("./views/web/index.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async about(req, res) {
        try {
            fs.readFile("./views/web/about.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async contact(req, res) {
        try {
            fs.readFile("./views/web/contact.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async download(req, res) {
        try {
            fs.readFile("./views/web/download.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }
    async WelcomeApi(req, res) {

        try {
        
            // var response = {
            //     "success": 1,
            //     "message":"Welcome to EvolveChain"
            // }
            var response= "Welcome To EvolveChain";
            return res.status(status.OK).jsonp(response);


        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

}

 module.exports = new Web();