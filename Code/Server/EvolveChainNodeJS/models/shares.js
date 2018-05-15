/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

const Share = new Schema({
    "code": {type: String},
    "hash": {type: String},
    "companyname": {type: String},
    "comment": {type: String},
    "sharedoc": [{type: String}],
    "new_KYC": {type: String},
    "status": {type: String},
    DateTime: {
        type: Date,
        default: Date.now
    }
});


Share.pre('save', function(next) {
    var Share = this;
    next();
});

module.exports = mongoose.model('shares', Share);