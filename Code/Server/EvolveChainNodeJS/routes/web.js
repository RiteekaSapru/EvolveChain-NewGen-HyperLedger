const web = require('express').Router();
const VerifyController = require("../controllers/kyc/VerifyController");
const SearchController = require("../controllers/web/SearchController");
const CommonController = require("../controllers/CommonController");
const WebController = require("../controllers/web/WebController");
const AuthMiddleware = require("../middlewares/CheckAuth");

web.post("/web/welcomeApi", WebController.WelcomeApi.bind(WebController));
web.post("/web/getAppDetails", WebController.GetAppDetails.bind(WebController));
web.post("/web/getAppByCountry", WebController.GetAppByCountry.bind(WebController));
web.post("/web/getAppSummary", WebController.GetAppSummary.bind(WebController));
web.post("/web/getApplication", WebController.GetApplication.bind(WebController));
web.post("/web/login", WebController.Login.bind(WebController));

web.post("/web/getKYCVerificationInfo", WebController.GetKYCVerificationInfo.bind(WebController));
web.post("/web/verifykyc", WebController.VerifyKYC.bind(WebController));

web.get("/web/preInitialize", WebController.PreInitialize.bind(WebController));
web.get("/web/getAppDetailsByPhone/:phone", WebController.GetAppDetailsByPhone.bind(WebController));

//web.get("/verify/:key", VerifyController.GetKYCVerificationInfo.bind(VerifyController));
//web.post("/verifyKyc/:key", VerifyController.VerifyKyc.bind(VerifyController));

// search routes
//web.get("/search/email/:email", SearchController.email);
//web.get("/search/phone/:phone", SearchController.phone);

// web.use(AuthMiddleware(["web"]));

module.exports = web;