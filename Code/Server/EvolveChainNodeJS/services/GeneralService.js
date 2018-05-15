/*
---Used for making http calls---

npm install --save request
npm install --save request-promise
  
*/

const request = require('request-promise');

class GeneralService{

GetService(url, data){

  return request({
    "method":"GET", 
    "uri": url,
    "json": true,
    // "headers": {
    //   "Authorization": "Bearer " + github.token,
    //   "User-Agent": "My little demo app"
    // }
  });
}

PostService(url,data){

  return request({
    "method":"POST", 
    "uri": url,
    "json": data,
    // "headers": {
    //   "Authorization": "Bearer " + github.token,
    //   "User-Agent": "My little demo app"
    // }
  });
}

}

module.exports = new GeneralService();

//sample API call
// GeneralService.PostService('http://192.168.60.130:4600/app/initialize',
// {
//         "ip" : "192.168.60.20",
//         "device_type":"Web",
//         "device_name":"Chrome-arpit",
//         "os_version": "7",
//         "vendor_uuid":"769b47ee-4a0e-11e8-9234-0123456789ab"
    
// }).then((result) => {

//     console.log(result);

// }).catch((err) => {
   
//     var respErr  = JSON.parse(err.error);
//     var errorResult = {
//         origUrl: respErr.origUrl,
//         error: respErr
//     };
//     console.log(errorResult);
// });