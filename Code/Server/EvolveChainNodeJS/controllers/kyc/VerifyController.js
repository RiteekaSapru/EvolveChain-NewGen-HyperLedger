const fs = require("fs");
const ejs = require('ejs');
const path = require("path");
const _ = require('lodash');
const async = require('async');
const config = require('config');
const status = config.get('status');
const messages = config.get('messages');
const utility = require('../../config/utility');
var ObjectId = require('mongodb').ObjectID;
var mongo = require('mongodb');
const md5 = require('md5');
const App = require('../../models/apps');
const Document = require('../../models/document');
const Question = require('../../models/question');
const File = require('../../models/files');
var templatesjs = require('templatesjs');

var bucket;
mongo.MongoClient.connect(config.get('MONGODB_URL'), function(err, db) {
    if(err){
        console.log("Database....." + err);  
    }
    else{
        database = db.db(config.get('DB_NAME'));
        bucket = new mongo.GridFSBucket(database);
    }
});

const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
    test: {
        new: 1,
        old: 0
    }
}

class Verify {
    
    async kycVerify(req, res) {
        try{
        	var obj = new Verify();
             
            let key = req.params.key;

            Question.findOne({},(error, question) => {
                if (error){
                    console.log(`Error :: ${error}`);
                    error = `Error :: ${error}`;
                    return res.status(status.OK).json({ 'success': 0, "error": error });
                }
                    
                if (!question) return res.redirect(config.get('base_url'));
                
                list.qst_basic_upload = [question.Basic.Uploaded[0],question.Basic.Uploaded[1]];
                list.qst_basic_correct = [question.Basic.Correct[0],question.Basic.Correct[1]]
                
                
                var conditions = {
                    key: key
                }
                App.findOne(conditions,(error, app) => {
                    
                    if (error){
                        console.log(`Error :: ${error}`);
                        error = `Error :: ${error}`;
                        return res.status(status.OK).json({ 'success': 0, "error": error });
                    }
                        
                    if (!app) return res.redirect(config.get('base_url'));

                    let document_query = {
                        hash: app.hash
                    }

                    Document.findOne(document_query,(error, docData) =>{
                    
                        if (error){
                            error = `Error :: ${error}`;
                            return res.status(status.OK).json({ 'success': 0, "error": error });
                        }
                            
                        if (!docData) return res.redirect(config.get('base_url'));

                        var doc = docData;
                        //console.log(question.Basic.Uploaded[1]);return false;
                        //var basic_upload_0 = (question.Basic.Uploaded[0] == doc.Verify.Basic.Uploaded) ? 'checked': '';
                        //var basic_upload_5 = (question.Basic.Uploaded[1] == doc.Verify.Basic.Uploaded) ? 'checked': '';

                        list.basic_document = {
                            first: doc.details.Name.first,
                            middle: doc.details.Name.middle,
                            last: doc.details.Name.last,
                            mobile: doc.details.Mobile,
                            email: doc.email,
                            dob: doc.details.Birth.date,
                            basic_upload_0: (question.Basic.Uploaded[0] == doc.Verify.Basic.Uploaded) ? 'checked': '',
                            basic_upload_5: (question.Basic.Uploaded[1] == doc.Verify.Basic.Uploaded) ? 'checked': ''
                        };
                        //list.basic_document = doc.details.Name;

                        var document_id = doc._id.toString();
                        
                        var total_score = 0;
                        if(!_.isUndefined(doc.verify) && !_.isUndefined(doc.verify.verified))
                        {
                            total_score = doc.Verify.Score;
                        }
                        if(!_.isUndefined(doc.verify) && !_.isUndefined(doc.verify.verified))
                        {
                            if(doc.verify.verified == "Yes") return res.redirect(config.get('base_url'));return false;
                        }

                        // create data list
                        list.total_socre = total_score;
                        list.basic_socre = doc.Verify.Basic.Uploaded + doc.Verify.Basic.Correct;
                            

                        var files = ['profile_img', 'address_proof', 'passport1', 'passport2', 'identity1', 'identity2',
                                    'tax1', 'drivinglicence1', 'hold_img'];
                        var all_documents = {'profile_img': '', 'address_proof':'', 'passport1': '', 'passport2': '', 'identity1': '', 
                                            'identity2': '', 'tax1': '', 'drivinglicence1': '', 'hold_img': ''};
                        async.eachSeries(files, function (file, outerCallback) { // for get all images
                            obj.getDocumentImage(document_id, file, function(image) {
                            
                                if(image.error == false){ // check image available or not                                    
                                    all_documents[file]= image.data;
                                }else{
                                    all_documents[file]= config.get('COMPANY_URL')+'/documents/no_image.png';
                                }
                                outerCallback();
                            })
                        },function(){
                            list.images = all_documents;
                            console.log(list);
                            fs.readFile("./views/web/verifiy.html", function(err,data){
                                if(err) throw err
                                templatesjs.set(data, function(err,data){
                                    if(err) throw err;
                                    
                                    templatesjs.renderAll(list, function(err,data){
                                        if(err) throw err;
                                        //console.log(data);
                                        res.write(data);
                                        res.end(); // or Do something else with the data
                                    
                                    });
                                });
                            });

                        });
                    })
                })
            })
        }catch(e){
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.OK).json({ 'success': 0, "error": err });
        }
    }

    // get KYC documents images
    async getDocumentImage(id=null, type=null, callback) 
    {
        let response = {
            'error': true,
            'data' : [],
            'message': messages.something_wentwrong,
        }
        var file_field = 'details_'+type+'_id';
        var conditions = {
            [file_field]: id
        }
        File.findOne(conditions, (error, fileData) =>{
                
            if (error){

                let err = `Error :: ${error}`;
                response.message = err;
                callback(response);

            }else if (!fileData){
                
                response.message = messages.app_not_found;
                callback(response);

            }else{
                
                var image_name_name = fileData._id+'_'+fileData.filename;
                var path = 'public/webroot/documents/'+image_name_name;
                var return_path = config.get('COMPANY_URL')+'/documents/'+image_name_name;

                bucket.openDownloadStream(fileData._id)
                    .pipe(fs.createWriteStream(path))
                    .on('error', function(error) {
                        assert.ifError(error);
                        response.message = err;
                    })
                    .on('finish', function() {
                        
                        response.error = false;
                        response.message = messages.image_data;
                        response.data = return_path;
                        callback(response); 
                    });
            }
        });
    }
}

module.exports = new Verify();