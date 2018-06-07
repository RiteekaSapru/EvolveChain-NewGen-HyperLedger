var randomstring = require("randomstring");
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const status = config.get('status');
const messages = config.get('messages');
var ObjectId = require('mongodb').ObjectID;
var templatesjs = require('templatesjs');
const PUBLIC_PATH = config.get('PUBLIC_PATH');
const Country = require('../../models/country');
const baseController = require('../BaseController');
const list = {
    SITE_NAME: config.get('app_name'),
    web_site: config.get('web_site'),
}

class Web  extends baseController{

    async GetCountryList(req, res) {
        var countries  = await Country.find();
        //res.send(countries);
        return res.status(status.OK).jsonp(countries);
    }
   

    async index(req, res) {
        try {
            fs.readFile("./views/web/index.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async about(req, res) {
        try {
            fs.readFile("./views/web/about.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async contact(req, res) {
        try {
            fs.readFile("./views/web/contact.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }

    async download(req, res) {
        try {
            fs.readFile("./views/web/download.html", function (err, data) {
                if (err) throw err
                templatesjs.set(data, function (err, data) {
                    if (err) throw err;

                    templatesjs.renderAll(list, function (err, data) {
                        if (err) throw err;
                        res.write(data);
                        res.end(); // or Do something else with the data

                    });
                });
            });
        } catch (e) {
            console.log(`Error :: ${e}`);
            let err = `Error :: ${e}`;
            return res.status(status.InternalServerError).json({ message: messages.error, error: err });
        }
    }


}

module.exports = new Web();