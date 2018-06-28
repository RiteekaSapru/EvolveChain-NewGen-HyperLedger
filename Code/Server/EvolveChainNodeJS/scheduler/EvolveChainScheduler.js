'use strict';
const scheduler = require('node-schedule');
const JobSchedulerService = require('../services/JobSchedulerService');

//Use this value for 30 sec :  '30 * * * * *'
// var jobArchiveApps = scheduler.scheduleJob('0 0 */12 * * *', () => {    
//     console.log('Scheduler - archive apps');
//     appCleanup();

// });

var j = scheduler.scheduleJob('12 * * * * *', function () {
    console.log('Scheduler call........');
    //appCleanup();
    //setExpiredStatus();
    advanceNotificationForExpiry();
});
// var test = scheduler.scheduleJob('*/5 * * * * *', () => {    
//     console.log('Scheduler - Test');
// });

console.log("Scheduler Initiated (Every 12 hours");

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