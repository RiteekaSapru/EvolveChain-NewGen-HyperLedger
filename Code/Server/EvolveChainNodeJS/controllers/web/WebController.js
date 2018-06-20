var randomstring = require("randomstring");
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const status = config.get('status');
const messages = config.get('messages');

const md5 = require('md5');
const emailService = require('../../services/EmailService')
const smsService = require('../../services/SMSService')
const commonUtility = require('../../helpers/CommonUtility');
const baseController = require('../BaseController');
const logManager = require('../../helpers/LogManager');
const mongoose = require('mongoose');
const async = require('async');

var ObjectId = require('mongodb').ObjectID;
var templatesjs = require('templatesjs');

const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');

const Country = require('../../models/country');
const App = require('../../models/apps');
const KYCDocument = require('../../models/kycdocument');
const Admin = require('../../models/admin');
const File = require('../../models/files');
const ConfigDB = require('../../models/config');
const ProofDocuments = require('../../models/proofdocuments');

const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
}

class Web  extends baseController{

    async GetCountryList(req, res) {
        var countries  = await Country.find();
        return res.status(status.OK).jsonp(countries);
    }


    async Login(req, res) {

        req.checkBody("email_id", messages.req_email).notEmpty();
        req.checkBody("password", messages.req_password).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = _.pick(req.body, ['email_id', 'password']);

            var conditions = {
                email_id: body.email_id,
                password: body.password
            }


            var Adm = await Admin.findOne(conditions);


            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

           var token_id = commonUtility.GenerateUniqueToken();

            var parameters = {
                $set: {token:token_id}
            }
            await Admin.update(conditions, parameters);

            return this.GetSuccessLoginResponse(token_id, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    GetSuccessLoginResponse(tokenId, res) {
        var response = {
            'success': 1,
            'now': commonUtility.UtcNow(),
            'token':tokenId ,
            "result": messages.login_success
        }
        return res.status(status.OK).jsonp(response);
    }

    async GetApplication(req, res) {

        //  req.checkBody("status", messages.req_status).notEmpty();
        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var appData;

            if(body.status == null || body.status==undefined)
            {
                appData = await App.find();
            }

            if(body.status!= null && body.status!=undefined){
                var conditions = {
                    status : body.status
                }
                appData = await App.find(conditions);
            }

            if (!appData) {
                return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);
            }

            var appDetails=[];

            for (var j = 0; j < appData.length; j++) {
                appDetails.push({
                    'email': appData[j].email,
                    'phone':appData[j].phone,
                    'isd_code':appData[j].isd_code,
                    'key':appData[j].key,
                    'ekyc_id':appData[j].ekyc_id,
                    'country_iso':appData[j].country_iso,
                    'name':appData[j].name,
                    'status':appData[j].status
                 });
            }

            console.log(appDetails);

            return this.GetSuccessAppResponse(appDetails, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    GetSuccessAppResponse(appEntity, res) {
        var response = {
            'success': 1,
            'now': commonUtility.UtcNow(),
            'appDetails': appEntity
        }
        return res.status(status.OK).jsonp(response);
    }



    async GetAppSummary(req, res) {

        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var countStatus = await App.aggregate([{"$group" : {_id:"$status", count:{$sum:1}}}])

            console.log(countStatus);

            return this.GetAppSummarySuccessResponse(countStatus, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    GetAppSummarySuccessResponse(count, res) {
        var response = {
            'success': 1,
            'now': commonUtility.UtcNow(),
            'Count': count
        }
        return res.status(status.OK).jsonp(response);
    }

    async GetAppByCountry(req, res) {

        req.checkBody("token", messages.req_admin_token).notEmpty();

        try {
            let result = await req.getValidationResult();
            if (!result.isEmpty()) {
                let error = this.GetErrors(result);
                return this.SendErrorResponse(res, config.ERROR_CODES.INVALID_REQUEST, error);
            }

            let body = req.body;

            var conditions = {
                token: body.token
            }

            var Adm = await Admin.findOne(conditions);

            if (!Adm) {
                return this.SendErrorResponse(res, config.ERROR_CODES.ADMIN_NOT_FOUND);
            }

            var countCountry = await App.aggregate([{"$group" : {_id:"$country_iso", count:{$sum:1}}}])

            return this.GetAppByCountrySuccessResponse(countCountry, res);

        } catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    GetAppByCountrySuccessResponse(count, res) {
        var response = {
            'success': 1,
            'now': commonUtility.UtcNow(),
            'Count': count
        }
        return res.status(status.OK).jsonp(response);
    }


    async index(req, res) {
        try {
            fs.readFile("./views/web/index.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async about(req, res) {
        try {
            fs.readFile("./views/web/about.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async contact(req, res) {
        try {
            fs.readFile("./views/web/contact.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async download(req, res) {
        try {
            fs.readFile("./views/web/download.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }


}

 module.exports = new Web();