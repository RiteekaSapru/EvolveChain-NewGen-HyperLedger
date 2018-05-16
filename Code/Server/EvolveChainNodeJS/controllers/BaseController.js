const config = require('config');
const messages = config.get('messages');
const status = config.get('status');

class BaseController {

    GetErrorResponse(error, res) {
        var response = { 'success': 0, 'now': Date.now(), "error": error };
        return res.status(status.OK).jsonp(response);;
    }

    GetErrors(result) // common function for check errors
    {
        //Newgen: Parse result array and add all errors to the return string
        return result.array()[0].msg;
    }

}

module.exports = BaseController;