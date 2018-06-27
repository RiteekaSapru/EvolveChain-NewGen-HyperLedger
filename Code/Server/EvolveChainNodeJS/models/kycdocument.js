
/*
 * KYC Document model schema
 *
 */
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');
const commonUtility = require('../helpers/CommonUtility');

const ImageInfo = new Schema({
    name: String,
    contentType: String,
    encoding: String,
    file_key : String
});

// const DocInfo = new Schema({
//     details: { type: Schema.Types.Mixed },
//     images: { type: [ImageInfo] },
//     docType: { type: String },
// });
/*
 * Upload Document model schema
 *
 */

const GeneralDocument = new Schema({
    number: { type: String },
    expiry_date: { type: Date },
    country: { type: String },
    document_type: { type: String },
    sub_document_type: { type: String }
});

const KYCDocument = new Schema({
    app_key: { type: String },
   // app_data:{ type: String, field:'key', ref:'apps' },
    isDelete: { type: Boolean,  default: false },
    //docInfo: { type: [DocInfo] },
    basic_info: {
        details: {
            firstname: { type: String },
            middlename: { type: String },
            lastname: { type: String },
            gender : {type : String},
            dob: { type: String },
            city: { type: String },
            address1: { type: String },
            address2: { type: String },
            street :{type : String},
            place_of_birth: { type: String },
            zip: { type: String },
            state: { type: String },
            country: { type: String },
            document_type: { type: String } //Profile in this case
        },
        images: { type: [ImageInfo] },
    },
    address_info: {
        details:{type: GeneralDocument},
        images: { type: [ImageInfo] },
    },
    identity_info: {
        details:{type: GeneralDocument},
        images: { type: [ImageInfo] },
    },
    face_info: {
        details:{type: GeneralDocument},
        images: { type: [ImageInfo] },
    },
    last_modified: { type: Date },
    //status: { type: String },
    hash: { type: String },
    is_verified: { type: Boolean, default: false },
    verification_comment: { type: String },
    verification_time: { type: Date },
    verification_by: { type: String }
});



KYCDocument.virtual('app_data', {
    ref: 'apps',
    localField: 'app_key',
    foreignField: 'key',
    justOne: true // for many-to-1 relationships
  });

// KYCDocument.index({ app_key: 1}, { unique: true});

KYCDocument.pre('save', function (next) {
    var KYCDocument = this;
    next();
});

KYCDocument.pre('update', function() {
    this.update({},{ $set: { last_modified: commonUtility.UtcNow() } });
  });
  
  KYCDocument.pre('findOneAndUpdate', function() {
    this.findOneAndUpdate({},{ $set: { last_modified: commonUtility.UtcNow() } });
  });

module.exports = mongoose.model('kycdocuments', KYCDocument);