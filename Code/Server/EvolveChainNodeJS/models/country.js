/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Country = new Schema({
    name: { type: String },
    iso: { type: String },
    is_active: { type: Boolean },
    phone_code: { type: Number },
    phone_format: { type: String },
    currency_code: { type: String },
    order: { type: Number },
    age_limit:{ 'min':{type:Number}, 'max': {type:Number}}

});

Country.pre('save', function (next) {
    var country = this;
    next();
});

module.exports = mongoose.model('countries', Country);
