const kyc = require("express").Router();
const KYCController = require("../controllers/kyc/KYCController");
const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
const AuthMiddleware = require("../middlewares/CheckAuth");

// kyc.post("/generateEmailOtp/:key", KYCController.GenerateEmailOTP.bind(KYCController));
// kyc.post("/verifyemail/:key", KYCController.VerifyEmail.bind(KYCController));

// kyc.post("/generateMobileOtp/:key", KYCController.GenerateMobileOTP.bind(KYCController));
// kyc.post("/verifymobile/:key", KYCController.VerifyMobile.bind(KYCController));

kyc.post("/createupdatekyc/:key", KYCController.CreateUpdateKyc.bind(KYCController));
kyc.post("/getStepStatus/:key", KYCController.GetStepStatus.bind(KYCController));
kyc.post("/getKycDocument/:key", KYCController.GetKycDocument.bind(KYCController));
kyc.post("/saveKycDocument/:key", KYCController.SaveKycDocument.bind(KYCController));
kyc.post("/submitKycDocument/:key", KYCController.SubmitKycDocument.bind(KYCController));
kyc.post("/unlinkKycImg/:key", KYCController.UnlinkKycImg.bind(KYCController));
kyc.post("/removeImage/:key", KYCController.RemoveImage.bind(KYCController));
kyc.post("/generateRandomKYC/:key", KYCController.GenerateRandomKYC.bind(KYCController));
kyc.post("/revokeDocument/:key", KYCController.RevokeDocument.bind(KYCController));
kyc.post("/getShareHistory/:key", KYCController.GetShareHistory.bind(KYCController));
kyc.post("/getkycidDeveloperUse/:key", KYCController.GetKycidDeveloperUse.bind(KYCController));

kyc.use(AuthMiddleware(["kyc"]));

module.exports = kyc;
