/*
 * Congig model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

const ConfigDB = new Schema({
    approver_emails: { type: [String] },
    app_expiration_days: { type: String },
    app_expiry_notification_days: { type: String }    
});


ConfigDB.pre('save', function (next) {
    var configDB = this;
    next();
});

module.exports = mongoose.model('configs', ConfigDB);