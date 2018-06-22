//
//  NetworkManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class NetworkManager: NSObject {
    
static let shared = NetworkManager()
    
    var progressComplete: (CGFloat)->Void = {_ in }
    
    func countryListAPI(success:@escaping ( Array<Any> ) -> Void, failure: @escaping (String? )-> Void) {
         print("Base URL - " + BaseURL)
       
        RequestManager.shared.makeGetAPICall(url: UrlConstants.countryListURL, params: nil, method: .GET, success: { (data, response, error, responseJSON) in

                success(responseJSON)

        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

        }
    }
    
    func initialiseAPI(success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) {
        
         GlobalMethods.shared.showLoader(loadingText: "   Loading...")
        var ipAdd = GlobalMethods.shared.getIFAddresses();
        
        var param :[String: Any]  = [:]
        param["device_type"]    = "iOS"
        param["os_version"]     = UIDevice.current.systemVersion
        param["os"]             = UIDevice.current.systemName
        param["device_name"]    = UIDevice.current.modelSJName
        param["ip"]             = ipAdd[1];
        param["vendor_uuid"]    = GlobalMethods.shared.getUniqueIdForDevice()
        
        param["latitude"]    = GlobalMethods.shared.getLocation().lat
        param["longitude"]    = GlobalMethods.shared.getLocation().long
        param["network_provider"]    = GlobalMethods.shared.getCarrierName()
        param["iso_country_code"]    = GlobalMethods.shared.getISOCountryCode()
        param["mobile_country_code"]    = GlobalMethods.shared.getMobileCountryCode()
        param["mobile_network_code"]    = GlobalMethods.shared.getMobileNetworkCode()

        param["country_iso"]    = SignupConfigModel.shared.selectedCountry.iso
       
        RequestManager.shared.makeAPICall(url: UrlConstants.initaliseURL, params: param, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    // MARK: - Verification
    
    func generateEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
       
        RequestManager.shared.makeAPICall(url: UrlConstants.generateEmailOtpURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
         
                success(responseJSON)

            
        }) { (data, response, error, errorMsg) in
          
                failure(errorMsg)
            
        }
    }
    
    func verifyEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
    
        RequestManager.shared.makeAPICall(url: UrlConstants.verifyEmailOtpURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
 
                success(responseJSON)

            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    func generateMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
    
        RequestManager.shared.makeAPICall(url: UrlConstants.generateMobileOtpURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
                success(responseJSON)
            
        }) { (data, response, error, errorMsg) in
                failure(errorMsg)
            
        }
    }
    
    
    
    func verifyMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
   
        RequestManager.shared.makeAPICall(url: UrlConstants.verifyMobileOtpURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
                success(responseJSON)

            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    // MARK: - Save KYC
    
    func POSTBasicDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
    
         GlobalMethods.shared.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.shared.progressComplete = { progress in
            self.progressComplete(progress)
        }
        
      
        RequestManager.shared.requestToUploadImagesWithParams(url: UrlConstants.saveKYCDetails, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTIdentityDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
   
        GlobalMethods.shared.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.shared.progressComplete = { progress in
            self.progressComplete(progress)
        }
        
      
        
        RequestManager.shared.requestToUploadImagesWithParams(url: UrlConstants.saveKYCDetails, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTAddressDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        
        GlobalMethods.shared.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.shared.progressComplete = { progress in
            self.progressComplete(progress)
        }
        
        RequestManager.shared.requestToUploadImagesWithParams(url: UrlConstants.saveKYCDetails, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTUpholdingDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
      
        GlobalMethods.shared.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.shared.progressComplete = { progress in
            self.progressComplete(progress)
        }
        
        RequestManager.shared.requestToUploadImagesWithParams(url: UrlConstants.saveKYCDetails, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTKYCComplete(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
     
        GlobalMethods.shared.showLoader(loadingText: "   Sending for approval...")
        
        RequestManager.shared.makeAPICall(url: UrlConstants.submitKYCDetails, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
            
        }
        
    }
    
    // MARK: - Login Module
    
    func generateOtpForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
      
        GlobalMethods.shared.showLoader(loadingText: StringConstants.OTPLoader)
        RequestManager.shared.makeAPICall(url: UrlConstants.generatePinURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg)
            })
            
        }
    }
    
    func setPinForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
     
        GlobalMethods.shared.showLoader(loadingText: "   Saving Pin...")
        RequestManager.shared.makeAPICall(url: UrlConstants.setPinURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
    func loginAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping( String?,Data? )-> Void) -> Void {
        
        
        GlobalMethods.shared.showLoader(loadingText: "   Logging In...")
        
        RequestManager.shared.makeAPICall(url: UrlConstants.loginURL, params: params, method: .POST, success: { (data, response, error, responseJson) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJson)
            })
        }) { (data, response, error, errorMsg) in
           
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
    
        }
    }
    
    func getKycIdAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping( String?,Data? )-> Void) -> Void {
        
     
        GlobalMethods.shared.showLoader(loadingText: "   Fetching KYC Id...")
        
        RequestManager.shared.makeAPICall(url: UrlConstants.getKycIdURL, params: params, method: .POST, success: { (data, response, error, responseJson) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJson)
            })
        }) { (data, response, error, errorMsg) in
            
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
      // MARK: - Post Login Module
    
    func changePinAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        
        GlobalMethods.shared.showLoader(loadingText: "   Saving Pin...")
        RequestManager.shared.makeAPICall(url: UrlConstants.changePinURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
     // MARK: - Edit Module
    
    func getEditOTPAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        
        GlobalMethods.shared.showLoader(loadingText: StringConstants.OTPLoader)
        RequestManager.shared.makeAPICall(url: UrlConstants.getEditOTPURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
    func verifyEditOTPAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
      
        GlobalMethods.shared.showLoader(loadingText: "   Verifing OTP...")
        RequestManager.shared.makeAPICall(url: UrlConstants.resubmitEditOTPURL, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.shared.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.shared.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
}


