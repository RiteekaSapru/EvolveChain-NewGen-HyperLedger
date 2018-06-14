require("./main").config("configEnv.env");
const path = require("path");
const status = require('./status');
const messages = require('./messages');
const appConfig = require('./app_configurations');

// const admin_messages = require('./admin_messages');
// const merchant_messages = require('./merchant_messages');


const BASE_PATH = path.join(__dirname + "./../");
const PUBLIC_PATH = BASE_PATH +'public';
const EMAIL_TEMPLATES_PATH = BASE_PATH + "templates/emails";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;

const BASE_URL = process.env.APP_URL+":"+PORT;
const MONGODB_URL= process.env.MONGO_URL;
const APP_NAME = process.env.APP_NAME;

const SITE_IMAGES = BASE_URL+'/public/images/';
const USER_IMAGE = 'public/images/user/';

const FROM_EMAIL = APP_NAME + ' <'+process.env.SMTP_FROM+'>'
var d = new Date();
var current_year = d.getFullYear();

const FTP_URL = '';
const COMPANY_URL = BASE_URL+'/public/webroot';
const web_site = BASE_URL+'/public/web';

const MAIL_1 = 'nilam@'+process.env.COMPANY_DOMAIN;
const MAIL_2 = 'joeld@'+process.env.COMPANY_DOMAIN;
const MAIL_3 = 'webmaster@'+process.env.COMPANY_DOMAIN;
const MAIL_4 = 'admin@'+process.env.COMPANY_DOMAIN;

const appLogoUrl = 'https://cdn1.imggmi.com/uploads/2018/6/12/17ae56b9e9ca9293bc3d54cd879a816a-full.png';
//const appLogoUrl = SITE_IMAGES + '/logo.png';


module.exports = {
  port: PORT,
  base_path: BASE_PATH,
  base_url: BASE_URL,
  app_name:APP_NAME,
  FROM_EMAIL: FROM_EMAIL, 
  current_year: current_year,
  status: status,
  ERROR_CODES: appConfig.ERROR_CODE,
  HTTP_STATUSES: appConfig.HTTP_STATUS,
  APP_STATUSES: appConfig.APP_STATUS,
  VERIFICATION_REASONS: appConfig.VERIFICATION_REASON, 
  messages: messages,
  FTP_URL: FTP_URL,
  MONGODB_URL: MONGODB_URL,
  COMPANY_URL: COMPANY_URL,
  PUBLIC_PATH: PUBLIC_PATH,
  EMAIL_TEMPLATES_PATH:EMAIL_TEMPLATES_PATH,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_MOBILE: process.env.TWILIO_MOBILE,
  web_site: web_site,
  DB_NAME: DB_NAME,
  OTP_EXPIRY_MINS:30,
  APP_LOGO_URL:appLogoUrl ,
  HL_URL : process.env.HL_URL,
  APP_EXPIRATION_DAYS : process.env.APP_EXPIRATION_DAYS
};
