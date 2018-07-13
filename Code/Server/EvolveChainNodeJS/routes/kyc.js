const kyc = require("express").Router();
const KYCController = require("../controllers/kyc/KYCController");
const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
const AuthMiddleware = require("../middlewares/CheckAuth");
const multer = require('multer');

//middleware
function keyMiddleware(req, res, next) {
    // _.isUndefined(req.params.key)
    if (req.params.key == '' || req.params.key == null) {
        return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
    }
    next();
}
var upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 100000000}
}).array('file[]', 2);

kyc.get("/getdocumentimages/:key", keyMiddleware, KYCController.GetDocumentImages.bind(KYCController))
kyc.post("/saveKycDocument/:key", [keyMiddleware, upload], KYCController.SaveKycDocument.bind(KYCController));
kyc.post("/submitKycDocument", KYCController.SubmitKycDocument.bind(KYCController));

//kyc.use(AuthMiddleware(["kyc"]));
kyc.use("/*", (req, res) => {
    res.status(400).json({ message: "Invalid Request" });
});

module.exports = kyc;
