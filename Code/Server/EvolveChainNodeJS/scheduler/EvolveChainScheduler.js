'use strict';
const scheduler = require('node-schedule');

var jobArchiveApps = scheduler.scheduleJob('0 0 */12 * * *', () => {    
    console.log('Scheduler - archive apps');
    

});
// var test = scheduler.scheduleJob('*/5 * * * * *', () => {    
//     console.log('Scheduler - Test');

// });
console.log("Scheduler Initiated (Every 12 hours");

process.on('uncaughtException', (err)=> {
    console.log("!!!Uncaught Exception!!! " + err.message);
});

