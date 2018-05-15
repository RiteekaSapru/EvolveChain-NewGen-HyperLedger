/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nodemailer = require('nodemailer');
const config = require('config');

const Question = new Schema({
    Basic: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Address: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Passport: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Tax: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Identity: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Driving: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    Face: {
        Uploaded: [{ type: Number }],
        Correct: [{ type: Number }]
    },
    DateTime: {
        type: Date,
        default: Date.now
    }
});


Question.pre('save', function(next) {
    var app = this;
    next();
});

module.exports = mongoose.model('questions', Question);