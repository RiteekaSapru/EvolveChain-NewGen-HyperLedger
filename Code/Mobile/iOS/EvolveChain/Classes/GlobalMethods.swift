//
//  GlobalMethods.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class GlobalMethods: NSObject {

    static let sharedInstance = GlobalMethods()
    
    func pushVC(_ controller : UIViewController) -> Void{
        _navigator.pushViewController(controller, animated: true)
    }
    
    func popVC() -> Void{
        _navigator.popViewController(animated: false)
    }
    
    func showAlert(alertTitle:String,alertText:String) -> Void {
        let alert = UIAlertController.init(title: alertTitle, message: alertText, preferredStyle: .alert)
        
        let defaultAction = UIAlertAction.init(title: "OK", style: .default) { (alert: UIAlertAction!) in
            
        }
        alert.addAction(defaultAction)
        
        _navigator.present(alert, animated: true, completion: nil)
        
    }
    
    func underDevelopmentAlert() -> Void {
        showAlert(alertTitle: stringAppName, alertText: stringUnderDevelopment)
    }
    
    func showAlertForImagePicker(success:@escaping (  Int ) -> Void) -> Void {
        let alert = UIAlertController.init(title: "", message: "", preferredStyle: .actionSheet)
        
        let cameraAction = UIAlertAction.init(title: "Camera", style: .default) { (alert: UIAlertAction!) in
            success(1)
        }
        alert.addAction(cameraAction)
        
        let galleryAction = UIAlertAction.init(title: "Gallery", style: .default) { (alert: UIAlertAction!) in
            success(2)
        }
        alert.addAction(galleryAction)
        
        let defaultAction = UIAlertAction.init(title: "Cancel", style: .cancel) { (alert: UIAlertAction!) in
            success(-1)
        }
        alert.addAction(defaultAction)
        
        _navigator.present(alert, animated: true, completion: nil)
        
    }
    
    
    /**
     Convert any object to Json formate string if any catch then empty string return
     */
    func toJsonString(_ parm : Any) -> String{
        do{
            let jsonData: Data = try JSONSerialization.data(withJSONObject: parm, options: JSONSerialization.WritingOptions.prettyPrinted)
            if let datastring = String(data: jsonData, encoding: String.Encoding.utf8){
                return datastring
            }
        } catch {
            return  ""
        }
        return  ""
    }
    
    func isValidEmail(testStr:String) -> Bool {
        // print("validate calendar: \(testStr)")
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailTest.evaluate(with: testStr)
    }
    
    func showLoader(loadingText:String) -> Void {
        let alert = UIAlertController(title: nil, message: loadingText, preferredStyle: .alert)
        
        let loadingIndicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
        loadingIndicator.startAnimating();
        
        alert.view.addSubview(loadingIndicator)
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func dismissLoader(complete:@escaping (   ) -> Void) -> Void {
        DispatchQueue.main.async {
            _navigator.presentedViewController?.dismiss(animated: true, completion: {
                complete()
            })
        }
      
    }
    
    func getIFAddresses() -> [String] {
        var addresses = [String]()
        
        // Get list of all interfaces on the local machine:
        var ifaddr : UnsafeMutablePointer<ifaddrs>?
        guard getifaddrs(&ifaddr) == 0 else { return [] }
        guard let firstAddr = ifaddr else { return [] }
        
        // For each interface ...
        for ptr in sequence(first: firstAddr, next: { $0.pointee.ifa_next }) {
            let flags = Int32(ptr.pointee.ifa_flags)
            let addr = ptr.pointee.ifa_addr.pointee
            
            // Check for running IPv4, IPv6 interfaces. Skip the loopback interface.
            if (flags & (IFF_UP|IFF_RUNNING|IFF_LOOPBACK)) == (IFF_UP|IFF_RUNNING) {
                if addr.sa_family == UInt8(AF_INET) || addr.sa_family == UInt8(AF_INET6) {
                    
                    // Convert interface address to a human readable string:
                    var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
                    if (getnameinfo(ptr.pointee.ifa_addr, socklen_t(addr.sa_len), &hostname, socklen_t(hostname.count),
                                    nil, socklen_t(0), NI_NUMERICHOST) == 0) {
                        let address = String(cString: hostname)
                        addresses.append(address)
                    }
                }
            }
        }
        
        freeifaddrs(ifaddr)
        return addresses
    }
    
    func convertToMD5(string: String) -> String {
        
        let messageData = string.data(using:.utf8)!
        var digestData = Data(count: Int(CC_MD5_DIGEST_LENGTH))
        
        _ = digestData.withUnsafeMutableBytes {digestBytes in
            messageData.withUnsafeBytes {messageBytes in
                CC_MD5(messageBytes, CC_LONG(messageData.count), digestBytes)
            }
        }
        let md5Hex =  digestData.map { String(format: "%02hhx", $0) }.joined()
        return md5Hex
    
    }
    func getDatePicker(controller:UIViewController,txtFld:UITextField,doneAction:Selector,cancelAction:Selector) -> UIDatePicker {
    
        let datePicker = UIDatePicker.init()
        
//        datePicker.delegate = controller
        
        datePicker.datePickerMode = .date
        
//        datePicker.maximumDate = Date()
        
        datePicker.backgroundColor = UIColor.white
        
        let toolbar = UIToolbar(frame: CGRect(x: 0, y: 0, width: Int(_screenSize.width), height:40))
        
        toolbar.isTranslucent = false
        
        toolbar.barTintColor = UIColor.white
        let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: controller, action: doneAction)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .plain, target: controller, action: cancelAction)
        let flexibleSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        
        doneButton.tintColor = UIColor.black
        
        cancelButton.tintColor = UIColor.black
        
        toolbar.setItems([cancelButton,flexibleSpace,doneButton], animated: true)
        txtFld.inputView = datePicker
        txtFld.inputAccessoryView = toolbar
        
        return datePicker
        
        

    }
}
