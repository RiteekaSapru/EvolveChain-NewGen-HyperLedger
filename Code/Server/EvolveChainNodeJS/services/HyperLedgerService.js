const config = require('config');
const _ = require('lodash');
const GeneralService = require('./GeneralService');

const HL_URL_EKYC = config.get('HL_URL') + "/EKYC";
const HL_URL_COMPANY = config.get('HL_URL') + "/COMPANY"
const HL_URL_UPDATE = config.get('HL_URL') + "/update_eKYC";


class HyperLedgerService {

    //save eKycId to Hyper Ledger
    //let hl_URL_KYC = config.HL_URL + "/EKYC";

    GetEkycDetails() {
        return GeneralService.GetService(HL_URL_EKYC);
    }

    PostEkycDetails(eKYCID, email, phone, isd_code, status, country_iso, basicDetailObj, addressDetailObj, identityDetailObj) {

        let DocDetails = {};
        DocDetails.eKYCID = eKYCID;
        DocDetails.email = email;
        DocDetails.phone = phone;
        DocDetails.isd_code = isd_code;
        DocDetails.eKYCstatus = status;
        DocDetails.country_iso = country_iso;
        DocDetails.basicDetailObj = JSON.stringify(basicDetailObj);;
        DocDetails.addressDetailObj = JSON.stringify(addressDetailObj);
        DocDetails.identityDetailObj = JSON.stringify(identityDetailObj);

        let eKycInfo = _.pick(DocDetails, ['eKYCID', 'email', 'phone', 'isd_code', 'eKYCstatus', 'country_iso', 'basicDetailObj', 'addressDetailObj', 'identityDetailObj']);

        return GeneralService.PostService(HL_URL_EKYC, eKycInfo);
    }

    GetEkycDetailsById(eKycId) {
        let url = HL_URL_EKYC + '/' + eKycId;
        return GeneralService.GetService(url);
    }

    DeleteEkyc(eKycId) {
        let deleteUrl = HL_URL_EKYC + '/' + eKycId;
        return GeneralService.DeleteService(deleteUrl);
    }

    UpdateEkycDetails(eKYCID, email, phone, isd_code, status, country_iso, basicDetailObj, addressDetailObj, identityDetailObj) {

        let asset = "resource:evolvechain.eKYC#";
        var assetFinal = asset.concat(eKYCID);
        let DocDetails = {};
        DocDetails.asset = assetFinal;
        DocDetails.newEmail = email;
        DocDetails.newPhone = phone;
        DocDetails.newISD_code = isd_code;
        DocDetails.new_eKYCstatus = status;
        DocDetails.newCountry_iso = country_iso;
        DocDetails.newBasicDetailObj = JSON.stringify(basicDetailObj);;
        DocDetails.newAddressDetailObj = JSON.stringify(addressDetailObj);
        DocDetails.newIdentityDetailObj = JSON.stringify(identityDetailObj);

        let eKycInfo = _.pick(DocDetails, ['asset', 'newEmail', 'newPhone', 'newISD_code', 'new_eKYCstatus', 'newCountry_iso', 'newBasicDetailObj', 'newAddressDetailObj', 'newIdentityDetailObj']);

        return GeneralService.PostService(HL_URL_UPDATE, eKycInfo);
    }

    GetSubscribedCompanies() {
        return GeneralService.GetService(HL_URL_COMPANY);
    }

    // UpdatePhone(eKycId, newPhone, newISD_code){
    //     // let updateUrl = HL_URL_EKYC + '/' + eKycId;

    //     let asset =  "resource:evolvechain.eKYC#";
    //     var assetFinal = asset.concat(eKycId);

    //     let Details= {};
    //     Details.newPhone = newPhone;
    //     Details.newISD_code = newISD_code;
    //     Details.asset = assetFinal;

    //     let eKycInfo = _.pick(Details, ['asset','newPhone','newISD_code']);

    //     return GeneralService.PostService(HL_URL_UPDATE_PHONE,eKycInfo);
    // }


}




//TEST CASES
//GET
// HyperLedgerService.GetEkycDetails().then((result) => {
//     console.log(result);
// }).catch((err) => {
//     var respErr  = JSON.parse(err.error);
//     var errorResult = {
//         origUrl: respErr.origUrl,
//         error: respErr
//     };
//     console.log(errorResult);
// });

//POST
// HyperLedgerService.PostEkycDetails({
//     "eKYCId": "112233445566",
//     "firstname": "first 1",
//     "middlename": "middle 1",
//     "lastname": "last 1",
//     "dob": "2015-03-15",
//     "place_of_birth": "pnp",
//     "city": "pnp",
//     "address1": "address 1",
//     "address2": "address 2",
//     "zip": "zip 1",
//     "state": "state 1",
//     "country": "country 1"
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {

//     var respErr  = JSON.parse(err.error);
//     var errorResult = {
//         origUrl: respErr.origUrl,
//         error: respErr
//     };
//     console.log(errorResult);
// });

//DELETE
// HyperLedgerService.DeleteEkyc("strin1g").then((result) => {
//     console.log(result);
//     result = ""   this result is coming
// }).catch((err) => {
//     var respErr  = JSON.parse(err.error);
//     var errorResult = {
//         origUrl: respErr.origUrl,
//         error: respErr
//     };
//     console.log(errorResult);
// });

//Update without the EkycId
// HyperLedgerService.UpdateEkyc("string",{
//     //"eKYCId": "112233445566",
//     "firstname": "first 1",
//     "middlename": "middle 1",
//     "lastname": "last 1",
//     "dob": "2015-03-15",
//     "place_of_birth": "pnp",
//     "city": "pnp",
//     "address1": "address 1",
//     "address2": "address 2",
//     "zip": "zip 1",
//     "state": "state 1",
//     "country": "country 1"
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {

//     var respErr = JSON.parse(err.error);
//     var errorResult = {
//         origUrl: respErr.origUrl,
//         error: respErr
//     };
//     console.log(errorResult);
// });



module.exports = new HyperLedgerService();