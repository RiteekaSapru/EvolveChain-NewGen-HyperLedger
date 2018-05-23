const _ = require('lodash');
const async = require('async');
const config = require('config');
const emailService = require('../../services/EmailService')
const smsService = require('../../services/SMSService')
const commonUtility = require('../../helpers/CommonUtility');
const logManager = require('../../helpers/LogManager');
const BaseController = require('../BaseController');

const App = require('../../models/apps');
const KycDocument = require('../../models/kycdocument');

const messages = config.messages;
const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
    test: {
        new: 1,
        old: 0
    }
}

class VerifyController extends BaseController {
    async GetKYCVerificationInfo(req, res) {
        try {

            // let test = config.ERROR_CODES.DEVICE_MISMATCH;
            let document_query = {
                app_key: req.params.key,
                isDelete: 0
            }

            KycDocument.findOne(document_query, (error, docData) => {
                if (error) {
                    logManager.Log(`GetKYCVerificationInfo-Error: ${error}`);
                    return res.redirect(config.base_url);

                }

                if (!docData) {
                    logManager.Log(`GetKYCVerificationInfo-Doc not found`);
                    return res.redirect(config.base_url);
                }

                let kycData = {
                    app_key: docData.app_key,
                    eKycId: "", //get it from app if already verified
                    is_verified: docData.is_verified,
                    hash: docData.hash,
                    verification_comment: docData.verification_comment,
                    BasicInfo: this.GetDocumentInfo(docData.basic_info),
                    IdentityInfo: this.GetDocumentInfo(docData.identity_info),
                    AddressInfo: this.GetDocumentInfo(docData.address_info)
                }

                res.render('web/verifiyKycDocuments.html', { kycData: kycData });

            }).catch(function (e) {
                logManager.Log(`GetKYCVerificationInfo-Exception: ${e}`);
                return res.redirect(config.base_url);
            });
        } catch (e) {
            logManager.Log(`GetKYCVerificationInfo-Exception: ${e}`);
            return res.redirect(config.base_url);
        }
    }

    async VerifyKyc(req, res) {
        try {

            let document_query = {
                app_key: req.params.key,
                isDelete: 0
            }

            KycDocument.findOne(document_query, (error, docData) => {

                if (error) {
                    logManager.Log(`VerifyKyc-Error: ${e}`);
                    res.render('web/contact.html', {});
                }

                if (!docData) {
                    logManager.Log(`VerifyKyc-Error: ${e}`);
                    res.render('web/contact.html', {});
                }

                let isVerified = (req.body.radioButtonVerify == "0" ? 0 : 1);
                var setParams = {
                    $set: {
                        is_verified: isVerified,
                        verification_comment: req.body.textBoxComment,
                        verification_time: commonUtility.NowDate(),
                        last_modified: commonUtility.NowDate(),
                        verification_by: "Admin"//set the email of verifier

                    }
                }
                KycDocument.update(document_query, setParams).then((success) => {

                    //generate eKycId if successfully updated
                    //update app status to verified
                    //send email to user
                    return res.redirect(req.baseUrl + "/verify/" + docData.app_key);
                });

            })

        } catch (e) {
            logManager.Log(`VerifyKyc-Exception: ${e}`);
            res.render('web/contact.html', {});
        }
    }


    GetDocumentInfo(docInfo) {
        let summaryInfo = {
            DocDetails: [],
            DocImages: []
        };

        if (docInfo.details != undefined) {
            var details = docInfo.details;
            let images = docInfo.images;

            let metaDataInfo = commonUtility.GetKycDocumentMetaDataInfo("BASIC");
            Object.keys(details).forEach(function (key) {
                summaryInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': details[key] });
            });

            for (var j = 0; j < images.length; j++) {
              let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
                // DocInfo.DocImages.push({ 'url': basicImages[j].id });
                // summaryInfo.DocImages.push({ 'url': 'https://images.pexels.com/photos/346796/pexels-photo-346796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' });
                summaryInfo.DocImages.push({ 'url': imgUrl});

            }
        }
        return summaryInfo;
    }
}

module.exports = new VerifyController();