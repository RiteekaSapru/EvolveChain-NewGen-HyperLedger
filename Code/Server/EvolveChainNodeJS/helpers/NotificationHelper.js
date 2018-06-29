const NotificationQueue = require('../models/notificationQueue');
const emailService = require('../services/EmailService');
const sms_service = require('../services/SMSService');

class NotificationHelper {

    /// notification_type : Phone, Email\
    /// When notification_type : Phone
    /// to : phone no, body :message,subject : ""
    async AddNotificationQueue(appKey, to, body, notification_type, subject) {

        var parameters = {
            app_key: appKey,
            to: to,
            subject: subject,
            //last_modified: commonUtility.UtcNow(),
            body: body,
            notification_type: notification_type
        }
        var notificationQueue = new NotificationQueue(parameters);
        return await notificationQueue.save();
    }

    async ProcessEmailNotificationQueue() {

        let notifications = await NotificationQueue.find({ is_open: true }).sort({ last_modified: 1 });
        notifications.forEach(async function (notification) {
            let notificationId = notification._id;
            if (notification.notification_type === "Email") {
                await emailService.SendEmail(notification.to, notification.subject, notification.body);
                let setParams = {
                    $set: {
                        is_open: false
                    }
                }
                await NotificationQueue.update({ _id: notificationId }, setParams);
            } else if (notification.notification_type === "Msg") {
                await sms_service.SendSMS(notification.to, notification.body);
                let setParams = {
                    $set: {
                        is_open: false
                    }
                }
                await NotificationQueue.update({ _id: notificationId }, setParams);
            }
        }
        );
    }
}

module.exports = new NotificationHelper();