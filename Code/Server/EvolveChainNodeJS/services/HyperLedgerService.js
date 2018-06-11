const config = require('config');
const _ = require('lodash');
const GeneralService = require('./GeneralService');

const HL_URL_EKYC = config.get('HL_URL') + "/EKYC";

class HyperLedgerService {

    //save eKycId to Hyper Ledger
    //let hl_URL_KYC = config.HL_URL + "/EKYC";

    GetEkycDetails() {
        return GeneralService.GetService(HL_URL_EKYC);
    }

    PostEkycDetails(eKycId, email, phone, isd_code, basicDetailObj) {
        basicDetailObj.eKYCId = eKycId;
        basicDetailObj.email = email;
        basicDetailObj.phone = phone;
        basicDetailObj.phone_code = isd_code;

        let eKycInfo = _.pick(basicDetailObj, ['eKYCId', 'email', 'phone', 'phone_code', 'firstname', "middlename", "lastname",
            "place_of_birth", "dob", "gender", "city", "street", "address1", "address2", "zip", "state", "country"]);

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

    UpdateEkyc(eKycId, basicDetailObj) {
        let updateUrl = HL_URL_EKYC + '/' + eKycId;
        return GeneralService.PutService(updateUrl, basicDetailObj);
    }
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