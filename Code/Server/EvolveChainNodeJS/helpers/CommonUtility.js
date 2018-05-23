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

    GetKycDocumentMetaDataInfo(document_type) {
        var metaDataInfo;
        switch (document_type) { //set to UPPER case
            case 'BASIC':
                metaDataInfo = { 'firstname': 'First Name', 'lastname': 'Last Name', 'middlename': 'Middle Name', 
                                'dob': 'Date Of Birth',
                                'city': 'City', 'address1':'Address 1', 'address2':'Address 2',
                                'place_of_birth': 'Birth Place', 'zip': 'Zip', 'state':'State', 'country': 'Country' };
                break;
            case 'IDENTITY':
            case 'ADDRESS':
                metaDataInfo = { 'document_type':'Title', 'number': 'First Name', 'expiry_date': 'Last Name', 'country': 'Middle Name', 'dob': 'Date Of Birth' };
                break;
            default:
                metaDataInfo = { 'firstname': 'First Name', 'lastname': 'Last Name', 'middlename': 'Middle Name', 'dob': 'Date Of Birth' };
                break;
        }
        return metaDataInfo;
    }



}

module.exports = new CommonUtility();