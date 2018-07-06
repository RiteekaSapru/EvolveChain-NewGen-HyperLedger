'use strict';
const scheduler = require('node-schedule');
const JobSchedulerService = require('../services/JobSchedulerService');
const NotificationHelper = require('../helpers/NotificationHelper');
const serviceLogManager = require('../helpers/ServiceLogManager');

//Runs every 5 minutes
var fiveMinuteScheduler = scheduler.scheduleJob("*/5 * * * *", function () {
    console.log("Scheduler Initiated for Process Notification Every 5 Min.");
    processNotificationQueue();
});

//Runs once a day at 3:00 AM
var onceADayScheduler = scheduler.scheduleJob("00 00 03 * * 1-7", function () {

    console.log("Scheduler Initiated (Every 24 hours) at 3:00 AM");
    appCleanup();
    setExpiredStatus();
    advanceNotificationForExpiry();

})

process.on('uncaughtException', (err) => {
    console.log("!!!Uncaught Exception!!! " + err.message);
});

function appCleanup() {
    try {
        JobSchedulerService.CleanupData();
    }
    catch (ex) {
        serviceLogManager.Log('Error - Process CleanupData : ' + ex);
    }
}

function setExpiredStatus() {

    try {
        JobSchedulerService.SetExpiredStatusAndNotifyUser();
    }
    catch (ex) {
        serviceLogManager.Log('Error - Process Set Expired Status And Notify User : ' + ex);
    }
}

function advanceNotificationForExpiry() {
    try {
        JobSchedulerService.AdvanceNotificationForExpiry();
    }
    catch (ex) {
        serviceLogManager.Log('Error - Process Advance Notification For Expiry: ' + ex);
    }
}

function processNotificationQueue() {

    try {
        NotificationHelper.ProcessEmailNotificationQueue();
    }
    catch (ex) {
        serviceLogManager.Log('Error - Process Email Notification Queue: ' + ex);
    }
}