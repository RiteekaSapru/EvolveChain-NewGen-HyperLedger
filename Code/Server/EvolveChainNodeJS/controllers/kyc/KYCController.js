const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const async = require('async');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
const utility = require('../../config/utility');
const emailService = require('../../services/EmailService')
const smsService = require('../../services/SMSService')
const commonUtility = require('../../helpers/CommonUtility');
const logManager = require('../../helpers/LogManager');
const BaseController = require('../BaseController');

const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb');

const md5 = require('md5');
const multer = require('multer');
const authenticator = require('authenticator');

const App = require('../../models/apps');
const KYCDocument = require('../../models/kycdocument');
const File = require('../../models/files');
const Share = require('../../models/shares');
const Wallet = require('../../models/wallet');
const ConfigDB = require('../../models/config');

const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');

//var to = config.get('ver_mail_id');
var im = require('imagemagick');

var bucket;
mongo.MongoClient.connect(config.get('MONGODB_URL'), function (err, db) {
    if (err) {
        console.log("Database....." + err);
    }
    else {
        database = db.db(config.get('DB_NAME'));
        bucket = new mongo.GridFSBucket(database);
    }
});

// let storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         var fileMime = file.mimetype.split('/')[0];
//         if (fileMime == 'image') {
//             callback(null, config.get('documents_path'));
//         } else if (fileMime == 'video') {
//             callback(null, config.get('documents_path'));
//         }
//     },
//     filename: function (req, file, callback) {
//         callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

let storage = multer.memoryStorage()

class KYCController extends BaseController {

    async GetDocumentImages(req, res) {

        var conditions = {
            _id: req.params.key
        }

        var kycController = this;

        try {

            File.findOne(conditions, (error, file) => {

                if (error) {
                    return kycController.SendErrorResponse(res, config.ERROR_CODES.ERROR, error);
                }
                if (!file) return kycController.GetErrorResponse(messages.file_not_found, res);

                var img = new Buffer(file.data, 'base64');

                res.contentType(file.contentType);
                res.status(status.OK).send(img);
            })
        }
        catch (ex) {
            return kycController.SendExceptionResponse(res, ex);
        }
    }

    async SaveKycDocument(req, res) {

        // var upload = multer({
        //     storage: storage
        // }).array('file[]', 2);

        //var kycController = this;//new KYCController();

        try {

            // await upload(req, res);

            // upload(req, res, async function (err) {

            //     if (err) {
            //         return kycController.SendErrorResponse(res, config.ERROR_CODES.ERROR, err);
            //     }

            //     if (!err) 
            //    var  proofDocuments = await App.findOne();

            req.checkBody("step", messages.req_step).notEmpty();
            req.checkBody("step", messages.req_valid_step).isIn(['basic', 'address', 'identity', 'face']);
            //req.checkBody("substep", messages.req_valid_step).isIn(['basic', 'passport', 'taxation', 'license', 'utility_bill']);

            let substep = req.body.substep;
            switch (req.body.step) {
                case "basic":
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("gender", messages.req_gender).notEmpty();
                    req.checkBody("dob", messages.req_dob).notEmpty();
                    req.checkBody("city", messages.req_city).notEmpty();
                    req.checkBody("address1", messages.req_address).notEmpty();
                    req.checkBody("zip", messages.req_zip).notEmpty();
                    req.checkBody("state", messages.req_state).notEmpty();
                    req.checkBody("street", messages.req_street).notEmpty();
                    req.checkBody("country", messages.req_country).notEmpty();
                    req.checkBody("place_of_birth", messages.req_pob).notEmpty();
                    break;
                case "address":
                case "identity":
                    //if (substep == "passport") { 
                    req.checkBody("number", messages.req_number).notEmpty();
                    req.checkBody("country", messages.req_country).notEmpty();
                    //req.checkBody("expiry_date", messages.req_dob).notEmpty();
                    //}
                    break;
                case "face":
                    req.checkBody("number", messages.req_number).notEmpty();
                    break;
                default:
                    return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, "Step name missing");
                    break;
            }

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = `SaveKYCDocumnet:Error - ${this.GetErrors(result)}`;
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            var filesBufferObject = {};
            var imageArrayForDoc = [];

            let body = req.body;

            let key = req.params.key;
            var conditions = {
                app_key: key,
                isDelete: "0"
            }

            var docData = await KYCDocument.findOne(conditions).populate('app_data');//.exec((error, docData) => {

            // if (error) {
            //     let error = `SaveKYCDocumnet:Error - ${error}`;
            //     return kycController.SendErrorResponse(res, config.ERROR_CODES.ERROR, error);
            // }

            if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

            var app = docData.app_data;
            if (!app) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            if (!app.phone || !app.email)
                return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, "Phone or Email not yet verified");

