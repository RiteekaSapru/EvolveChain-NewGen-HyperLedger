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
    
     // MARK: - Navigation
    
    func pushVC(_ controller : UIViewController) -> Void{
        _navigator.pushViewController(controller, animated: true)
    }
    
    func popVC() -> Void{
        _navigator.popViewController(animated: false)
    }
    
     // MARK: - Alerts
    
    func showAlert(alertTitle:String,alertText:String) -> Void {
        DispatchQueue.main.async {
            let alert = UIAlertController.init(title: alertTitle, message: alertText, preferredStyle: .alert)
            
            let defaultAction = UIAlertAction.init(title: "OK", style: .default) { (alert: UIAlertAction!) in
                
            }
            alert.addAction(defaultAction)
            
            _navigator.present(alert, animated: true, completion: nil)
        }
    }
    
    func underDevelopmentAlert() -> Void {
        showAlert(alertTitle: stringAppName, alertText: stringUnderDevelopment)
    }
    
    func showAlertForImagePicker(success:@escaping (  Int ) -> Void) -> Void {
        let alert = UIAlertController.init(title: nil, message: nil, preferredStyle: .actionSheet)
        
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
    
     // MARK: - Data Parser
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
    
    
     // MARK: - Validations
    
    func isValidEmail(testStr:String) -> Bool {
        // print("validate calendar: \(testStr)")
        let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailTest.evaluate(with: testStr)
    }
    
    func getDate(year:Int,after:Bool) -> Date {
        if after {
            return (Calendar.current as NSCalendar).date(byAdding: .year, value: year, to: Date(), options: [])!

        }
        else{
            return (Calendar.current as NSCalendar).date(byAdding: .year, value: -year, to: Date(), options: [])!
        }
        
    }
     // MARK: - Loader
    
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
    
     // MARK: - System
    
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
    
     // MARK: - Pickers
    
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
    
     // MARK: - Uploaders

    func uploadBasicDetails() {
        
        let dateFormatter  = DateFormatter.init()
        
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        let params = ["step":"basic","firstname":BasicDetailsModel.sharedInstance.fname,"lastname":BasicDetailsModel.sharedInstance.lname,"dob":dateFormatter.string(from: BasicDetailsModel.sharedInstance.dob),"place_of_birth":BasicDetailsModel.sharedInstance.placeOfBirth,"address1":BasicDetailsModel.sharedInstance.add1,"address2":BasicDetailsModel.sharedInstance.add2,"street":BasicDetailsModel.sharedInstance.street,"city":BasicDetailsModel.sharedInstance.city,"zip":BasicDetailsModel.sharedInstance.zipCode,"state":BasicDetailsModel.sharedInstance.state,"country":BasicDetailsModel.sharedInstance.country,"middlename":BasicDetailsModel.sharedInstance.mname,"substep":"basic"]
        //"email":BasicDetailsModel.sharedInstance.email,"phone":BasicDetailsModel.sharedInstance.contactNumber,
        
        let filenameArray = ["file[]"]
        
        let imagesArray = [BasicDetailsModel.sharedInstance.userImage]
        
        NetworkManager.sharedInstance.POSTBasicDetails(params: params, fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Basic Details Saved")
            self.uploadIdentityDetails()
        }) { (errorMsg) in
             GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
        
    }
    
    func uploadIdentityDetails() {
        
        let dateFormatter  = DateFormatter.init()
        
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        var params  : Dictionary = ["step":"identity"]
        var imagesArray : [UIImage] = []
        
        switch DocumentModel.sharedInstance.identityType {
        case .DrivingLicenceIdentityType:
            
            let model = DocumentModel.sharedInstance.drivingModel
            params.updateValue("license", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(dateFormatter.string(from: model.expiry), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            imagesArray = [model.frontImage,model.backImage]
            
        case .PassportIdentityType:
            
             let model = DocumentModel.sharedInstance.passportModel
             params.updateValue("passport", forKey: "substep")
             params.updateValue(model.number, forKey: "number")
             params.updateValue(dateFormatter.string(from: model.expiry), forKey: "expiry_date")
             params.updateValue(model.country, forKey: "country")
             params.updateValue("", forKey: "document_type")
             imagesArray = [model.frontImage,model.backImage]
            
        case .TaxationIdentityType:
            let model = DocumentModel.sharedInstance.taxationModel
             params.updateValue("taxation", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(dateFormatter.string(from: model.expiry), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            imagesArray = [model.frontImage,model.backImage]
            
        }

        let filenameArray = ["file[]","file[]"]

        NetworkManager.sharedInstance.POSTIdentityDetails(params: params, fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Identity Details Saved")
            self.uploadAddressDetails()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
        
    }
    
   
    
    func uploadAddressDetails() {
        
        let dateFormatter  = DateFormatter.init()
        
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        var params  : Dictionary = ["step":"address"]
        var imagesArray : [UIImage] = []
        
        switch DocumentModel.sharedInstance.addressType {
        case .DrivingLicenceAddressType:
            
            let model = DocumentModel.sharedInstance.drivingModel
            params.updateValue("license", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(dateFormatter.string(from: model.expiry), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            imagesArray = [model.frontImage,model.backImage]
            
        case .PassportAddressType:
            
            let model = DocumentModel.sharedInstance.passportModel
            params.updateValue("passport", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(dateFormatter.string(from: model.expiry), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            imagesArray = [model.frontImage,model.backImage]
            
        case .UtilityAddressType:
            let model = DocumentModel.sharedInstance.utilityModel
            params.updateValue("utility_bill", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue("", forKey: "expiry_date")
            params.updateValue(model.address, forKey: "country")
            params.updateValue(model.type, forKey: "document_type")
            imagesArray = [model.frontImage,model.backImage]
            
        }
        
        let filenameArray = ["file[]","file[]"]
        
        NetworkManager.sharedInstance.POSTAddressDetails(params: params, fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Address Details Saved")
            //mve to nxt screen
            self.cleanUpRegistrationData()
            let successfullVC = _navigator.storyboard?.instantiateViewController(withIdentifier: "SuccessfullVC") as! SuccessfullVC
            GlobalMethods.sharedInstance.pushVC(successfullVC)
            
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
        
    }
    
      // MARK: - Data Erasing
    
    func cleanUpRegistrationData() {
        BasicDetailsModel.sharedInstance.eraseData()
        DocumentModel.sharedInstance.eraseData()
    }
    
     // MARK: - Logout
    
    func logoutUser() {
        
        let alert = UIAlertController.init(title: "Logout", message: "Are you sure?", preferredStyle: .actionSheet)
        
        let logoutAction = UIAlertAction.init(title: "Logout", style: .destructive) { (alert: UIAlertAction!) in
            FlowManager.sharedInstance.resetToSplash()
        }
        alert.addAction(logoutAction)
        
        
        let defaultAction = UIAlertAction.init(title: "Cancel", style: .cancel) { (alert: UIAlertAction!) in
            
        }
        alert.addAction(defaultAction)
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func loginUser(details:Dictionary<String,Any>) {
        
        GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: "User Logged Sucessfully")
//        FlowManager.sharedInstance.moveToHome()
    }
}
