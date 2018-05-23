
/*
 * KYC Document model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

const ImageInfo = new Schema({
    name: String,
    contentType: String,
    encoding: String
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
    expiry_date: { type: String },
    country: { type: String },
    document_type: { type: String }
});

const KYCDocument = new Schema({
    app_key: { type: String },
    isDelete: { type: Boolean },
    //docInfo: { type: [DocInfo] },
    basic_info: {
        details: {
            firstname: { type: String },
            middlename: { type: String },
            lastname: { type: String },
            dob: { type: String },
            city: { type: String },
            address1: { type: String },
            address2: { type: String },
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
    last_modified: { type: Date },
    //status: { type: String },
    hash: { type: String },
    is_verified: { type: Boolean, default: false },
    verification_comment: { type: String },
    verification_time: { type: Date },
    verification_by: { type: String }
});

KYCDocument.pre('save', function (next) {
    var KYCDocument = this;
    next();
});

module.exports = mongoose.model('kycdocuments', KYCDocument);