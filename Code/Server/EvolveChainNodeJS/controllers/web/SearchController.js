const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const async = require('async');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
const utility = require('../../config/utility');
var ObjectId = require('mongodb').ObjectID;
const md5 = require('md5');
const App = require('../../models/apps');
const Wallet = require('../../models/wallet');

class Search {
    
    async email(req, res) {
        try{
        	var obj = new Search();
             
            let email = req.params.email;

            if(email==null || email==""){
                return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), "error": messages.email_missing });
            }

            let conditions = {
                email: email,
                secret: { $exists: true, $ne: [] }
            }
            
            Wallet.findOne(conditions,(error, wallet) =>{
                
                if (error){
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }
                    
                if (!wallet) return res.status(status.OK).jsonp({
                    "success": 0,
                    'now': Date.now(),
                    "error": messages.not_found_email_wallet
                });

                var SERVER_ADDR = md5(req.connection.localAddress);
                var REMOTE_ADDR = md5(req.connection.remoteAddress);

                var response = {
                    'success': 1,
                    'now': Date.now(),
                    'email': wallet.email,
                    'phone': wallet.phone,
                    'address': wallet.address,
                    'ip': wallet.IPinfo.ip,
                    'country': wallet.IPinfo.country,
                    'city': wallet.IPinfo.city,
                    'DateTime': wallet.DateTime,
                    'extra': wallet.extra,
                    'Server': SERVER_ADDR,
                    'Refer': REMOTE_ADDR
                }
                return res.status(status.OK).jsonp(response);

            });
            
        }catch(e){
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    async phone(req, res) {
        try{
            var obj = new Search();
             
            let phone = req.params.phone;

            if(phone==null || phone==""){
                return res.status(status.OK).json({ 'success': 0, 'now': Date.now(), "error": messages.phone_missing });
            }

            let conditions = {
                phone: phone,
                secret: { $exists: true, $ne: [] }
            }
            
            Wallet.findOne(conditions,(error, wallet) =>{
                
                if (error){
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }
                    
                if (!wallet) return res.status(status.OK).jsonp({
                    "success": 0,
                    'now': Date.now(),
                    "error": messages.not_found_phone_wallet
                });

                var SERVER_ADDR = md5(req.connection.localAddress);
                var REMOTE_ADDR = md5(req.connection.remoteAddress);

                var response = {
                    'success': 1,
                    'now': Date.now(),
                    'email': wallet.email,
                    'phone': wallet.phone,
                    'address': wallet.address,
                    'ip': wallet.IPinfo.ip,
                    'country': wallet.IPinfo.country,
                    'city': wallet.IPinfo.city,
                    'DateTime': wallet.DateTime,
                    'extra': wallet.extra,
                    'Server': SERVER_ADDR,
                    'Refer': REMOTE_ADDR
                }
                return res.status(status.OK).jsonp(response);

            });
            
        }catch(e){
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }
}

module.exports = new Search();