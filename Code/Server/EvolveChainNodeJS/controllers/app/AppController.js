const FS = require("fs");
const EJS = require('ejs');
const PATH = require("path");
const _ = require('lodash');
const CONFIG = require('config');
const STATUS = CONFIG.get('status');
const MESSAGES = CONFIG.get('messages');

const MD5 = require('md5');
const EMAIL_SERVICE = require('../../services/EmailService')
const SMS_SERVICE = require('../../services/SMSService')
const COMMON_UTILITY = require('../../helpers/CommonUtility');
const LOG_MANAGER = require('../../helpers/LogManager');
const BASE_CONTROLLER = require('../BaseController');

const APP = require('../../models/apps');
const KYC_DOCUMENT = require('../../models/kycdocument');

const PUBLIC_PATH = CONFIG.get('PUBLIC_PATH');
const EMAIL_TEMPLATES_PATH = PATH.join(__dirname + "/../../public/email_template");
const OTP_EXPIRY_MINS = CONFIG.get('OTP_EXPIRY_MINS');

class AppController extends BASE_CONTROLLER {

    async Initialize(req, res) {

        req.checkBody("ip", MESSAGES.req_IP).notEmpty();
        req.checkBody("device_type", MESSAGES.req_device_type).notEmpty();
        req.checkBody("device_name", MESSAGES.req_device_name).notEmpty();
        req.checkBody("os_version", MESSAGES.req_os_version).notEmpty();
        req.checkBody("vendor_uuid", MESSAGES.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = super.GetErrors(result);              
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['ip', 'device_type', 'device_name', 'os_version', 'vendor_uuid']);

            body.key = COMMON_UTILITY.GenerateUniqueToken();
            body.SERVER_ADDR = MD5(req.connection.localAddress);
            body.REMOTE_ADDR = MD5(req.connection.remoteAddress);

            var params = {
                IP: body.ip,
                device_type: body.device_type,
                device_name: body.device_name,
                os_version: body.os_version,
                vendor_uuid: body.vendor_uuid,
                key: body.key,
                isdelete: '0',
                Server: body.SERVER_ADDR,
                Refer: body.REMOTE_ADDR
            }

            COMMON_UTILITY.RemoveNull(params); // remove blank value from array

            var app = new APP(params);

            app.save().then((newApp) => {
                var kycDocParam = {
                    app_key: newApp.key,
                    isDelete: 0,
                    CONFIG: CONFIG.APP_STATUSES.PENDING,
                    last_modified: COMMON_UTILITY.UtcNow()
                }
                var kycDoc = new KYC_DOCUMENT(kycDocParam);
                kycDoc.save().then((newKycDoc) => {
                    return this.GetSuccessResponse("Initialize", newApp, res);
                }).catch((ex) => {
                    return this.SendExceptionResponse(error, res);
                });

            }).catch((ex) => {
                return this.SendExceptionResponse(res, ex);
            });

        } catch (ex) {
            LOG_MANAGER.Log(`Initialize:Exception- ${ex}`);
            return this.SendExceptionResponse(res, ex);
        }
    }


    async ResubmitInitialize(req, res) {

        req.checkBody("resubmit_pin", MESSAGES.req_resubmit_pin).notEmpty();
        req.checkBody("user_contact_type", MESSAGES.req_user_contact_type).isIn(['email', 'phone']);

        switch (req.body.user_contact_type) {
            case "phone":
                req.checkBody("phone", MESSAGES.req_mobile).notEmpty();
                req.checkBody("country_code", MESSAGES.req_country_code).notEmpty();
                break;
            case "email":
                req.checkBody("email", MESSAGES.req_email).notEmpty();
                break;
            default:
                return this.GetErrorResponse('user contact type missing!', res);
                break;
        }

        try {
                let result = await req.getValidationResult();

                if (!result.isEmpty()) {
                    let error = this.GetErrors(result);
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);
                }

                let body = _.pick(req.body, ['email','phone', 'country_code', 'resubmit_pin', 'user_contact_type']);

                switch (req.body.user_contact_type) {
                    case "phone":
                    var conditions = {
                        phone: body.phone,
                        country_code: body.country_code,
                        resubmit_pin: body.resubmit_pin
                    }
                        break;
                    case "email":
                        var conditions = {
                            email: body.email,
                            resubmit_pin: body.resubmit_pin
                        }
                        break;
                    default:
                        return this.GetErrorResponse('contact type missing!', res);
                        break;
                }

                APP.findOne(conditions, (error, app) => {

                    if (error) {
                        return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR);
                    }
                    if (!app) {
                        return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND);
                    }
                    var con = {
                        app_key: app.key,
                        isDelete: 0
                    }
                    KYC_DOCUMENT.findOne(con, (error, docData) => {
                        if (error) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR);

                        if (!docData) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.DOCUMENT_NOT_FOUND);

                        return this.GetSuccessResubmitInitialize(app, docData, res);
                    })

                });

        } catch (ex) {
            LOG_MANAGER.Log(`ResubmitInitialize:Exception- ${ex}`);
            return this.SendExceptionResponse(res, ex);
        }
    }


    async GenerateEmailOTP(req, res) {

        req.checkBody("email", MESSAGES.req_email).notEmpty().isEmail();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['email']);

            let key = req.params.key;

            var conditions = {
                key: key
            }

            APP.findOne(conditions, (error, app) => {

                if (error) {
                    error = `Error :: ${error}`;
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_KEY);


                var email = body.email.toLowerCase();
                var email_code = COMMON_UTILITY.GenerateOTP(6);

                //send verification code email
                var template = FS.readFileSync(EMAIL_TEMPLATES_PATH + '/email_varified.html', {
                    encoding: 'utf-8'
                });

                var emailBody = EJS.render(template, {
                    email: email,
                    kyc_id: email_code,
                    APP_LOGO_URL: CONFIG.get('APP_LOGO_URL'),
                    SITE_NAME: CONFIG.get('app_name'),
                    CURRENT_YEAR: CONFIG.get('current_year')
                });

                const subject = 'EvolveChain KYC - Email Code';

                EMAIL_SERVICE.SendEmail(email, subject, emailBody).then((success) => {

                    let md5EmailCode = MD5(email_code);
                    var expireTime = COMMON_UTILITY.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                    var setParams = {
                        $set: {
                            email: email,
                            email_code: md5EmailCode,
                            email_verified: 0,
                            email_code_expire_time: expireTime
                        }
                    }

                    APP.update(conditions, setParams).then(
                        (success) => {
                            return this.GetSuccessResponse("GenerateEmailOTP", null, res);
                        }
                    ).catch((ex) => {
                        return this.SendExceptionResponse(res, ex);
                    });

                }).catch((ex) => {
                    return this.SendExceptionResponse(res, ex);
                });
            })
        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async VerifyEmail(req, res) {

        req.checkBody("email", MESSAGES.req_email).notEmpty().isEmail();
        req.checkBody("email_code", MESSAGES.req_email_code).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['email', 'email_code']);
            let key = req.params.key;

            var conditions = {
                key: key
                // email: body.email.toLowerCase(),
                // email_code: body.email_code.toLowerCase()
            }

            APP.findOne(conditions, (error, app) => {
                if (error) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_KEY);

                if (app.email != body.email.toLowerCase())
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_EMAIL);

                var currentUtc = COMMON_UTILITY.UtcNow();
                //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
                var expireTime = COMMON_UTILITY.ConvertToUtc(app.email_code_expire_time);
                if (expireTime < currentUtc)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.OTP_EXPIRED);

                if (app.email_code != body.email_code.toLowerCase())
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_OTP);


                var setParams = {
                    $set: { email_verified: 1 }
                }

                APP.update(conditions, setParams).then(
                    (success) => {
                        return this.GetSuccessResponse("VerifyEmail", null, res);
                    }
                ).catch((ex) => {
                    return this.SendExceptionResponse(res, ex);
                });

            });

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }

    }

    async GenerateMobileOTP(req, res) {

        req.checkBody("mobile", MESSAGES.req_mobile).notEmpty();
        req.checkBody("country_code", MESSAGES.req_country_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['mobile', 'country_code']);
            let key = req.params.key;

            var conditions = {
                key: key
            }

            APP.findOne(conditions, (error, app) => {

                if (error) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR, error);

                if (!app) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND, error);

                var phone_code = COMMON_UTILITY.GenerateOTP(6);


                var phone = body.mobile.replace("+", "");
                var countryCode = body.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + phone_code + '.';
                let toPhone = "+" + countryCode + phone;

                SMS_SERVICE.SendSMS(toPhone, msg).then(message => {

                    let md5MobileOTP = MD5(phone_code);
                    // var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                    var expireTime = COMMON_UTILITY.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                    var setParams = {
                        $set: {
                            phone: phone,
                            phone_code: md5MobileOTP,
                            country_Code: countryCode,
                            phone_verified: 0,
                            phone_code_expire_time: expireTime
                        }
                    }

                    APP.update(conditions, setParams).then(
                        (success) => {
                            return this.GetSuccessResponse("GenerateMobileOTP", null, res);
                        }
                    ).catch((ex) => {
                        return this.SendExceptionResponse(res, ex);
                    });

                    // this.FindAndModifyQuery(conditions, setParams).exec(
                    //     (error, updatedApp) => {
                    //         return this.SendResponse("GenerateMobileOTP", error, updatedApp, res);
                    //     }
                    // );

                }).catch((ex) => {
                    return this.SendExceptionResponse(res, ex);
                });
            })

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async VerifyMobile(req, res) {

        req.checkBody("mobile", MESSAGES.req_mobile).notEmpty();
        req.checkBody("country_code", MESSAGES.req_country_code).notEmpty();
        req.checkBody("phone_code", MESSAGES.req_mobile_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['mobile', 'country_code', 'phone_code']);
            let key = req.params.key;

            // var expireTime = new Date(Date.now() - (OTP_EXPIRY_MINS * 60000));

            var conditions = {
                key: key
                // phone: body.mobile,
                // phone_code: body.phone_code,
                // country_Code: body.country_Code,
                // phone_code_expire_time: { $gte: expireTime }
            }

            APP.findOne(conditions, (error, app) => {
                if (error) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_KEY);

                if (app.phone != body.mobile.toLowerCase() && app.country_code != body.country_Code)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_PHONE);

                var currentUtc = COMMON_UTILITY.UtcNow();
                //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
                var expireTime = COMMON_UTILITY.ConvertToUtc(app.phone_code_expire_time);
                if (expireTime < currentUtc)
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.OTP_EXPIRED);

                if (app.phone_code != body.phone_code.toLowerCase())
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_OTP);

                var setParams = {
                    $set: { phone_verified: 1 }
                }

                APP.update(conditions, setParams).then(
                    (success) => {
                        return this.GetSuccessResponse("VerifyMobile", null, res);
                    }
                ).catch((ex) => {
                    return this.SendExceptionResponse(res, ex);
                });

            });

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GeneratePin(req, res) {

        //       let current_ref= this;
        req.checkBody("ekyc_id", MESSAGES.req_ekycid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['ekyc_id']);

            let conditions = {
                ekyc_id: body.ekyc_id
            }

            APP.findOne(conditions, (error, app) => {

                if (error) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR, error);

                if (!app) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.APP_NOT_FOUND, error);

                //Email verification
                var email = app.email.toLowerCase();
                var ver_code = COMMON_UTILITY.GenerateOTP(6);

                var template = FS.readFileSync(EMAIL_TEMPLATES_PATH + '/email_varified.html', {
                    encoding: 'utf-8'
                });

                var emailBody = EJS.render(template, {
                    email: email,
                    kyc_id: ver_code,
                    APP_LOGO_URL: CONFIG.get('APP_LOGO_URL'),
                    SITE_NAME: CONFIG.get('app_name'),
                    CURRENT_YEAR: CONFIG.get('current_year')
                });

                const subject = 'EvolveChain KYC - Email Code';

                //Mobile Verification
                var phone = app.phone.replace("+", "");
                var countryCode = app.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + ver_code + '.';
                let toPhone = "+" + countryCode + phone;

                SMS_SERVICE.SendSMS(toPhone, msg)
                    .then(message => {
                        let md5MobileOTP = MD5(ver_code);
                        // var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                        // var expireTime = COMMON_UTILITY.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                        var setParams = {
                            $set: {
                                otp: md5MobileOTP
                            }
                        }

                        return this.FindAndModifyQuery(conditions, setParams).exec();
                    })
                    .then((error, updatedApp) => {

                        if (!error && !updatedApp) {
                            this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR, error);
                        }
                        else return EMAIL_SERVICE.SendEmail(email, subject, emailBody);
                    })
                    .then((success) => {

                        let md5EmailCode = MD5(ver_code);
                        var setParams = {
                            $set: {
                                otp: md5EmailCode
                            }
                        }

                        return this.FindAndModifyQuery(conditions, setParams).exec();

                    })
                    .then((updatedApp, error) => {
                        return this.SendResponse("GeneratePin", error, updatedApp, res);
                    })
                    .catch((ex) => {
                        return this.SendExceptionResponse(res, ex);
                    });

            });

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }

    }

    async SetPin(req, res) {


        req.checkBody("ekyc_id", MESSAGES.req_ekycid).notEmpty();
        req.checkBody("pin_otp", MESSAGES.req_otp).notEmpty();
        req.checkBody("pin", MESSAGES.req_pin).notEmpty();
        req.checkBody("vendor_uuid", MESSAGES.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['ekyc_id', 'pin_otp', 'pin', 'vendor_uuid']);
            let targetPin = body.pin;
            let conditions = {
                ekyc_id: body.ekyc_id,
                pin_otp: body.pin_otp
            }

            var setParams = {
                $set: {
                    pin: targetPin,
                    vendor_uuid: body.vendor_uuid
                }
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                    return this.SendResponse("SetPin", error, updatedApp, res);
                }
            );

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async ChangePin(req, res) {

        req.checkBody("ekyc_id", MESSAGES.req_ekycid).notEmpty();
        req.checkBody("pin", MESSAGES.req_pin).notEmpty();
        req.checkBody("new_pin", MESSAGES.req_new_pin).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['pin', 'new_pin', 'ekyc_id']);

            if (body.pin == body.new_pin) {
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.SAME_PIN);
            }

            let conditions = {
                ekyc_id: body.ekyc_id,
                pin: body.pin
            }

            var setParams = {
                pin: body.new_pin,
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                    return this.SendResponse("ChangePin", error, updatedApp, res);
                }
            );

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async Login(req, res) {

        req.checkBody("ekyc_id", MESSAGES.req_ekycid).notEmpty();
        req.checkBody("pin", MESSAGES.req_pin).notEmpty();
        req.checkBody("vendor_uuid", MESSAGES.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['ekyc_id', 'pin', 'vendor_uuid']);

            var conditions = {
                isdelete: '0',
                ekyc_id: body.ekyc_id,
            }

            APP.findOne(conditions, (error, app) => {

                if (error) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR);
                }
                if (!app) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_EKYCID);
                }
                if (app.vendor_uuid != body.vendor_uuid) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.DEVICE_MISMATCH);
                }
                if (app.pin != body.pin) {
                    return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_PIN);
                }
                var params = {
                    $set: { last_login_time: Date.now() }
                }
                APP.update({
                    _id: app._id
                }, params).then((success) => {
                    var con = {
                        app_key: app.key
                    }
                    KYC_DOCUMENT.findOne(con, (error, docData) => {
                        if (error) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.ERROR);

                        if (!docData) return this.SendErrorResponse(res, CONFIG.ERROR_CODES.DOCUMENT_NOT_FOUND);

                        return this.GetSuccessLoginResponse(app, docData, res);

                    })

                })
            });

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    FindAndModifyQuery(queryCondition, setParams) {
        const options = {
            upsert: false,
            returnNewDocument: true
        }
        return APP.findOneAndUpdate(queryCondition, setParams, options);
    }

    SendResponse(apiName, error, updatedApp, res) {
        if (error) {
            return this.GetErrorResponse(error, res);
        }
        if (!updatedApp) {
            return this.GetErrorResponse("Invalid Request: No application found", res);
        }
        return this.GetSuccessResponse(apiName, updatedApp, res);
    }

    //Common methods for Success response
    GetSuccessResponse(apiName, appEntity, res) {
        var response = {};
        switch (apiName) {
            case "Initialize":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'ip': appEntity.IP,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'init_config': CONFIG.get('init_config')
                };
                break;
            case "GeneratePin":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'result': MESSAGES.verify_email_phone_code
                }
                break;
            case "SetPin":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'result': MESSAGES.set_pin_success
                }
                break;
            case "ChangePin":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'pin': appEntity.pin,
                    'result': MESSAGES.change_pin_success
                }
                break;
            case "GenerateEmailOTP":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': MESSAGES.verify_email_code
                }
                break;
            case "VerifyEmail":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': 'Email verified successfully!'
                }
                break;
            case "GenerateMobileOTP":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': MESSAGES.verify_phone_code
                }
                break;
            case "VerifyMobile":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': MESSAGES.verify_mobile_success
                }
                break;
        }

        return res.status(STATUS.OK).jsonp(response);
    }

    GetSuccessLoginResponse(appEntity, docEntity, res) {
        var response = {
            'success': 1,
            'now': Date.now(),
            'name': appEntity.name,
            'email': appEntity.email,
            'phone': appEntity.phone,
            'appkey' : appEntity.key,
            'country_code' : appEntity.country_code,
            "firstname": docEntity.basic_info.details.firstname,
            "middlename": docEntity.basic_info.details.middlename,
            "lastname": docEntity.basic_info.details.lastname,
            "dob": docEntity.basic_info.details.dob,
            "city": docEntity.basic_info.details.city,
            "address1": docEntity.basic_info.details.address1,
            "address2": docEntity.basic_info.details.address2,
            "street" : docEntity.basic_info.details.street,
            "place_of_birth": docEntity.basic_info.details.place_of_birth,
            "zip": docEntity.basic_info.details.zip,
            "state": docEntity.basic_info.details.state,
            "country": docEntity.basic_info.details.country,
            "profile_pic": CONFIG.base_url + "/kyc/getdocumentimages/" + docEntity.basic_info.images[0]._id.toString(),
            "result": MESSAGES.login_success
        }
        return res.status(STATUS.OK).jsonp(response);
    }


       GetSuccessResubmitInitialize(appEntity, docEntity, res) {
            var response = {
                "success": 1,
                "now": Date.now(),
                "name": appEntity.name,
                "email": appEntity.email,
                "phone": appEntity.phone,
                'appkey' : appEntity.key,
                "BasicInfo": COMMON_UTILITY.GetKycDocumentInfo(docEntity.basic_info, "BASIC"),
                "AddressInfo": COMMON_UTILITY.GetKycDocumentInfo(docEntity.address_info, "ADDRESS"),
                "IdentityInfo": COMMON_UTILITY.GetKycDocumentInfo(docEntity.identity_info, "IDENTITY"),
                "result": MESSAGES.resubmit_init_success
            }
        return res.status(STATUS.OK).jsonp(response);
    }
}

module.exports = new AppController();
