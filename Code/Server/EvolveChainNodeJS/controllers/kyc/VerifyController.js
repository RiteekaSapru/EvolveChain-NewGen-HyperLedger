const _ = require('lodash');
// const async = require('async');
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
        let baseURL = commonUtility.GetAppBaseUrl(req); //config.base_url

        try {
            
            let appKey =  req.params.key;
            let document_query = {
                app_key: appKey,
                isDelete: 0
            }

            KycDocument.findOne(document_query).populate('app_data').exec((error, docData)=> {
                
                if (error) {
                    logManager.Log(`GetKYCVerificationInfo-Error: ${error}`);
                    return res.redirect(baseURL);
                }

                if (!docData) {
                    logManager.Log(`GetKYCVerificationInfo-Doc not found`);
                    return res.redirect(baseURL);
                }

                let kycData = {
                    app_key: docData.app_key,
                    eKycId:  docData.is_verified ? docData.app_data.ekyc_id : '',
                    is_verified: docData.is_verified,
                    hash: docData.hash,
                    verification_comment: docData.verification_comment,
                    BasicInfo: this.GetDocumentInfo(docData.basic_info, "BASIC"),
                    IdentityInfo: this.GetDocumentInfo(docData.identity_info, "IDENTITY"),
                    AddressInfo: this.GetDocumentInfo(docData.address_info, "ADDRESS")
                }
                res.render('web/verifiyKycDocuments.html', { kycData: kycData });
            
            });

        } catch (e) {
            logManager.Log(`GetKYCVerificationInfo-Exception: ${e}`);
            return res.redirect(baseURL);
        }
    }

    async VerifyKyc(req, res) {
        try {

            const appKey= req.params.key;
            let document_query = {
                app_key: appKey,
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
                        verification_time: commonUtility.UtcNow(),
                        last_modified: commonUtility.UtcNow(),
                        verification_by: "Admin"//set the email of verifier

                    }
                }
                KycDocument.update(document_query, setParams).then((success) => {

                    //generate eKycId if successfully updated
                    const eKycId = commonUtility.GenerateKYCId();
                    App.update({'key':appKey}, {$set:{'ekyc_id': eKycId}}).then((error, updatedApp)=>
                    {
                        return res.redirect(req.baseUrl + "/verify/" + docData.app_key);
                    });
                    //update app status to verified
                    //send email to user
                   
                });

            })

        } catch (e) {
            logManager.Log(`VerifyKyc-Exception: ${e}`);
            res.render('web/contact.html', {});
        }
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
            // Object.keys(details).forEach(function (key) {
            //     if(metaDataInfo.hasOwnProperty(key)){
            //         summaryInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': details[key] });
            //     }
            // });

            for (var j = 0; j < images.length; j++) {
              let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
                 summaryInfo.DocImages.push({ 'url': imgUrl});

            }
        }
        return summaryInfo;
    }
}

module.exports = new VerifyController();