const NotificationQueue = require('../models/notificationQueue');

class NotificationHelper {

    /// notification_type : Phone, Email\
    /// When notification_type : Phone
    /// to : phone no, body :message,subject : ""
    async AddNotificationQueue(app_key, to, body, notification_type,subject) {

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
}

module.exports = new NotificationHelper();