const _ = require('lodash');
const path = require("path");
const config = require('config');
const fs = require("fs");
const ejs = require('ejs');
const emailService = require('../../services/EmailService');
const smsService = require('../../services/SMSService');
const hyperLedgerService = require('../../services/HyperLedgerService');
const commonUtility = require('../../helpers/CommonUtility');
const logManager = require('../../helpers/LogManager');
const BaseController = require('../BaseController');

const App = require('../../models/apps');
const KycDocument = require('../../models/kycdocument');
const VerificationReasons = require('../../models/verificationReason');
const EmailTemplatesPath = path.join(__dirname + "/../../public/email_template");

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
            let appReasons = [];   //docData.app_data.verification_reasons
            let reasonList = await VerificationReasons.find();
            //update reason array with state = checked
            // reasonList[4].state = 1;
            // reasonList[1].state = true;
            // reasonList[2].state = 0;

            let isVerified = (docData.app_data.status == config.APP_STATUSES.VERIFIED);
            let kycData = {
                app_key: docData.app_key,
                eKycId: isVerified ? docData.app_data.ekyc_id : docData.app_data.status,
                country_iso:docData.app_data.country_iso,
                is_verified: isVerified,
                hash: docData.hash,
                verification_comment: docData.verification_comment,
                verification_code: docData.app_data.verification_code,
                email:docData.app_data.email,
                phone: "+" + docData.app_data.isd_code + "-" + docData.app_data.phone,
                BasicInfo: this.GetDocumentInfo(docData.basic_info, "BASIC"),
                IdentityInfo: this.GetDocumentInfo(docData.identity_info, "IDENTITY"),
                AddressInfo: this.GetDocumentInfo(docData.address_info, "ADDRESS"),
                reasonList: reasonList
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
            var emailTemplateHtml = '/kyc_reject.html';
            var subject = 'EvolveChain KYC - Rejected';
            var resubmitPin = '';

            if (isVerified) {
                //generate eKycId 
                eKycId = commonUtility.GenerateKYCId(appData.country_iso, basicDetails.firstname);
                appStatus = config.APP_STATUSES.VERIFIED;
                emailTemplateHtml = '/kyc_success.html';
                subject = 'EvolveChain KYC - Approved';
            }
            else {
                //generate resubmit pin
                resubmitPin = commonUtility.GenerateOTP(6);
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
                            verification_reasons:reasonList
                        }
                }
            //send email 
            var template = fs.readFileSync(EmailTemplatesPath + emailTemplateHtml, {
                encoding: 'utf-8'
            });

            var emailBody = ejs.render(template, {
                eKycId: eKycId,
                resubmitPin: resubmitPin,
                APP_LOGO_URL: config.get('APP_LOGO_URL'),
                SITE_NAME: config.get('app_name'),
                CURRENT_YEAR: config.get('current_year')
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

    GetDocumentInfo(docInfo, docType) {
        let summaryInfo = {
            DocDetails: [],
            DocImages: []
        };

        if (docInfo.details != undefined) {
            var details = docInfo.details;
            let images = docInfo.images;

            let metaDataInfo = commonUtility.GetKycDocumentMetaDataInfo(docType);
            let detailKeys = Object.keys(details);
            Object.keys(metaDataInfo).forEach(function (key) {
                //if(detailKeys.hasOwnProperty(key)){
                summaryInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': details[key] });
                // }
            });            
            for (var j = 0; j < images.length; j++) {
                let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
                summaryInfo.DocImages.push({ 'url': imgUrl });

            }
        }
        return summaryInfo;
    }
}

module.exports = new VerifyController();