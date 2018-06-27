/* App model schema */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const commonUtility = require('../helpers/CommonUtility');


const NotificationQueue = new Schema({
    app_key: { type: String},
    is_open: { type: Boolean, default:true},
    to: { type: String },
    subject: { type: String },
    last_modified: { type: Date },
    body: {type: String},
    notification_type: {type: String}
});


NotificationQueue.pre('save', function (next) {
    var ver = this;
    next();
});
NotificationQueue.pre('update', function () {
    this.update({}, { $set: { last_modified: commonUtility.UtcNow() } });
});
NotificationQueue.pre('findOneAndUpdate', function () {
    this.findOneAndUpdate({}, { $set: { last_modified: commonUtility.UtcNow() } });
});

module.exports = mongoose.model('notificationQueue', NotificationQueue);