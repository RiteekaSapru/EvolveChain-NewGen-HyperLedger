var randomstring = require("randomstring");
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const multer = require('multer');
const status = config.get('status');
const messages = config.get('messages');
var ObjectId = require('mongodb').ObjectID;

// const User = require('../models/users');
// const UserDevice = require('../models/userdevice');

const saltRounds = 10;
const ViewPath = path.join(__dirname + "/../views");
const EmailTemplatesPath = path.join(__dirname + "/../public/email_template");

let storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, 'public/images/user')
	},
	filename: function(req, file, callback) {
		callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
	}
})


class CommonController {
    

    async logout(req, res){
        try{
            var query = {
                _id: req.user._id
            };
           
            User.findOne(query, (error, user) => {
                
                if (error) return res.status(status.InternalServerError).jsonp({"message": error});

                if (!user) return res.status(status.NotFound).jsonp({"message": messages.user_not_found});
                
                UserDevice.update({
                    user_id: user._id
                }, {
                    $set: {auth_token:""}
                }).then((success) => {
                    return res.status(status.OK).jsonp({"message": messages.logout_success});
                }).catch(function(error){
                    return res.status(status.ExpectationFailed).jsonp({"message": messages.logout_failed});
                });
            });
        }catch(e){
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

}

module.exports = new CommonController();