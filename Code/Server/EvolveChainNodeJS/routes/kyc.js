const kyc = require("express").Router();
const KYCController = require("../controllers/kyc/KYCController");
const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
const AuthMiddleware = require("../middlewares/CheckAuth");

//middleware
function keyMiddleware(req, res, next) {
    // _.isUndefined(req.params.key)
    if (req.params.key == '' || req.params.key == null) {
        return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
    } 
    next();
  }  

kyc.get("/getdocumentimages/:key",KYCController.GetDocumentImages.bind(KYCController))
kyc.post("/createupdatekyc/:key",keyMiddleware, KYCController.CreateUpdateKyc.bind(KYCController));
kyc.post("/getStepStatus/:key", keyMiddleware, KYCController.GetStepStatus.bind(KYCController));
kyc.post("/getKycDocument/:key", keyMiddleware, KYCController.GetKycDocument.bind(KYCController));
kyc.post("/saveKycDocument/:key", keyMiddleware, KYCController.SaveKycDocument.bind(KYCController));
kyc.post("/submitKycDocument/:key", keyMiddleware, KYCController.SubmitKycDocument.bind(KYCController));
kyc.post("/unlinkKycImg/:key",keyMiddleware, KYCController.UnlinkKycImg.bind(KYCController));
kyc.post("/removeImage/:key", keyMiddleware, KYCController.RemoveImage.bind(KYCController));
kyc.post("/generateRandomKYC/:key", keyMiddleware, KYCController.GenerateRandomKYC.bind(KYCController));
kyc.post("/revokeDocument/:key", keyMiddleware, KYCController.RevokeDocument.bind(KYCController));
kyc.post("/getShareHistory/:key",keyMiddleware, KYCController.GetShareHistory.bind(KYCController));
kyc.post("/getkycidDeveloperUse/:key",keyMiddleware, KYCController.GetKycidDeveloperUse.bind(KYCController));

//kyc.use(AuthMiddleware(["kyc"]));
kyc.use("/*", (req, res) => {
    res.status(400).json({message: "Invalid Request"});
});

module.exports = kyc;
