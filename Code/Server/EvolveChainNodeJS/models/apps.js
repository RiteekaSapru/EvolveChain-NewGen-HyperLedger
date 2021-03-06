/* App model schema */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const commonUtility = require('../helpers/CommonUtility');


var validateEmail = function (email) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email);
};


const App = new Schema({

    affiliateType: { type: String },
    country: { type: String },
    country_iso: { type: String },

    device_name: { type: String },
    device_type: { type: String },
    os_version: { type: String },
    IP: { type: String },
    Refer: { type: String },
    Server: { type: String },
    vendor_uuid: { type: String },

    device_info: {
        device_name: { type: String },
        device_type: { type: String },
        os_version: { type: String },
        ip: { type: String },
        refer: { type: String },
        server: { type: String },
        latitude : {type : String},
        longitude : {type : String},
        network_provider : { type: String },
        network_country_code :  { type: String },
        mobile_network_code : { type: String },
        iso_country_code: { type: String }
    },

    isdelete: { type: Boolean, default: false},
    key: { type: String },
    name: { type: String },

    phone: { type: String },
    isd_code: { type: String },

    phone_info: {
        otp: { type: String },
        otp_expiry_time: { type: Date },
        number: { type: String },
        isd_code: { type: Number }
    },

    resubmit_pin: { 
        otp : {type: String },
        otp_expiry_time: { type: Date },
    },

    // email: { type: String, validate: {validator: validateEmail, message:'Invalid email address'}},
    email: { type: String },
    email_info: {
        otp: { type: String },
        otp_expiry_time: { type: Date },
        id: { type: String }
    },

    pin: { type: String },
    pin_otp: { type: String },
    ekyc_id: { type: String },

    last_login_time: { type: Date },
    DateTime: {
        type: Date,
        default: Date.now
    },

    //profile: { type: String },
    //hash: { type: String },
    last_modified: { type: Date },

    status: { type: String },
    
    //This is set to true when the notification is sent to the user prior to 15 days
    expire_notification : {type : Boolean, default: false},
    
    verification_code: { type: String },
    verification_comment: { type: String },
    verification_reasons: [{ type: String }],
    verification_time: { type: String },
    verification_by: { type: String }

});

App.index({ key: 1, ekyc_id: 1 }, { unique: true });

App.virtual('kycdoc_data', {
    ref: 'kycdocuments',
    localField: 'key',
    foreignField: 'app_key',
    justOne: true // for many-to-1 relationships
});

App.pre('save', function (next) {
    var app = this;
    next();
});

App.pre('update', function () {
    this.update({}, { $set: { last_modified: commonUtility.UtcNow() } });
});

App.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $set: { last_modified: commonUtility.UtcNow() } });
});

module.exports = mongoose.model('apps', App);