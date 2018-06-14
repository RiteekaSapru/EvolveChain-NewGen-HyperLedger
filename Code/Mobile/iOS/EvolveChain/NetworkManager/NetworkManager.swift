//
//  NetworkManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class NetworkManager: NSObject {
    
static let sharedInstance = NetworkManager()
    
    
    func countryListAPI(success:@escaping ( Array<Any> ) -> Void, failure: @escaping (String? )-> Void) {
        
//        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Loader)
        let url = kLocalURL+countryListURL
       
        RequestManager.sharedInstance.makeGetAPICall(url: url, params: nil, method: .GET, success: { (data, response, error, responseJSON) in
//            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
//            })
        }) { (data, response, error, errorMsg) in
//            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
//            })
        }
    }
    
    func initialiseAPI(success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) {
        
         GlobalMethods.sharedInstance.showLoader(loadingText: "   Loading...")
        let url = kLocalURL+initaliseURL
        var ipAdd = GlobalMethods.sharedInstance.getIFAddresses();
        
        var param :[String: Any]  = [:]
        param["device_type"]    = "iOS"
        param["os_version"]     = UIDevice.current.systemVersion
        param["os"]             = UIDevice.current.systemName
        param["device_name"]    = UIDevice.current.modelSJName
        param["ip"]             = ipAdd[1];
        param["vendor_uuid"]    = GlobalMethods.sharedInstance.getUniqueIdForDevice()
        
        param["latitude"]    = GlobalMethods.sharedInstance.getLocation().lat
        param["longitude"]    = GlobalMethods.sharedInstance.getLocation().long
        param["network_provider"]    = GlobalMethods.sharedInstance.getCarrierName()
        param["iso_country_code"]    = GlobalMethods.sharedInstance.getISOCountryCode()
        param["mobile_country_code"]    = GlobalMethods.sharedInstance.getMobileCountryCode()
        param["mobile_network_code"]    = GlobalMethods.sharedInstance.getMobileNetworkCode()

        param["country_iso"]    = SignupConfigModel.sharedInstance.selectedCountry.iso
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: param, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    // MARK: - Verification
    
    func generateEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generateEmailOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            //GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            //})
            
        }) { (data, response, error, errorMsg) in
            //GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
           // })
            
        }
    }
    
    func verifyEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+verifyEmailOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        

        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            //GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            //})
            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    func generateMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generateMobileOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
//        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Loader)
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
//            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
//            })
            
        }) { (data, response, error, errorMsg) in
//            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
//            })
            
        }
    }
    
    
    
    func verifyMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+verifyMobileOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            //GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            //})
            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    // MARK: - Save KYC
    
    func POSTBasicDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+saveKYCDetails+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
         GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.sharedInstance.requestToUploadImagesWithParams(url: url, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTIdentityDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+saveKYCDetails+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.sharedInstance.requestToUploadImagesWithParams(url: url, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTAddressDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+saveKYCDetails+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.sharedInstance.requestToUploadImagesWithParams(url: url, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTUpholdingDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+saveKYCDetails+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.Saving)
        
        RequestManager.sharedInstance.requestToUploadImagesWithParams(url: url, params: params, images: fileArray, fileNames: filenameArray, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
        }
    }
    
    func POSTKYCComplete(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+submitKYCDetails//+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Sending for approval...")
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
            
        }
        
    }
    
    // MARK: - Login Module
    
    func generateOtpForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generatePinURL//+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.OTPLoader)
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg)
            })
            
        }
    }
    
    func setPinForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+setPinURL//+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Saving Pin...")
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
    func loginAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping( String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+loginURL//+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Logging In...")
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJson) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJson)
            })
        }) { (data, response, error, errorMsg) in
           
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
    
        }
    }
    
    func getKycIdAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping( String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+getKycIdURL//+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Fetching KYC Id...")
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJson) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJson)
            })
        }) { (data, response, error, errorMsg) in
            
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
      // MARK: - Post Login Module
    
    func changePinAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+changePinURL
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Saving Pin...")
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
     // MARK: - Edit Module
    
    func getEditOTPAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+getEditOTPURL
        
        GlobalMethods.sharedInstance.showLoader(loadingText: StringConstants.OTPLoader)
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
    
    func verifyEditOTPAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String?,Data? )-> Void) -> Void {
        
        let url = kLocalURL+resubmitEditOTPURL
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Verifing OTP...")
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                failure(errorMsg,data)
            })
            
        }
    }
}
