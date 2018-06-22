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
     static let shared = RequestManager()
    
    var session : URLSession?

    var progressComplete: (CGFloat)->Void = {_ in }
    
    // MARK: - Network Availability
    
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
    
    // MARK: - GET
    
    func makeGetAPICall(url: String,params: Dictionary<String, Any>?, method: HttpMethod, success:@escaping ( Data? ,HTTPURLResponse?  , NSError? ,Array<Any>) -> Void, failure: @escaping ( Data? ,HTTPURLResponse?  , NSError?,String? )-> Void) {
        
        if !isConnectedToNetwork() {
            failure(nil , nil , nil,StringConstants.NoInternet)
            return
        }
        
        DispatchQueue.main.async(execute: {
            UIApplication.shared.isNetworkActivityIndicatorVisible = true
        })
        
        
        var request = URLRequest(url: URL(string: url)!)
        NSLog("URL = \(url)")
        NSLog("Params = \(params)")
        
        if let params = params {
            
            let  jsonData = try? JSONSerialization.data(withJSONObject: params, options: .prettyPrinted)
            
            
            request.httpBody = jsonData//?.base64EncodedData()
            
        }
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpMethod = method.rawValue
        
        
        URLSession.shared.dataTask(with: request as URLRequest) { (data, response, error) -> Void in
            
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
            if error != nil{
                let err = error! as NSError
                
                failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (err.code)))
                return
            }
            let res = response as? HTTPURLResponse
            
            if let data = data {
                
                if let response = response as? HTTPURLResponse, 200...299 ~= response.statusCode {
                    do {
                        if let jsonArray = try JSONSerialization.jsonObject(with: data, options : .allowFragments) as? Array<Any>
                        {
                            print(jsonArray)
                            success(data , response , error as NSError?,jsonArray)
                        } else {
                            print("bad json")
                            let backToString = String(data: data, encoding: String.Encoding.utf8) as String?
                            print(backToString!)
                            failure(data , response , error as NSError?,"Unable to parse JSON.")
                        }
                    } catch let error as NSError {
                        print(error)
                        failure(data , response, error as NSError?,"Unable to parse JSON.")
                    }
                    
                } else {
                    failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (res?.statusCode)!) )
                }
            }else {
                
                failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (res?.statusCode)!))
                
            }
            }.resume()
        
    }
    
    // MARK: - Custom Requests
    
    func makeAPICall(url: String,params: Dictionary<String, Any>?, method: HttpMethod, success:@escaping ( Data? ,HTTPURLResponse?  , NSError? ,Dictionary<String,Any>) -> Void, failure: @escaping ( Data? ,HTTPURLResponse?  , NSError?,String? )-> Void) {
        
        if !isConnectedToNetwork() {
            failure(nil , nil , nil,StringConstants.NoInternet)
            return
        }
        
        DispatchQueue.main.async(execute: {
            UIApplication.shared.isNetworkActivityIndicatorVisible = true
        })
        
        
        var request = URLRequest(url: URL(string: url)!)
        NSLog("URL = \(url)")
        NSLog("Params = \(params)")
        
        if let params = params {
            
            let  jsonData = try? JSONSerialization.data(withJSONObject: params, options: .prettyPrinted)
            
            
            request.httpBody = jsonData//?.base64EncodedData()
            
        }
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpMethod = method.rawValue

        
        URLSession.shared.dataTask(with: request as URLRequest) { (data, response, error) -> Void in
            
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
            
            if error != nil{
                let err = error! as NSError
                
                failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (err.code)))
                return
            }
            
             let res = response as? HTTPURLResponse
            
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
                                    var errorString = "Server Error"
                                    if let val = RawdataConverter.optionalString(jsonDict["error"]) {
                                        // now val is not nil and the Optional has been unwrapped, so use it
                                        errorString = val
                                    }
                                    
                                    if let errorCode = RawdataConverter.optionalString(jsonDict["error_code"]) {
                                       
//                                        if errorCode == ErrorCode.APP_NOT_FOUND.rawValue{
//                                            GlobalMethods.shared.dismissLoader {
//                                                GlobalMethods.shared.logOutUser()
//                                                GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorString)
//                                            }
//                                        }
                                         if errorCode == ErrorCode.DEVICE_MISMATCH.rawValue{
                                            GlobalMethods.shared.dismissLoader {
                                                GlobalMethods.shared.deviceMismatch(errorMsg: errorString)
                                            }
                                        }
                                         else if errorCode == ErrorCode.EXPIRED_APP_STATUS.rawValue{
                                            GlobalMethods.shared.dismissLoader {
                                                GlobalMethods.shared.documentExpiredError(errorMsg: errorString)
//                                                GlobalMethods.shared.logOutUser()
//                                                GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorString)
                                            }
                                         }
                                        else{
                                            failure(data , response , error as NSError?,errorString)
                                        }
                                    }
                                }
                            }
                            else{
                                 failure(data , response , error as NSError?,RawdataConverter.string(jsonDict["error"]))
                            }
                        } else {
                            print("bad json")
                            var backToString = String(data: data, encoding: String.Encoding.utf8) as String!
                            print(backToString)
                             failure(data , response , error as NSError?,"Unable to parse JSON.")
                        }
                    } catch let error as NSError {
                        print(error)
                        failure(data , response, error as NSError?,"Unable to parse JSON.")
                    }
                    
                } else {
                    failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (res?.statusCode)!))
                }
            }else {
                
                failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (res?.statusCode)!))
                
            }
            }.resume()
        
    }
    
    // MARK: - Custom requests with Progress
    
    func requestToUploadImagesWithParams(url: String,params: Dictionary<String, Any>?, images : [UIImage],fileNames : [String], method: HttpMethod, success:@escaping ( Data? ,HTTPURLResponse?  , NSError? ,Dictionary<String,Any>) -> Void, failure: @escaping ( Data? ,HTTPURLResponse?  , NSError?,String? )-> Void)
    {
        if !isConnectedToNetwork() {
            failure(nil , nil , nil,StringConstants.NoInternet)
            return
        }
        var request = URLRequest(url: URL(string: url)!)
        
        NSLog("URL = \(url)")
         NSLog("Params = \(params)")
        
        DispatchQueue.main.async(execute: {
            UIApplication.shared.isNetworkActivityIndicatorVisible = true
        })
        
        let boundary = "*****14737809831466499882746641449*****"

        let contentType = "multipart/form-data; boundary=\(boundary)"
        
        request.addValue(contentType, forHTTPHeaderField: "Content-Type")
         request.addValue("Keep-Alive", forHTTPHeaderField: "Connection")
        let bodyData = NSMutableData()
        let mimetype = "image/jpg"
        
        if params != nil {
            for (key, value) in params! {
                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
                bodyData.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".data(using: String.Encoding.utf8)!)
                bodyData.append("\(value)\r\n".data(using: String.Encoding.utf8)!)
            }
        }
        
        if images.count > 0
        {
            for index in 1...images.count
            {
                var compression = 0.8
                if images[index-1].size.height > 2500 || images[index-1].size.width > 2500 {
                    compression = 0.4
                }
                let image_data = UIImageJPEGRepresentation(images[index-1], CGFloat(compression))
                    
//                let image_data = UIImageJPEGRepresentation(images[index-1], 0.5)
                let fileName = fileNames[index-1] as String
                
                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
                bodyData.append(String("Content-Disposition: form-data; name=\"\(fileName)\"; filename=\"\(fileName)\".jpg").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append(String("Content-Type: \(mimetype)").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
//                bodyData.append(String("Content-Transfer-Encoding: binary").data(using: String.Encoding.utf8)!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
//                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
                bodyData.append(image_data!)
                bodyData.append(String("\r\n").data(using: String.Encoding.utf8)!)
//                bodyData.append("--\(boundary)--\r\n".data(using: String.Encoding.utf8)!)
//                bodyData.append("--\(boundary)\r\n".data(using: String.Encoding.utf8)!)
            }
        }
                bodyData.append("--\(boundary)--\r\n".data(using: String.Encoding.utf8)!)

        
        
        request.httpBody = bodyData as Data
        request.httpMethod = "POST"
//        let sess = URLSessionTask.
        let customSession = URLSession.init(configuration: URLSessionConfiguration.default, delegate: self, delegateQueue: OperationQueue.main)
        
       customSession.dataTask(with: request as URLRequest) { (data, response, error) -> Void in
            
           
            DispatchQueue.main.async(execute: {
                UIApplication.shared.isNetworkActivityIndicatorVisible = false
            })
        
        if error != nil{
            let err = error! as NSError
            
            failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (err.code)))
            return
        }
        
            let res = response as? HTTPURLResponse
            
            
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
                                var errorString = "Server Error"
                                if let val = RawdataConverter.optionalString(jsonDict["error"]) {
                                    // now val is not nil and the Optional has been unwrapped, so use it
                                    errorString = val
                                }
                                
                                if let errorCode = RawdataConverter.optionalString(jsonDict["error_code"]) {
                                    
                                    if errorCode == ErrorCode.APP_NOT_FOUND.rawValue{
                                        GlobalMethods.shared.logOutUser()
                                        GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorString)
                                    }
                                    else if errorCode == ErrorCode.DEVICE_MISMATCH.rawValue{
                                        GlobalMethods.shared.deviceMismatch(errorMsg: errorString)
                                    }
                                    else{
                                        failure(data , response , error as NSError?,errorString)
                                    }
                                }
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
                    
                    failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: (res?.statusCode)!))
                }
            }else {
                
                failure(data , response as? HTTPURLResponse, error as NSError?,HTTPURLResponse.localizedString(forStatusCode: ((error as NSError?)?.code)!))
                
            }
 
        }.resume()
    }
    
    // MARK: - Downlaod requests
    
    func getDataFromUrl(url: URL, completion: @escaping (Data?, URLResponse?, Error?) -> ()) {
        URLSession.shared.dataTask(with: url) { data, response, error in
            completion(data, response, error)
            }.resume()
    }
    
    // MARK: - Session Delegates
    
//    func dis
}

extension RequestManager : URLSessionTaskDelegate{
    func urlSession(_ session: URLSession, task: URLSessionTask, didSendBodyData bytesSent: Int64, totalBytesSent: Int64, totalBytesExpectedToSend: Int64) {
        let fractionComplete = CGFloat(totalBytesSent)/CGFloat(totalBytesExpectedToSend) * 100.0
        
        
        self.progressComplete(fractionComplete)
    }
}
