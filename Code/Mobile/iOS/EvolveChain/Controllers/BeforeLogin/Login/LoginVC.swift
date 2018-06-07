//
//  LoginVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class LoginVC: UIViewController, UITextFieldDelegate,BackSpaceTextFieldDelegate {

    @IBOutlet weak var txtfldKYCId: NoCursorTextfield!
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    @IBOutlet weak var lblTitle: UILabel!
    
    @IBOutlet weak var btnBack: UIButton!
    @IBOutlet weak var btnLogin: UIButton!
    @IBOutlet weak var vwPinHolder: UIView!
    
    @IBOutlet weak var btnGeneratePin: UIButton!
    
    var kycIdText:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        txtfldKYCId.backDelegate = self
        
        if let kyc = _userDefault.object(forKey: kApplicationKycIdKey) as? String{
            txtfldKYCId.text = changeTextToStar(stringToChange: kyc )
            kycIdText = kyc
        }
//        txtfldKYCId.text = changeTextToStar(stringToChange: (_userDefault.object(forKey: kApplicationKycIdKey) as? String)!)
        
        if (BasicDetailsModel.sharedInstance.isBasicDetailsComplete)
        {
            setupForPinCheck()
        }
        
        if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
        {
             btnBack.isHidden = true
        }
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        if txtfldKYCId.text!.count >= 18 {
            txtfld1.becomeFirstResponder()
        }
        else {
             txtfldKYCId.becomeFirstResponder()
        }
       
    }
    
     // MARK: - Custom Methods
    func setupForPinCheck() {

//        txtfldKYCId.isUserInteractionEnabled = false
        btnLogin.setTitle("Continue", for: .normal)
        btnGeneratePin.setTitle("Forgot Pin", for: .normal)
        btnBack.isHidden = true
        
        if GlobalMethods.sharedInstance.checkIfBioMetricSupported(){
            GlobalMethods.sharedInstance.beginBiometricID { (status) in
                print(status)
                let pin = _userDefault.object(forKey: kApplicationPinKey)
                let kyc = self.kycIdText.trimmingCharacters(in: .whitespaces)
                _userDefault.set(kyc, forKey: kApplicationKycIdKey)
                self.view.endEditing(true)
                self.loginAPI(kyc, pin as! String)
            }
        }
//        lblTitle.text = "Check Pin"
    }
    
    func changeTextToStar(stringToChange:String) -> String{
        var hashPassword = String()
        
        for index in 0..<stringToChange.count {
            
            let indexStart = stringToChange.index(stringToChange.startIndex, offsetBy: index)
            let indexEnd = stringToChange.index(stringToChange.startIndex, offsetBy: index+1)
            
            let newString = String(stringToChange[indexStart..<indexEnd])
            
            if index < 3 || index > 13 || newString == "-"{
                
                hashPassword += newString
            }
            else{
                hashPassword += "*"
            }
            
            
        }
        
        return hashPassword
    }
    
    func clearPin()  {
        txtfld1.text = ""
        txtfld2.text = ""
        txtfld3.text = ""
        txtfld4.text = ""
        txtfld5.text = ""
        txtfld6.text = ""
        
    }
    
    func getPIN() -> String {
        let otpStr = txtfld1.text!+txtfld2.text!+txtfld3.text!+txtfld4.text!+txtfld5.text!+txtfld6.text!
        
        return otpStr
    }
    
    func shakeView(viewToShake:UIView)  {
        let animation = CABasicAnimation(keyPath: "position")
        animation.duration = 0.07
        animation.repeatCount = 4
        animation.autoreverses = true
        animation.fromValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x - 5, y: viewToShake.center.y))
        animation.toValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x + 5, y: viewToShake.center.y))
        
        viewToShake.layer.add(animation, forKey: "position")
    }
    
    func checkValidation() -> Bool {
        if kycIdText.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringKYCIDEmpty)
            txtfldKYCId.becomeFirstResponder()
            return false;
        }
        else if getPIN().count < 6{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPinEmpty)
            self.clearPin()
            self.shakeView(viewToShake: self.vwPinHolder)
            self.txtfld1.becomeFirstResponder()
            return false;
        }
        else{
            return true
        }
    }
    
    func checkPin() {
        
//        if (_userDefault.object(forKey: kApplicationPinKey) != nil) {
//
//            let pin = _userDefault.object(forKey: kApplicationPinKey) as! String
//
//            if pin == GlobalMethods.sharedInstance.convertToMD5(string: getPIN()){
//                GlobalMethods.sharedInstance.popVC()
//            }
//            else{
//                self.clearPin()
//                self.shakeView(viewToShake: self.vwPinHolder)
//                txtfld1.becomeFirstResponder()
//            }
//        }
//        else{
        let pin = GlobalMethods.sharedInstance.convertToMD5(string: getPIN())
        let kyc = self.kycIdText.trimmingCharacters(in: .whitespaces)
        _userDefault.set(kyc, forKey: kApplicationKycIdKey)
            loginAPI(kyc, pin)
//        }
    }
    
    func processResponse(data:Data,errorMsg:String) {
        do {
            if let jsonDict = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String,Any> {
                let errorCode = RawdataConverter.optionalString(jsonDict["error_code"])
            
                if errorCode == ErrorCode.INCORRECT_EKYCID.rawValue{
                   self.txtfldKYCId.text = ""
                    self.kycIdText = ""
                    self.clearPin()
                    self.shakeView(viewToShake: self.txtfldKYCId)
                     self.txtfldKYCId.becomeFirstResponder()
                }
                else if errorCode == ErrorCode.INCORRECT_PIN.rawValue{
                    self.clearPin()
                    self.shakeView(viewToShake: self.vwPinHolder)
                    self.txtfld1.becomeFirstResponder()
                }
                else{
                   GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg)
                }
            }
            else{
            
            }
        }
        catch let error as NSError {
            print(error)
            
        }
    }
 // MARK: - Actions
    
    @IBAction func actionLogin(_ sender: Any) {
        
        if checkValidation() {
            self.view.endEditing(true)
            checkPin()
        }
    }
    
    @IBAction func actionGeneratePin(_ sender: Any) {
        let generateObj = self.storyboard?.instantiateViewController(withIdentifier: "GenerateOtpVC") as! GenerateOtpVC
        generateObj.kycID = kycIdText
        GlobalMethods.sharedInstance.pushVC(generateObj)
        
    }

    @IBAction func actionBack(_ sender: Any) {
        GlobalMethods.sharedInstance.popVC()
    }
    //MARK: - Textfield
    
    func textFieldDidDelete(textfield: UITextField) {
        if textfield.tag == 0 {
//            if kycIdText.last == "-" {
//                print(kycIdText)
//                kycIdText.removeLast()
////                textfield.text = changeTextToStar(stringToChange: kycIdText)
//            }
        }
        else{
            if textfield.text!.count < 1 {
                let previousTag = textfield.tag - 1
                if previousTag > 6{
                    let previousResponder = self.view?.viewWithTag(previousTag) as! BackSpaceTextfield
                    previousResponder.text = ""
                    previousResponder.becomeFirstResponder()
                }
            }
        }
        
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        // Try to find next responder
        if let nextField = self.view.viewWithTag(textField.tag + 1) as? UITextField {
            nextField.becomeFirstResponder()
        } else {
            // Not found, so remove keyboard.
            txtfld1.becomeFirstResponder()
        }
        // Do not add a line break
        return false
    }
    
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
         if textField.tag == 0 {
            kycIdText = ""
        }
        
        return true
    }

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.tag == 0 {
            
//            var hashPassword = String()
            let result = string.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
            let newChar = result.first
            let offsetToUpdate = kycIdText.index(kycIdText.startIndex, offsetBy: range.location)
            
            if string == "" {
                if kycIdText.last == "-" {
                    print(kycIdText)
                    kycIdText.removeLast()
                    kycIdText.removeLast()
                    textField.text = changeTextToStar(stringToChange: kycIdText)
                    return false
                }
                else{
                    kycIdText.remove(at: offsetToUpdate)
                }
                return true
            }
            else if kycIdText.count >= 18 || result.count == 0{
                return false
            }
            else if result.count > 1{
//                passwordText.insert(newChar!, at: offsetToUpdate)
                 let indexEnd = string.index(string.startIndex, offsetBy: 18 - kycIdText.count )
                kycIdText.append(String(string[..<indexEnd]))
            }
            else{
            
                 kycIdText.append(newChar!)
                if kycIdText.count == 3 || kycIdText.count == 8 || kycIdText.count == 13{
                    kycIdText.append("-")
                }
            }
           
            
            
//            for index in 0..<passwordText.count {
//                let indexStart = passwordText.index(passwordText.startIndex, offsetBy: index)
//                let indexEnd = passwordText.index(passwordText.startIndex, offsetBy: index+1)
//
//                let newString = String(passwordText[indexStart..<indexEnd])
//
//                if index < 3 || index > 13 || newString == "-"{
//
//                    hashPassword += newString
//                }
//                else{
//                     hashPassword += "*"
//                }
//
//
//            }
            textField.text = changeTextToStar(stringToChange: kycIdText)
            return false
//            return true
        }
        
        if textField.text!.count < 1  && string.count > 0{
            let nextTag = textField.tag + 1
            
            // get next responder
            var nextResponder = self.view?.viewWithTag(nextTag)
            
            if (nextResponder == nil){
                
                nextResponder = textField.superview?.viewWithTag(1)
            }
            textField.text = string
            if nextTag == 13 {
                //call Validate
                 textField.resignFirstResponder()
                if checkValidation(){
                    // Call API
                   
                    checkPin()
                }
            }
            else{
                nextResponder?.becomeFirstResponder()
                let textfldNext = nextResponder as! UITextField
                textfldNext.text = ""
                
            }
            
            
            return false
        }
        return true
        
    }
    
     //MARK: - Webservice
    
    func loginAPI(_ kycID:String,_ pinHash:String) {
        
        
       
        var param = ["ekyc_id":kycID,"pin":pinHash,"vendor_uuid":GlobalMethods.sharedInstance.getUniqueIdForDevice()] as [String : Any]
        
//        param.updateValue("25794606-8288-4C41-B1E9-79619C86914C", forKey: "vendor_uuid")
        
        NetworkManager.sharedInstance.loginAPI(params: param, success: { (responseJson) in

          GlobalMethods.sharedInstance.loginUser(details: responseJson, kyc_id:kycID, pin: pinHash)
        }) { (errorMsg,response) in
            
            _userDefault.removeObject(forKey: kApplicationKycIdKey)
            self.processResponse(data: response!, errorMsg: errorMsg!)
        }
    }
}
