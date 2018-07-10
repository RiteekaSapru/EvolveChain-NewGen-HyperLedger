'use strict';
const common_utility = require('../helpers/CommonUtility');
const App = require('../models/apps');
const File = require('../models/files');
const KYCDocument = require('../models/kycdocument');
const ConfigDB = require('../models/config');
const config = require('config');
var _ = require('lodash');
const ejs = require('ejs');
const fs = require("fs");
const emailService = require('../services/EmailService');
const notificationHelper = require('../helpers/NotificationHelper');
const logManager = require('../helpers/LogManager');
const serviceLogManager = require('../helpers/ServiceLogManager');
let imageContainers = ['basic_info', 'address_info', 'identity_info', 'face_info'];

class JobSchedulerService {

    async CleanupData() {
        let configCol = await ConfigDB.findOne({});
        let expiryDate = common_utility.AddDaysToUtcNow(-configCol.app_expiration_days);
        let expiredApps = await App.find({ last_login_time: { $lte: expiryDate } });
        _.each(expiredApps, async function (app) {
            if (app['status'] === "Pending") {
                let app_query = {
                    key: app['key']
                }
                let appData = await App.findOne(app_query).populate('kycdoc_data').exec();
                let kycAppKey = appData['kycdoc_data']['app_key'];
                let imageIds = [];
                _.each(imageContainers, function (step) {
                    let info = appData['kycdoc_data'][step];
                    if (info.images && info.images.length > 0) {
                        _.each(info.images, function (imageObject) {
                            imageIds.push(imageObject['file_key']);
                        })
                    };
                });
                await File.deleteMany({ _id: { $in: imageIds } });
                await KYCDocument.remove({ app_key: kycAppKey });
                await App.remove({ key: kycAppKey });
                serviceLogManager.Log('Scheduler - Record deleted for key: ' + kycAppKey);
            }
        });
    }

    async SetExpiredStatusAndNotifyUser() {
        let configCol = await ConfigDB.findOne({});
        let nowDate = common_utility.NowDate();
        KYCDocument.find()
            .or([{ "address_info.details.expiry_date": { $lte: nowDate } }, { "identity_info.details.expiry_date": { $lte: nowDate } }])
            .populate('app_data')
            .then(expiredDocs => {
                expiredDocs = _.uniqBy(expiredDocs, 'app_key'); // to get unique documents based on app_key
                let expiredAppTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/expired.html';
                let template = fs.readFileSync(expiredAppTemplateHtml, {
                    encoding: 'utf-8'
                });
                let emailSubject = 'EvolveChain Application - Expired';
                let emailBody = ejs.render(template, {
                    expiryDays: configCol.app_expiration_days,
                    APP_LOGO_URL: config.get('APP_LOGO_URL'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });
                let phoneMessage = "This is to inform you that your KYC application has expired. Please resubmit your application with in next " + configCol.app_expiration_days + " days";
                _.each(expiredDocs, async function (kycDoc) {
                    let appData = kycDoc.app_data;
                    if (appData.status === config.APP_STATUSES.VERIFIED) {
                        try {
                            // email notification
                            await notificationHelper.AddNotificationQueue(appData.key, appData.email, emailBody, config.NOTIFICATION_TYPES.EMAIL, emailSubject);
                            serviceLogManager.Log('Scheduler - Email notification sent to ' + appData.email + ' having key: ' + appData.key);

                            // phone notification
                            await notificationHelper.AddNotificationQueue(appData.key, appData.phone, phoneMessage, config.NOTIFICATION_TYPES.MESSAGE);
                            serviceLogManager.Log('Scheduler - Phone notification sent to ' + appData.phone + ' having key: ' + appData.key);
                            var appConditions = {
                                key: appData['key']
                            }
                            var params = {
                                status: config.APP_STATUSES.EXPIRED
                            }
                            await App.update(appConditions, params); //UPDATE app with expired status
                        }
                        catch (ex) {
                            serviceLogManager.Log(`AddNotificationToQueueException: ${ex}`);
                        }
                    }
                })
            })
            .catch(error => {
                let ww = error;
            });
    }

    async AdvanceNotificationForExpiry() {
        let configCol = await ConfigDB.findOne({});
        let expiringTime = common_utility.AddDaysToUtcNow(configCol.app_expiry_notification_days);
        KYCDocument.find()
            .or([{ "address_info.details.expiry_date": { $lte: expiringTime } }, { "identity_info.details.expiry_date": { $lte: expiringTime } }])
            .populate('app_data')
            .then(expiringDocs => {
                expiringDocs = _.uniqBy(expiringDocs, 'app_key'); // to get unique documents based on app_key
                let expiringAppTemplateHtml = config.EMAIL_TEMPLATES_PATH + '/expiryNotification.html';
                let template = fs.readFileSync(expiringAppTemplateHtml, {
                    encoding: 'utf-8'
                });
                let emailSubject = 'EvolveChain Application - About To Expire';
                let emailBody = ejs.render(template, {
                    expiryDays: configCol.app_expiry_notification_days,
                    APP_LOGO_URL: config.get('APP_LOGO_URL'),
                    SITE_NAME: config.get('app_name'),
                    CURRENT_YEAR: config.get('current_year')
                });
                let phoneMessage = "This is to inform you that your KYC application is going to expire in " + configCol.app_expiry_notification_days + " days. Please resubmit your application with in next " + configCol.app_expiry_notification_days + " days";
                _.each(expiringDocs, async function (kycDoc) {
                    let appData = kycDoc.app_data;
                    if (!appData.expire_notification || appData.expire_notification === false) {
                        try {
                            // email notification
                            await notificationHelper.AddNotificationQueue(appData.key, appData.email, emailBody, config.NOTIFICATION_TYPES.EMAIL, emailSubject);
                            serviceLogManager.Log('Scheduler - Email notification sent to ' + appData.email + ' having key: ' + appData.key);
                            // phone notification
                            await notificationHelper.AddNotificationQueue(appData.key, appData.phone, phoneMessage, config.NOTIFICATION_TYPES.MESSAGE);
                            serviceLogManager.Log('Scheduler - Phone notification sent to ' + appData.phone + ' having key: ' + appData.key);
                            var appConditions = {
                                key: appData['key']
                            }
                            var params = {
                                expire_notification: true
                            }
                            await App.update(appConditions, params); //UPDATE app with expired status
                        }
                        catch (ex) {
                            serviceLogManager.Log(`ProcessNotificationQueueException: ${ex}`);
                        }
                    }
                })
            })
            .catch(error => {
                let ww = error;
            });
    }
}

module.exports = new JobSchedulerService();