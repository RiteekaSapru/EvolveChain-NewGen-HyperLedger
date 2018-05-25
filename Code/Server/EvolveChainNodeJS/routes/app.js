const app = require("express").Router();
const AppController = require("../controllers/app/AppController");
const AuthMiddleware = require("../middlewares/CheckAuth");

//middleware
function keyMiddleware(req, res, next) {
    // _.isUndefined(req.params.key)
    if (req.params.key == '' || req.params.key == null) {
        return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), 'error': 'Key missing!' });
    } 
    next();
  }
  
app.post("/initialize", AppController.Initialize.bind(AppController));

app.post("/generateEmailOtp/:key",keyMiddleware, AppController.GenerateEmailOTP.bind(AppController));
app.post("/verifyemail/:key",keyMiddleware, AppController.VerifyEmail.bind(AppController));

app.post("/generateMobileOtp/:key",keyMiddleware, AppController.GenerateMobileOTP.bind(AppController));
app.post("/verifymobile/:key", keyMiddleware,AppController.VerifyMobile.bind(AppController));

app.post("/GeneratePin", AppController.GeneratePin.bind(AppController));
app.post("/setpin", AppController.SetPin.bind(AppController));
app.post("/changepin", AppController.ChangePin.bind(AppController));
app.post("/login", AppController.Login.bind(AppController));

// app.use(AuthMiddleware(["app"]));
app.use("/*", (req, res) => {
    res.status(400).json({message: "Invalid Request"});
});

module.exports = app;
