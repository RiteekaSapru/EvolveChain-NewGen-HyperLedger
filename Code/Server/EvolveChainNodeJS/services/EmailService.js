const config = require('config');
const nodemailer = require('nodemailer');
const logManager = require('../helpers/LogManager');
class EmailService{	

    SendEmail(toEmailIds, subject, htmlEmailBody) {

        var mailOption = {
            from: config.get('FROM_EMAIL'),
            to: toEmailIds, // list of receivers
            subject: subject, // Subject line
            html: htmlEmailBody
        }
    
    var transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            auth: {
                user: process.env.SMTP_USERNAME || 'gordhan@yudiz.com', // SMTP email
                pass: process.env.SMTP_PASSWORD || 'Gordhan_9033' // Your password
            },           
            secure: true
        });
    
    return transporter.sendMail(mailOption).then((emailSuccess)=> {
       // return success.messageId;
       transporter.close();
       logManager.Log(mailOption.to + ":" + emailSuccess.messageId);
       return Promise.resolve(emailSuccess);
    });
};
	
}

module.exports = new EmailService();