const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const async = require('async');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
const commonUtility = require('../../helpers/CommonUtility');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb');
const md5 = require('md5');
const App = require('../../models/apps');
const Document = require('../../models/document');
const KycDocument = require('../../models/kycdocument');
const Question = require('../../models/question');
const File = require('../../models/files');
var templatesjs = require('templatesjs');

var bucket;

const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
    test: {
        new: 1,
        old: 0
    }
}

class Verify {
    async GetKYCVerificationInfo(req, res) {
        try {

            let document_query = {
                app_key: req.params.key,
                isDelete:0
            }

            KycDocument.findOne(document_query, (error, docData) => {

                if (error) {
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!docData) return res.redirect(config.get('base_url'));


                var kycDocInfoList = [];

                let docInfoList = docData.docInfo;                
                for (var i = 0; i < docInfoList.length; i++) {
                    var DocInfo = {
                        DocType: _.toUpper(docInfoList[i].docType),
                        DocDetails: [],
                        DocImages: []
                    };
                    let metaDataInfo = commonUtility.GetKycDocumentMetaDataInfo(DocInfo.DocType);
                    Object.keys(docInfoList[i].details).forEach(function (key) {
                        DocInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': docInfoList[i].details[key] });
                    });

                    let Images = docInfoList[i].images;

                    for (var j = 0; j < Images.length; j++) {
                        // DocInfo.DocImages.push({ 'url': Images[j].id });
                        DocInfo.DocImages.push({ 'url': 'https://images.pexels.com/photos/346796/pexels-photo-346796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' });

                    }

                    kycDocInfoList.push(DocInfo);

                }

               let kycData = {
                   app_key: docData.app_key,
                   eKycId: "", //get it from app if already verified
                   is_verified: docData.is_verified,                   
                   hash:docData.hash,
                   verification_comment:  docData.verification_comment,
                   docInfo: kycDocInfoList
               }

                res.render('web/verifiyKycDocuments.html', { kycData: kycData });


            })


        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async VerifyKyc(req, res) {
        try {

            let document_query = {
                app_key: req.params.key,
                isDelete:0
            }

            KycDocument.findOne(document_query, (error, docData) => {

                if (error) {
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!docData) return res.redirect(config.get('base_url'));
                let isVerified = (req.body.radioButtonVerify == "0" ? 0 : 1);
                var setParams = {
                    $set: {
                        is_verified:isVerified ,
                        verification_comment: req.body.textBoxComment,
                        verification_time: commonUtility.NowDate() ,
                        last_modified: commonUtility.NowDate() ,
                        verification_by:"Admin"//set the email of verifier

                    }
                }
                KycDocument.update(document_query, setParams).then((success)=>{
                    
                    //generate eKycId if successfully updated
                    //update app status to verified
                    //send email to user
                    return res.redirect(config.get('base_url')+"/verify/"+ docData.app_key);
                });

            })
          
        } catch (e) {
            //develop an error page for the same           
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    // get KYC documents images
    async getDocumentImage(id = null, type = null, callback) {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        var file_field = 'details_' + type + '_id';
        var conditions = {
            [file_field]: id
        }
        File.findOne(conditions, (error, fileData) => {

            if (error) {

                let err = `Error :: ${error}`;
                response.message = err;
                callback(response);

            } else if (!fileData) {

                response.message = messages.app_not_found;
                callback(response);

            } else {

                var image_name_name = fileData._id + '_' + fileData.filename;
                var path = 'public/webroot/documents/' + image_name_name;
                var return_path = config.get('COMPANY_URL') + '/documents/' + image_name_name;

                bucket.openDownloadStream(fileData._id)
                    .pipe(fs.createWriteStream(path))
                    .on('error', function (error) {
                        assert.ifError(error);
                        response.message = err;
                    })
                    .on('finish', function () {

                        response.error = false;
                        response.message = messages.image_data;
                        response.data = return_path;
                        callback(response);
                    });
            }
        });
    }
}

module.exports = new Verify();