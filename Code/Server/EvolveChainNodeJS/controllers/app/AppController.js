const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');

const md5 = require('md5');
const email_service = require('../../services/EmailService')
const sms_service = require('../../services/SMSService')
const common_utility = require('../../helpers/CommonUtility');
const log_manager = require('../../helpers/LogManager');
const base_controller = require('../BaseController');

const app = require('../../models/apps');
const Country = require('../../models/country');
const ProofDocuments = require('../../models/proofdocuments');

const kyc_document = require('../../models/kycdocument');

const PUBLIC_PATH = config.get('PUBLIC_PATH');
const EMAIL_TEMPLATES_PATH = path.join(__dirname + "/../../public/email_template");
const OTP_EXPIRY_MINS = config.get('OTP_EXPIRY_MINS');
const APP_EXPIRATION_DAYS = config.get('APP_EXPIRATION_DAYS');

class AppController extends base_controller {

    async Initialize(req, res) {

        req.checkBody("ip", messages.req_IP).notEmpty();
        req.checkBody("device_type", messages.req_device_type).notEmpty();
        req.checkBody("device_name", messages.req_device_name).notEmpty();
        req.checkBody("os_version", messages.req_os_version).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();
        req.checkBody("country_iso", messages.req_country_iso).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = super.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            // let body = _.pick(req.body, ['ip', 'device_type', 'device_name', 'os_version', 'vendor_uuid', 'country_iso', 'latitude', 'longitude', 'network_provider', 'network_country_code', 'mobile_network_code', 'mobile_country_code', 'iso_country_code']);
            let body = req.body;

            body.key = common_utility.GenerateUniqueToken();
            body.SERVER_ADDR = req.connection.localAddress;
            body.REMOTE_ADDR = req.connection.remoteAddress;

            var appParams = {                
                    device_info: {
                        device_name: body.device_name,
                        device_type: body.device_type,
                        os_version: body.os_version,
                        ip: body.ip,
                        refer: body.REMOTE_ADDR,
                        server: body.SERVER_ADDR,
                        latitude : body.latitude,
                        longitude : body.longitude,
                        network_provider : body.network_provider,
                        network_country_code :  body.network_country_code,
                        mobile_network_code : body.mobile_network_code,
                        iso_country_code:body.iso_country_code
                    },
                    vendor_uuid: body.vendor_uuid,
                    key: body.key,
                    status: config.APP_STATUSES.PENDING,
                    country_iso: body.country_iso
            }

            common_utility.RemoveNull(appParams); // remove blank value from array

            var iso = body.country_iso.toUpperCase();
            const countryDocs  = await ProofDocuments.find({country_iso: { $eq : iso}});

            var App = new app(appParams);
            var newApp = await App.save();

            let verification_code = common_utility.GenerateOTP(6);
            var kycDocParam = {
                app_key: newApp.key,
                isDelete: 0,
                face_info: { details: { number: verification_code } },
                last_modified: common_utility.UtcNow()
            }


            var kycDoc = new kyc_document(kycDocParam);
            var newKycDoc = await kycDoc.save();
            newApp.documents = countryDocs
            newApp.verification_code = verification_code;

            return this.GetSuccessResponse("Initialize", newApp, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async ResubmitVerification(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("isd_code", messages.req_isd_code).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['mobile', 'isd_code']);

            var conditions = {
                phone: body.mobile,
                isd_code: body.isd_code
            }

            var App = await app.findOne(conditions);

            if (!App) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND, error);

            var status = App.status;
            var errorMsg = "Your application is in " + status + " status. You cannot resubmit the application.";
            if (status != config.APP_STATUSES.PENDING && status != config.APP_STATUSES.REJECTED) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, errorMsg);
            }

            var currentUtc = common_utility.UtcNow();
            //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
            var lastModified = common_utility.ConvertToUtc(App.last_modified);
            var expiryDate = lastModified.setDate(lastModified.getDate() + APP_EXPIRATION_DAYS);

            if (expiryDate < currentUtc)
                return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, "Your application has expired. Please sign up again.");

            var phone_code = common_utility.GenerateOTP(6);

            var phone = body.mobile.replace("+", "");
            var isdCode = body.isd_code.replace("+", "");
            var msg = 'EvolveChain mobile verification code: ' + phone_code + '.';
            let toPhone = "+" + isdCode + phone;

            let smsResult = await sms_service.SendSMS(toPhone, msg);

            let md5OTP = md5(phone_code);
            var expireTime = common_utility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

            var setParams = {
                $set: {
                    resubmit_pin: {
                        otp: md5OTP,
                        otp_expiry_time: expireTime,
                    }
                }
            }

            await app.update(conditions, setParams);
            return this.GetSuccessResponse("ResubmitVerification", null, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async ResubmitInitialize(req, res) {

        req.checkBody("resubmit_pin", messages.req_resubmit_pin).notEmpty();
        req.checkBody("appkey", messages.req_app_key).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['resubmit_pin', 'appkey']);

            var conditions = {
                key: body.appkey,
                resubmit_pin: body.resubmit_pin
            }

            var appData = await app.findOne(conditions).populate('kycdoc_data').exec();

            if (!appData)
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            if (appData.resubmit_pin.otp != body.resubmit_pin)
                return this.SendErrorResponse(res, CONFIG.ERROR_CODES.INCORRECT_OTP);

            var currentUtc = common_utility.UtcNow();
            //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
            var expireTime = common_utility.ConvertToUtc(appData.resubmit_pin.otp_expiry_time);
            if (expireTime < currentUtc)
                return this.SendErrorResponse(res, config.ERROR_CODES.OTP_EXPIRED);

            var docData = appData.kycdoc_data;//await kyc_document.findOne(con);
            if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

            var iso = appData.country_iso.toUpperCase();
            const countryDocs = await ProofDocuments.find({ country_iso: { $eq: iso } });

            //Get the Country details from ISO
            var countryDetails = await Country.findOne({ "iso": iso });

            appData.documents = countryDocs;
            appData.countryDetails = countryDetails;
            return this.GetSuccessResubmitInitialize(appData, docData, res);

        } catch (ex) {
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

            var App = await app.findOne(conditions);

            if (!App)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);


            var email = body.email.toLowerCase();
            var email_code = common_utility.GenerateOTP(6);

            //send verification code email
            var template = fs.readFileSync(config.EMAIL_TEMPLATES_PATH + '/verifyEmail.html', {
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

            var emailSuccess = await email_service.SendEmail(email, subject, emailBody);

            let md5OTP = md5(email_code);
            var expireTime = common_utility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

            var setParams = {
                $set: {
                    email_info: {
                        otp: md5OTP,
                        otp_expiry_time: expireTime,
                        id: email
                    }
                }
            }

            await app.update(conditions, setParams);

            return this.GetSuccessResponse("GenerateEmailOTP", null, res);

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
            }

            var App = await app.findOne(conditions);

            if (!App)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);

            if (App.email_info.id != body.email.toLowerCase())
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_EMAIL);

            var currentUtc = common_utility.UtcNow();
            //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
            var expireTime = common_utility.ConvertToUtc(App.email_info.otp_expiry_time);
            if (expireTime < currentUtc)
                return this.SendErrorResponse(res, config.ERROR_CODES.OTP_EXPIRED);

            if (App.email_info.otp != body.email_code.toLowerCase())
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_OTP);

            var setParams = {
                $set: { email: body.email.toLowerCase() }
            }

            await app.update(conditions, setParams);

            return this.GetSuccessResponse("VerifyEmail", null, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }

    }

    async GenerateMobileOTP(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("country_code", messages.req_isd_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);

            }

            let body = _.pick(req.body, ['mobile', 'country_code']);
            let appKey = req.params.key;

            var conditions = {
                key: appKey
            }

            var App = await app.findOne(conditions);

            if (!App) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            var phone = body.mobile.replace("+", "");
            var isdCode = body.country_code.replace("+", "");

            var sameMobileOtherApp = await app.findOne({ key: { $ne: appKey }, phone: phone, isd_code: isdCode });
            if (sameMobileOtherApp) {
                return this.SendErrorResponse(res, config.ERROR_CODES.DUPLICATE_PHONE);
            }

            var phone_code = common_utility.GenerateOTP(6);
            var msg = 'EvolveChain mobile verification code: ' + phone_code + '.';
            let toPhone = "+" + isdCode + phone;

            let smsResult = await sms_service.SendSMS(toPhone, msg);

            let md5OTP = md5(phone_code);
            // var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
            var expireTime = common_utility.AddMinutesToUtcNow(OTP_EXPIRY_MINS);

            var setParams = {
                $set: {
                    phone_info: {
                        otp: md5OTP,
                        otp_expiry_time: expireTime,
                        number: phone,
                        isd_code: isdCode
                    }
                }
            }

            await app.update(conditions, setParams);
            return this.GetSuccessResponse("GenerateMobileOTP", null, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async VerifyMobile(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("country_code", messages.req_isd_code).notEmpty();
        req.checkBody("phone_code", messages.req_mobile_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['mobile', 'country_code', 'phone_code']);
            let appKey = req.params.key;
            let phone = body.mobile.toLowerCase();
            let isdCode = body.country_code;
            let phoneOtp = body.phone_code.toLowerCase();
            var conditions = {
                key: appKey
            }

            var App = await app.findOne(conditions);

            if (!App)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_KEY);

            if (App.phone_info.number != phone || App.phone_info.isd_code != isdCode)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_PHONE);

            var currentUtc = common_utility.UtcNow();
            //explicitly needs to convert to UTC, somehow mongodb or node js convert it to local timezone
            var expireTime = common_utility.ConvertToUtc(App.phone_info.otp_expiry_time);
            if (expireTime < currentUtc)
                return this.SendErrorResponse(res, config.ERROR_CODES.OTP_EXPIRED);

            if (App.phone_info.otp != phoneOtp)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_OTP);

            var sameMobileOtherApp = await app.findOne({ key: { $ne: appKey }, phone: phone, isd_code: isdCode });
            if (sameMobileOtherApp) {
                return this.SendErrorResponse(res, config.ERROR_CODES.DUPLICATE_PHONE);
            }

            var setParams = {
                $set: { phone: phone, isd_code: isdCode }
            }

            await app.update(conditions, setParams);
            return this.GetSuccessResponse("VerifyMobile", null, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GeneratePin(req, res) {

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

            var App = await app.findOne(conditions);

            if (!App)
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_EKYCID);

            //Email verification
            var email = App.email.toLowerCase();
            var ver_code = common_utility.GenerateOTP(6);

            var template = fs.readFileSync(EMAIL_TEMPLATES_PATH + '/email_varified.html', {
                encoding: 'utf-8'
            });

            var emailBody = ejs.render(template, {
                email: email,
                kyc_id: ver_code,
                APP_LOGO_URL: config.get('APP_LOGO_URL'),
                SITE_NAME: config.get('app_name'),
                CURRENT_YEAR: config.get('current_year')
            });
            const subject = 'EvolveChain KYC - Email Code';

            //Mobile Verification
            var phone = App.phone.replace("+", "");
            var isdCode = App.isd_code.replace("+", "");
            var msg = 'EvolveChain mobile verification code: ' + ver_code + '.';
            let toPhone = "+" + isdCode + phone;


            var emailSuccess = await email_service.SendEmail(email, subject, emailBody);
            let smsResult = await sms_service.SendSMS(toPhone, msg);

            let md5EmailCode = md5(ver_code);
            var setParams = {
                $set: {
                    pin_otp: md5EmailCode
                }
            }

            var updatedApp = await this.FindAndModifyQuery(conditions, setParams);

            if (!updatedApp) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            return this.GetSuccessResponse("GeneratePin", updatedApp, res);

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
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
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

            var updatedApp = await this.FindAndModifyQuery(conditions, setParams);

            if (!updatedApp) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            return this.GetSuccessResponse("SetPin", updatedApp, res);

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

            var updatedApp = await this.FindAndModifyQuery(conditions, setParams);

            if (!updatedApp) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            return this.GetSuccessResponse("ChangePin", updatedApp, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }



    async GetEkycId(req, res) {

        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['vendor_uuid']);

            let conditions = {
                vendor_uuid: body.vendor_uuid
            }

            var appData = await app.findOne(conditions);

            if (!appData) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            if (appData.ekyc_id == undefined || appData.ekyc_id == null) {
                return this.SendErrorResponse(res, config.ERROR_CODES.DEVICE_EKYCID_NOT_FOUND);
            }

            return this.GetSuccessResponse("GetEkycId", appData, res);

        } catch (e) {
            return this.SendExceptionResponse(res, e);
        }
    }



    async Login(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("isd_code", messages.req_isd_code).notEmpty();
        req.checkBody("pin", messages.req_pin).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['mobile', 'isd_code', 'pin', 'vendor_uuid']);

            var conditions = {
                phone: body.mobile,
                isd_code: body.isd_code
            }

            var App = await app.findOne(conditions);
            var appData = await app.findOne(conditions).populate('kycdoc_data').exec();

            if (!appData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }
            if (appData.vendor_uuid != body.vendor_uuid) {
                return this.SendErrorResponse(res, config.ERROR_CODES.DEVICE_MISMATCH);
            }
            if (appData.pin != body.pin) {
                return this.SendErrorResponse(res, config.ERROR_CODES.INCORRECT_PIN);
            }

            var status = appData.status;
            if (status == config.APP_STATUSES.EXPIRED) {
                return this.SendErrorResponse(res, config.ERROR_CODES.EXPIRED_APP_STATUS);
            }
            
            var errorMsg = "Your application is in " + status + " status. You cannot login the application.";
            if (status != config.APP_STATUSES.VERIFIED) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ERROR, errorMsg);
            }

            var docData = appData.kycdoc_data;
            if (!docData) return this.SendErrorResponse(res, config.ERROR_CODES.DOCUMENT_NOT_FOUND);

            var currentUtc = common_utility.UtcNow();
            var expired = false;

            if (docData.identity_info.details.expiry_date != undefined || docData.identity_info.details.expiry_date != null) {
                var expireDateIdentity = common_utility.ConvertToUtc(docData.identity_info.details.expiry_date);
                if (expireDateIdentity < currentUtc) {
                    expired = true;
                }
            }

            if (docData.address_info.details.expiry_date != undefined || docData.address_info.details.expiry_date != null) {
                var expireDateAddress = common_utility.ConvertToUtc(docData.address_info.details.expiry_date);
                if (expireDateAddress < currentUtc) {
                    expired = true;
                }
            }

            var cond = { _id: appData._id }
            if (expired) {
                var params = {
                    $set: { status: config.APP_STATUSES.EXPIRED }
                }
                await app.update(cond, params);
                return this.SendErrorResponse(res, config.ERROR_CODES.EXPIRED_APP_STATUS);
            }

            var params = {
                $set: { last_login_time: common_utility.UtcNow() }
            }
            await app.update(cond, params);

            return this.GetSuccessLoginResponse(App, docData, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }



    FindAndModifyQuery(queryCondition, setParams) {
        const options = {
            upsert: false,
            returnNewDocument: true
        }
        return app.findOneAndUpdate(queryCondition, setParams, options);
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
                    'documents': appEntity.documents,
                    'verification_code': appEntity.verification_code
                    // 'init_config': config.get('init_config')
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
                    'result': messages.set_pin_success
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
                    'result': messages.change_pin_success
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
                    'result': messages.verify_mobile_success
                }
                break;
            case "GetEkycId":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'ekyc_id': appEntity.ekyc_id,
                    'result': messages.ekyc_same_device
                }
            case "ResubmitVerification":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'result': messages.success
                }
                break;
        }

        return res.status(status.OK).jsonp(response);
    }

    GetSuccessLoginResponse(appEntity, docEntity, res) {
        var response = {
            'success': 1,
            'now': common_utility.UtcNow(),
            'name': appEntity.name,
            'email': appEntity.email,
            'phone': appEntity.phone,
            'appkey': appEntity.key,
            'country_code': appEntity.isd_code,
            "firstname": docEntity.basic_info.details.firstname,
            "middlename": docEntity.basic_info.details.middlename,
            "lastname": docEntity.basic_info.details.lastname,
            "dob": docEntity.basic_info.details.dob,
            "city": docEntity.basic_info.details.city,
            "address1": docEntity.basic_info.details.address1,
            "address2": docEntity.basic_info.details.address2,
            "street": docEntity.basic_info.details.street,
            "place_of_birth": docEntity.basic_info.details.place_of_birth,
            "zip": docEntity.basic_info.details.zip,
            "state": docEntity.basic_info.details.state,
            "country": docEntity.basic_info.details.country,
            "profile_pic": config.base_url + "/kyc/getdocumentimages/" + docEntity.basic_info.images[0]._id.toString(),
            "result": messages.login_success
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
            'country_code': appEntity.isd_code,
            'appkey': appEntity.key,
            "BasicInfo": common_utility.GetKycDocumentInfo(docEntity.basic_info, "BASIC"),
            "AddressInfo": common_utility.GetKycDocumentInfo(docEntity.address_info, "ADDRESS"),
            "IdentityInfo": common_utility.GetKycDocumentInfo(docEntity.identity_info, "IDENTITY"),
            "FaceInfo": common_utility.GetKycDocumentInfo(docEntity.face_info, "IDENTITY"),
            'documents': appEntity.documents,
            'country_details': appEntity.countryDetails,
            'verification_code': docEntity.face_info.details.number,
            "result": messages.resubmit_init_success
        }
        return res.status(status.OK).jsonp(response);
    }
}

module.exports = new AppController();
