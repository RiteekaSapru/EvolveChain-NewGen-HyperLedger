const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');

const md5 = require('md5');
const emailService = require('../../services/EmailService')
const smsService = require('../../services/SMSService')
const commonUtility = require('../../helpers/CommonUtility');
const logManager = require('../../helpers/LogManager');
const BaseController = require('../BaseController');
const App = require('../../models/apps');
const KycDocument = require('../../models/kycdocument');

const PUBLIC_PATH = config.get('PUBLIC_PATH');
const EmailTemplatesPath = path.join(__dirname + "/../../public/email_template");
const OTP_EXPIRY_MINS = config.get('OTP_EXPIRY_MINS');

class AppController extends BaseController {

    async Initialize(req, res) {

        req.checkBody("ip", messages.req_IP).notEmpty();
        req.checkBody("device_type", messages.req_device_type).notEmpty();
        req.checkBody("device_name", messages.req_device_name).notEmpty();
        req.checkBody("os_version", messages.req_os_version).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = super.GetErrors(result);
                logManager.Log(`Initialize:Invalid Request- ${error}`);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['ip', 'device_type', 'device_name', 'os_version', 'vendor_uuid']);

            body.key = commonUtility.GenerateUniqueToken();
            body.SERVER_ADDR = md5(req.connection.localAddress);
            body.REMOTE_ADDR = md5(req.connection.remoteAddress);

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

            commonUtility.RemoveNull(params); // remove blank value from array

            var app = new App(params);

