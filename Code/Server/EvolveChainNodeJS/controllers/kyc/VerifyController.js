const _ = require('lodash');
const config = require('config');
const fs = require("fs");
const ejs = require('ejs');
const md5 = require('md5');
const emailService = require('../../services/EmailService');
const smsService = require('../../services/SMSService');
const hyperLedgerService = require('../../services/HyperLedgerService');
const commonUtility = require('../../helpers/CommonUtility');
const logManager = require('../../helpers/LogManager');
const BaseController = require('../BaseController');

const App = require('../../models/apps');
const KycDocument = require('../../models/kycdocument');
const ProofDocuments = require('../../models/proofdocuments');
const VerificationReasons = require('../../models/verificationReason');


const messages = config.messages;

class VerifyController extends BaseController {

    async GetKYCVerificationInfo(req, res) {

        let baseURL = commonUtility.GetAppBaseUrl(req); //config.base_url
        let appKey = req.params.key;
        try {

            let document_query = {
                app_key: appKey,
                isDelete: 0
            }

            var docData = await KycDocument.findOne(document_query).populate('app_data').exec();// => {

            if (!docData) {
                logManager.Log(`GetKYCVerificationInfo-Doc not found`);
                return res.redirect(baseURL);
            }

            //Get exisitng reasons 
            let appReasons = docData.app_data.verification_reasons;
            let allReasons = await VerificationReasons.find();

            for (var j = 0; j < appReasons.length; j++) {
                let idx = allReasons.findIndex(r => r.code == appReasons[j]);
                allReasons[idx].state = true;
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
            res.render('web/verifiyKycDocuments.html', { kycData: kycData });

        } catch (e) {
            logManager.Log(`GetKYCVerificationInfo-Exception: ${e}`);
            return res.redirect(baseURL);
        }
    }

    async VerifyKyc(req, res) {

        let baseURL = commonUtility.GetAppBaseUrl(req); //config.base_url
        const appKey = req.params.key;
        try {
            var userEmailId = "";
            let app_query = {
                key: appKey,
                isdelete: 0
            }

            var appData = await App.findOne(app_query).populate('kycdoc_data').exec();

            if (!appData) {
                return res.redirect(baseURL);
            }

            //check if it is already verified
            let alreadyVerified = (appData.status == config.APP_STATUSES.VERIFIED);
            if (alreadyVerified) {
                return res.redirect(baseURL);
            }

            userEmailId = appData.email;
            var action = req.body.action;

            var reasonList = req.body.reasonList;

            let isVerified = (action.toUpperCase() == "VERIFY");

            let basicDetails = appData.kycdoc_data.basic_info.details;

            var eKycId = "";
            var appStatus = config.APP_STATUSES.REJECTED;
            var emailTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/kycRejected.html';
            var subject = 'EvolveChain KYC - Rejected';

            if (isVerified) {
                //generate eKycId 
                eKycId = commonUtility.GenerateKYCId(appData.country_iso, basicDetails.firstname);
                appStatus = config.APP_STATUSES.VERIFIED;
                emailTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/kycApproved.html';
                subject = 'EvolveChain KYC - Approved';
            }

            var appSetParams =
                {
                    $set:
                        {
                            'ekyc_id': eKycId,
                            'status': appStatus,
                            verification_comment: req.body.textBoxComment,
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
                eKycId: eKycId,
                expiryDays: '15',
                APP_LOGO_URL: config.get('APP_LOGO_URL'),
                SITE_NAME: config.get('app_name'),
                CURRENT_YEAR: config.get('current_year'),
                REASON_LIST: reasonDefinition.map(x => x.reason)
            });

            if (isVerified && eKycId != '') {

                var hlResult = await hyperLedgerService.PostEkycDetails(eKycId, appData.email, appData.phone, appData.isd_code, basicDetails);//.then((result) => {
                if (hlResult && hlResult.eKYCId == eKycId) {
                    var result = await this.NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams);
                }
                else
                    return res.redirect(baseURL);
            }
            else {
                var result = await this.NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams);

            }
        } catch (ex) {
            logManager.Log(`VerifyKyc-Exception: ${ex.message}`);
            return res.redirect(baseURL);

        }
        return res.redirect(req.baseUrl + "/verify/" + appKey);
    }


    async NotifyUserAndUpdateApp(userEmailId, subject, emailBody, appKey, appSetParams) {
        var emailSuccess = await emailService.SendEmail(userEmailId, subject, emailBody);
        var appSuccess = await App.update({ 'key': appKey }, appSetParams);
        return (appSuccess);
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
}

module.exports = new VerifyController();