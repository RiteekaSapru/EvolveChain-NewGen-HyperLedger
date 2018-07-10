//
//  Strings.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 14/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

final class StringConstants: NSObject {
    
    private override init() {
        
    }
//    func getBaseURL() -> String {
//        if <#condition#> {
//            <#code#>
//        }
//    }
    // MARK : Strings
    
   static let AppName = "EvolveChain"
    
    static let NoInternet = "Please check internet connectivity and retry."
   static let NoGallery = "Please provide permission to access Gallery."
    static let NoCamera = "Please provide permission to access Camera."

   static let UnderDevelopment = "This feature is under development."
   static let Loader = "   Loading..."
   static let OTPLoader = "   Waiting for OTP..."
   static let Saving = "   Saving..."
    
    static let okText = "Ok"
    static let APIFailureText = "Oops! Something went wrong."
    
   static let EmailEmpty = "Please enter your email."
   static let PhoneEmpty = "Please enter your contact number."
   static let PhoneInvalid = "Please enter valid contact number."
    
   static let Error = "Error"
   static let EmailInvalid = "Please enter a valid email id."
   static let OtpEmpty = "Please enter OTP."
   static let FnameEmpty = "Please enter your first name."
   static let MnameEmpty = "Please enter your middle name."
   static let LnameEmpty = "Please enter your last name."
   static let GenderEmpty = "Please select your gender."
    
    
   static let FnameIncorrect = "Please enter valid first name."
   static let LnameIncorrect = "Please enter valid last name."
   static let MnameIncorrect = "Please enter valid middle name."
    
    
   static let DOBEmpty = "Please select your date of birth."
   static let BirthStateEmpty = "Please enter your birth place."
   static let BirthCountryEmpty = "Please enter your birth country."
   static let AddStreetEmpty = "Please enter your street."
   static let CityEmpty = "Please enter your city."
    
    
   static let EmailNotVerified = "Please add your email."
   static let PhoneNotVerified = "Please add your contact number."
   static let UserPicEmpty = "Please add your profile image."
   static let IdentityExpiryEmpty = "Please enter expiry date."
   static let IdentityFrontPicEmpty = "Please select front picture."
   static let IdentityBackPicEmpty = "Please select back picture."
    static let BothPicEmpty = "Please select front and back picture."

    
   static let NumberEmpty = "Please enter document number."
   static let NumberIncorrect = "Please enter valid document number."
    
   static let BillTypeEmpty = "Please select bill type."
    
    
   static let Add1Empty = "Please enter address."
   static let Add2Empty = "Please enter address."
   static let StateEmpty = "Please enter state."
   static let CountryEmpty = "Please select country"
   static let AreaCodeEmpty = "Please enter zip code."
   static let AreaCodeIncorrect = "Please enter valid zip code."
    
   static let KYCIDEmpty = "Please enter eKYC Id."
   static let PinEmpty = "Please enter pin."
   static let RePinEmpty = "Please re-enter pin."
   static let PinNotMatch = "Pin does not match."
    
//   static let BasicNotSaved = "Please complete your Profile details before submitting."
//   static let IdentityNotSaved = "Please complete and save Identity details before submitting."
//   static let AddressNotSaved = "Please complete and save Address details before submitting."
//    static let UpholdingNotSaved = "Please save Document Holding Photo before submitting."
    static let RegisterNotComplete = "Please complete and save all documents before submitting."

    
   static let UpholdingInfo = "Take a selfie while holding your identity document that you used to fill in the Verification form.\n\nBefore uploading an image on the Verification form, please make sure to follow photo requirements:\n\nYou are looking straight at the camera.\nYour background has a light, neutral colour.\nYour selfie is in colour.\nNo red eye!\nDO NOT wear sunglasses, a hat or a headband.\nVerification Code \(ConfigModel.shared.verificationCode) must be clearly visible."
    
   static let UpholdingMissing = "Please select a picture."
    
    static let PinChangeText = " For security reasons, kindly login again."
    
    static let RegistrationComplete = "Your application has been registered with us. You will recieve your eKYC-ID on your registered email after successfull verification."
}
