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
const authenticator = require('authenticator');
const App = require('../../models/apps');
const KycDocument = require('../../models/kycdocument');
const Document = require('../../models/document');
const File = require('../../models/files');
const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');
const EmailTemplatesPath = path.join(__dirname + "/../../public/email_template");
const OTP_EXPIRY_MINS = config.get('OTP_EXPIRY_MINS');
var bucket;

class AppController extends BaseController {

    FindAndModifyQuery(queryCondition, setParams) {
        const options = {
            upsert: false,
            returnNewDocument: true
        }
        return App.findOneAndUpdate(queryCondition, setParams, options);
    }

    //#region Initialize
    async Initialize(req, res) {

        req.checkBody("ip", messages.req_IP).notEmpty();
        req.checkBody("device_type", messages.req_device_type).notEmpty();
        req.checkBody("device_name", messages.req_device_name).notEmpty();
        req.checkBody("os_version", messages.req_os_version).notEmpty();
        req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                logManager.Log(`Initialize:Invalid Request- ${error}`);
                return this.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['ip', 'device_type', 'device_name', 'os_version', 'vendor_uuid']);

            body.key = md5(Date.now());
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
                    docInfo: {}
                }
                var kycDoc = new KycDocument(kycDocParam);
                kycDoc.save().then((newKycDoc) => {
                    return this.GetSuccessResponse("Initialize", newApp, res);
                }).catch(function (error) {
                    return this.GetErrorResponse(error, res);
                });

            }).catch(function (error) {
                return this.GetErrorResponse(error, res);
            });

            // //Newgen:check if vendor_uuid already exist then update the info else add new record
            // let conditions = {
            //     vendor_uuid: body.vendor_uuid
            // }

            // App.findOne(conditions, (error, app) => {

            //     if (error) return this.GetErrorResponse(error, res);

            //     if (!app) {
            //         var params = {
            //             IP: body.ip,
            //             device_type: body.device_type,
            //             device_name: body.device_name,
            //             os_version: body.os_version,
            //             vendor_uuid: body.vendor_uuid,
            //             key: body.key,
            //             isdelete: '0',
            //             Server: body.SERVER_ADDR,
            //             Refer: body.REMOTE_ADDR
            //         }
            //         commonUtility.RemoveNull(params); // remove blank value from array
            //         var newApp = new App(params);

            //         newApp.save().then((lastAddedApp) => {
            //             return this.GetSuccessResponse("Initialize", lastAddedApp, res);
            //             // return res.status(status.OK).jsonp(response);

            //         }).catch(function (error) {
            //             return this.GetErrorResponse(error, res);
            //         });
            //     }
            //     else {
            //         return this.GetSuccessResponse("Initialize", app, res);
            //     }
            // });

        } catch (e) {
            let error = `Error :: ${e}`;
            logManager.Log(`Initialize:Exception- ${error}`);
            return this.GetErrorResponse(error, res);
        }
    }
    //#endregion
    async GenerateEmailOTP(req, res) {

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

                emailService.SendEmail(email, subject, emailBody).then(function (success) {

                    let md5EmailCode = md5(email_code);
                    var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                    var setParams = {
                        $set: {
                            email: email,
                            email_code: md5EmailCode,
                            email_verified: 0,
                            email_code_expire_time: expireTime
                        }
                    }

                    this.FindAndModifyQuery(conditions, setParams).exec(
                        (error, updatedApp) => {
                            return this.SendResponse("GenerateEmailOTP", error, updatedApp, res);
                        }
                    );

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

    async VerifyEmail(req, res) {

        req.checkBody("email", messages.req_email).notEmpty().isEmail();
        req.checkBody("email_code", messages.req_email_code).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);

            }

            let body = _.pick(req.body, ['email', 'email_code']);
            let key = req.params.key;

            var conditions = {
                key: key,
                email: body.email.toLowerCase(),
                email_code: body.email_code.toLowerCase()
            }
            var setParams = {
                $set: { email_verified: 1 }
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                    return this.SendResponse("VerifyEmail", error, updatedApp, res);
                }
            );

        } catch (e) {
            let error = `Error :: ${e}`;
            logManager.Log(`VerifyEmail:Exception-${error}`);
            return this.GetErrorResponse(error, res);
        }

    }

    async GenerateMobileOTP(req, res) {

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

                if (error) return this.GetErrorResponse(error, res);

                if (!app) return this.GetErrorResponse(`Data Mismatch: No application found for phone:${phone}`, res);

                // Authenticator
                var secret = authenticator.generateKey();
                secret = secret.replace(/\W/g, '').toLowerCase();
                var phone_code = authenticator.generateToken(secret);


                var phone = body.mobile.replace("+", "");
                var countryCode = body.country_code.replace("+", "");
                var msg = 'EvolveChain mobile verification code: ' + phone_code + '.';
                let toPhone = "+" + countryCode + phone;

                smsService.SendSMS(toPhone, msg).then(message => {

                    let md5MobileOTP = md5(phone_code);
                    var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));
                    var setParams = {
                        $set: {
                            phone: phone,
                            phone_code: md5MobileOTP,
                            country_Code: countryCode,
                            phone_verified: 0,
                            phone_code_expire_time: expireTime
                        }
                    }

                    this.FindAndModifyQuery(conditions, setParams).exec(
                        (error, updatedApp) => {
                            return this.SendResponse("GenerateMobileOTP", error, updatedApp, res);
                        }
                    );

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
        req.checkBody("phone_code", messages.req_mobile_code).notEmpty();

        try {

            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);

            }

            let body = _.pick(req.body, ['mobile', 'country_code', 'phone_code']);
            let key = req.params.key;

            var expireTime = new Date(Date.now() - (OTP_EXPIRY_MINS * 60000));

            var conditions = {
                key: key,
                phone: body.mobile,
                phone_code: body.phone_code,
                country_Code: body.country_Code,
                phone_code_expire_time: { $gte: expireTime }
            }

            var setParams = {
                $set: { phone_verified: 1 }
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                    return this.SendResponse("VerifyMobile", error, updatedApp, res);
                }
            );

        } catch (e) {
            console.log(`Error :: ${e}`);
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
        }
    }




   async GeneratePin(req, res) {

 //       let current_ref= this;
        req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['ekyc_id']);

            let conditions = {
                ekyc_id : body.ekyc_id
            }

            App.findOne(conditions, (error, app) => {

                if (error) return this.GetErrorResponse(error, res);

                if (!app) return this.GetErrorResponse(`Data Mismatch: No application found for phone:${phone}`, res);

                // Authenticator
                var secret = authenticator.generateKey();
                secret = secret.replace(/\W/g, '').toLowerCase();
                var otpToken = authenticator.generateToken(secret);

                //Email verification
                var email = app.email.toLowerCase();
                var ver_code = otpToken.substring(0, 6);

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
                    var expireTime = new Date(Date.now() + (OTP_EXPIRY_MINS * 60000));

                    var setParams = {
                        $set: {
                            otp: md5MobileOTP
                        }
                    }

                    return this.FindAndModifyQuery(conditions, setParams).exec();

                })
                .then( (error, updatedApp) => {

                    return emailService.SendEmail(email, subject, emailBody);
                })
                .then( (success) => {

                    let md5EmailCode = md5(ver_code);
                    var setParams = {$set: {
                        otp: md5EmailCode
                        }
                    }

                    return this.FindAndModifyQuery(conditions, setParams).exec();

                })
                .then( (updatedApp, error) => {

                    return this.SendResponse("GeneratePin", error, updatedApp, res);

                })
                .catch(function (e) {
                    let error = `Error :: ${e}`;
                    return this.GetErrorResponse(error, res);
                });

            });
        
        } catch (e) {
            console.log(`Error :: ${e}`);
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
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
                return this.GetErrorResponse(error, res);

            }

            let body = _.pick(req.body, ['ekyc_id','pin_otp','pin','vendor_uuid']);
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

        } catch (e) {
            console.log(`Error :: ${e}`);
            let error = `Error :: ${e}`;
            this.GetErrorResponse(error, res);
        }
    }

    async CheckPin(req, res) {
        try {

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

                var response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': app.key,
                    'pin': app.pin,
                    'Server': app.Server,
                    'Refer': app.Refer
                }
                return res.status(status.OK).jsonp(response);
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
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
                return this.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['pin', 'new_pin', 'ekyc_id']);

            if (body.pin == body.new_pin) {
                return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': messages.same_pin });
            }

            let conditions = {
                ekyc_id: body.ekyc_id,
                pin: body.pin
            }

            var setParams = {
                pin: body.new_pin
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                            return this.SendResponse("ChangePin", error, updatedApp, res);
                        }
                    );

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async GetProfile(req, res) {
        try {
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

                Document.findOne(document_query, (error, doc) => {

                    if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                    if (!doc) return res.status(status.OK).jsonp({
                        "success": 0,
                        "error": messages.document_not_found
                    });

                    this.GetImage(doc.hash, 'profile_img', function (response) {
                        if (response.error == true) {
                            return res.status(status.OK).jsonp({
                                "success": 0,
                                "error": messages.something_wentwrong
                            });
                        }
                        else {
                            var response = {
                                'success': 1,
                                'now': Date.now(),
                                'result': messages.get_profile,
                                'kyc_id': doc.kyc_id,
                                'email': doc.email,
                                'name': doc.details.Name,
                                'phone': doc.phone,
                                'address': doc.details.Address,
                                'passport': doc.details.Passport,
                                'tax': doc.details.Tax,
                                'identity': doc.details.Identity,
                                'driving': doc.details.Driving,
                                'profile': config.get('FTP_URL') + "/profiles/" + doc.profile,
                            }
                            return res.status(status.OK).jsonp(response);
                        }
                    });
                })
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async Logout(req, res) {
       
        try {

            let key = req.params.key;

            let conditions = {
                key: key,
                isdelete: '0'
            }

            App.findOne(conditions, (error, app) => {

                if (error) return res.status(status.OK).jsonp({ "success": 0, "error": error });

                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_login
                });

                var response = {
                    'success': 1,
                    'now': Date.now(),
                    'result': messages.success_logout
                }
                return res.status(status.OK).jsonp(response);
            })

        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }


/*async Login(req, res) {

	req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();
	req.checkBody("pin", messages.req_pin).notEmpty();
    req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();

            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['ekyc_id', 'pin','vendor_uuid']);
            let key = req.params.key;

            var conditions = {
                isdelete: '0',
                ekyc_id: body.ekyc_id,
                pin: body.pin
            }
            
            var setParams = {
                $set: { last_login_time: Date.now() }
            }

            this.FindAndModifyQuery(conditions, setParams).exec(
                (error, updatedApp) => {
                    return this.SendResponse("Login", error, updatedApp, res);
                }
            );

        } catch (e) {
            let error = `Error :: ${e}`;
            return this.GetErrorResponse(error, res);
        }

    }
*/



async Login(req, res) {

	req.checkBody("ekyc_id", messages.req_ekycid).notEmpty();
	req.checkBody("pin", messages.req_pin).notEmpty();
    req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.GetErrorResponse(error, res);
            }

            let body = _.pick(req.body, ['ekyc_id', 'pin','vendor_uuid']);
            let key = req.params.key;

            var conditions = {
                isdelete: '0',
                ekyc_id: body.ekyc_id,
            }

            App.findOne(conditions,(error, app) =>{

                if (error) return res.status(status.OK).jsonp({"success": 0, "error": error});
                if (!app) return res.status(status.OK).jsonp({
                    "success": 0,
                    "error": messages.invalid_ekycid
                });

                if(app.vendor_uuid==body.vendor_uuid)
                {
                    if(app.pin==body.pin)
                    {   var params = {
                            $set: { last_login_time: Date.now() }
                        }

                        App.update({
                             _id: app._id
                        }, {
                            $set: params
                        }).then((success) => {
                            var response = {
                                'success': 1,
                                'now': Date.now(),
                                'key': app.key,
                                'pin': body.pin,
                                'Server': app.Server,
                                'Refer': app.Refer,
                                'result': 'Login successful!'
                            }
                            return res.status(status.OK).jsonp(response);

                            }).catch(function(error){
                                return res.status(status.OK).jsonp({'success': 0,"error": error});
                            });
                    }
                    else
                    {
                        return res.status(status.OK).jsonp({
                            "success": 0,
                            "error": "Pin doesnot match"
                        });
                    }
                }
                else
                {
                    return res.status(status.OK).jsonp({
                        "success": 0,
                        "error": "Device mismatch"
                    });
                }
            })

            }catch(e){
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
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
            case "Initialize":
                response = {
                    'success': 1,
                    'now': Date.now(),
                    'key': appEntity.key,
                    'ip': appEntity.IP,
                    'Server': appEntity.Server,
                    'Refer': appEntity.Refer
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

    // common for update App
    async UpdateApp(conditions, params = [], callback) // common function for update App
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
    async UpdateDocument(conditions, params = [], callback) // common function for update Document
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
    async GetImage(id = null, type = null, callback) {
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
                        var path = PUBLIC_PATH + '/webroot/documents/' + image_name_name;
                        var return_path = config.get('COMPANY_URL') + '/documents/' + image_name_name;

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
                                response.data = { "return_path": return_path, "path": path };
                                callback(response);
                            });

                    }
                });
            }
        })
    }

}

module.exports = new AppController();