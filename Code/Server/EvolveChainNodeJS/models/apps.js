/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nodemailer = require('nodemailer');
const config = require('config');

const App = new Schema({
    affiliateType: {type:String},
    country:{type:String},
    device_name: { type: String },
    device_type: { type: String },
    email: { type: String },
    hash: { type: String },
    IP: { type: String },
    isdelete: { type: String },
    key: { type: String },
    name: { type: String },
    os_version: { type: String },
    phone: { type: String },
    country_code: { type: String },
    pin: { type: String },
    profile: { type: String },
    Refer: { type: String },
    Server: { type: String },
    vendor_uuid: { type: String },
    chkemail: { type: String },
    email_code: { type: String },
    chkphone: { type: String },
    phone_code: { type: String },
    DateTime: {
        type: Date,
        default: Date.now
    }
});


App.pre('save', function(next) {
    var app = this;
    next();
});

// App.methods.sendEmail = function(mailOption) {
    
//     var transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST || 'smtp.gmail.com',
//             port: process.env.SMTP_PORT || 465,
//             auth: {
//                 user: process.env.SMTP_USERNAME || 'gordhan@yudiz.com', // SMTP email
//                 pass: process.env.SMTP_PASSWORD || 'Gordhan_9033' // Your password
//             },
//             secure: true
//         });
    
//     return transporter.sendMail(mailOption).then(function(success) {
//        // return success.messageId;
//        transporter.close();
//     }).catch(function(err) {
//         //return err;
//         console.log(err);
//     });
// };

module.exports = mongoose.model('apps', App);