            let infoType = body.step + "_info";
            this.SaveDocumentImages(req.files, (response) => {
                // var response = await this.SaveDocumentImages(req.files);

                if (response.error == true) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, response.message);
                }
                else {

                    var imageArrayForDoc = response.data;
                    //Saving Document Object
                    this.SaveDocumentObject(docData, body, imageArrayForDoc).then((updatedDoc) => {

                        this.DeleteDocumentImages(docData, body).then((deletedresult) => {

                            var data = {
                                'success': 1,
                                'now': Date.now(),
                                'result': messages.success
                            }
                            return res.status(status.OK).jsonp(data);

                        }).catch((ex) => {
                            return this.SendExceptionResponse(res, ex);
                        });

                    }).catch((ex) => {
                        return this.SendExceptionResponse(res, ex);
                    });
                }
            });
            // });
            //});
        }
        catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }

    }

    async SaveDocumentImages(filesFrmRequest, callback) {

        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        var imageArrayForDoc = [];

        async.eachSeries(filesFrmRequest, (file, outerSubCallback) => {

            var newFileObj;
            newFileObj = {
                data: file.buffer,
                contentType: file.mimetype,
                //key: image._id.toString()
            };

            var newfile = new File(newFileObj)
            newfile.save().then((savedFile) => {

                //Create image detail array for 
                imageArrayForDoc.push({
                    name: file.originalname,
                    contentType: file.mimetype,
                    encoding: file.encoding,

                    //Saving the ID of File into the KYC document
                    file_key: savedFile._id.toString()
                });

                outerSubCallback(null);

            }).catch((error) => {
                outerSubCallback(new Error('Error in image upload' + error));
            });

        }, (err, results) => {

            ///Find way to check error here...
            if (err) {
                response.error = true;
                response.message = error;
                callback(response);
            }

            response.error = false;
            response.data = imageArrayForDoc;
            response.message = "";
            // {
            //     'success': 1,
            //     'now': Date.now(),
            //     'result': messages.save_basic_info
            // }
            //response.message = messages.save_basic_info;
            callback(response);
        });
    }

    DeleteDocumentImages(docData, body) {

        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        var imageKeysForDelete = [];
        let infoType = body.step + "_info";
        var images = docData[infoType].images;

        if (images == undefined || images == null || images.length == 0) {

        }

        var fileIdsToDelete = images.map(a => a.file_key);

        //If new upload...
        //if (images == null || images ==)
        return File.deleteMany({ _id: { $in: fileIdsToDelete } });
    }

    SaveDocumentObject(docData, body, imgArr) {

        var obj = docData;

        var details = {};
        var images = [];
        var valid = true;
        var errorMsg = "Validation Failed";
        var docInfo = {};
        var setParams = {
            //last_modified: new Date(Date.now())
        };



        switch (body.step) {

            case "basic":
                details = {
                    firstname: body.firstname,
                    middlename: body.middlename,
                    lastname: body.lastname,
                    gender: body.gender,
                    dob: body.dob,
                    city: body.city,
                    address1: body.address1,
                    address2: body.address2,
                    place_of_birth: body.place_of_birth,
                    zip: body.zip,
                    state: body.state,
                    country: body.country,
                    street: body.street,
                    document_type: "basic"
                };
                setParams.basic_info = {};
                setParams.basic_info.details = details;
                setParams.basic_info.images = imgArr;
                break;

            case "address":

                details = {
                    number: body.number,
                    expiry_date: body.expiry_date,
                    country: body.country,
                    document_type: body.substep,
                    sub_document_type: body.subdoc
                };
                setParams.address_info = {};
                setParams.address_info.details = details;
                setParams.address_info.images = imgArr;
                break;

            case "identity":
                details = {
                    number: body.number,
                    expiry_date: body.expiry_date,
                    country: body.country,
                    document_type: body.substep,
                    sub_document_type: body.subdoc
                };
                setParams.identity_info = {};
                setParams.identity_info.details = details;
                setParams.identity_info.images = imgArr;
                break;

            case "face":
                details = {
                    number: body.number
                };
                setParams.face_info = {};
                setParams.face_info.details = details;
                setParams.face_info.images = imgArr;
                break;

            default:
                break;
        }

        if (!valid) {
            return new Promise((resolve, reject) => {
                // console.log("It is done.");
                // // Succeed half of the time.
                // if (valid) {
                //   resolve(obj);
                // } else 

                // {
                reject(new Error(errorMsg));
                //}
            })
        }

        return KYCDocument.findByIdAndUpdate(obj._id.toString(),
            {
                // $set: {
                //     docInfo: obj.docInfo,
                //     //status: documentStatus.InProcess,
                //     last_modified: new Date(Date.now())
                // }
                $set: setParams
            }
            , { new: true });
    }

    async SubmitKycDocument(req, res) {

        var kycController = new KYCController();
        req.checkBody("app_key", messages.req_app_key).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = kycController.GetErrors(result);
                return kycController.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['app_key']);
            var conditions = {
                app_key: body.app_key
            }

            var docData = await KYCDocument.findOne(conditions);
            if (!docData)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);

            if (docData.basic_info.details == undefined || docData.basic_info.details == null || docData.basic_info.details.document_type == undefined)
                return this.SendErrorResponse(res, config.ERROR_CODES.BASIC_DOCS_MISSING);

            if (docData.identity_info.details == undefined || docData.identity_info.details == null || docData.identity_info.details.document_type == undefined)
                return this.SendErrorResponse(res, config.ERROR_CODES.IDENTITY_DOCS_MISSING);

            if (docData.address_info.details == undefined || docData.address_info.details == null || docData.address_info.details.document_type == undefined)
                return this.SendErrorResponse(res, config.ERROR_CODES.ADDRESS_DOCS_MISSING);

            if (docData.face_info.details == undefined || docData.face_info.details == null)
                return this.SendErrorResponse(res, config.ERROR_CODES.FACE_DOCS_MISSING);


            var basic_images_id = docData.basic_info.images.map(x => mongoose.Types.ObjectId(x.file_key));
            var address_images_id = docData.address_info.images.map(x => mongoose.Types.ObjectId(x.file_key));
            var identity_images_id = docData.identity_info.images.map(x => mongoose.Types.ObjectId(x.file_key));
            var face_images_id = docData.face_info.images.map(x => mongoose.Types.ObjectId(x.file_key));

            var all_image_ids = basic_images_id.concat(address_images_id).concat(identity_images_id).concat(face_images_id);

            var result_all = await File.find(
                { _id: { $in: all_image_ids } },
                { _id: 1 }
            );
            if ((all_image_ids.length !== result_all.length)) return kycController.GetErrorResponse(messages.file_not_found, res);

            //link send through email 
            var template = fs.readFileSync(config.EMAIL_TEMPLATES_PATH + '/verifyKycRequest.html', {
                encoding: 'utf-8'
            });

            let configCol = await ConfigDB.findOne({});
            let toEmailIds = configCol.approver_emails.join(",")

            var emailBody = ejs.render(template, {
                kyc_verify_url: config.get('base_url') + "/verify/" + docData.app_key,
                APP_LOGO_URL: config.get('APP_LOGO_URL'),
                SITE_NAME: config.get('app_name'),
                CURRENT_YEAR: config.get('current_year')
            });
            const subject = 'EvolveChain KYC - Verification Request';
            var emailSuccess = await emailService.SendEmail(toEmailIds, subject, emailBody);

            //Updating the app
            var appConditions = {
                key: docData.app_key
            }
            var params = {
                status: config.APP_STATUSES.IN_PROCESS
            }

            var updatedVal = await App.update(appConditions, params);

            let response = {
                'success': 1,
                'now': Date.now(),
                'result': messages.success
            }
            return res.status(config.HTTP_STATUSES.OK).jsonp(response);
            // return this.GetSuccessResponse("SubmitKycDocument", docData, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }
}

module.exports = new KYCController();