//
//  GlobalMethods.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import AVFoundation
import Photos
import LocalAuthentication
import CoreTelephony
import CoreLocation

class GlobalMethods: NSObject,CLLocationManagerDelegate {

    static let sharedInstance = GlobalMethods()
    
    var locationManager : CLLocationManager?
    
     // MARK: - Navigation
    
    func pushVC(_ controller : UIViewController) -> Void{
        _navigator.pushViewController(controller, animated: true)
    }
    
    func popVC() -> Void{
        _navigator.popViewController(animated: true)
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
        showAlert(alertTitle: StringConstants.AppName, alertText: StringConstants.UnderDevelopment)
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
    
    func checkForCameraPermission() {
        if AVCaptureDevice.authorizationStatus(for: .video) ==  .authorized {
            //already authorized
        } else {
            AVCaptureDevice.requestAccess(for: .video, completionHandler: { (granted: Bool) in
                if granted {
                    //access allowed
                } else {
                    //access denied
                }
            })
        }
    }
    
    
    fileprivate func showAlertForPermission(alertMsg:String){
        
        let alert = UIAlertController.init(title: StringConstants.Error, message: alertMsg, preferredStyle: .alert)
        
        let settingsAction = UIAlertAction.init(title: "Settings", style: .default) { (alert: UIAlertAction!) in
            let settingsUrl = URL(string: UIApplicationOpenSettingsURLString)!
            UIApplication.shared.openURL(settingsUrl)
        }
        alert.addAction(settingsAction)
        
        
        let defaultAction = UIAlertAction.init(title: "Cancel", style: .cancel) { (alert: UIAlertAction!) in
            
        }
        alert.addAction(defaultAction)
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func checkForGalleryPermission(success:@escaping () -> Void, failure: @escaping ()-> Void) -> Void {
        let status = PHPhotoLibrary.authorizationStatus()
        
        if (status == PHAuthorizationStatus.authorized) {
            // Access has been granted.
            success()
        }
            
        else if (status == PHAuthorizationStatus.denied) {
            // Access has been denied.
            self.showAlertForPermission(alertMsg: StringConstants.NoGallery)
            failure()
        }
            
        else if (status == PHAuthorizationStatus.notDetermined) {
            
            // Access has not been determined.
            PHPhotoLibrary.requestAuthorization({ (newStatus) in
                
                if (newStatus == PHAuthorizationStatus.authorized) {
                     success()
                }
                    
                else {
                    self.showAlertForPermission(alertMsg: StringConstants.NoGallery)
                    failure()
                }
            })
        }
            
        else if (status == PHAuthorizationStatus.restricted) {
            // Restricted access - normally won't happen.
            self.showAlertForPermission(alertMsg: StringConstants.NoGallery)
            failure()
        }
    }
     // MARK: - Loader
    
    func showLoader(loadingText:String) -> Void {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: nil, message: loadingText, preferredStyle: .alert)
                        
            let attribLoadingText = NSMutableAttributedString.init(string: loadingText)
            attribLoadingText.addAttribute(.font, value: UIFont.init(name: "AvenirNext-Regular", size: 14)!, range: NSMakeRange(0, loadingText.count))
            
            alert.setValue(attribLoadingText, forKey: "attributedMessage")
            
            let loadingIndicator = UIActivityIndicatorView(frame: CGRect(x: 10, y: 5, width: 50, height: 50))
            loadingIndicator.hidesWhenStopped = true
            loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.gray
            loadingIndicator.startAnimating();
            
            alert.view.addSubview(loadingIndicator)
            _navigator.present(alert, animated: true, completion: nil)
        }
        
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
    
    func checkIfBioMetricSupported() -> Bool{
        guard #available(iOS 8.0, *) else {
            return false
        }
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            return false
        }
        return true
    }
    
    func beginBiometricID(success:@escaping ( Bool ) -> Void) {
        
        guard #available(iOS 8.0, *) else {
            success(false)
            return
        }
        
        let context = LAContext()
        var error: NSError?
        
        guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
            success(false)
            return
        }
        
        let reason = "Please authenticate yourself for auto-login."
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { isAuthorized, error in
            guard isAuthorized == true else {
                success(false)
                return
            }
            
            success(true)
        }
        
    }

    
     // MARK: - Pickers
    
    func getDatePicker(controller:Any?,txtFld:UITextField,doneAction:Selector,cancelAction:Selector) -> UIDatePicker {
    
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

//    func uploadBasicDetails() {
//
//        let filenameArray = ["file[]"]
//         let image = GlobalMethods.sharedInstance.resizeImage(image: BasicDetailsModel.sharedInstance.userImage, targetSize: CGSize.init(width: 200.0, height: 200.0))
//        let imagesArray = [image]
//
//        NetworkManager.sharedInstance.POSTBasicDetails(params: BasicDetailsModel.sharedInstance.getBasicParamsForSaveKYC(), fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
//            print(responseDict)
//            print("Basic Details Saved")
////            self.uploadIdentityDetails()
//        }) { (errorMsg) in
//             GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
//        }
//
//    }
//
//    func uploadIdentityDetails() {
//
//        let filenameArray = ["file[]","file[]"]
//
//        NetworkManager.sharedInstance.POSTIdentityDetails(params:DocumentModel.sharedInstance.getIdentityDetailsForKYC() , fileArray: DocumentModel.sharedInstance.getIdentityImagesForKYC(), filenameArray: filenameArray, success: { (responseDict) in
//            print(responseDict)
//            print("Identity Details Saved")
//            self.uploadAddressDetails()
//        }) { (errorMsg) in
//            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
//        }
//
//    }
//
//
//
//    func uploadAddressDetails() {
//
//        let filenameArray = ["file[]","file[]"]
//
//        NetworkManager.sharedInstance.POSTAddressDetails(params: DocumentModel.sharedInstance.getAddressDetailsForKYC(), fileArray: DocumentModel.sharedInstance.getAddressImagesForKYC(), filenameArray: filenameArray, success: { (responseDict) in
//            print(responseDict)
//            print("Address Details Saved")
//
//            self.kycComplete()
//
//
//        }) { (errorMsg) in
//            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
//        }
//
//    }
    
    
    
      // MARK: - Data Erasing
    
    func cleanUpRegistrationData() {
        BasicDetailsModel.sharedInstance.eraseData()
        DocumentManager.sharedInstance.eraseData()
        
        _userDefault.removeObject(forKey: kApplicationPinKey)
        _userDefault.removeObject(forKey: kApplicationUserDetailsKey)
        _userDefault.removeObject(forKey: kApplicationKycIdKey)
        
        GlobalMethods.sharedInstance.stopLocation()
    }
    
    func removeTempImages()  {
        if let dirPath          = getDocDirPath(folder: "tempImages")
        {
            do {
                try FileManager.default.removeItem(at: dirPath)
            } catch {
                NSLog("Couldn't remove document directory")
                }
        }
    }
    
     // MARK: - Logout
    
    func logoutUserWithAlert() {
        
        let alert = UIAlertController.init(title: nil, message: "Are you sure you want to logout?", preferredStyle: .alert)
        
        let logoutAction = UIAlertAction.init(title: "Logout", style: .destructive) { (alert: UIAlertAction!) in
            
            self.logOutUser()
        }
        alert.addAction(logoutAction)
        
        
        let defaultAction = UIAlertAction.init(title: "Cancel", style: .cancel) { (alert: UIAlertAction!) in
            
        }
        alert.addAction(defaultAction)
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func logOutUser() {

        cleanUpRegistrationData()
        removeTempImages()
        FlowManager.sharedInstance.resetToSplash()
    }
      // MARK: - Log In
    
    func loginUser(details:Dictionary<String,Any>,pin:String) {
        
//        _userDefault.set(kyc_id, forKey: kApplicationKycIdKey)
        _userDefault.set(pin, forKey: kApplicationPinKey)

//        _userDefault.set(details, forKey: kApplicationUserDetailsKey)
        _userDefault.set(details["appkey"], forKey: kApplicationKey)

//         let pin = _userDefault.object(forKey: kApplicationPinKey) as! String
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete {
            BasicDetailsModel.sharedInstance.initWithResponse(responseJson: details)
            GlobalMethods.sharedInstance.popVC()
            _navigator.interactivePopGestureRecognizer?.isEnabled = true

        }
        else{
            BasicDetailsModel.sharedInstance.initWithResponse(responseJson: details)
            FlowManager.sharedInstance.moveToHome()
        }
        _userDefault.set(BasicDetailsModel.sharedInstance.contactNumber, forKey: kUserPhoneKey)
        _userDefault.set(BasicDetailsModel.sharedInstance.countryCode, forKey: kUserISDCodeKey)
    }
    
    fileprivate func APIGeneratePin(errorMsg:String) {
        let params = ["ekyc_id":_userDefault.object(forKey: kApplicationKycIdKey)]
        
        NetworkManager.sharedInstance.generateOtpForKydId(params: params, success: { (responseJson) in
            DispatchQueue.main.async {
                FlowManager.sharedInstance.resetToGeneratePin()
                GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg)
            }
        }) { (errorMsg2) in
            _userDefault.removeObject(forKey: kApplicationKycIdKey)
            let msg = errorMsg + ". " + errorMsg2!
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: msg)
        }
    }
    
    func deviceMismatch(errorMsg:String) {
        
       
        
        self.cleanUpRegistrationData()
        DispatchQueue.main.async {
            FlowManager.sharedInstance.resetToGeneratePin()
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg)
        }
        
