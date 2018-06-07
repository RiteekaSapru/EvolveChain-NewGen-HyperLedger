const config = require('config');
const messages = config.get('messages');
var dateFormat = require('dateformat');
const md5 = require('md5');
const authenticator = require('authenticator');

class CommonUtility {
    NowDate() {
        return dateFormat(new Date(), "isoUtcDateTime");
    }

    UtcNow() {
        return dateFormat(new Date(), "isoUtcDateTime");
    }

    ConvertToUtc(localDate) {
        return dateFormat(localDate, "isoUtcDateTime");
    }

    AddMinutesToUtcNow(minutes) {
        var newDate = new Date(Date.now() + minutes * 60000);
        return dateFormat(newDate, "isoUtcDateTime");
    }

    ReplaceData(shortcodearr, strbody) {
        if (shortcodearr != null) {
            for (key in shortcodearr) {
                strbody = strbody.replace(new RegExp(key, 'g'), shortcodearr[key]);
            }
        }
        return strbody;
    }

    RemoveNull(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }
        }
    }

    GetKycDocumentMetaDataInfo(document_type) {
        var metaDataInfo;
        switch (document_type) { //set to UPPER case
            case 'BASIC':
                metaDataInfo = {
                    'firstname': 'First Name', 'middlename': 'Middle Name','lastname': 'Last Name', 
                    'dob': 'Date Of Birth', 'place_of_birth': 'Birth Place',
                    'address1': 'Address 1', 'address2': 'Address 2', 'city': 'City',
                    'zip': 'Zip', 'state': 'State'
                };
                break;
            case 'IDENTITY':
            case 'ADDRESS':
                metaDataInfo = { 'document_type': 'Title', 'number': 'Number', 'expiry_date': 'Expiry Date'};
                break;
        }
        return metaDataInfo;
    }

    GenerateUniqueToken() {
        var token = md5(Date.now());
        return token;
    }

    GenerateOTP(noOfDigits) {
        // Authenticator
        var secret = authenticator.generateKey();
        secret = secret.replace(/\W/g, '').toLowerCase();
        var otpToken = authenticator.generateToken(secret);
        var code = otpToken.substring(0, noOfDigits);
        return code;
    }

    GenerateKYCId(countryISO, firstName) {
        var secretKey1 = authenticator.generateKey();
        secretKey1 = secretKey1.replace(/\W/g, '').toLowerCase();
        var secret1_code = authenticator.generateToken(secretKey1);

        var secretKey2 = authenticator.generateKey();
        secretKey2 = secretKey2.replace(/\W/g, '').toLowerCase();
        var secret2_code = authenticator.generateToken(secretKey2);

        let secretCode = secret1_code + secret2_code;

        // var countryISO = this.GetCountryISO(country);

        var kycId = countryISO.substring(0, 2) + firstName.substring(0, 1) + '-' + secretCode.substring(0, 4) + '-' + secretCode.substring(4, 8) + '-' + secretCode.substring(8, 12);

        return kycId.toUpperCase();
    }

    GetCountryISO(countryName) {
        var iso = "EC";
        const countryList = require('../config/countries');

        const country = countryList.find(c => c.Country.toUpperCase() === countryName.toUpperCase());
        if (country)
            iso = country.ISO;

        return iso;

    }

    GetAppBaseUrl(req) {
        return req.protocol + '://' + req.get('host');
    }

    GetKycImages(docInfo, docType) {
        let summaryInfo = {
            DocImages: []
        };

        if (docInfo.details != undefined) {
            let images = docInfo.images;

            for (var j = 0; j < images.length; j++) {
                let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
                summaryInfo.DocImages.push({ 'url': imgUrl });
            }
        }
        return summaryInfo;
    }

    GetKycDocumentInfo(docInfo, docType) {
        let summaryInfo = {
            DocDetails: {},
            DocImages: []
        };
        if (docInfo.details != undefined) {
            var details = docInfo.details;
            let images = docInfo.images;
            summaryInfo.DocDetails = JSON.parse(JSON.stringify(details));

            for (var j = 0; j < images.length; j++) {
                let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
                summaryInfo.DocImages.push({ 'url': imgUrl });
            }
        }
        return summaryInfo;
    }

    // GetKycDocumentInfo(docInfo, docType) {
    //     let summaryInfo = {
    //         DocDetails: [],
    //         DocImages: []
    //     };

    //     if (docInfo.details != undefined) {
    //         var details = docInfo.details;
    //         let images = docInfo.images;

    //         let metaDataInfo = this.GetKycDocumentMetaDataInfo(docType);
    //         let detailKeys = Object.keys(details);
    //         Object.keys(metaDataInfo).forEach(function (key) {
    //             summaryInfo.DocDetails.push({ 'name': metaDataInfo[key], 'value': details[key] });
    //         });

    //         for (var j = 0; j < images.length; j++) {
    //             let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j]._id.toString();
    //             summaryInfo.DocImages.push({ 'url': imgUrl });
    //         }
    //     }
    //     return summaryInfo;
    // }


}

module.exports = new CommonUtility();