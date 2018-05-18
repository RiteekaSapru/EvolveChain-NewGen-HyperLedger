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

// MARK: - Shorthands

let _screenSize     = UIScreen.main.bounds.size
let _screenFrame    = UIScreen.main.bounds

let _defaultCenter  = NotificationCenter.default
let _userDefault    = UserDefaults.standard
let _appDelegator   = UIApplication.shared.delegate! as! AppDelegate
let _navigator   = _appDelegator.navigator!
let _application    = UIApplication.shared





let app_store_ID        = "123456"
let app_iTunes_URL      = "https://itunes.apple.com/us/app/id\(app_store_ID)"

let support_and_feedback_page_url  = "http://evolvechain.org/support/index"

let website_url  = "http://evolvechain.org"

// MARK: User Default keys
let kDeviceTokenKey        =        "kDeviceTokenKey"
let kApplicationURL        =        "app_url"
let kApplicationSettingsURL        =        "app_url_settings"
let kApplicationKey       =        "kApplicationKey"

//MARK : URLs
let kLocalURL                     = "http://192.168.60.130:4600"


let initaliseURL = "/app/initialize"

let generateEmailOtpURL = "/app/generateEmailOtp/"
let verifyEmailOtpURL = "/app/verifyemail/"
let generateMobileOtpURL = "/app/generateMobileOTP/"
let verifyMobileOtpURL = "/app/verifymobile/"


// MARK : Colors

let color_green = UIColor.init(red: 5.0/255.0, green: 104.0/255, blue: 57.0/255.0, alpha: 1.0)

// MARK : Strings
let stringAppName = "EvolveChain"

let stringNoInternet = "Please check internet connectivity and retry."
let stringUnderDevelopment = "This feature is under development."
let stringLoader = "Loading..."


let stringEmailEmpty = "Please enter email."
let stringPhoneEmpty = "Please enter phone number."
let stringError = "Error"
let stringEmailInvalid = "The email is not valid."
let stringOtpEmpty = "Please enter OTP."
let stringFnameEmpty = "Please enter first name."
let stringMnameEmpty = "Please enter middle name."
let stringLnameEmpty = "Please enter last name."
let stringEmailNotVerified = "Please add your email."
let stringPhoneNotVerified = "Please add your contact number."
let stringUserPicEmpty = "Please add your picture."
let stringPassportNumberEmpty = "Please enter passport number."
let stringIdentityExpiryEmpty = "Please enter expiry date."
let stringIdentityFrontPicEmpty = "Please select front picture."
let stringIdentityBackPicEmpty = "Please select back picture."
let stringDrivingNumberEmpty = "Please enter drinving license number."

let stringAdd1Empty = "Please enter drinving license number."
let stringAdd2Empty = "Please enter drinving license number."
let stringStateEmpty = "Please enter drinving license number."
let stringCountryEmpty = "Please enter drinving license number."
let stringAreaCodeEmpty = "Please enter drinving license number."
let stringUtilityEmpty = "Please enter drinving license number."

let stringTaxationIDEmpty = "Please enter drinving license number."

