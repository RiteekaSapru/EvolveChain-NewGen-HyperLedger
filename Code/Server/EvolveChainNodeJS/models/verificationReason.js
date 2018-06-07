/* App model schema */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const commonUtility = require('../helpers/CommonUtility');


const VerificationReasons = new Schema({
    reason: { type: String },
    code: { type: String },
    state: { type: Boolean, default:false}
});


VerificationReasons.pre('save', function (next) {
    var ver = this;
    next();
});
VerificationReasons.pre('update', function () {
    this.update({}, { $set: { last_modified: commonUtility.UtcNow() } });
});
VerificationReasons.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $set: { last_modified: commonUtility.UtcNow() } });
});

module.exports = mongoose.model('verificationReasons', VerificationReasons);