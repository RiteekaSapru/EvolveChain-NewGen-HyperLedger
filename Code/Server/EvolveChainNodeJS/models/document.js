/*
 * Country model schema
 *
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config');

const Document = new Schema({
    address_proof: { 
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "details": {
        "Mobile": {type: String},
        "Name": {
            "first": {type: String},
            "middle": {type: String},
            "last": {type: String}
        },
        "Birth": {
            "date": {type: String}
        },
        "Address": {
            "address": {type: String},
            "street": {type: String},
            "city": {type: String},
            "zip": {type: String},
            "state": {type: String},
            "country": {type: String}
        },
        "Passport": {
            "firstname": {type: String},
            "middlename": {type: String},
            "lastname": {type: String},
            "dob": {type: String},
            "address": {type: String},
            "street": {type: String},
            "city": {type: String},
            "zip": {type: String},
            "state": {type: String},
            "country": {type: String},
            "no": {type: String},
            "expiry": {type: String},
            "pass_country": {type: String}
        },
        "Tax": {
            "firstName": {type: String},
            "middleName": {type: String},
            "lastName": {type: String},
            "dateofBirth": {type: String},
            "id": {type: String}
        },
        "Driving": {
            "firstname": {type: String},
            "middlename": {type: String},
            "lastname": {type: String},
            "dob": {type: String},
            "address": {type: String},
            "street": {type: String},
            "city": {type: String},
            "zip": {type: String},
            "state": {type: String},
            "country": {type: String},
            "no": {type: String},
            "expiry": {type: String},
            "licence_country": {type: String}
        },
        "Identity": {
            "firstname": {type: String},
            "middlename": {type: String},
            "lastname": {type: String},
            "no": {type: String}
        }
    },
    "drivinglicense1": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "email": {type: String},
    "hash": {type: String},
    "hold_img": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "identity1": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "identity2": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "IP": {type: String},
    "isdelete": {type: String},
    "kyc_id": {type: String},
    "passport1": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "passport2": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "phone": {type: String},
    "profile": {type: String},
    "profile_img": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    },
    "secret": [{type: String}],
    "step": {
        "issubmit": {type: String},
        "basic": {
            "status": {type: String},
            "message": {type: String}
        },
        "address": {
            "status": {type: String},
            "message": {type: String}
        },
        "passport": {
            "status": {type: String},
            "message": {type: String}
        },
        "identity": {
            "status": {type: String},
            "message": {type: String}
        },
        "taxation": {
            "status": {type: String},
            "message": {type: String}
        },
        "drivinglicense": {
            "status": {type: String},
            "message": {type: String}
        },
        "holdimg": {
            "status": {type: String},
            "message": {type: String}
        }
    },
    "Verify": {
        "Score": {type: Number},
        "Basic": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Address": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Passport": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Tax": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Identity": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Driving": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "Face": {
            Uploaded: {
                type: Number,
                enum: [0,5],
                default: 0
            },
            Correct: {
                type: Number,
                enum: [0,5],
                default: 0
            }
        },
        "DateTime": {
            type: Date,
            default: Date.now
        },
        "Checked": {
            type: String,
            enum: ['Yes','No'],
            default: 'No'
        },
        "Percent" : {type: Number},
        "verified": {
            type: String,
            enum: ['Yes','No'],
            default: 'No'
        }
    },
    "tax1": {
        "name": {type: String},
        "type": {type: String},
        "tmp_name": {type: String},
        "error": {type: Number},
        "size": {type: Number},
        "verified": {type: String},
        "IP": {type: String}
    }
});


Document.pre('save', function(next) {
    var Document = this;
    next();
});

module.exports = mongoose.model('documents', Document);