//        if  (_navigator.presentedViewController != nil){
//            _navigator.presentedViewController?.dismiss(animated: true, completion: {
//                DispatchQueue.main.async {
//                    self.APIGeneratePin(errorMsg: errorMsg)
//                }
//            })
//        }
//        else{
//             self.APIGeneratePin(errorMsg: errorMsg)
//        }
//        _userDefault.removeObject(forKey: kApplicationKycIdKey)
        
        
    }
      // MARK: - Date Format
    
    func getDateStringFromUTCString(dateUTC:String,stringFormat:String) -> String {
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = SignupConfigModel.sharedInstance.dateFormat
        dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
        
        let date = dateFormatter.date(from: dateUTC)
        
        // change to a readable time format and change to local time zone
        dateFormatter.dateFormat = stringFormat
        dateFormatter.timeZone = NSTimeZone.local
        return dateFormatter.string(from: date!)
    }
    
    // MARK: - Init Config
    
    func initConfig(){
       let config =  _userDefault.object(forKey: kApplicationInitConfigKey) as! Dictionary<String,Any>
        SignupConfigModel.sharedInstance.initWithDictionary(configDict: config)
    }
    
    func getUniqueIdForDevice() -> String{
        if let uniqueID = KeychainService.loadPassword(service: service, account: account) {
            return uniqueID
        }
        else {
            let uniqueID = UIDevice.current.identifierForVendor?.uuidString
            KeychainService.savePassword(service: service, account: account, data: uniqueID!)
            return uniqueID!
        }
    }
    
    // MARK: - Image Compression
    
    func resizeImage(image: UIImage, targetSize: CGSize) -> UIImage {
        let size = image.size
        
        let widthRatio  = targetSize.width  / size.width
        let heightRatio = targetSize.height / size.height
        
        // Figure out what our orientation is, and use that to form the rectangle
        var newSize: CGSize
        if(widthRatio > heightRatio) {
            newSize = CGSize(width: size.width * heightRatio, height: size.height * heightRatio)
        } else {
            newSize = CGSize(width: size.width * widthRatio,  height: size.height * widthRatio)
        }
        
        // This is the rect that we've calculated out and this is what is actually used below
        let rect = CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height)
        
        // Actually do the resizing to the rect using the ImageContext stuff
        UIGraphicsBeginImageContextWithOptions(newSize, false, 1.0)
        image.draw(in: rect)
        let newImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        
        return newImage!
    }
    
    // MARK: - Image Caching
    
    func saveImage(image: UIImage,fileName:String) -> Bool {
        guard let data = UIImageJPEGRepresentation(image, 1) ?? UIImagePNGRepresentation(image) else {
            return false
        }
//        guard let directory = try? FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false) as NSURL else {
//            return false
//        }
        if let dirPath          = getDocDirPath(folder: "tempImages")
        {
            do {
                try data.write(to: dirPath.appendingPathComponent(fileName))
                return true
            } catch {
                print(error.localizedDescription)
                return false
            }
        }
         return false
    }
    
    func checkIfFileExists(fileName:String) -> Bool {
//        let nsDocumentDirectory = FileManager.SearchPathDirectory.documentDirectory
//        let nsUserDomainMask    = FileManager.SearchPathDomainMask.userDomainMask
//        let paths               = NSSearchPathForDirectoriesInDomains(nsDocumentDirectory, nsUserDomainMask, true)
        if let dirPath          = getDocDirPath(folder: "tempImages")
        {
           return FileManager.default.fileExists(atPath: dirPath.path+"/"+fileName)
        }
        
        return false
    }
    
    func getLocallySavedImage(fileName:String) -> UIImage!{
//        let nsDocumentDirectory = FileManager.SearchPathDirectory.documentDirectory
//        let nsUserDomainMask    = FileManager.SearchPathDomainMask.userDomainMask
//        let paths               = NSSearchPathForDirectoriesInDomains(nsDocumentDirectory, nsUserDomainMask, true)
        if let dirPath          = getDocDirPath(folder: "tempImages")
        {
            let imageURL = dirPath.appendingPathComponent(fileName)//URL(fileURLWithPath: dirPath).appendingPathComponent(fileName)
            let image    = UIImage(contentsOfFile: imageURL.path)
            // Do whatever you want with the image
            return image
        }
        return nil
    }
    
    func getDocDirPath(folder:String) -> URL? {
        let fileManager = FileManager.default
        if let tDocumentDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first {
            let filePath =  tDocumentDirectory.appendingPathComponent("\(folder)", isDirectory: true)
            if !fileManager.fileExists(atPath: filePath.path) {
                do {
                    try fileManager.createDirectory(atPath: filePath.path, withIntermediateDirectories: true, attributes: nil)
                } catch {
                    NSLog("Couldn't create document directory")
                    return nil
                }
            }
            NSLog("Document directory is \(filePath)")
            return filePath
        }
        return nil
    }
    
    
    // MARK: - Carrier
    
    func getCarrierName() -> String? {
        let networkInfo = CTTelephonyNetworkInfo()
        let carrier = networkInfo.subscriberCellularProvider
        
        // Get carrier name
        let carrierName = carrier?.carrierName
        
        return (carrierName != nil) ? carrierName : ""
    }
    
    func getMobileNetworkCode() -> String? {
        let networkInfo = CTTelephonyNetworkInfo()
        let carrier = networkInfo.subscriberCellularProvider
        
        let networkCode = carrier?.mobileNetworkCode
        
        return (networkCode != nil) ? networkCode : ""
    }
    
    func getMobileCountryCode() -> String? {
        let networkInfo = CTTelephonyNetworkInfo()
        let carrier = networkInfo.subscriberCellularProvider
        
        let countryCode = carrier?.mobileCountryCode
        
        return (countryCode != nil) ? countryCode : ""
    }
    
    func getISOCountryCode() -> String? {
        let networkInfo = CTTelephonyNetworkInfo()
        let carrier = networkInfo.subscriberCellularProvider
        
        let countryCode = carrier?.isoCountryCode
        
        return (countryCode != nil) ? countryCode : ""
    }
    
    // MARK: - Location
    
    func getLocation() -> (lat:Double,long:Double) {
        if CLLocationManager.locationServicesEnabled(){
            switch CLLocationManager.authorizationStatus(){
            case .restricted, .denied:
                print("No access")
                return (0.0,0.0)
            case .authorizedAlways, .authorizedWhenInUse:
                print("Access")
                return ((locationManager?.location?.coordinate.latitude)!,(locationManager?.location?.coordinate.longitude)!)
                
            case .notDetermined:
                print("not determined")
                return (0.0,0.0)
            }
        }
        else
        {
            return (0.0,0.0)
        }
    }
    
    func initialiseLocation() {
        if CLLocationManager.locationServicesEnabled(){
            switch CLLocationManager.authorizationStatus(){
            case .restricted, .denied:
                print("No access")
            case .authorizedAlways, .authorizedWhenInUse:
                print("Access")
                startLocation()
//                GlobalMethods.sharedInstance.showLoader(loadingText: "   Please wait...")
                
            case .notDetermined:
                print("not determined")
                startLocation()
//                locationManager?.requestWhenInUseAuthorization()
            }
        }
    }
    
    func startLocation() {
        if locationManager == nil{
            locationManager = CLLocationManager.init()
        }
        locationManager?.delegate = self
        locationManager?.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func stopLocation() {
        locationManager?.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if locations.count > 0 {
//            GlobalMethods.sharedInstance.dismissLoader {
//
//            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status{
        case .restricted, .denied:
            print("No access")
//            GlobalMethods.sharedInstance.dismissLoader {
//
//            }
        case .authorizedAlways, .authorizedWhenInUse:
            print("Access")
            locationManager?.startUpdatingLocation()
//            GlobalMethods.sharedInstance.showLoader(loadingText: "   Fetching Location...")
        case .notDetermined:
            print("not determined")
            locationManager?.requestWhenInUseAuthorization()
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("location failed")
//        GlobalMethods.sharedInstance.dismissLoader {
//
//        }
    }
    
    // MARK: - Edit
    
    func documentExpiredError(errorMsg:String) {
        cleanUpRegistrationData()
        removeTempImages()
        
        let alert = UIAlertController.init(title: StringConstants.Error, message: errorMsg, preferredStyle: .alert)
        
        let okAction = UIAlertAction.init(title: "Okay", style: .default) { (alert: UIAlertAction!) in
           
            DispatchQueue.main.async {
                FlowManager.sharedInstance.resetToEdit()
            }
        }
        alert.addAction(okAction)
        
        _navigator.present(alert, animated: true, completion: nil)
        
    }
    
    func processEditResponse(responesJSON:Dictionary<String,Any>) {
        // process selected country
       
        guard let countryJSON = RawdataConverter.dictionary(responesJSON["country_details"]) else {
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: "Country Details Missing.")
            return
        }
        let selectedCountry = CountryModel.init()
        selectedCountry.initWithDictionary(countryDict: countryJSON)
        
        SignupConfigModel.sharedInstance.selectedCountry = selectedCountry
        
        
        //documents
        
        guard let docArray = RawdataConverter.array(responesJSON["documents"] ) as? [Dictionary<String, Any>] else {
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: "Doc Array Missing.")
            return
        }
        DocumentManager.sharedInstance.initWith(docArray: docArray)
        
        //basic details, email, phone, isd code,
        
        BasicDetailsModel.sharedInstance.initWithResponseEdit(responseJson: responesJSON)
        
        //verification code, app key
        SignupConfigModel.sharedInstance.verificationCode = RawdataConverter.string(responesJSON["verification_code"])
        _userDefault.set(responesJSON["appkey"], forKey: kApplicationKey)
        
        //identity, address, face
        
        DocumentManager.sharedInstance.initWithResponesEdit(responseJSON: responesJSON)
        
        BasicDetailsModel.sharedInstance.initUpholdingDocEdit(response: responesJSON)
        
        DispatchQueue.main.async {
            GlobalMethods.sharedInstance.dismissLoader {
                let regVC = FlowManager.sharedInstance.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "AmericaRegistrationVC") as! RegistrationVC
                GlobalMethods.sharedInstance.pushVC(regVC)
            }
           
        }
       
        
    }
}
