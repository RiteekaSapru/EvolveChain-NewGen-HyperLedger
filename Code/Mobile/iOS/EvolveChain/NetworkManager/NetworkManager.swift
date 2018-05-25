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
    
    
    
    func initialiseAPI(success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) {
        
        
        let url = kLocalURL+initaliseURL
        var ipAdd = GlobalMethods.sharedInstance.getIFAddresses();
        
        var param :[String: Any]  = [:]
        param["device_type"]    = "iOS"
        param["os_version"]     = UIDevice.current.systemVersion
        param["os"]             = UIDevice.current.systemName
        param["device_name"]    = UIDevice.current.modelSJName
        param["ip"]             = ipAdd[1];
        param["vendor_uuid"]    = UIDevice.current.identifierForVendor?.uuidString
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: param, method: .POST, success: { (data, response, error, responseJSON) in
            success(responseJSON)
        }) { (data, response, error, errorMsg) in
           failure(errorMsg)
        }
    }
    
    // MARK: - Verification
    
    func generateEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generateEmailOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
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
    
    func verifyEmailOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+verifyEmailOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        

        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    func generateMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generateMobileOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
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
    
    
    
    func verifyMobileOTP(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+verifyMobileOtpURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        RequestManager.sharedInstance.makeAPICall(url: url, params: params, method: .POST, success: { (data, response, error, responseJSON) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                success(responseJSON)
            })
            
        }) { (data, response, error, errorMsg) in

                failure(errorMsg)

            
        }
    }
    
    // MARK: - Save KYC
    
    func POSTBasicDetails(params:Dictionary<String,Any>,fileArray:[UIImage],filenameArray:[String],success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+saveKYCDetails+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
         GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
        
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
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
        
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
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
        
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
    
    // MARK: - Generate Pin
    
    func generateOtpForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+generatePinURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
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
    
    func setPinForKydId(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+setPinURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
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
    
    func loginAPI(params:Dictionary<String,Any>,success:@escaping ( Dictionary<String,Any> ) -> Void, failure: @escaping (String? )-> Void) -> Void {
        
        let url = kLocalURL+setPinURL+RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))
        
        GlobalMethods.sharedInstance.showLoader(loadingText: stringLoader)
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
}
