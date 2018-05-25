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
let saveKYCDetails = "/kyc/saveKycDocument/"

let generatePinURL = "/app/GeneratePin/"
let setPinURL = "/app/SetPin/"

let loginURL = "/app/Login/"


// MARK : Colors

let color_green = UIColor.init(red: 5.0/255.0, green: 104.0/255, blue: 57.0/255.0, alpha: 1.0)
let color_blue = UIColor.init(red: 15.0/255.0, green: 117.0/255.0, blue: 189.0/255.0, alpha: 1.0)


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

let stringFnameIncorrect = "Please enter correct first name."
let stringLnameIncorrect = "Please enter correct last name."
let stringMnameIncorrect = "Please enter correct middle name."


let stringDOBEmpty = "Please enter your date of birth."
let stringBirthStateEmpty = "Please enter your birth place."
let stringBirthCountryEmpty = "Please enter your birth country."
let stringAddStreetEmpty = "Please enter your street."
let stringCityEmpty = "Please enter your city."


let stringEmailNotVerified = "Please add your email."
let stringPhoneNotVerified = "Please add your contact number."
let stringUserPicEmpty = "Please add your picture."
let stringPassportNumberEmpty = "Please enter passport number."
let stringIdentityExpiryEmpty = "Please enter expiry date."
let stringIdentityFrontPicEmpty = "Please select front picture."
let stringIdentityBackPicEmpty = "Please select back picture."
let stringDrivingNumberEmpty = "Please enter drinving license number."

let stringNumberEmpty = "Please enter document number."
let stringBillTypeEmpty = "Please select bill type."


let stringAdd1Empty = "Please enter address."
let stringAdd2Empty = "Please enter address."
let stringStateEmpty = "Please enter state."
let stringCountryEmpty = "Please enter country."
let stringAreaCodeEmpty = "Please enter zip code."
let stringUtilityEmpty = "Please select image."
let stringSSNIDEmpty = "Please enter SSN ID."

let stringTaxationIDEmpty = "Please enter taxation ID."

let stringPayPalIDEmpty = "Please enter PayPal ID."
let stringAccountNumberIDEmpty = "Please enter account number."
let stringIFSCEmpty = "Please enter IFSC."
let stringBankNameIDEmpty = "Please enter bank name."

let stringKYCIDEmpty = "Please enter KYC Id."
let stringPinEmpty = "Please enter pin."
let stringRePinEmpty = "Please re-enter pin."
let stringPinNotMatch = "Pin does not match."

let stringBasicNotSaved = "Please complete and save Basic details first."
let stringIdentityNotSaved = "Please complete and save Identity details first."
let stringAddressNotSaved = "Please complete and save Address details first."
