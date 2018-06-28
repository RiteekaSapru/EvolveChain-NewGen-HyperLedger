const NotificationQueue = require('../models/notificationQueue');
const emailService = require('../services/EmailService');

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

        var notifications = await NotificationQueue.find({ is_open: true });
        notifications.forEach(notification => {

            emailService.SendEmail(notification.to, notification.subject, notification.body);

            var setParams = {
                $set: {
                    is_open: false
                }
            }
            
            await NotificationQueue.update({ _Id: notification._Id }, setParams);

        }
        );
    }
}

module.exports = new NotificationHelper();