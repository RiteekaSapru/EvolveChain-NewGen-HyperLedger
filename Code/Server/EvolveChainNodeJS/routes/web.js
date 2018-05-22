const web = require('express').Router();
const VerifyController = require("../controllers/kyc/VerifyController");
const SearchController = require("../controllers/web/SearchController");
const CommonController = require("../controllers/CommonController");
const WebController = require("../controllers/web/WebController");
const AuthMiddleware = require("../middlewares/CheckAuth");


web.get("/verify/:key", VerifyController.GetKYCVerificationInfo.bind(VerifyController));

web.get("/verify/index/:key", VerifyController.kycVerify);
web.get("/", WebController.index);
web.get("/company/about", WebController.about);
web.get("/company/contact", WebController.contact);
web.get("/download", WebController.download);

// serach routes
web.get("/search/email/:email", SearchController.email);
web.get("/search/phone/:phone", SearchController.phone);

// web.use(AuthMiddleware(["web"]));

module.exports = web;