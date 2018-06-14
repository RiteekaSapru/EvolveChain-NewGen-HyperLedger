//
//  Constants.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class Constants: NSObject {

    
}

// MARK: - Error Codes

enum ErrorCode : String {
    case ERROR = "E00"
    case DEVICE_MISMATCH = "E01"
    case INCORRECT_PIN = "E02"
    case INCORRECT_OTP = "E03"
    case INCORRECT_KEY = "E04"
    case INCORRECT_EKYCID = "E05"
    case INVALID_REQUEST = "E06"
    case APP_NOT_FOUND = "E07"
    case DOCUMENT_NOT_FOUND = "E08"
    case SAME_PIN = "E09"
    case EXCEPTION = "E100"
    case EXPIRED_APP_STATUS = "E21"
}

// MARK: - Shorthands

let _screenSize     = UIScreen.main.bounds.size
let _screenFrame    = UIScreen.main.bounds

let _defaultCenter  = NotificationCenter.default
let _userDefault    = UserDefaults.standard
let _appDelegator   = UIApplication.shared.delegate! as! AppDelegate
let _navigator   = _appDelegator.navigator!
let _application    = UIApplication.shared

let service = "EvolveService"
let account = "EvolveAccount"

// MARK: Application Details

let app_store_ID        = "123456"
let app_iTunes_URL      = "https://itunes.apple.com/us/app/id\(app_store_ID)"

let support_and_feedback_page_url  = "https://evolvechain.org/support/index"

let website_url  = "https://evolvechain.org"

let terms_url  = "https://evolvechain.org/terms"

let privacy_url  = "https://evolvechain.org/privacy"

// MARK: User Default keys
let kDeviceTokenKey        =        "kDeviceTokenKey"
let kApplicationURL        =        "app_url"
let kApplicationSettingsURL        =        "app_url_settings"
let kApplicationKey       =        "kApplicationKey"

let kApplicationKycIdKey       =        "kApplicationKycIdKey"
let kApplicationPinKey       =        "kApplicationPinKey"
let kApplicationUserDetailsKey       =        "kApplicationUserDetailsKey"
let kApplicationInitConfigKey       =        "kApplicationInitConfigKey"
let kUserPhoneKey       =        "kUserPhoneKey"
let kUserISDCodeKey       =        "kUserISDCodeKey"


//MARK : URLs
let kLocalURL                     = "http://192.168.60.130:4600"

let countryListURL = "/web/getcountrylist"

let initaliseURL = "/app/initialize"

let generateEmailOtpURL = "/app/generateEmailOtp/"
let verifyEmailOtpURL = "/app/verifyemail/"
let generateMobileOtpURL = "/app/generateMobileOTP/"
let verifyMobileOtpURL = "/app/verifymobile/"
let saveKYCDetails = "/kyc/saveKycDocument/"
let submitKYCDetails = "/kyc/SubmitKycDocument/"


let generatePinURL = "/app/GeneratePin"
let setPinURL = "/app/SetPin"
let loginURL = "/app/Login"
let getKycIdURL = "/app/GetEkycId"


let changePinURL = "/app/ChangePin"

let getEditOTPURL = "/app/resubmitverification"
let resubmitEditOTPURL = "/app/resubmitinitialize"


// MARK : Colors

let color_green = UIColor.init(red: 5.0/255.0, green: 104.0/255, blue: 57.0/255.0, alpha: 1.0)
let color_blue = UIColor.init(red: 15.0/255.0, green: 117.0/255.0, blue: 189.0/255.0, alpha: 1.0)


