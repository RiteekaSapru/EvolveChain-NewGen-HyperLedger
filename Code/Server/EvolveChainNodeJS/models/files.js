/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

const FileSchema = new Schema({
    // chunkSize : {type: Number},
    // //file: {type: Schema.Types.ObjectId, ref: "fs.files"},
    // filename: {type: String},
    // length: {type: Number},
    // md5: {type: String},
    // metadata: { filename: {type: String}},
    // uploadDate: {
    //     type: Date,
    //     default: Date.now
    // },
    // details_profile_img_id: {type: String},
    // details_address_proof_id: {type: String},
    // details_passport1_id: {type: String},
    // details_passport2_id: {type: String},
    // details_identity1_id: {type: String},
    // details_identity2_id: {type: String},
    // details_tax1_id: {type: String},
    // details_drivinglicence1_id: {type: String},
    // details_hold_img_id: {type: String}
    data: Buffer,
    contentType: String,
    key : String
});


FileSchema.pre('save', function(next) {
    var file = this;
    next();
});

module.exports = mongoose.model('fs.files', FileSchema);