const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const async = require('async');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
const documentStatus = config.get('document_status');
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
const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');
var im = require('imagemagick');
const EmailTemplatesPath = path.join(__dirname + "/../../public/email_template");
//var to = config.get('ver_mail_id');

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

    async CreateUpdateKyc(req, res) {

        req.checkBody("email", messages.req_email).notEmpty().isEmail();
        req.checkBody("email_code", messages.req_email_code).notEmpty();
        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("mobile_code", messages.req_mobile_code).notEmpty();
        req.checkBody("ip", messages.req_IP).notEmpty();

        try {
            // var obj = new KYCController();
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }

            let body = _.pick(req.body, ['email', 'email_code', 'mobile', 'mobile_code', 'ip']);

            let key = req.params.key;
            body.email = body.email.toLowerCase();
            body.SERVER_ADDR = md5(req.connection.localAddress);
            body.REMOTE_ADDR = md5(req.connection.remoteAddress);

            var conditions = {
                key: key,
                chkemail: body.email,
                email_code: body.email_code,
                // chkphone: body.mobile,
                phone_code: body.mobile_code
            }

            App.findOne(conditions, (error, app) => {

                if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_emial_mobile
                });

                var conditions = {
                    email: body.email,
                    phone: body.mobile,
                    isdelete: "0"
                }

                App.findOne(conditions, (error, app) => {

                    if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                    if (app) {

                        if (app.key != key) {
                            var conditions = {
                                key: key
                            }

                            var params = {
                                email: app.email,
                                phone: app.phone,
                                isdelete: "0",
                                hash: app.hash,
                                IP: body.ip
                            }

                            this.updateApp(conditions, params, function (response) {
                                if (response.error == true) {
                                    return res.status(status.OK).jsonp({
                                        "success": 0,
                                        "error": messages.something_wentwrong
                                    });
                                }
                                else {

                                    var conditions = {
                                        key: app.key
                                    }

                                    var params = {
                                        isdelete: "1"
                                    }
                                    this.updateApp(conditions, params, function (response) {
                                        if (response.error == true) {
                                            return res.status(status.OK).jsonp({
                                                "success": 0,
                                                "error": messages.something_wentwrong
                                            });
                                        }
                                        else {

                                            var response = {
                                                'success': 1,
                                                'result': messages.success,
                                                'Server': md5(body.SERVER_ADDR),
                                                'Refer': md5(body.REMOTE_ADDR)
                                            }
                                            return res.status(status.OK).jsonp(response);
                                        }
                                    });

                                }
                            });
                        }
                        else {
                            var response = {
                                'success': 1,
                                'result': messages.success,
                                'Server': md5(body.SERVER_ADDR),
                                'Refer': md5(body.REMOTE_ADDR)
                            }
                            return res.status(status.OK).jsonp(response);
                        }

                    } else { // new Kyc
                        var conditions = {
                            key: key
                        }

                        var params = {
                            email: body.email,
                            phone: body.mobile,
                            isdelete: "0",
                            hash: md5(body.email)
                        }

                        this.updateApp(conditions, params, function (response) {
                            if (response.error == true) {
                                return res.status(status.OK).jsonp({
                                    "success": 0,
                                    "error": messages.something_wentwrong
                                });
                            }
                            else {

                                // Authenticator
                                ///////////////////////////////////Generate KYC ---------------------- and random KYC 
                                var secret1 = authenticator.generateKey();
                                secret1 = secret1.replace(/\W/g, '').toLowerCase();
                                var secret1_code = authenticator.generateToken(secret1);

                                var secret2 = authenticator.generateKey();
                                secret2 = secret2.replace(/\W/g, '').toLowerCase();
                                var secret2_code = authenticator.generateToken(secret2);

                                var secret3 = authenticator.generateKey();
                                secret3 = secret3.replace(/\W/g, '').toLowerCase();
                                var secret3_code = authenticator.generateToken(secret3);

                                var kyc_id = secret1_code + '-' + secret2_code + '-' + secret3_code;

                                var email_code = kyc_id.substring(0, 6);

                                var params = {
                                    kyc_id: kyc_id,
                                    'secret': [secret1, secret2, secret3],
                                    'email': body.email,
                                    'phone': body.mobile,
                                    'details.Mobile': body.mobile,
                                    'hash': md5(body.email),
                                    'IP': body.REMOTE_ADDR
                                }

                                var newDoc = new Document(params);

                                newDoc.save().then((lastAddedDoc) => {
                                    var response = {
                                        'success': 1,
                                        'result': messages.success,
                                        'Server': md5(body.SERVER_ADDR),
                                        'Refer': md5(body.REMOTE_ADDR)
                                    }
                                    return res.status(status.OK).jsonp(response);

                                }).catch(function (error) {
                                    return res.status(status.OK).jsonp({ 'success': 0, "error": error });
                                });
                            }
                        });
                    }

                })

            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetStepStatus(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        try {
            // var obj = new KYCController();
            let key = req.params.key;

            let conditions = {
                key: key
            }

            App.findOne(conditions, (error, app) => {

                if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });

                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 0,
                        "error": messages.document_not_found
                    });
                    var doc = docData.toJSON();

                    if ('step' in doc === true && doc.step != null && doc.step != '') {
                        var step = doc.step;
                        var response = {
                            'success': 1,
                            'result': messages.success,
                            'step': step
                        }
                        return res.status(status.OK).jsonp(response);

                    } else {

                        var conditions = { 'hash': app.hash };
                        var params = { 'step.issubmit': 'n' };

                        this.updateDocument(conditions, params, function (response) {

                            if (response.error == true) {
                                return res.status(status.OK).jsonp({
                                    "success": 0,
                                    "error": messages.something_wentwrong
                                });
                            }
                            else {
                                var step = { 'issubmit': 'n' };
                                var response = {
                                    'success': 1,
                                    'result': messages.success,
                                    'step': step
                                }
                                return res.status(status.OK).jsonp(response);
                            }
                        });
                    }
                })
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetKycDocument(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        req.checkBody("step", messages.req_step).notEmpty();
        req.checkBody("step", messages.req_valid_step).isIn(['basic', 'address', 'passport', 'identity', 'taxation', 'drivinglicense', 'holdimg']);

        try {
            // var obj = new KYCController();
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }

            let body = _.pick(req.body, ['step']);

            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }
            App.findOne(conditions, (error, app) => {

                if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                if (!app) return res.status(status.OK).jsonp({
                    "success": 2,
                    "error": messages.invalid_key
                });

                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 2,
                        "error": messages.kyc_document_not_found
                    });

                    var doc = docData.toJSON();

                    this.getKYCDocument(key, doc, body.step, function (response) {
                        if (response.error == true) {
                            return res.status(status.OK).jsonp({
                                "success": 0,
                                "error": messages.something_wentwrong
                            });
                        }
                        else {
                            return res.status(status.OK).jsonp(response.data);
                        }
                    })

                })
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetDocumentImages(req, res) {

        var conditions = {
            key: req.params.key
        }

        var kycController = this;

        try {

            File.findOne(conditions, (error, file) => {

                if (error) {
                    logManager.Log(`GetDocumentImages:Error - ${error}`);
                    error = `Error :: ${error}`;
                    return kycController.GetErrorResponse(error, res);
                }
                if (!file) return kycController.GetErrorResponse(messages.file_not_found, res);

                var img = new Buffer(file.data, 'base64');

                res.contentType(file.contentType);
                res.status(status.OK).send(img);
            })
        }
        catch (e) {
            logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
            error = `Error :: ${error}`;
            return kycController.GetErrorResponse(error, response.message);
        }
    }

    async SaveKycDocument(req, res) {

        var upload = multer({
            storage: storage
        }).array('file[]', 2);

        upload(req, res, async function (err) {

            var kycController = new KYCController();

            if (err) {
                logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                error = `Error :: ${error}`;
                return kycController.GetErrorResponse(error, res);
            }

            if (!err) {
                req.checkBody("step", messages.req_step).notEmpty();
                req.checkBody("step", messages.req_valid_step).isIn(['basic', 'address', 'identity']);
                req.checkBody("substep", messages.req_valid_step).isIn(['basic', 'passport', 'taxation', 'license', 'utility_bill']);

                let substep = req.body.substep;
                switch (req.body.step) {
                    case "basic":
                        req.checkBody("firstname", messages.req_firstname).notEmpty();
                        req.checkBody("lastname", messages.req_lastname).notEmpty();
                        req.checkBody("dob", messages.req_dob).notEmpty();
                        req.checkBody("city", messages.req_city).notEmpty();
                        req.checkBody("address1", messages.req_address).notEmpty();
                        req.checkBody("zip", messages.req_zip).notEmpty();
                        req.checkBody("state", messages.req_state).notEmpty();
                        req.checkBody("country", messages.req_country).notEmpty();
                        break;
                    case "address":
                    case "identity":
                        //if (substep == "passport") { 
                        req.checkBody("number", messages.req_firstname).notEmpty();
                        req.checkBody("country", messages.req_lastname).notEmpty();
                        //req.checkBody("expiry_date", messages.req_dob).notEmpty();
                        //}
                        break;
                    default:
                        return kycController.GetErrorResponse('step name missing!', res);
                        break;
                }

                try {
                    let result = await req.getValidationResult();

                    if (!result.isEmpty()) {

                        let error = kycController.GetErrors(result);
                        logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                        return kycController.GetErrorResponse(error, res);
                    }

                    var filesBufferObject = {};
                    var imageArrayForDoc = [];

                    async.eachSeries(req.files, function (file, outerSubCallback) {

                        let orgFileName = file.originalname;
                        filesBufferObject[orgFileName] = file.buffer;

                        //Create image detail array
                        imageArrayForDoc.push({
                            name: orgFileName,
                            contentType: file.mimetype,
                            encoding: file.encoding
                        });
                        outerSubCallback();
                    }, function () {

                        let body = req.body;

                        let key = req.params.key;
                        var conditions = {
                            key: key,
                            isdelete: "0"
                        }

                        App.findOne(conditions, (error, app) => {

                            if (error) {
                                logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                                error = `Error :: ${error}`;
                                return kycController.GetErrorResponse(error, res);
                            }

                            if (!app) return this.GetErrorResponse(messages.invalid_key, res);

                            if (!app.email_verified || !app.phone_verified)
                                return kycController.GetErrorResponse("Phone or Email not yet verified", res);

                            let document_query = {
                                app_key: app.key
                            }

                            KYCDocument.findOne(document_query, (error, docData) => {

                                if (error) {
                                    logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                                    error = `Error :: ${error}`;
                                    return kycController.GetErrorResponse(error, res);
                                }
                                if (!docData) return kycController.GetErrorResponse(messages.kyc_document_not_found, res);
                                
                                let infoType = body.step + "_info";

                                //Check if it is same step
                                // if (docData[infoType] != undefined && docData[infoType] != null && docData[infoType].details.document_type != undefined)
                                //     return kycController.GetErrorResponse("Uploaded information is already available", res);

                                //if(docData.)
                                //return kycController.GetErrorResponse("Information for all the uploads is already present", res);

                                //Saving Document Object
                                kycController.saveDocumentObject(docData, body, imageArrayForDoc).then((updatedDoc) => {

                                    var docInfo = updatedDoc[infoType];
                                    //let image = docInfo[0].images[0];

                                    kycController.saveDocumentImages(body.step, docInfo.images, filesBufferObject, function (response) {

                                        if (response.error == true) {
                                            logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                                            error = `Error :: ${error}`;
                                            return kycController.GetErrorResponse(error, response.message);
                                        }
                                        else {
                                            return res.status(status.OK).jsonp(response.data);
                                        }
                                    });

                                }).catch(function (error) {
                                    logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                                    error = `Error :: ${error}`;
                                    return kycController.GetErrorResponse(error, response.message);
                                });
                            })
                        })
                    });
                }
                catch (e) {
                    logManager.Log(`SaveKYCDocumnet:Error - ${error}`);
                    error = `Error :: ${error}`;
                    return kycController.GetErrorResponse(error, response.message);
                }
            }
        })
    }

    saveDocumentImages(step, imageCollection, filesBufferObject, callback) {

        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        async.eachSeries(imageCollection, function (image, outerSubCallback) {

            var file;
            file = {
                data: filesBufferObject[image.name],
                contentType: image.contentType,
                key: image._id.toString()
            };

            var newfile = new File(file)
            newfile.save().then((file) => {

                outerSubCallback();

            }).catch(function (error) {
                response.message = error;
                outerSubCallback(response);
                //return res.status(status.OK).jsonp({ 'success': 0, "error": error });
            });
        }, function (err, results) {

            ///Find way to check error here...
            if (err)
                callback(response);

            response.error = false;
            response.data = {
                'success': 1,
                'now': Date.now(),
                'result': messages.save_basic_info
            }
            response.message = messages.save_basic_info;
            callback(response);
        });
    }

    saveDocumentObject(docData, body, imgArr) {

        var obj = docData;

        var details = {};
        var images = [];
        var valid = true;
        var errorMsg = "Validation Failed";
        var docInfo = {};
        var setParams = {
            last_modified: new Date(Date.now())
        };

        switch (body.step) {

            case "basic":
                details = {
                    firstname: body.firstname,
                    middlename: body.middlename,
                    lastname: body.lastname,
                    dob: body.dob,
                    city: body.city,
                    address1: body.address1,
                    address2: body.address2,
                    place_of_birth: body.place_of_birth,
                    zip: body.zip,
                    state: body.state,
                    country: body.country,
                    street : body.street,
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
                    document_type: body.substep
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
                    document_type: body.substep
                };
                setParams.identity_info = {};
                setParams.identity_info.details = details;
                setParams.identity_info.images = imgArr;
                break;

            default:
                break;
        }

        // docInfo = {
        //     details: details,
        //     images: imgArr,
        //     docType: body.step
        // }

        // obj.docInfo.push(docInfo);
        //return obj;

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

    checkRequestValidationForEachstep(body) {

        switch (body.step) {

            case "basic":
                req.checkBody("firstname", messages.req_firstname).notEmpty();
                req.checkBody("lastname", messages.req_lastname).notEmpty();
                req.checkBody("dob", messages.req_dob).notEmpty();
                break;
            case "Orange":
                text = "I am not a fan of orange.";
                break;
            case "Apple":
                text = "How you like them apples?";
                break;
            default:
                return res.status(status.OK).jsonp({
                    "success": 0,
                    "now": Date.now(),
                    "error": 'step name missing!'
                });
                break;
        }

        try {
            // var obj = new KYCController();
            //            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }
        }
        catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }






async SubmitKycDocument(req, res) {

    var kycController = new KYCController();

	req.checkBody("app_key", messages.req_app_key).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = kycController.GetErrors(result);
                logManager.Log(`SubmitKycDocument:Error - ${error}`);
                return kycController.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['app_key']);

            var conditions = {
                app_key : body.app_key
            }

            KYCDocument.findOne(conditions,(error, docData) =>{

                if (error) {
                    logManager.Log(`SubmitKycDocument:Error - ${error}`);
                    error = `Error :: ${error}`;
                    return kycController.GetErrorResponse(error, res);
                }
                if (!docData) return kycController.GetErrorResponse(messages.invalid_app_key, res);

                if (docData.basic_info.details == undefined || docData.basic_info.details == null || docData.basic_info.details.document_type == undefined)
                {    return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": "Basic documents missing"
                    });
                }
                if (docData.identity_info.details == undefined || docData.identity_info.details == null||docData.identity_info.details.document_type == undefined)
                {    return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": "Identity documents missing"
                    });
                }
                if (docData.address_info.details == undefined || docData.address_info.details == null||docData.address_info.details.document_type == undefined)
                {    return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": "Address documents missing"
                    });
                }

                //link send through email 
                var template = fs.readFileSync(EmailTemplatesPath + '/verifyKycRequest.html', {
                    encoding: 'utf-8'
                });

                // to = to.toString();
                let toEmailIds= config.APPROVER_EMAIL_IDS;
                var emailBody = ejs.render(template, {
                    kyc_verify_url: config.get('base_url')+"/verify/"+ docData.app_key,
                    APP_LOGO_URL: config.get('APP_LOGO_URL'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });

                const subject = 'EvolveChain KYC - Verification Request';

                emailService.SendEmail(toEmailIds, subject, emailBody).then(function (success) {
                    var response = {
                        'success': 1,
                        'now': Date.now(),
                        'result' : "Email sent to the admin for verification!"
                    }
                    return res.status(status.OK).jsonp(response);

                }).catch(function (e) {
                    let error = `Error :: ${e}`;
                    return this.GetErrorResponse(error, res);
                });

            })
        } catch (e) {
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
        }
    }


    async UnlinkKycImg(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        try {
            // var obj = new KYCController();
            let body = _.pick(req.body, ['type']);
            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });
                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) {
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 2,
                        "error": messages.kyc_document_not_found
                    });

                    var doc = docData.toJSON();

                    async.eachSeries(body.type, function (type, outerSubCallback) {

                        var file_field = 'details_' + type + '_id';
                        var conditions = {
                            [file_field]: doc._id.toString()
                        }
                        File.findOne(conditions, (error, file) => {

                            if (error) {
                                error = `Error :: ${error}`;
                                return res.status(status.OK).json({ 'success': 0, "error": error });
                            }

                            if (file) {
                                if (file.filename != "") {
                                    var image_name = file._id + '_' + file.filename;
                                    var unlink_path = 'public/webroot/documents/' + image_name;
                                    fs.unlinkSync(unlink_path); // remove comment for unlink file
                                }
                            }

                            outerSubCallback();
                        })

                    }, function () {
                        var response = {
                            'success': 1,
                            'now': Date.now(),
                            'result': messages.success_unlink
                        }
                        return res.status(status.OK).jsonp(response);
                    })

                })
            })
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async RemoveImage(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }
        req.checkBody("step", messages.req_step).notEmpty();
        req.checkBody("type", messages.req_type).notEmpty();

        try {
            // var obj = new KYCController();
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }

            let body = _.pick(req.body, ['type', 'step']);
            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });
                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) {
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 2,
                        "error": messages.kyc_document_not_found
                    });

                    var doc = docData.toJSON();
                    var type = body.type;
                    var step = body.step;
                    var file_field = 'details_' + type + '_id';

                    // remove all old files, please remove comment code after all test
                    var conditions = {
                        [file_field]: doc._id.toString()
                    }
                    File.deleteMany(conditions).then(function (result) {
                        console.log("success");
                    });

                    var conditions = {
                        _id: doc._id
                    }
                    var step_val = 'step.' + step + '.status';
                    var params = {
                        [step_val]: "incompleted"
                    }

                    this.updateDocument(conditions, params, function (response) {
                        if (response.error == true) {
                            return res.status(status.OK).jsonp({
                                "success": 0,
                                'now': Date.now(),
                                "error": response.message
                            });
                        }
                        else {
                            var response = {
                                'success': 1,
                                'now': Date.now(),
                                'result': messages.success_delete
                            }
                            return res.status(status.OK).jsonp(response);
                        }
                    });

                })
            })
        } catch (e) {
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GenerateRandomKYC(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }
        req.checkBody("companyname", messages.req_companyname).notEmpty();
        req.checkBody("comment", messages.req_comment).notEmpty();
        req.checkBody("sharedoc", messages.req_sharedoc).notEmpty();

        try {
            // var obj = new KYCController();
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }

            let body = _.pick(req.body, ['companyname', 'comment', 'sharedoc']);
            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });
                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) {
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 2,
                        "error": messages.kyc_document_not_found
                    });

                    var doc = docData.toJSON();

                    // Authenticator
                    ///////////////////////////////////Generate KYC ---------------------- and random KYC 
                    var secret1 = doc.secret[0];
                    secret1 = secret1.replace(/\W/g, '').toLowerCase();
                    var secret1_code = authenticator.generateToken(secret1);

                    var secret2 = doc.secret[1];
                    secret2 = secret2.replace(/\W/g, '').toLowerCase();
                    var secret2_code = authenticator.generateToken(secret2);

                    var secret3 = doc.secret[2];
                    secret3 = secret3.replace(/\W/g, '').toLowerCase();
                    var secret3_code = authenticator.generateToken(secret3);

                    var new_KYC = secret1_code + '-' + secret2_code + '-' + secret3_code;

                    var code = authenticator.generateKey();
                    code = code.replace(/\W/g, '').toLowerCase();

                    var params = {
                        'code': code,
                        'hash': doc.hash,
                        'companyname': body.companyname,
                        'comment': body.comment,
                        'sharedoc': body.sharedoc,
                        'new_KYC': new_KYC,
                        'status': 'shared'
                    }

                    var newShare = new Share(params);

                    newShare.save().then((lastAddedDoc) => {
                        var response = {
                            'success': 1,
                            'now': Date.now(),
                            'new_KYC': new_KYC,
                            'code': code,
                        }
                        return res.status(status.OK).jsonp(response);

                    }).catch(function (error) {
                        return res.status(status.OK).jsonp({ 'success': 0, "error": error });
                    });

                })
            })
        } catch (e) {
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async RevokeDocument(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }
        req.checkBody("code", messages.req_code).notEmpty();

        try {
            var obj = new KYCController();
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {

                this.GetErrors(result, function (error) {
                    return res.status(status.OK).json(error);
                });
                return false;
            }

            let body = _.pick(req.body, ['code']);
            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });

                var conditions = {
                    hash: app.hash,
                    code: body.code
                }

                Share.findOne(conditions, (error, share_kyc) => {

                    if (error) {
                        console.log(`Error :: ${error}`);
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), "error": error });
                    }

                    if (!share_kyc) return res.status(status.OK).jsonp({
                        "success": 0,
                        'now': Date.now(),
                        "error": messages.not_founc_share_kyc
                    });

                    var params = {
                        status: "revoke",
                        DateTime: new Date()
                    }

                    Share.update(conditions,
                        {
                            $set: params
                        }).then((success) => {
                            var response = {
                                'success': 1,
                                'now': Date.now(),
                                'result': messages.success_revoke
                            }
                            return res.status(status.OK).jsonp(response);
                        }).catch(function (error) {
                            console.log(`Error :: ${error}`);
                            error = `Error :: ${error}`;
                            return res.status(status.OK).json({ 'success': 0, "error": error });
                        });

                })
            })
        } catch (e) {
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetShareHistory(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        try {
            // var obj = new KYCController();

            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });

                var match = {
                    hash: app.hash
                }
                Share.aggregate([
                    {
                        "$match": match
                    },
                    {
                        "$sort": {
                            DateTime: -1
                        }
                    },
                    {
                        "$project": {
                            _id: -1,
                            companyname: 1,
                            comment: 1,
                            code: 1,
                            sharedoc: 1,
                            new_KYC: 1,
                            status: 1,
                            DateTime: 1
                        }
                    }
                ]).exec(function (error, history) {

                    if (error) return res.status(status.InternalServerError).jsonp({ "message": error });

                    var response = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.share_history,
                        'history': history
                    }
                    return res.status(status.OK).jsonp(response);

                });
            })
        } catch (e) {
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetKycidDeveloperUse(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        try {
            // var obj = new KYCController();

            let key = req.params.key;

            var conditions = {
                key: key,
                isdelete: "0"
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_key
                });
                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) {
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 2,
                        "error": messages.kyc_document_not_found
                    });

                    var kyc = docData.toJSON();
                    var response = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.kyc_info,
                        'kyc': kyc
                    }
                    return res.status(status.OK).jsonp(response);

                })
            })
        } catch (e) {
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    // common for update App
    async updateApp(conditions, params = [], callback) // common function for update App
    {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        App.update(conditions,
            {
                $set: params
            }).then((success) => {
                App.findOne(conditions, (error, app) => {
                    if (error) {
                        let err = `Error :: ${error}`;
                        response.message = err;

                    } else if (!app) {

                        response.message = messages.app_not_found;

                    } else {
                        response.error = false;
                        response.message = messages.app_data;
                        response.data = app;
                    }

                    callback(response);
                })
            }).catch(function (error) {
                response.message = error;
                callback(response);
            });
    }

    // common for update document
    async updateDocument(conditions, params = [], callback) // common function for update Document
    {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        Document.update(conditions,
            {
                $set: params
            }).then((success) => {
                Document.findOne(conditions, (error, doc) => {

                    if (error) {

                        let err = `Error :: ${error}`;
                        response.message = err;

                    } else if (!doc) {

                        response.message = messages.doc_not_found;

                    } else {
                        response.error = false;
                        response.message = messages.doc_data;
                        response.data = doc;
                    }

                    callback(response);
                })
            }).catch(function (error) {
                response.message = error;
                callback(response);
            });
    }

    // common for get image
    async getImage(id = null, type = null, callback) {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        var file_field = 'details_' + type + '_id';

        Document.findOne({ 'hash': id }, (error, doc) => {

            if (error) {
                response.message = error;
                callback(response);
            } else if (!doc) {
                response.message = messages.app_not_found;
                callback(response);
            } else {
                var conditions = {
                    [file_field]: doc._id.toString()
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
                        //console.log(fileData);return false;
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
                                console.log('done!');
                                response.error = false;
                                response.message = messages.image_data;
                                response.data = return_path;
                                callback(response);
                            });
                    }
                });
            }
        })
    }

    // common for check image
    async checkImageExits(id = null, type = null, callback) {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        var file_field = 'details_' + type + '_id';

        Document.findOne({ 'hash': id }, (error, doc) => {

            if (error) {
                response.message = error;
                callback(response);
            } else if (!doc) {
                response.message = messages.app_not_found;
                callback(response);
            } else {
                var conditions = {
                    [file_field]: doc._id.toString()
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
                        response.error = false;
                        response.message = messages.image_data;
                        callback(response);
                    }
                });
            }
        })
    }

    // common for image resize
    async imageResize(source, destination, width, callback) {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        im.resize({
            srcPath: source,
            dstPath: destination,
            width: width
        }, function (error, stdout, stderr) {
            if (error) {
                let err = `Error :: ${error}`;
                response.message = err;
            } else {
                response.error = false;
                response.message = messages.resize_image;
                response.data = destination;
            }
            callback(response);
        });
    }

    // common for get image
    async upload(id = null, file, type = 'passport', REMOTE_ADDR = '', callback) {
        //console.log(file);return false;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        var path = PUBLIC_PATH + '/webroot/documents/' + file.filename;
        var unlink_path = 'public/webroot/documents/' + file.filename
        var save = PUBLIC_PATH + '/webroot/documents/' + file.filename

        this.imageResize(path, save, 1024, function (image_resized) {

            if (image_resized.error == true) {
                callback(response);
                return false;
            }
            else {

                Document.findOne({ 'hash': id }, (error, doc) => {

                    if (error) {
                        response.message = error;
                        callback(response);
                    } else if (!doc) {
                        response.message = messages.app_not_found;
                        callback(response);
                    } else {

                        var file_field = 'details_' + type + '_id';

                        // remove all old files, please remove comment code after all test
                        var conditions = {
                            [file_field]: doc._id.toString()
                        }
                        File.deleteMany(conditions).then(function (result) {
                            console.log("success");
                        });

                        var conditions = {
                            _id: doc._id
                        }

                        var params = {
                            [type]: {
                                name: file.filename,
                                type: file.mimetype,
                                error: 0,
                                size: file.size,
                                verified: 'No',
                                IP: REMOTE_ADDR
                            }
                        }

                        this.updateDocument(conditions, params, function (doc_update) {
                            if (doc_update.error == true) {
                                callback(response);
                            }
                            else {

                                var filename = file.filename;
                                var options = {
                                    'metadata': { "filename": filename }
                                }

                                var path = 'public/webroot/documents/' + file.filename;

                                if (fs.existsSync(path)) {

                                    fs.createReadStream(path).
                                        pipe(bucket.openUploadStream(filename, options)).
                                        on('error', function (error) {
                                            assert.ifError(error);
                                            callback(response);
                                        }).
                                        on('finish', function (file) {
                                            console.log('done!');
                                            var conditions = {
                                                _id: file._id
                                            }

                                            var params = {
                                                [file_field]: doc._id.toString()
                                            }
                                            console.log(params);

                                            File.update({
                                                _id: file._id
                                            }, { $set: params }).then((success) => {

                                                console.log(unlink_path);
                                                fs.unlinkSync(unlink_path); // remove comment for unlink file
                                                response.error = false;
                                                callback(response);

                                            }).catch(function (error) {
                                                return res.status(status.OK).jsonp({ 'success': 0, "error": error });
                                            });
                                        });
                                } else {
                                    callback(response);
                                }
                            }
                        });
                    }
                })
            }
        });
    }

    // common for update document
    async getKYCDocument(key, kyc, step = '', callback) // common function for get KYC documents
    {
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        switch (step) {
            case 'basic':
                this.getImage(kyc.hash, 'profile_img', function (image) {
                    var path = '';
                    if (image.error == true) { // check image available or not
                        response.error = false;
                        response.message = image.message;
                    }
                    else {
                        response.error = false;
                        response.message = messages.basic_data;
                        path = image.data
                    }
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.basic_data,
                        'Name': kyc.details.Name,
                        'Birth': kyc.details.Birth,
                        'profile_img': path,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'address':
                this.getImage(kyc.hash, 'address_proof', function (image) {
                    var path = '';
                    if (image.error == true) { // check image available or not
                        response.error = false;
                        response.message = image.message;
                    }
                    else {
                        response.error = false;
                        response.message = messages.basic_data;
                        path = image.data
                    }
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.Address_data,
                        'Address': kyc.details.Name,
                        'address_proof': path,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'passport':
                var imgs = ['passport1', 'passport2'];
                var passport1 = '';
                var passport2 = '';
                async.eachSeries(imgs, function (img, outerCallback) { // for get all images
                    this.getImage(kyc.hash, img, function (image) {

                        if (image.error == true) { // check image available or not
                            response.error = false;
                            response.message = image.message;
                        }
                        else {
                            response.error = false;
                            response.message = messages.basic_data;
                            if (img == 'passport1') {
                                passport1 = image.data;
                            } else if (img == 'passport2') {
                                passport2 = image.data;
                            }
                        }
                        outerCallback();
                    })
                }, function () {
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.Passport_data,
                        'Passport': kyc.details.Passport,
                        'passport1': passport1,
                        'passport2': passport2,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'identity':
                var imgs = ['identity1', 'identity2'];
                var identity1 = '';
                var identity2 = '';
                async.eachSeries(imgs, function (img, outerCallback) { // for get all images
                    this.getImage(kyc.hash, img, function (image) {

                        if (image.error == true) { // check image available or not
                            response.error = false;
                            response.message = image.message;
                        }
                        else {
                            response.error = false;
                            response.message = messages.basic_data;
                            if (img == 'identity1') {
                                identity1 = image.data;
                            } else if (img == 'identity2') {
                                identity2 = image.data;
                            }
                        }
                        outerCallback();
                    })
                }, function () {
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.Identity_data,
                        'identity': kyc.details.Identity,
                        'identity1': identity1,
                        'identity2': identity2,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'taxation':
                this.getImage(kyc.hash, 'tax1', function (image) {
                    var path = '';
                    if (image.error == true) { // check image available or not
                        response.error = false;
                        response.message = image.message;
                    }
                    else {
                        response.error = false;
                        response.message = messages.tax_data;
                        path = image.data;
                    }
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.tax_data,
                        'Tax': kyc.details.Tax,
                        'tax1': path,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'drivinglicense':
                this.getImage(kyc.hash, 'drivinglicense1', function (image) {
                    var path = '';
                    if (image.error == true) { // check image available or not
                        response.error = false;
                        response.message = image.message;
                    }
                    else {
                        response.error = false;
                        response.message = messages.drivinglicense_data;
                        path = image.data;
                    }
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.drivinglicense_data,
                        'Driving': kyc.details.Driving,
                        'drivinglicense1': path,
                        'key': key
                    };
                    callback(response);
                })
                break;
            case 'holdimg':
                this.getImage(kyc.hash, 'hold_img', function (image) {
                    var path = '';
                    if (image.error == true) { // check image available or not
                        response.error = false;
                        response.message = image.message;
                    }
                    else {
                        response.error = false;
                        response.message = messages.holding_data;
                        path = image.data;
                    }
                    response.data = {
                        'success': 1,
                        'now': Date.now(),
                        'result': messages.holding_data,
                        'hold_img': path,
                        'key': key
                    };
                    callback(response);
                })
                break;
            default:
                response.message = 'step name missing!';
                break;
        }

    }

    async kycHoldingImgInfo(key, kyc, body, callback) {

        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        if (body.files.length < 1) { // if not upload than check old image available or not
            this.checkImageExits(kyc.hash, 'hold_img', function (imageData) {

                if (imageData.error == true) {
                    response.message = messages.req_holding_image;
                    callback(response);
                }
                else {
                    response.message = messages.already_holding_image;
                    callback(response);
                }
            })

        } else {
            var cnt = 0;
            async.eachSeries(body.files, function (file, outerCallback) { // for get all images

                this.upload(kyc.hash, file, body.type[cnt], body.REMOTE_ADDR, function (image) {

                    cnt++;
                    outerCallback();
                })
            }, function () {

                var conditions = {
                    key: kyc.key
                }

                var params = {
                    'step.holdimg.status': 'completed'
                }
                this.updateDocument(conditions, params, function (response) {
                    if (response.error == true) {
                        response.message = messages.something_wentwrong;
                        callback(response);
                    }
                    else {
                        response.error = false;
                        response.data = {
                            'success': 1,
                            'now': Date.now(),
                            'result': messages.save_holding_info,
                            'key': key
                        }
                        response.message = messages.save_holding_info;
                        callback(response);
                    }
                });
            })
        }
    }

    SendResponse(apiName, error, updatedApp, res) {
        if (error) {
            return this.GetErrorResponse(error, res);
        }
        else if (!updatedApp) {
            return this.GetErrorResponse("Invalid Request: No application found", res);
        }
        return this.GetSuccessResponse(apiName, updatedApp, res);
    }

    //Common function for Success response
    GetSuccessResponse(apiName, appEntity, res) {
        var response = {};
        switch (apiName) {
            case "SubmitKycDocument":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result' : "Email has been sent to the verifier"
                };
                break;
        }

        return res.status(status.OK).jsonp(response);
    }

}

module.exports = new KYCController();