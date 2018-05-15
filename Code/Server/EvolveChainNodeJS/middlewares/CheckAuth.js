const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
var ObjectId = require('mongodb').ObjectID;

//const User = require('../models/users');
//const UserDevice = require('../models/userdevice');

CheckAuth = (user_type=["user"]) => {
    
    return async (req, res, next) => {
        try{          
            const StoragePath = path.join(__dirname + "/../storage");
            
            let cert = fs.readFileSync(StoragePath + "/" + process.env.PRIVATE_KEY);
            let token = req.header("Authorization");
            let decoded = jwt.verify(token, cert);
            
            try {
                
                UserDevice.findOne({auth_token: token, user_id: ObjectId(decoded._id)}, (error, userDevice) => {
                
                    if (error) return res.status(status.InternalServerError).jsonp({"error":error});

                    if (!userDevice) return res.status(status.Unauthorized).jsonp({ "error": messages.unauthorized });
                    
                    var query = {
                        '_id': ObjectId(decoded._id),
                    };

                    User.findOne(query, (error, user) => {
                    
                        if (error) return res.status(status.InternalServerError).jsonp({"error":error});

                        if (!user) return res.status(status.NotFound).jsonp({ "error": messages.user_not_found });

                        if (!user_type.includes(user.user_type)) { // check route for user
                            return res.status(status.Forbidden).json({ message: messages.permision_denied});
                        }
                        //console.log(user);return false;
                        if (user.blocked === true)
                        {
                            UserDevice.deleteMany({user_id: user._id}, (error, devicetoken) => {
                                return res.status(status.Locked).jsonp({
                                        "message": messages.account_suspended
                                });
                            });
                        }
                        else if (user.status === 'd'){
                            return res.status(status.Locked).jsonp({ "error": messages.user_disabled });  
                        } 
                        else if (user.status === 'n'){
                            return res.status(status.NotAcceptable).jsonp({ "error": messages.not_varified });  
                        } 
                        else{
                            req.user = user;
                            return next();    
                        }

                    });
                    

                });
                
            } catch(err){
                return res.status(status.OK).json({ "success": 0, 'error': messages.error });
            }
        }catch(e){
            
            res.status(status.OK).send({"success": 0, 'error': messages.permision_denied});
        }
    };
}

module.exports = CheckAuth;


