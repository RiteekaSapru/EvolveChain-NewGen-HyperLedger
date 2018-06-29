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
    
    
    static let countryListURL = BaseURL + "/web/getcountrylist"
    
    static let initaliseURL = BaseURL + "/app/initialize"
    
    static let generateEmailOtpURL = BaseURL + "/app/generateEmailOtp/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let verifyEmailOtpURL = BaseURL + "/app/verifyemail/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let generateMobileOtpURL = BaseURL + "/app/generateMobileOTP/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let verifyMobileOtpURL = BaseURL + "/app/verifymobile/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let saveKYCDetails = BaseURL + "/kyc/saveKycDocument/" + RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
    static let submitKYCDetails = BaseURL + "/kyc/SubmitKycDocument/"
    
    static let generatePinURL = BaseURL + "/app/GeneratePin"
    static let setPinURL = BaseURL + "/app/SetPin"
    static let loginURL = BaseURL + "/app/Login"
    static let getKycIdURL = BaseURL + "/app/GetEkycId"
    
    
    static let changePinURL = BaseURL + "/app/ChangePin"
    
    static let getEditOTPURL = BaseURL + "/app/resubmitverification"
    static let resubmitEditOTPURL = BaseURL + "/app/resubmitinitialize"
    
}
