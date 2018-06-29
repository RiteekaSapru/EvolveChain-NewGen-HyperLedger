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

func print(_ items: Any..., separator: String = " ", terminator: String = "\n") {
     #if DEBUG
    Swift.print(items[0], separator:separator, terminator: terminator)
    #endif
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


// MARK: User Default keys
let kDeviceTokenKey        =        "kDeviceTokenKey"
let kApplicationURL        =        "app_url"
let kSettingsBundleURL        =     "app_url_settings"

let kApplicationKey       =        "kApplicationKey"

let kApplicationKycIdKey       =        "kApplicationKycIdKey"
let kApplicationPinKey       =        "kApplicationPinKey"
let kApplicationInitConfigKey       =        "kApplicationInitConfigKey"
let kUserPhoneKey       =        "kUserPhoneKey"
let kUserISDCodeKey       =        "kUserISDCodeKey"






var BaseURL = RawdataConverter.string(_userDefault.object(forKey: kApplicationURL))
