const config = require('config');
const messages = config.get('messages');
const App = require('../models/apps');
const logManager = require('../helpers/LogManager');


class BaseController {

    // GetErrorResponse(error_code, error, res) {
    GetErrorResponse(error, res) {
        var error_message = error;
        let errorType = (typeof error);
        if (error != null && error != undefined && errorType == 'object')
            error_message = error.message;

        var response =
            {
                'success': 0,
                'now': Date.now(),
                "error_code": "E100",
                "error": error_message
            };
        logManager.Log(error_message);
        return res.status(config.HTTP_STATUSES.OK).jsonp(response);;
    }

    SendExceptionResponse(res, ex) {
        return this.SendErrorResponse(res, "E100", ex.message);
    }

    SendErrorResponse(res, errorCode, errorMessage = '') {
//       var resultMessage = this.GetMessageByErrorCode(errorCode)

        var errorMessageFrmErrorCode =  messages.ERROR_CODES[errorCode] ;

        var resultMessage = errorMessageFrmErrorCode == undefined || errorMessageFrmErrorCode == null ? "Unknown error" : errorMessageFrmErrorCode ;
        if (errorMessage != '')
            resultMessage = resultMessage + "; " + errorMessage;
        var response =
            {
                'success': 0,
                'now': Date.now(),
                "error_code": errorCode,
                "error": resultMessage
            };
        logManager.Log(resultMessage);
        return res.status(config.HTTP_STATUSES.OK).jsonp(response);;
    }

    GetErrors(result) // common function for check errors
    {
        //Newgen: Parse result array and add all errors to the return string
        return result.array()[0].msg;
    }

/*    GetMessageByErrorCode(errorCode) {
        var message = "Unknown Error";
        switch (errorCode) {
            case config.ERROR_CODES.EXCEPTION: message = "Exception:"; break;
            case config.ERROR_CODES.ERROR: message = "Error:"; break;
            case config.ERROR_CODES.DEVICE_MISMATCH: message = "Your account is logged into from a new device, for security reason please re-generate pin to login from this device"; break;
            case config.ERROR_CODES.INCORRECT_PIN: message = "Please enter correct pin to continue"; break;
            case config.ERROR_CODES.INCORRECT_OTP: message = "Please enter correct OTP to continue"; break;
            case config.ERROR_CODES.INCORRECT_KEY: message = "Please enter correct App Key to continue"; break;
            case config.ERROR_CODES.INCORRECT_EKYCID: message = "Please enter correct eKycId to continue"; break;
            case config.ERROR_CODES.INVALID_REQUEST: message = "Incorrect input parametrs in the request"; break;
            case config.ERROR_CODES.APP_NOT_FOUND: message = "No application record found"; break;
            case config.ERROR_CODES.DOCUMENT_NOT_FOUND: message = "No document record found"; break;
            case config.ERROR_CODES.SAME_PIN: message = "New pin cann't be same as old pin"; break;
        }

        return message;
    }
*/


}

module.exports = BaseController;