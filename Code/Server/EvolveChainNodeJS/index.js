const config = require("config");
const path = require('path');
const express = require("express");
const mongoose = require('mongoose');
// var Grid = require('gridfs-stream');
const expressValidator = require("express-validator");
const routes = require('./routes');
var mongo = require('mongodb');
const logManager = require('./helpers/LogManager');
var morgan = require('morgan')
var fs = require('fs');

const status = config.get('status');
const PORT = config.get('port');
const base_url = config.get('base_url');

//For Scheduler Service
var schedular = require('./scheduler/EvolveChainScheduler');

const app = express();

// Cors Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "GET,POST, PATCH,DELETE, OPTIONS"
    // );
    next();
});

//logger functionality
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname + '/logs', 'access.log'), {flags: 'a'})
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// SET View Engine and View folder Path 
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static('dist'));
//app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));


// API & Web Routes
app.use("/app/", routes.app);
app.use("/kyc/", routes.kyc);
// app.use("/web/", routes.web);
app.use("", routes.web);

// Return 404 Response in Json for APIs
// app.use("/api/*", (req, res) => {
//     res.status(status.NotFound).json({ message: "Page not Found." });
// });

// app.use("*", (req, res) => {  
//     let data = {
//         SITE_NAME: config.get('app_name'),
//         BASE_URL: config.get('base_url')
//     };
//     //return res.render("shared/404.html", data);
// //    res.sendfile('./dist/index.html');
// });

app.use((req, res, next) => { 
    res.sendfile(path.join(__dirname, "dist","index.html"));
}); 

// connect to mongo database
mongoose.connection.openUri(config.get('MONGODB_URL'), function (err, db) {
    if (err) {
        console.log("Database Error....." + err);
    }
    // else{
    //     gfs = Grid(db, mongo);
    // }
});

mongoose.Promise = global.Promise;

const server = app.listen(PORT, () => {
    console.log(`EvolveChain Node Server Started @ ${base_url}`);
});

server.timeout = 300000; //5 minutes time out

process.on('uncaughtException', (err) => {
    logManager.Log("!!!Uncaught Exception!!! " + err.message);
});

