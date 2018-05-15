/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nodemailer = require('nodemailer');
const config = require('config');

const Wallet = new Schema({
    kyc_id: { type: String },
    email: { type: String },
    hash: { type: String },
    phone: { type: String },
    IP: { type: String },
    "secret": [{type: String}],
    "Address": {
        "address": {type: String},
        "street": {type: String},
        "city": {type: String},
        "zip": {type: String},
        "state": {type: String},
        "country": {type: String}
    },
    "details": {
        "Mobile": {type: String}
    },
    "IPinfo": {
        "ip": {type: String},
        "city": {type: String},
        "country": {type: String}
    },
    extra: {type: String},
    DateTime: {
        type: Date,
        default: Date.now
    }
});


Wallet.pre('save', function(next) {
    var wallet = this;
    next();
});

module.exports = mongoose.model('wallets', Wallet);