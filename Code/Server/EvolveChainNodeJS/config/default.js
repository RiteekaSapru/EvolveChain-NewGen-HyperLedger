require("./main").config("configEnv.env");
const path = require("path");
const status = require('./status');
const messages = require('./messages');
const admin_messages = require('./admin_messages');
const merchant_messages = require('./merchant_messages');


const BASE_PATH = path.join(__dirname + "./../");
const PUBLIC_PATH = BASE_PATH+'public';
const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;

const BASE_URL = process.env.APP_URL+":"+PORT;
const MONGODB_URL= process.env.MONGO_URL;
const APP_NAME = process.env.APP_NAME;

const SITE_IMAGE = BASE_URL+'/public/assets/images/';
const USER_IMAGE = 'public/images/user/';

const FROM_EMAIL = '"'+APP_NAME+'" <'+process.env.SMTP_FROM+'>'
var d = new Date();
var current_year = d.getFullYear();

const FTP_URL = '';
const documents_path = PUBLIC_PATH+'/webroot/documents'
const COMPANY_URL = BASE_URL+'/public/webroot';

const MAIL_1 = 'nilam@'+process.env.COMPANY_DOMAIN;
const MAIL_2 = 'joeld@'+process.env.COMPANY_DOMAIN;
const MAIL_3 = 'webmaster@'+process.env.COMPANY_DOMAIN;
const MAIL_4 = 'admin@'+process.env.COMPANY_DOMAIN;

// const MAIL_1 = 'gordhan@yudiz.com';
// const MAIL_2 = 'gordhan.c@yudiz.in';

const web_site = BASE_URL+'/public/web'


module.exports = {
  port: PORT,
  base_path: BASE_PATH,
  base_url: BASE_URL,
  app_name:APP_NAME,
  FROM_EMAIL: FROM_EMAIL,
  SITE_IMAGE: SITE_IMAGE,
  USER_IMAGE: USER_IMAGE,
  current_year: current_year,
  status: status,
  messages: messages,
  FTP_URL: FTP_URL,
  admin_messages: admin_messages,
  merchant_messages: merchant_messages,
  MONGODB_URL: MONGODB_URL,
  COMPANY_URL: COMPANY_URL,
  PUBLIC_PATH: PUBLIC_PATH,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_MOBILE: process.env.TWILIO_MOBILE,
  documents_path: documents_path,
  MAIL_1: MAIL_1,
  MAIL_2: MAIL_2,
  MAIL_3: MAIL_3,
  MAIL_4: MAIL_4,
  web_site: web_site,
  DB_NAME: DB_NAME,
  OTP_EXPIRY_MINS:30
};
