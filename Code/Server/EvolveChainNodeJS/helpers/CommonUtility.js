const config = require('config');
var im = require('imagemagick');
const messages = config.get('messages');
var dateFormat = require('dateformat');

class CommonUtility {
    NowDate() {
        return dateFormat(new Date(), "isoUtcDateTime");
    }

    ReplaceData(shortcodearr, strbody) {
        if (shortcodearr != null) {
            for (key in shortcodearr) {
                strbody = strbody.replace(new RegExp(key, 'g'), shortcodearr[key]);
            }
        }
        return strbody;
    }

    RemoveNull(obj) {
        console.log(obj);
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }
        }
    }

    // common for image resize
    async ImageResize(source, destination, width, callback) {
        let response = {
            'error': true,
            'data': [],
            'message': messages.something_wentwrong,
        }
        im.resize({
            srcPath: source,
            dstPath: destination,
            width: width
        }, function (error, stdout, stderr) {
            if (error) {
                let err = `Error :: ${error}`;
                response.message = err;
            } else {
                response.error = false;
                response.message = messages.resize_image;
                response.data = destination;
            }
            console.log(response);
            callback(response);
        });
    }



}

module.exports = new CommonUtility();