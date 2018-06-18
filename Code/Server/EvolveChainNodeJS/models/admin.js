/* App model schema */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const commonUtility = require('../helpers/CommonUtility');


const Admin = new Schema({
    id: { type: String },
    email_id: { type: String },
    password: { type: String },
    token: { type: String },
    phone: { type: String },
    isd_code: { type: String }
});


Admin.pre('save', function (next) {
    var adm = this;
    next();
});
Admin.pre('update', function () {
    this.update({}, { $set: { last_modified: commonUtility.UtcNow() } });
});
Admin.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $set: { last_modified: commonUtility.UtcNow() } });
});

module.exports = mongoose.model('admin', Admin);