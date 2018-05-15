const config = require('config');

class AadhaarService {

    GenerateOTP(vid) {

        return 1473;
    };

    VerifyAadhaar(vid, otp) {

        var myAadhaarGateway 
        = new AadhaarAPIGateway('fbe96ede-8c81-460e-a799-0e71aa7f2781', gatewayOptions);
        openAadhaarGateway(myAadhaarGateway);

        return true;
    };

    InitiateGatewayTransaction(vid)
    {
        // https://api.quagga.in/gateway/init/:type/:aadhaar_number
        // https://api.quagga.in/gateway/init/:eKyc/:vid
        response = {
            "id": "fbe96ede-8c81-460e-a799-0e71aa7f2781",
            "aadhaar_number": vid,
            "createdAt": "2017-05-22T08:34:25.841Z",
            "env": 1
          };

        //   return gatewayLaunchHtml;
    }
}


function handleAadhaarConsentDenied() {
    console.log('Handling consent denial at client end');
    //Handle the case when user denies consent
}

function handleAadhaarEKYCSuccess(responseJSON) {
    console.log('Handling EKYC success at client end');
    console.log(responseJSON);
    //Handle the case when EKYC is successful
}

function handleAadhaarEKYCFailure(errorJSON) {
    console.log('Handling EKYC failure at client end');
    console.log(errorJSON);
    //Handle the case when EKYC fails
}

function handleAadhaarAUTHSuccess(responseJSON) {
    console.log('Handling AUTH success at client end');
    console.log(responseJSON);
    //Handle the case when AUTH is successful
}

function handleAadhaarAUTHFailure(errorJSON) {
    console.log('Handling AUTH failure at client end');
    console.log(errorJSON);
    //Handle the case when user Authentication fails
}


function handleAadhaarOTPFailure(errorJSON) {
    console.log('Handling OTP failure cases at client end');
    console.log(errorJSON);
    //Handle OTP failure
    /*
      Check for errorJSON.resultCode
        119 : No email or mobile associated with aadhaar (when Fingerprint is disabled)
        998 : Invalid Aadhaar Number.
        410 : OTP requested more than 3 times for same transaction (when Fingerprint is disabled)
     */
}

//Do not remove this function, even if not used.
function handleGatewayError(errorJSON) {
    //Handle cases where gateway fails during launch or in between
    //statusCode: 412 - Gateway timed out before launch or during transaction. 
    console.log('Handling Gateway failure at client end');
    console.log(errorJSON);
}

function handleGatewayTermination() {
    //Do not remove this function, even if not used.
    console.log('Handling Gateway Termination at client end');
}




module.exports = new AadhaarService();