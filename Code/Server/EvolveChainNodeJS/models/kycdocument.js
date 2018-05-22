
/*
 * KYC Document model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

// const ImageData = new Schema({
//     img: { data: Buffer, contentType: String }
// });

const ImageInfo = new Schema({
    name: String,
    contentType: String,
    encoding: String
});

const DocInfo = new Schema({
    details: { type: Schema.Types.Mixed },
    images: { type: [ImageInfo] },
    docType: { type: String },
    is_verified: { type: Boolean, default: false }
});

const KYCDocument = new Schema({
    app_key: { type: String },
    isDelete: { type: Boolean },
    docInfo: { type: [DocInfo] },
    last_modified: { type: Date },
    status: { type: String },
    hash: { type: String },
    is_verified: { type: Boolean, default: false },
    verification_comment: { type: String },
    verification_time: { type: Date },
    verification_by: {type:String}
});

KYCDocument.pre('save', function (next) {
    var KYCDocument = this;
    next();
});

module.exports = mongoose.model('kycdocuments', KYCDocument);