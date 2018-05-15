/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nodemailer = require('nodemailer');
const config = require('config');

const Country = new Schema({
    name: { type: String },
    code: { type: String },
    "2_digit_code": { type: String },
    "3_digit_code": { type: String },
    status: {
        type: String,
        enum: ['y', 'n', 'd'],
        default: 'y'
    },
    sort: { type: Number },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


Country.pre('save', function(next) {
    var country = this;
    next();
});

module.exports = mongoose.model('countries', Country);