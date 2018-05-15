const config = require('config');
const twilioClient = require('twilio')(config.get('TWILIO_ACCOUNT_SID'), config.get('TWILIO_AUTH_TOKEN'));

class SMSService {

    // constructor(req, res, db){
    // 	this.req = req
    //     this.res = res
    //     this.db = db
    // }  

    SendSMS(toPhone, message) {

        return twilioClient.messages
            .create({
                to: toPhone,
                from: config.get('TWILIO_MOBILE'),
                body: message,
            });
    };

}

module.exports = new SMSService();