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
const Document = require('../../models/document');
const File = require('../../models/files');
const Share = require('../../models/shares');
const Wallet = require('../../models/wallet');
const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');
var im = require('imagemagick');
const EmailTemplatesPath = path.join(__dirname + "/../../public/email_template");
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

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var fileMime = file.mimetype.split('/')[0];
        if (fileMime == 'image') {
            callback(null, config.get('documents_path'));
        } else if (fileMime == 'video') {
            callback(null, config.get('documents_path'));
        }
    },
    filename: function (req, file, callback) {
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
    }
})

class KYCController extends BaseController {

    async VerifyEmail(req, res) {

        req.checkBody("email", messages.req_email).notEmpty().isEmail();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);

            }

            let body = _.pick(req.body, ['email']);

            let key = req.params.key;

            var conditions = {
                key: key
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return this.GetErrorResponse(error, res);
                }

                if (!app)
                    return this.GetErrorResponse(messages.invalid_key, res);


                // Authenticator
                var secret = authenticator.generateKey();
                secret = secret.replace(/\W/g, '').toLowerCase();
                var otpToken = authenticator.generateToken(secret);


                var email = body.email.toLowerCase();
                var email_code = otpToken.substring(0, 6);

                //send verification code email

                var template = fs.readFileSync(EmailTemplatesPath + '/email_varified.html', {
                    encoding: 'utf-8'
                });

                var emailBody = ejs.render(template, {
                    email: email,
                    kyc_id: email_code,
                    SITE_IMAGE: config.get('SITE_IMAGE'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });

                const subject = 'EvolveChain KYC - Email Code';
                // var mailOption = {
                //     from: config.get('FROM_EMAIL'),
                //     to: email, // list of receivers
                //     subject: 'KYCGlobal - Email Code', // Subject line
                //     html: emailBody
                // }

                // var appUser = new App(); 
                // appUser.sendEmail(mailOption).then(function (success) {                
                emailService.SendEmail(email, subject, emailBody).then(function (success) {

                    let md5EmailCode = md5(email_code);
                    var params = {
                        email: email,
                        email_code: md5EmailCode
                    }

                    App.update({
                        key: key
                    }, {
                            $set: params
                        }).then((success) => {

                            var response = {
                                'success': 1,
                                'result': messages.verify_email_code,
                                'email_code': md5EmailCode,
                                'email': email
                            }
                            return res.status(status.OK).jsonp(response);

                        }).catch(function (error) {
                            return this.GetErrorResponse(error, res);
                        });

                }).catch(function (e) {
                    let error = `Error :: ${e}`;
                    return this.GetErrorResponse(error, res);
                });
            })
        } catch (e) {
            console.log(`Error :: ${e}`);
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
        }
    }

    async VerifyMobile(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("country_code", messages.req_mobile).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);

            }

            let body = _.pick(req.body, ['mobile', 'country_code']);
            let key = req.params.key;

            var conditions = {
                key: key
            }
            App.findOne(conditions, (error, app) => {

                if (error) return  this.GetErrorResponse(error, res);

                if (!app) return  this.GetErrorResponse(messages.invalid_key, res);                   

                // Authenticator
                var secret = authenticator.generateKey();
                secret = secret.replace(/\W/g, '').toLowerCase();
                var signinCode = authenticator.generateToken(secret);



                var phone = body.mobile.replace("+", "");
                var countryCode = body.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + signinCode + '.';
                let toPhone = "+" + countryCode + phone;
              
                smsService.SendSMS(toPhone, msg).then(message => {
                    console.log(message.sid);
                    md5MobileOTP = md5(signinCode);
                    var params = {
                        phone: phone,
                        phone_code: md5MobileOTP,
                        country_Code: countryCode
                    }

                    App.update({
                        key: key
                    }, {
                            $set: params
                        }).then((success) => {

                            var response = {
                                'success': 1,
                                'result': messages.verify_phone_code,
                                'phone_code': md5MobileOTP,
                                'country_code': countryCode,
                                'phone': phone
                            }
                            return res.status(status.OK).jsonp(response);

                        }).catch(function (error) {
                            return this.GetErrorResponse(error, res);
                        });
                }).catch(function (e) {
                    let error = `Error :: ${e}`;
                    return this.GetErrorResponse(error, res);
                });
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
        }
    }

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
                chkphone: body.mobile,
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

    async SaveKycDocument(req, res) {

        var upload = multer({
            storage: storage
        }).array('file[]', 5);

        upload(req, res, async function (err) {
            if (err) console.log(err);
            if (!err) {
                if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
                    return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
                }
                req.checkBody("step", messages.req_step).notEmpty();
                req.checkBody("step", messages.req_valid_step).isIn(['basic', 'address', 'passport', 'identity', 'taxation', 'drivinglicense', 'holdimg']);

                // check particular step's require params
                if (req.body.step == 'basic') {
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("dob", messages.req_dob).notEmpty();

                } else if (req.body.step == 'address') {
                    req.checkBody("address", messages.req_address).notEmpty();
                    req.checkBody("street", messages.req_street).notEmpty();
                    req.checkBody("city", messages.req_city).notEmpty();
                    req.checkBody("zip", messages.req_zip).notEmpty();
                    req.checkBody("state", messages.req_state).notEmpty();
                    req.checkBody("country", messages.req_country).notEmpty();
                } else if (req.body.step == 'passport') {
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("dob", messages.req_dob).notEmpty();
                    req.checkBody("address", messages.req_address).notEmpty();
                    req.checkBody("street", messages.req_street).notEmpty();
                    req.checkBody("city", messages.req_city).notEmpty();
                    req.checkBody("zip", messages.req_zip).notEmpty();
                    req.checkBody("state", messages.req_state).notEmpty();
                    req.checkBody("country", messages.req_country).notEmpty();
                    req.checkBody("no", messages.req_pass_no).notEmpty();
                    req.checkBody("expiry", messages.req_expiry).notEmpty();
                    req.checkBody("pass_country", messages.req_pass_country).notEmpty();

                } else if (req.body.step == 'identity') {
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("no", messages.req_identity_no).notEmpty();
                    req.checkBody("no", messages.req_identity_no_numeric).isNumeric();
                    req.checkBody("no", messages.req_identity_no_length).isLength({ min: 12, max: 12 });

                } else if (req.body.step == 'taxation') {
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("dateofbirth", messages.req_dob).notEmpty();
                    req.checkBody("id", messages.req_tax_id).notEmpty();

                } else if (req.body.step == 'drivinglicense') {
                    req.checkBody("firstname", messages.req_firstname).notEmpty();
                    req.checkBody("lastname", messages.req_lastname).notEmpty();
                    req.checkBody("dob", messages.req_dob).notEmpty();
                    req.checkBody("address", messages.req_address).notEmpty();
                    req.checkBody("street", messages.req_street).notEmpty();
                    req.checkBody("city", messages.req_city).notEmpty();
                    req.checkBody("zip", messages.req_zip).notEmpty();
                    req.checkBody("state", messages.req_state).notEmpty();
                    req.checkBody("country", messages.req_country).notEmpty();
                    req.checkBody("no", messages.req_license_no).notEmpty();
                    req.checkBody("expiry", messages.req_license_expiry).notEmpty();
                    req.checkBody("license_country", messages.req_license_country).notEmpty();

                }

                try {
                    // var obj = new KYCController();
                    let result = await req.getValidationResult();

                    if (!result.isEmpty()) {

                        this.GetErrors(result, function (error) {
                            return res.status(status.OK).json(error);
                        });
                        return false;
                    }

                    let filesArray = [];

                    async.eachSeries(req.files, function (file, outerSubCallback) {
                        console.log(file);
                        filesArray.push(file);
                        outerSubCallback();
                    }, function () {

                        let body = req.body;
                        body.SERVER_ADDR = md5(req.connection.localAddress);
                        body.REMOTE_ADDR = md5(req.connection.remoteAddress);
                        body.files = filesArray;

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
                                let step = body.step;
                                switch (step) {
                                    case 'basic':
                                        this.kycBasicInfo(key, doc, body, function (response) {
                                            console.log(response);
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'address':
                                        this.kycAddressInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'passport':
                                        this.kycPassportInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'identity':
                                        this.kycIdentityInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'taxation':
                                        this.kycTaxationInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'drivinglicense':
                                        this.kycDrivinglicenseInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    case 'holdimg':
                                        this.kycHoldingImgInfo(key, doc, body, function (response) {
                                            if (response.error == true) {
                                                return res.status(status.OK).jsonp({
                                                    "success": 0,
                                                    "now": Date.now(),
                                                    "error": response.message
                                                });
                                            }
                                            else {
                                                return res.status(status.OK).jsonp(response.data);
                                            }
                                        })
                                        break;
                                    default:
                                        return res.status(status.OK).jsonp({
                                            "success": 0,
                                            "now": Date.now(),
                                            "error": 'step name missing!'
                                        });
                                        break;
                                }

                            })
                        })
                    });

                } catch (e) {
                    console.log(`Error :: ${e}`);
                    let err = `Error :: ${e}`;
                    return res.status(status.OK).json({ 'success': 0, "error": err });
                }
            }
        })
    }

    async SubmitKycDocument(req, res) {

        if (_.isUndefined(req.params.key) || req.params.key == '' || req.params.key == null) {
            return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
        }

        try {
            // var obj = new KYCController();
            let key = req.params.key;

            let conditions = {
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
                    'now': Date.now(),
                    "error": messages.invalid_key
                });

                let document_query = {
                    hash: app.hash
                }

                Document.findOne(document_query, (error, docData) => {

                    if (error) {
                        console.log(`Error :: ${error}`);
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }

                    if (!docData) return res.status(status.OK).jsonp({
                        "success": 0,
                        'now': Date.now(),
                        "error": messages.document_not_found
                    });

                    var kyc = docData.toJSON();

                    var basic = kyc.step.basic.status;
                    var address = kyc.step.address.status;
                    var Identity = kyc.step.identity.status;
                    var taxation = kyc.step.taxation.status;
                    var holdimg = kyc.step.holdimg.status;
                    var passport = kyc.step.passport.status;
                    var drivinglicense = kyc.step.drivinglicense.status;

                    if (basic == '' || address == '' || Identity == '' || taxation == '' || holdimg == '') {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            'now': Date.now(),
                            "error": messages.kyc_incompleted
                        });

                    } else if (basic == 'process' || address == 'process' || Identity == 'process' || taxation == 'process' || holdimg == 'process') {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            'now': Date.now(),
                            "error": messages.kyc_process
                        });

                    } else if (basic == 'reject' || address == 'reject' || Identity == 'reject' || taxation == 'reject' || holdimg == 'reject') {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            'now': Date.now(),
                            "error": messages.kyc_reject
                        });

                    } else if (basic == 'incompleted' || address == 'incompleted' || Identity == 'incompleted' || taxation == 'incompleted' || holdimg == 'incompleted') {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            'now': Date.now(),
                            "error": messages.kyc_incompleted_edit
                        });
                    } else if (basic == 'approved' && address == 'approved' && Identity == 'approved' && taxation == 'approved' && holdimg == 'approved') {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            'now': Date.now(),
                            "error": messages.kyc_approved
                        });
                    }


                    //send verification code email

                    var template = fs.readFileSync(EmailTemplatesPath + '/kyc_varified.html', {
                        encoding: 'utf-8'
                    });

                    var emailBody = ejs.render(template, {
                        email: app.email,
                        kyc_id: kyc.kyc_id,
                        kyc_verify_url: config.get('base_url') + '/verify/index/' + app.key,
                        hash: app.hash,
                        SITE_IMAGE: config.get('SITE_IMAGE'),
                        SITE_NAME: config.get('app_name'),
                        CURRENT_YEAR: config.get('current_year')
                    });
                    var to = [config.get('MAIL_1'), config.get('MAIL_2')];
                    to = to.toString();
                    const subject = 'EvolveChain KYC - New Form Submit';
                    //console.log(to);return false;
                    // var mailOption = {
                    //     from: config.get('FROM_EMAIL'),
                    //     to: to, // list of receivers
                    //     subject: 'KYC - New From Submit', // Subject line
                    //     html: emailBody
                    // }

                    //var appUser = new App(); 
                    // appUser.sendEmail(mailOption).then(function (success) {

                    emailService.SendEmail(to, subject, emailBody).then(function (success) {

                        let params = {};
                        async.forEachOf(kyc.step, function (step, key, outerCallback) { // for get all steps
                            if (key == 'issubmit') {
                                var new_key = 'step.' + key;

                                params[new_key] = 'y'
                                outerCallback();
                            }
                            else {
                                async.forEachOf(step, function (val, sk, innerCallback) { // for get all sub step
                                    if (sk == 'status' && val == 'completed') {
                                        var new_key = 'step.' + key + '.' + sk;
                                        var new_message = 'step.' + key + '.message';

                                        params[new_key] = 'process';
                                        params[new_message] = 'In process'
                                        innerCallback()
                                    }
                                    else {
                                        innerCallback()
                                    }

                                }, function () {
                                    outerCallback();
                                })
                            }

                        }, function () {
                            console.log(params);

                            var conditions = { 'hash': kyc.hash };

                            this.updateDocument(conditions, params, function (response) {

                                if (response.error == true) {
                                    return res.status(status.OK).jsonp({
                                        "success": 0,
                                        'now': Date.now(),
                                        "error": response.message
                                    });
                                }
                                else {

                                    // create wallet
                                    var REMOTE_ADDR = md5(req.connection.remoteAddress);

                                    var params = {
                                        'kyc_id': kyc.kyc_id,
                                        'email': app.email,
                                        'phone': app.phone,
                                        'details.Mobile': app.phone,
                                        'hash': md5(email),
                                        'secret': kyc.secret,
                                        'IP': REMOTE_ADDR
                                    }

                                    var newWallet = new Wallet(params);

                                    newWallet.save().then((lastAddedDoc) => {
                                        var response = {
                                            'success': 1,
                                            'now': Date.now(),
                                            'result': messages.kyc_submited
                                        }
                                        return res.status(status.OK).jsonp(response);

                                    }).catch(function (error) {
                                        return res.status(status.OK).jsonp({ 'success': 0, "error": error });
                                    });
                                }
                            });
                        })

                    }).catch(function (e) {
                        let err = `Error :: ${e}`;
                        return res.status(status.OK).jsonp({ 'success': 0, "error": err });
                    });

                })
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
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

    async GetkycidDeveloperUse(req, res) {

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

    async kycBasicInfo(key, kyc, body, callback) {
        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        function isValidDate(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        if (!isValidDate(body.dob)) {
            response.message = messages.invalid_date;
            callback(response);
            return false;
        }

        if (_.isUndefined(body.middlename) || body.middlename == '') {
            body.middlename = '';
        }

        if (body.files.length < 1) { // if not upload than check old image available or not
            this.checkImageExits(kyc.hash, 'profile_img', function (imageData) {

                if (imageData.error == true) {
                    response.message = messages.req_profile_image;
                    callback(response);
                }
                else {

                    var conditions = {
                        key: key
                    }

                    var params = {
                        name: body.firstname + ' ' + body.lastname
                    }

                    this.updateApp(conditions, params, function (response) {
                        if (response.error == true) {
                            response.message = messages.something_wentwrong;
                        }
                        else {

                            var conditions = {
                                key: kyc.key
                            }
                            var basic = {
                                'first': body.firstname,
                                'middle': body.middlename,
                                'last': body.lastname
                            };

                            var birth = { 'date': body.dob }

                            var params = {
                                'details.Name': basic,
                                'details.Birth': birth,
                                'step.basic.status': 'completed'
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
                                        'result': messages.save_basic_info,
                                        'first': body.firstname,
                                        'middle': body.middlename,
                                        'last': body.lastname,
                                        'dob': body.dob,
                                        'key': key
                                    }
                                    response.message = messages.save_basic_info;
                                    callback(response);
                                }
                            });
                        }
                    });
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
                    key: key
                }

                var params = {
                    name: body.firstname + ' ' + body.lastname
                }

                this.updateApp(conditions, params, function (response) {
                    if (response.error == true) {
                        response.message = messages.something_wentwrong;
                    }
                    else {

                        var conditions = {
                            key: kyc.key
                        }
                        var basic = {
                            'first': body.firstname,
                            'middle': body.middlename,
                            'last': body.lastname
                        };

                        var birth = { 'date': body.dob }

                        var params = {
                            'details.Name': basic,
                            'details.Birth': birth,
                            'step.basic.status': 'completed'
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
                                    'result': messages.save_basic_info,
                                    'first': body.firstname,
                                    'middle': body.middlename,
                                    'last': body.lastname,
                                    'dob': body.dob,
                                    'key': key
                                }
                                response.message = messages.save_basic_info;
                                callback(response);
                            }
                        });
                    }
                });
            })
        }

    }

    async kycAddressInfo(key, kyc, body, callback) {
        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        if (body.files.length < 1) { // if not upload than check old image available or not
            this.checkImageExits(kyc.hash, 'address_proof', function (imageData) {

                if (imageData.error == true) {
                    response.message = req_address_proof;
                    callback(response);
                }
                else {

                    var conditions = {
                        key: kyc.key
                    }
                    var address_info = {
                        'address': body.address,
                        'street': body.street,
                        'city': body.city,
                        'zip': body.zip,
                        'state': body.state,
                        'country': body.country
                    }

                    var params = {
                        'details.Address': address_info,
                        'step.address.status': 'completed'
                    }
                    this.updateDocument(conditions, params, function (response) {
                        if (response.error == true) {
                            response.message = messages.something_wentwrong;
                        }
                        else {
                            response.error = false;
                            response.data = {
                                'success': 1,
                                'now': Date.now(),
                                'result': messages.save_address_info,
                                'address': body.address,
                                'street': body.street,
                                'city': body.city,
                                'zip': body.zip,
                                'state': body.state,
                                'country': body.country,
                                'key': key
                            }
                            response.message = messages.save_address_info;
                            callback(response);
                        }
                    });
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
                var address_info = {
                    'address': body.address,
                    'street': body.street,
                    'city': body.city,
                    'zip': body.zip,
                    'state': body.state,
                    'country': body.country
                }

                var params = {
                    'details.Address': address_info,
                    'step.address.status': 'completed'
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
                            'result': messages.save_address_info,
                            'address': body.address,
                            'street': body.street,
                            'city': body.city,
                            'zip': body.zip,
                            'state': body.state,
                            'country': body.country,
                            'key': key
                        }
                        response.message = messages.save_address_info;
                        callback(response);
                    }
                });
            })
        }
    }

    async kycPassportInfo(key, kyc, body, callback) {
        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        function isValidDate(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        if (!isValidDate(body.dob)) {
            response.message = messages.invalid_date;
            callback(response);
            return false;
        }

        if (!isValidDate(body.expiry)) {
            response.message = messages.invalid_passport_expiry_date;
            callback(response);
            return false;
        }

        if (_.isUndefined(body.middlename) || body.middlename == '') {
            body.middlename = '';
        }
        var images = ['passport1', 'passport2'];
        if (body.files.length < 1) { // if not upload than check old image available or not

            async.eachSeries(images, function (image, outerCallback) { // for get all images

                this.checkImageExits(kyc.hash, image, function (imageData) {

                    if (imageData.error == true) {
                        response.message = messages.req_passport_image;
                        callback(response);
                        return false;
                    }
                    else {
                        outerCallback();
                    }
                })

            }, function () {
                var conditions = {
                    key: key
                }

                var params = {
                    name: body.firstname + ' ' + body.lastname
                }

                this.updateApp(conditions, params, function (response) {
                    if (response.error == true) {
                        response.message = messages.something_wentwrong;
                    }
                    else {

                        var conditions = {
                            key: kyc.key
                        }
                        var passport_info = {
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'dob': body.dob,
                            'address': body.address,
                            'street': body.street,
                            'city': body.city,
                            'zip': body.zip,
                            'state': body.state,
                            'country': body.country,
                            'no': body.no,
                            'expiry': body.expiry,
                            'pass_country': body.pass_country
                        };


                        var params = {
                            'details.Passport': passport_info,
                            'step.passport.status': 'completed'
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
                                    'result': messages.save_passport_info,
                                    'firstname': body.firstname,
                                    'middlename': body.middlename,
                                    'lastname': body.lastname,
                                    'dob': body.dob,
                                    'address': body.address,
                                    'street': body.street,
                                    'city': body.city,
                                    'zip': body.zip,
                                    'state': body.state,
                                    'country': body.country,
                                    'no': body.no,
                                    'expiry': body.expiry,
                                    'pass_country': body.pass_country,
                                    'key': key
                                }
                                response.message = messages.save_passport_info;
                                callback(response);
                            }
                        });
                    }
                });
            });

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
                var passport_info = {
                    'firstname': body.firstname,
                    'middlename': body.middlename,
                    'lastname': body.lastname,
                    'dob': body.dob,
                    'address': body.address,
                    'street': body.street,
                    'city': body.city,
                    'zip': body.zip,
                    'state': body.state,
                    'country': body.country,
                    'no': body.no,
                    'expiry': body.expiry,
                    'pass_country': body.pass_country
                };


                var params = {
                    'details.Passport': passport_info,
                    'step.passport.status': 'completed'
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
                            'result': messages.save_passport_info,
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'dob': body.dob,
                            'address': body.address,
                            'street': body.street,
                            'city': body.city,
                            'zip': body.zip,
                            'state': body.state,
                            'country': body.country,
                            'no': body.no,
                            'expiry': body.expiry,
                            'pass_country': body.pass_country,
                            'key': key
                        }
                        response.message = messages.save_passport_info;
                        callback(response);
                    }
                });
            })
        }
    }

    async kycIdentityInfo(key, kyc, body, callback) {

        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        if (_.isUndefined(body.middlename) || body.middlename == '') {
            body.middlename = '';
        }
        var images = ['identity1', 'identity2'];
        if (body.files.length < 1) { // if not upload than check old image available or not

            async.eachSeries(images, function (image, outerCallback) { // for get all images

                this.checkImageExits(kyc.hash, image, function (imageData) {

                    if (imageData.error == true) {
                        response.message = messages.req_identity_image;
                        callback(response);
                        return false;
                    }
                    else {
                        outerCallback();
                    }
                })

            }, function () {
                var conditions = {
                    key: key
                }

                var params = {
                    name: body.firstname + ' ' + body.lastname
                }

                this.updateApp(conditions, params, function (response) {
                    if (response.error == true) {
                        response.message = messages.something_wentwrong;
                    }
                    else {

                        var conditions = {
                            key: kyc.key
                        }
                        var Identity_info = {
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'no': body.no
                        };


                        var params = {
                            'details.Identity': Identity_info,
                            'step.identity.status': 'completed'
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
                                    'result': messages.save_identity_info,
                                    'firstname': body.firstname,
                                    'middlename': body.middlename,
                                    'lastname': body.lastname,
                                    'no': body.no,
                                    'key': key
                                }
                                response.message = messages.save_identity_info;
                                callback(response);
                            }
                        });
                    }
                });
            });

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
                var Identity_info = {
                    'firstname': body.firstname,
                    'middlename': body.middlename,
                    'lastname': body.lastname,
                    'no': body.no
                };


                var params = {
                    'details.Identity': Identity_info,
                    'step.identity.status': 'completed'
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
                            'result': messages.save_identity_info,
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'no': body.no,
                            'key': key
                        }
                        response.message = messages.save_identity_info;
                        callback(response);
                    }
                });
            })
        }
    }

    async kycTaxationInfo(key, kyc, body, callback) {
        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        function isValidDate(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        if (!isValidDate(body.dateofbirth)) {
            response.message = messages.invalid_date;
            callback(response);
            return false;
        }

        if (_.isUndefined(body.middlename) || body.middlename == '') {
            body.middlename = '';
        }

        if (body.files.length < 1) { // if not upload than check old image available or not
            this.checkImageExits(kyc.hash, 'tax1', function (imageData) {

                if (imageData.error == true) {
                    response.message = messages.req_tax_image;
                    callback(response);
                }
                else {

                    var conditions = {
                        key: kyc.key
                    }
                    var tax = {
                        'firstname': body.firstname,
                        'middlename': body.middlename,
                        'lastname': body.lastname,
                        'dateofbirth': body.dateofbirth,
                        'id': body.id
                    };

                    var params = {
                        'details.Tax': tax,
                        'step.taxation.status': 'completed'
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
                                'result': messages.save_tax_info,
                                'firstname': body.firstname,
                                'middlename': body.middlename,
                                'lastname': body.lastname,
                                'dateofbirth': body.dateofbirth,
                                'id': body.id,
                                'key': key
                            }
                            response.message = messages.save_tax_info;
                            callback(response);
                        }
                    });
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
                    key: key
                }

                var params = {
                    name: body.firstname + ' ' + body.lastname
                }

                this.updateApp(conditions, params, function (response) {
                    if (response.error == true) {
                        response.message = messages.something_wentwrong;
                        callback(response);
                    }
                    else {

                        var conditions = {
                            key: kyc.key
                        }
                        var tax = {
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'dateofbirth': body.dateofbirth,
                            'id': body.id
                        };

                        var params = {
                            'details.Tax': tax,
                            'step.taxation.status': 'completed'
                        }
                        this.updateDocument(conditions, params, function (response) {
                            if (response.error == true) {
                                response.message = messages.something_wentwrong;
                            }
                            else {
                                response.error = false;
                                response.data = {
                                    'success': 1,
                                    'now': Date.now(),
                                    'result': messages.save_tax_info,
                                    'firstname': body.firstname,
                                    'middlename': body.middlename,
                                    'lastname': body.lastname,
                                    'dateofbirth': body.dateofbirth,
                                    'id': body.id,
                                    'key': key
                                }
                                response.message = messages.save_tax_info;
                                callback(response);
                            }
                        });
                    }
                });
            })
        }
    }

    async kycDrivinglicenseInfo(key, kyc, body, callback) {
        var step = body.step;
        // var obj = new KYCController();
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }

        function isValidDate(dateString) {
            var regEx = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateString.match(regEx)) return false;  // Invalid format
            var d = new Date(dateString);
            if (!d.getTime() && d.getTime() !== 0) return false; // Invalid date
            return d.toISOString().slice(0, 10) === dateString;
        }
        if (!isValidDate(body.dob)) {
            response.message = messages.invalid_date;
            callback(response);
            return false;
        }

        if (!isValidDate(body.expiry)) {
            response.message = messages.invalid_license_expiry_date;
            callback(response);
            return false;
        }

        if (_.isUndefined(body.middlename) || body.middlename == '') {
            body.middlename = '';
        }

        if (body.files.length < 1) { // if not upload than check old image available or not
            this.checkImageExits(kyc.hash, 'drivinglicense1', function (imageData) {

                if (imageData.error == true) {
                    response.message = messages.req_license_image;
                    callback(response);
                }
                else {

                    var conditions = {
                        key: kyc.key
                    }
                    var license = {
                        'firstname': body.firstname,
                        'middlename': body.middlename,
                        'lastname': body.lastname,
                        'dob': body.dob,
                        'address': body.address,
                        'street': body.street,
                        'city': body.city,
                        'zip': body.zip,
                        'state': body.state,
                        'country': body.country,
                        'no': body.no,
                        'expiry': body.expiry,
                        'license_country': body.license_country
                    };

                    var params = {
                        'details.Driving': license,
                        'step.drivinglicense.status': 'completed'
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
                                'result': messages.save_driving_license_info,
                                'firstname': body.firstname,
                                'middlename': body.middlename,
                                'lastname': body.lastname,
                                'dob': body.dob,
                                'address': body.address,
                                'street': body.street,
                                'city': body.city,
                                'zip': body.zip,
                                'state': body.state,
                                'country': body.country,
                                'no': body.no,
                                'expiry': body.expiry,
                                'license_country': body.license_country,
                                'key': key
                            }
                            response.message = messages.save_driving_license_info;
                            callback(response);
                        }
                    });
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
                var license = {
                    'firstname': body.firstname,
                    'middlename': body.middlename,
                    'lastname': body.lastname,
                    'dob': body.dob,
                    'address': body.address,
                    'street': body.street,
                    'city': body.city,
                    'zip': body.zip,
                    'state': body.state,
                    'country': body.country,
                    'no': body.no,
                    'expiry': body.expiry,
                    'license_country': body.license_country
                };

                var params = {
                    'details.Driving': license,
                    'step.drivinglicense.status': 'completed'
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
                            'result': messages.save_driving_license_info,
                            'firstname': body.firstname,
                            'middlename': body.middlename,
                            'lastname': body.lastname,
                            'dob': body.dob,
                            'address': body.address,
                            'street': body.street,
                            'city': body.city,
                            'zip': body.zip,
                            'state': body.state,
                            'country': body.country,
                            'no': body.no,
                            'expiry': body.expiry,
                            'license_country': body.license_country,
                            'key': key
                        }
                        response.message = messages.save_driving_license_info;
                        callback(response);
                    }
                });
            })
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
}

module.exports = new KYCController();