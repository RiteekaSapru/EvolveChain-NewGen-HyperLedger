
const sharekyc = require("express").Router();
const _ = require('lodash');

const ShareKYCController = require("../controllers/kyc/ShareKYCController");
const app = require('../models/apps');

const config = require('config');
const status = config.get('status');
const messages = config.get('messages');

//const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
//const AuthMiddleware = require("../middlewares/CheckAuth");
//const multer = require('multer');

//middleware
async function validateMiddleware(req, res, next) {
    req.checkBody("key", messages.req_app_key).notEmpty();
    req.checkBody("vendor_uuid", messages.req_vendor_uuid).notEmpty();

    try {
        let result = await req.getValidationResult();

        if (!result.isEmpty()) {
            return res.status(400).end(messages.app_key_not_valid_middleware);
        }

        let body = _.pick(req.body, ['key', 'vendor_uuid']);

        var app_conditions = {
            key: body.key
        }

        var App = await app.findOne(app_conditions);

        if (!App) {
            return res.status(501).end(config.ERROR_CODES.APP_NOT_FOUND);
        }
        if (App.vendor_uuid != body.vendor_uuid) {
            return res.status(501).end(messages.device_mismatch);
        }

        if (App.status != config.APP_STATUSES.VERIFIED) {
            return res.status(501).end(messages.app_not_verified);
        }
    }
    catch (ex) {
        return res.status(501).end(ex.message);
    }
    next();
}

sharekyc.post("/getsubscribedcompanies", [validateMiddleware], ShareKYCController.GetSubscribedCompanies.bind(ShareKYCController))
//sharekyc.post("/saveKycDocument/:key", [keyMiddleware, upload], KYCController.SaveKycDocument.bind(ShareKYCController));
//sharekyc.post("/submitKycDocument", KYCController.SubmitKycDocument.bind(ShareKYCController));

//kyc.use(AuthMiddleware(["kyc"]));
sharekyc.use("/*", (req, res) => {
    res.status(400).json({ message: "Invalid Request" }); 1
});

module.exports = sharekyc;
