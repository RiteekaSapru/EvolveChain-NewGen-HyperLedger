/* App model schema */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

    email: { type: String },
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
    // kyc_id : { type: String },
    pin_otp : { type: String },
    ekyc_id : { type: String },

    last_login_time: {type: Date},   
    DateTime: {
        type: Date,
        default: Date.now
    },

    profile: { type: String },
    hash: { type: String }
    // chkemail: { type: String }
    // chkphone: { type: String },
    
});


App.pre('save', function(next) {
    var app = this;
    next();
});

module.exports = mongoose.model('apps', App);