const fs = require("fs");
const ejs = require('ejs');
const _ = require('lodash');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
//const emailService = require('../../services/EmailService')
//const smsService = require('../../services/SMSService')
//const commonUtility = require('../../helpers/CommonUtility');
//const logManager = require('../../helpers/LogManager');
//const mongoose = require('mongoose');
//const async = require('async');

const BaseController = require('../BaseController');
const HyperLedgerService = require('../../services/HyperLedgerService');

const App = require('../../models/apps');
const KYCDocument = require('../../models/kycdocument');
const File = require('../../models/files');
const ConfigDB = require('../../models/config');
const ProofDocuments = require('../../models/proofdocuments');

const BASE_PATH = config.get('base_path');
const PUBLIC_PATH = config.get('PUBLIC_PATH');

class ShareKYCController extends BaseController {

    async GetSubscribedCompanies(req, res) {

        //req.checkBody("key", messages.req_app_key).notEmpty();
        //req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

        try {
            var companyData = await HyperLedgerService.GetSubscribedCompanies();
            res.status(status.OK).json(companyData);
        }
        catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }

    async GetSubscribedCompanies(req, res) {

        req.checkBody("mobile", messages.req_mobile).notEmpty();
        req.checkBody("isd_code", messages.req_isd_code).notEmpty();
        req.checkBody("company_key", ).notEmpty();

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
            let configCol = await ConfigDB.findOne({});
            var App = await app.findOne(conditions);

            if (!App) return this.SendErrorResponse(res, config.ERROR_CODES.APP_NOT_FOUND);

            var companyData = await HyperLedgerService.GetSubscribedCompanies();
            res.status(status.OK).json(companyData);
        }
        catch (ex) {
            return this.SendExceptionResponse(res, ex);
        }
    }



}

module.exports = new ShareKYCController();