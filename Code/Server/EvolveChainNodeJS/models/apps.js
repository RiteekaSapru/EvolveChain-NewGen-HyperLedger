/* App model schema */
'use strict'
const mongoose = require('mongoose');
const commonUtility = require('../helpers/CommonUtility');
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
};


const App = new Schema({

    affiliateType: {type:String},
    country:{type:String},

    device_name: { type: String },
    device_type: { type: String },
    os_version: { type: String },
    IP: { type: String },
    Refer: { type: String },
    Server: { type: String },
    vendor_uuid: { type: String },

    // email: { type: String, validate: {validator: validateEmail, message:'Invalid email address'}},
    email: { type: String},
    email_code: { type: String },    
    email_verified: { type: Boolean },    
    email_code_expire_time: {type:Date},

    isdelete: { type:String },
    key: { type: String },
    name: { type: String },   

    phone: { type: String },
    phone_code: { type: String },
    phone_verified:{ type: Boolean },    
    country_code: { type: String },
    phone_code_expire_time: {type:Date},

    pin: { type: String },   
    pin_otp : { type: String },
    ekyc_id : { type: String},

    last_login_time: {type: Date},   
    DateTime: {
        type: Date,
        default: Date.now
    },

    profile: { type: String },
    hash: { type: String },
    last_modified: {type: Date},

    status:{type:String},
    resubmit_pin : {type:String} 
    
});

App.index({ key: 1, ekyc_id: 1 }, { unique: true});

App.pre('save', function(next) {
    var app = this;
    next();
});
App.pre('update', function() {
    this.update({},{ $set: { last_modified: commonUtility.UtcNow() } });
  });

  App.pre('findOneAndUpdate', function() {
    this.findOneAndUpdate({},{ $set: { last_modified: commonUtility.UtcNow() } });
  });

module.exports = mongoose.model('apps', App);