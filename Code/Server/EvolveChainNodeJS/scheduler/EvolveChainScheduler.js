'use strict';
const scheduler = require('node-schedule');
const JobSchedulerService = require('../services/JobSchedulerService');
const NotificationHelper = require('../helpers/NotificationHelper');

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
    JobSchedulerService.CleanupData();
}

function setExpiredStatus() {
    JobSchedulerService.SetExpiredStatusAndNotifyUser();
}

function advanceNotificationForExpiry() {
    JobSchedulerService.AdvanceNotificationForExpiry();
}

function processNotificationQueue() {
    NotificationHelper.ProcessEmailNotificationQueue();
}