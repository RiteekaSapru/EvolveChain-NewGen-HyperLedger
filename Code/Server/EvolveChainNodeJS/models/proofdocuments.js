const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProofDocument = new Schema({

    name: { type: String },
    code: { type: String },
    country_iso: [{ type: String }],
    type: { type: String },
    expiry_date: { type: Boolean },
    sub_docs: [{
        name: { type: String },
        code: { type: String },
    }]

});


ProofDocument.pre('save', function (next) {
    var app = this;
    next();
});

module.exports = mongoose.model('proofdocuments', ProofDocument);