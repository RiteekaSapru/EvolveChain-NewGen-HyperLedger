//
//  RequestManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import SystemConfiguration


//HTTP Methods
enum HttpMethod : String {
    case  GET
    case  POST
    case  DELETE
    case  PUT
}

class RequestManager: NSObject {
     static let sharedInstance = RequestManager()
    
    var session : URLSession?

    func isConnectedToNetwork() -> Bool {
        
        var zeroAddress = sockaddr_in(sin_len: 0, sin_family: 0, sin_port: 0, sin_addr: in_addr(s_addr: 0), sin_zero: (0, 0, 0, 0, 0, 0, 0, 0))
        zeroAddress.sin_len = UInt8(MemoryLayout.size(ofValue: zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        
        let defaultRouteReachability = withUnsafePointer(to: &zeroAddress) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {zeroSockAddress in
                SCNetworkReachabilityCreateWithAddress(nil, zeroSockAddress)
            }
        }
        
        var flags: SCNetworkReachabilityFlags = SCNetworkReachabilityFlags(rawValue: 0)
        if SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) == false {
            return false
        }
        
        /* Only Working for WIFI
         let isReachable = flags == .reachable
         let needsConnection = flags == .connectionRequired
         
         return isReachable && !needsConnection
         */
        
        // Working for Cellular and WIFI
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        let ret = (isReachable && !needsConnection)
        
        return ret
        
    }
    
    
    func makeAPICall(url: String,params: Dictionary<String, Any>?, method: HttpMethod, success:@escaping ( Data? ,HTTPURLResponse?  , NSError? ,Dictionary<String,Any>) -> Void, failure: @escaping ( Data? ,HTTPURLResponse?  , NSError?,String? )-> Void) {
        
        if !isConnectedToNetwork() {
            failure(nil , nil , nil,stringNoInternet)
            return
        }
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        
        var request = URLRequest(url: URL(string: url)!)
        NSLog("URL = \(url)")
        
        if let params = params {
            
            let  jsonData = try? JSONSerialization.data(withJSONObject: params, options: .prettyPrinted)
            
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = jsonData//?.base64EncodedData()
            
        }
        
        request.httpMethod = method.rawValue

        
        URLSession.shared.dataTask(with: request as URLRequest) { (data, response, error) -> Void in
            
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
            
            if let data = data {
                
                if let response = response as? HTTPURLResponse, 200...299 ~= response.statusCode {
                    do {
                        if let jsonDict = try JSONSerialization.jsonObject(with: data, options : .allowFragments) as? Dictionary<String,Any>
                        {
                            print(jsonDict)
                            if let status = jsonDict["success"] {
                                
                                if RawdataConverter.integer(status) == 1{
                                   success(data , response , error as NSError?,jsonDict)
                                   
                                }
                                else{
                                    failure(data , response , error as NSError?,RawdataConverter.optionalString(jsonDict["error"]))
                                }
                            }
                            else{
                                 failure(data , response , error as NSError?,RawdataConverter.optionalString(jsonDict["error"]))
                            }
                        } else {
                            print("bad json")
                             failure(data , response , error as NSError?,"Unable to parse JSON.")
                        }
                    } catch let error as NSError {
                        print(error)
                        failure(data , response, error as NSError?,"Unable to parse JSON.")
                    }
                    
                } else {
                    failure(data , response as? HTTPURLResponse, error as NSError?,error.debugDescription)
                }
            }else {
                
                failure(data , response as? HTTPURLResponse, error as NSError?,error.debugDescription)
                
            }
            }.resume()
        
    }
    
    func requestToUploadImagesWithParams(url: String,params: Dictionary<String, Any>?, images : [UIImage],fileNames : [String], method: HttpMethod, success:@escaping ( Data? ,HTTPURLResponse?  , NSError? ) -> Void, failure: @escaping ( Data? ,HTTPURLResponse?  , NSError?,String? )-> Void)
    {
        if !isConnectedToNetwork() {
            failure(nil , nil , nil,stringNoInternet)
            return
        }
        var request = URLRequest(url: URL(string: url)!)
        
        NSLog("URL = \(url)")
        
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
        
//        let imageData = UIImagePNGRepresentation(signatureImage)
//        let fileString = imageData?.base64EncodedData(options: .endLineWithLineFeed)
//
//        let boundary = "-------------------------acebdf13572468"
        let contentType = "multipart/form-data"
        
        request.addValue(contentType, forHTTPHeaderField: "Content-Type")
        
//        let contentLength = String.init(describing: imageData?.count)
        
//        request.setValue(contentLength, forHTTPHeaderField: "Content-Length")
        
//        let upperBoundary = NSMutableData()
//        let lowerBoundary = NSMutableData()
        let bodyData = NSMutableData()
        let mimetype = "image/png"
         let boundary = "---------------------------14737809831466499882746641449"
        if images.count > 0
        {
            for index in 1...images.count
            {
                let image_data = UIImagePNGRepresentation(images[index-1])
                let fileName = fileNames[index-1] as String
                
                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
                bodyData.append(String("Content-Disposition: form-data; name=\"file\"; filename=\"\(fileName)\"").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append(String("Content-Type: \(mimetype)").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append(image_data!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
            }
        }
        
        
        
        request.httpBody = bodyData as Data
        request.httpMethod = "POST"
        
        let uploadTask : URLSessionUploadTask = URLSession.shared.uploadTask(with: request as URLRequest, from: bodyData as Data, completionHandler: {
            
            data, response, error in
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
            
            if let data = data {
                
                if let response = response as? HTTPURLResponse, 200...299 ~= response.statusCode {
                    success(data , response , error as NSError?)
                } else {
                    failure(data , response as? HTTPURLResponse, error as NSError?,error.debugDescription)
                }
            }else {
                
                failure(data , response as? HTTPURLResponse, error as NSError?,error.debugDescription)
                
            }
 
        })
        
        uploadTask.resume()
        
        
    }
}
