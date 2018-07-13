const config = require('config');
const messages = config.get('messages');
var dateFormat = require('dateformat');
const md5 = require('md5');
const authenticator = require('authenticator');
//const twofa = require('node-2fa');
const twofa = require('otplib');

const ConfigDB = require('../models/config');
// const ConfigDB = require('../../models/config');


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

    AddDaysToUtcNow(days) {
        var minsInADay = 1440; // 24*60
        var newDate = new Date(Date.now() + days * minsInADay * 60000);
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
                    'firstname': 'First Name', 'middlename': 'Middle Name', 'lastname': 'Last Name',
                    'dob': 'Date Of Birth', 'gender': "Gender", 'place_of_birth': 'Birth Place',
                    'address1': 'Address 1', 'address2': 'Address 2', 'street': 'Street', 'city': 'City',
                    'zip': 'Zip', 'state': 'State', 'country': 'Country'
                };
                break;
            case 'IDENTITY':
            case 'ADDRESS':
                metaDataInfo = { 'document_type': 'Title', 'number': 'Number', 'expiry_date': 'Expiry Date' };
                break;
            case 'FACE':
                metaDataInfo = { 'number': 'Code' };
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

    GenerateShareKey(company_api_key, phone, eKYCID) {

        ///Generate secret keys based on thse parameters O/P { "secret1": twofaSecret1,"secret2": twofaSecret2,"secret3": twofaSecret3,}
        let secretKeys = this.GetSecretKeysForShareKey(company_api_key, phone, eKYCID);

        //let configCol = await ConfigDB.findOne({});
        let share_key_expiry = 2//configCol.share_key_expiry;
        // setting
        twofa.authenticator.options = {
            step: share_key_expiry * 60,
            window: 1
        };

        let sharedKey = twofa.authenticator.generate(secretKeys.secret1)
            + "-" + twofa.authenticator.generate(secretKeys.secret2)
            + "-" + twofa.authenticator.generate(secretKeys.secret3);

        return sharedKey;
    }


    GetSecretKeysForShareKey(company_api_key, phone, eKYCID) {

        var splitArr = eKYCID.split("-");
        let countryPart = splitArr[0] + "-";

        //key1 = md5(email + phone + 'INN-1234');
        let secretKey1 = md5(company_api_key + phone + countryPart + splitArr[1]).replace(/\W/g, '').toLowerCase();
        let secretKey2 = md5(company_api_key + phone + countryPart + splitArr[2]).replace(/\W/g, '').toLowerCase();
        let secretKey3 = md5(company_api_key + phone + countryPart + splitArr[3]).replace(/\W/g, '').toLowerCase();

        return {
            "secret1": secretKey1,
            "secret2": secretKey2,
            "secret3": secretKey3,
        };
    }

    static get cards() {
        return _cards;
    }

    async VerifyShareKey(company_api_key, phone, eKYCID, shareKey) {

        let splitShareKeyArr = shareKey.split("-");

        ///Generate secret keys based on thse parameters O/P { "secret1": twofaSecret1,"secret2": twofaSecret2,"secret3": twofaSecret3,}
        let secretKeys = this.GetSecretKeysForShareKey(company_api_key, phone, eKYCID);

        let verifyToken1 = twofa.authenticator.check(splitShareKeyArr[0], secretKeys.secret1);
        let verifyToken2 = twofa.authenticator.check(splitShareKeyArr[1], secretKeys.secret2);
        let verifyToken3 = twofa.authenticator.check(splitShareKeyArr[2], secretKeys.secret3);

        if (verifyToken1 != null && verifyToken1 != undefined && verifyToken1.delta === 0)
            return true;

        return false;
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
                let imgUrl = config.base_url + "/kyc/getdocumentimages/" + images[j].file_key.toString();
                summaryInfo.DocImages.push({ 'url': imgUrl });
            }
        }
        return summaryInfo;
    }


    async GetInitConfig() {
        let configCol = await ConfigDB.findOne({});
        let InitConfig = {};
        InitConfig.supportPhone = configCol.support_phone;
        InitConfig.supportEmails = configCol.support_email;
        InitConfig.siteUrl = configCol.site_url;
        InitConfig.minDaysToExpiry = configCol.add_expiry_days_from_doc_from_UTC;
        InitConfig.addExpirationDays = configCol.app_expiration_days;
        InitConfig.appExpiryNotificationDays = configCol.app_expiry_notification_days;
        InitConfig.termsPageUrl = configCol.terms_page_url;
        InitConfig.sharekeyExpiryInMin = configCol.share_key_expiry;

        return InitConfig;
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