            app.save().then((newApp) => {
                var kycDocParam = {
                    app_key: newApp.key,
                    isDelete: 0,
                    status: config.APP_STATUSES.PENDING,
                    last_modified: commonUtility.UtcNow()
                }
                var kycDoc = new KycDocument(kycDocParam);
                kycDoc.save().then((newKycDoc) => {
                    return this.GetSuccessResponse("Initialize", newApp, res);
                }).catch((ex) => {
                    return this.SendExceptionResponse(error, res);
                });

            }).catch((ex) => {
                return this.SendExceptionResponse(res, ex);
            });

        } catch (ex) {
            logManager.Log(`Initialize:Exception- ${ex}`);
            return this.SendExceptionResponse(res, ex);
        }
    }


    async ResubmitInitialize(req, res) {

        req.checkBody("resubmit_pin", messages.req_resubmit_pin).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['email', 'phone', 'country_code', 'resubmit_pin']);
            {
                if (body.email == "" && body.phone == "") {
                    return this.SendErrorResponse(res, config.ERROR_CODES.MISSING_PHONE_EMAIL, "");
                }
                else if (body.email == "") {
                    if (body.country_code == "")
                    //                if(body.country_code.notEmpty())
                    {
                        return this.SendErrorResponse(res, config.ERROR_CODES.MISSING_COUNTRY_CODE, "");
                    }
                    else {
                        var conditions = {
                            phone: body.phone,
                            country_code: body.country_code,
                            resubmit_pin: body.resubmit_pin
                        }
                    }
                }
                else if (body.phone == "") {
                    var conditions = {
                        email: body.email,
                        resubmit_pin: body.resubmit_pin
                    }
                }
            }
            App.findOne(conditions, (error, app) => {

                if (error) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.ERROR);
                }
                if (!app) { //Add the error code and corresponding message
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_DETAILS);
                }
                var con = {
                    app_key: app.key
                }
                KycDocument.findOne(con, (error, docData) => {
                    if (error) return this.SendErrorResponse(res, config.ERROR_CODES.ERROR);

                    if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

                    return this.GetSuccessResubmitInitialize(app, docData, res);
                })

            });

        } catch (ex) {
            logManager.Log(`ResubmitInitialize:Exception- ${ex}`);
            return this.SendExceptionResponse(res, ex);
        }
    }


    async GenerateEmailOTP(req, res) {

        req.checkBody("email", messages.req_email).notEmpty().isEmail();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['email']);

            let key = req.params.key;

            var conditions = {
                key: key
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    error = `Error :: ${error}`;
                    return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);


                var email = body.email.toLowerCase();
                var email_code = commonUtility.GenerateOTP(6);

                //send verification code email
                var template = fs.readFileSync(EmailTemplatesPath + '/email_varified.html', {
                    encoding: 'utf-8'
                });

                var emailBody = ejs.render(template, {
                    email: email,
                    kyc_id: email_code,
                    APP_LOGO_URL: config.get('APP_LOGO_URL'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });

                const subject = 'EvolveChain KYC - Email Code';

                emailService.SendEmail(email, subject, emailBody).then((success) => {

                    let md5EmailCode = md5(email_code);
                    var expireTime = commonUtility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                    var setParams = {
                        $set: {
                            email: email,
                            email_code: md5EmailCode,
                            email_verified: 0,
                            email_code_expire_time: expireTime
                        }
                    }

                    App.update(conditions, setParams).then(
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

        req.checkBody("email", messages.req_email).notEmpty().isEmail();
        req.checkBody("email_code", messages.req_email_code).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['email', 'email_code']);
            let key = req.params.key;

            var conditions = {
                key: key
                // email: body.email.toLowerCase(),
                // email_code: body.email_code.toLowerCase()
            }

            App.findOne(conditions, (error, app) => {
                if (error) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);

                if (app.email != body.email.toLowerCase())
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_EMAIL);

                var currentUtc = commonUtility.UtcNow();
                //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
                var expireTime = commonUtility.ConvertToUtc(app.email_code_expire_time);
                if (expireTime < currentUtc)
                    return this.SendErrorResponse(res, config.ERROR_CODES.OTP_EXPIRED);

                if (app.email_code != body.email_code.toLowerCase())
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_OTP);


                var setParams = {
                    $set: { email_verified: 1 }
                }

                App.update(conditions, setParams).then(
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

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("country_code", messages.req_country_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['mobile', 'country_code']);
            let key = req.params.key;

            var conditions = {
                key: key
            }

            App.findOne(conditions, (error, app) => {

                if (error) return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, error);

                if (!app) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);

                var phone_code = commonUtility.GenerateOTP(6);


                var phone = body.mobile.replace("+", "");
                var countryCode = body.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + phone_code + '.';
                let toPhone = "+" + countryCode + phone;

                smsService.SendSMS(toPhone, msg).then(message => {

                    let md5MobileOTP = md5(phone_code);
                    // var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                    var expireTime = commonUtility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                    var setParams = {
                        $set: {
                            phone: phone,
                            phone_code: md5MobileOTP,
                            country_Code: countryCode,
                            phone_verified: 0,
                            phone_code_expire_time: expireTime
                        }
                    }

                    App.update(conditions, setParams).then(
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

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("country_code", messages.req_country_code).notEmpty();
        req.checkBody("phone_code", messages.req_mobile_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

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

            App.findOne(conditions, (error, app) => {
                if (error) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);
                }

                if (!app)
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);

                if (app.phone != body.mobile.toLowerCase() && app.country_code != body.country_Code)
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_PHONE);

                var currentUtc = commonUtility.UtcNow();
                //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
                var expireTime = commonUtility.ConvertToUtc(app.phone_code_expire_time);
                if (expireTime < currentUtc)
                    return this.SendErrorResponse(res, config.ERROR_CODES.OTP_EXPIRED);

                if (app.phone_code != body.phone_code.toLowerCase())
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_OTP);

                var setParams = {
                    $set: { email_verified: 1 }
                }

                App.update(conditions, setParams).then(
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
        req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['ekyc_id']);

            let conditions = {
                ekyc_id: body.ekyc_id
            }

            App.findOne(conditions, (error, app) => {

                if (error) return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, error);

                if (!app) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);

                //Email verification
                var email = app.email.toLowerCase();
                var ver_code = commonUtility.GenerateOTP(6);

                var template = fs.readFileSync(EmailTemplatesPath + '/email_varified.html', {
                    encoding: 'utf-8'
                });

                var emailBody = ejs.render(template, {
                    email: email,
                    kyc_id: ver_code,
                    SITE_IMAGE: config.get('SITE_IMAGE'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });

                const subject = 'EvolveChain KYC - Email Code';

                //Mobile Verification
                var phone = app.phone.replace("+", "");
                var countryCode = app.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + ver_code + '.';
                let toPhone = "+" + countryCode + phone;

                smsService.SendSMS(toPhone, msg)
                    .then(message => {
                        let md5MobileOTP = md5(ver_code);
                        // var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                        // var expireTime = commonUtility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

                        var setParams = {
                            $set: {
                                otp: md5MobileOTP
                            }
                        }

                        return this.FindAndModifyQuery(conditions, setParams).exec();
                    })
                    .then((error, updatedApp) => {

                        if (!error && !updatedApp) {
                            this.SendErrorResponse(res, config.ERROR_CODES.ERROR, error);
                        }
                        else return emailService.SendEmail(email, subject, emailBody);
                    })
                    .then((success) => {

                        let md5EmailCode = md5(ver_code);
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


        req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();
        req.checkBody("pin_otp", messages.req_otp).notEmpty();
        req.checkBody("pin", messages.req_pin).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
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

        req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();
        req.checkBody("pin", messages.req_pin).notEmpty();
        req.checkBody("new_pin", messages.req_new_pin).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['pin', 'new_pin', 'ekyc_id']);

            if (body.pin == body.new_pin) {
                return this.SendErrorResponse(res, config.ERROR_CODES.SAME_PIN);
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

        req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();
        req.checkBody("pin", messages.req_pin).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['ekyc_id', 'pin', 'vendor_uuid']);

            var conditions = {
                isdelete: '0',
                ekyc_id: body.ekyc_id,
            }

            App.findOne(conditions, (error, app) => {

                if (error) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.ERROR);
                }
                if (!app) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_EKYCID);
                }
                if (app.vendor_uuid != body.vendor_uuid) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.DEVICE_MISMATCH);
                }
                if (app.pin != body.pin) {
                    return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_PIN);
                }
                var params = {
                    $set: { last_login_time: Date.now() }
                }
                App.update({
                    _id: app._id
                }, params).then((success) => {
                    var con = {
                        app_key: app.key
                    }
                    KycDocument.findOne(con, (error, docData) => {
                        if (error) return this.SendErrorResponse(res, config.ERROR_CODES.ERROR);

                        if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

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
        return App.findOneAndUpdate(queryCondition, setParams, options);
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
                    'init_config': config.get('init_config')
                };
                break;
            case "GeneratePin":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'result': messages.verify_email_phone_code
                }
                break;
            case "SetPin":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer,
                    'result': 'Pin has been set successfully!'
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
                    'result': 'Pin has been changed successfully!'
                }
                break;
            case "GenerateEmailOTP":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': messages.verify_email_code
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
                    'result': messages.verify_phone_code
                }
                break;
            case "VerifyMobile":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': 'Phone verified successfully!'
                }
                break;
            case "Login":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'name': appEntity.name,
                    'email': appEntity.email,
                    'phone': appEntity.phone,
                    //                   'profile': ,
                    'result': 'Login successful!'
                }
                break;
        }

        return res.status(status.OK).jsonp(response);
    }

    GetSuccessLoginResponse(appEntity, docEntity, res) {
        var response = {
            'success': 1,
            'now': Date.now(),
            'name': appEntity.name,
            'email': appEntity.email,
            'phone': appEntity.phone,
            "firstname": docEntity.basic_info.details.firstname,
            "middlename": docEntity.basic_info.details.middlename,
            "lastname": docEntity.basic_info.details.lastname,
            "dob": docEntity.basic_info.details.dob,
            "city": docEntity.basic_info.details.city,
            "address1": docEntity.basic_info.details.address1,
            "address2": docEntity.basic_info.details.address2,
            "place_of_birth": docEntity.basic_info.details.place_of_birth,
            "zip": docEntity.basic_info.details.zip,
            "state": docEntity.basic_info.details.state,
            "country": docEntity.basic_info.details.country,
            "profile_pic": config.base_url + "/kyc/getdocumentimages/" + docEntity.basic_info.images[0]._id.toString(),
            "result": "Login successful!"
        }
        return res.status(status.OK).jsonp(response);
    }

    GetSuccessResubmitInitialize(appEntity, docEntity, res) {
        var response = {
            "success": 1,
            "now": Date.now(),
            "name": appEntity.name,
            "email": appEntity.email,
            "phone": appEntity.phone,
            "basic_info_details": docEntity.basic_info.details,
            "address_info_details": docEntity.address_info.details,
            "identity_info_details": docEntity.identity_info.details,
            "profile_pic": config.base_url + "/kyc/getdocumentimages/" + docEntity.basic_info.images[0]._id.toString(),
            "result": "Resubmit initialize successful!"
        }

        return res.status(status.OK).jsonp(response);
    }


}

module.exports = new AppController();