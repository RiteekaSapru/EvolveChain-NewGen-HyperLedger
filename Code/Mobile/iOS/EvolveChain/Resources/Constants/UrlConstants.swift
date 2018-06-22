//
//  UrlConstants.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import Foundation
final class UrlConstants: NSObject {
    
    private override init() {
        
    }
    
    // MARK: Application Details
    
   static let app_store_ID        = "123456"
   static let  app_iTunes_URL      = "https://itunes.apple.com/us/app/id\(app_store_ID)"
    
   static let support_and_feedback_page_url  = "https://evolvechain.org/support/index"
    
   static let website_url  = "https://evolvechain.org"
    
    static let terms_url  = website_url + "/terms"
    
    static let privacy_url  = website_url + "/privacy"

    
    //MARK : URLs
    static let kLocalURL : String = {
        if _userDefault.object(forKey: kApplicationURL) != nil{
            return RawdataConverter.string(_userDefault.object(forKey: kApplicationURL))
        }
        else{
            return "http://192.168.60.130:4600"
        }
    }()
    
    static let countryListURL = BaseURL + "/web/getcountrylist"
    
    static let initaliseURL = BaseURL + "/app/initialize"
    
    static let generateEmailOtpURL = kLocalURL + "/app/generateEmailOtp/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let verifyEmailOtpURL = kLocalURL + "/app/verifyemail/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let generateMobileOtpURL = kLocalURL + "/app/generateMobileOTP/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let verifyMobileOtpURL = kLocalURL + "/app/verifymobile/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let saveKYCDetails = kLocalURL + "/kyc/saveKycDocument/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let submitKYCDetails = kLocalURL + "/kyc/SubmitKycDocument/"
    
    static let generatePinURL = kLocalURL + "/app/GeneratePin"
    static let setPinURL = kLocalURL + "/app/SetPin"
    static let loginURL = kLocalURL + "/app/Login"
    static let getKycIdURL = kLocalURL + "/app/GetEkycId"
    
    
    static let changePinURL = kLocalURL + "/app/ChangePin"
    
    static let getEditOTPURL = kLocalURL + "/app/resubmitverification"
    static let resubmitEditOTPURL = kLocalURL + "/app/resubmitinitialize"
    
    

}
