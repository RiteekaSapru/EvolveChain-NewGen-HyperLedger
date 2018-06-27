'use strict';
const common_utility = require('../helpers/CommonUtility');
const App = require('../models/apps');
const File = require('../models/files');
const KYCDocument = require('../models/kycdocument');
const config = require('config');
const APP_EXPIRATION_DAYS = config.get('APP_EXPIRATION_DAYS');
var _ = require('lodash');
let imageContainers = ['basic_info', 'address_info', 'identity_info', 'face_info'];

class JobSchedulerService {

    async CleanupData() {
        let expiryDate = common_utility.AddDaysToUtcNow(-APP_EXPIRATION_DAYS);
        //let expiredApps = await App.find({ key: '50890b3cd5a123ba6b5f8834d2a328fc' });
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
                console.log('Record deleted for key: ' + kycAppKey);
            }
        });
    }

}

module.exports = new JobSchedulerService();