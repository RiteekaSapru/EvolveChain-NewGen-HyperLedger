//
//  VerifyOtpVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

enum VerifyOtpType : String {
    case  EmailVerification
    case  PhoneVerification
    case  EditVerification
}

import UIKit

class VerifyOtpVC: UIViewController,UITextFieldDelegate,BackSpaceTextFieldDelegate {

    var completionHandler: ()->Void = {}
    
    @IBOutlet weak var activityIndicatorLoader: UIActivityIndicatorView!
    @IBOutlet weak var vwPinHolder: UIView!
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    
    @IBOutlet weak var vwVerificationDone: UIView!
    @IBOutlet weak var btnResend: UIButton!
    var verificationType : VerifyOtpType = .EmailVerification
    var stringVerify : String = ""
    var stringVerifyCountryCode : String = ""
    var timerOtp : Timer?
    var secCount : Int = 60
    
    var stringAppKey : String = ""
    
    @IBOutlet weak var vwBg: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        vwVerificationDone.isHidden = true
        // Do any additional setup after loading the view.
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        UIView.animate(withDuration: 0.3) {
            self.vwBg.alpha = 0.4
        }
//        txtfldOtp.becomeFirstResponder()
        startTimer()
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        
        txtfld1.becomeFirstResponder()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
//        NotificationCenter.default.addObserver(self, selector: #selector(VerifyOtpVC.methodOfReceivedNotification), name: notificationName, object: nil)

    }
    
     // MARK: - Custom Methods
    
    
    func startTimer() -> Void {
        btnResend.backgroundColor = UIColor.lightGray
//        btnResend.setTitle("Resend in 00:0" + String(secCount), for: .normal)
        timerOtp?.invalidate()
        timerOtp = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(updateResendBtn), userInfo: nil, repeats: true)
    }

   @objc func updateResendBtn() -> Void {
        if secCount <= 0 {
            timerOtp?.invalidate()
            secCount = 60
            btnResend.isUserInteractionEnabled = true
            btnResend.backgroundColor = UIColor.init(red: 74.0/255.0, green: 177.0/255.0, blue: 157.0/255.0, alpha: 1.0)
            btnResend.setTitle("Resend", for: .normal)
        }
        else {
  
            secCount = secCount - 1
            btnResend.isUserInteractionEnabled = false
            btnResend.backgroundColor = UIColor.lightGray
            if secCount < 10
            {
                  btnResend.setTitle("Resend in 00:0" + String(secCount), for: .normal)
            }
            else{
                  btnResend.setTitle("Resend in 00:" + String(secCount), for: .normal)
            }
          
        }
    }
    
    func checkValidations() -> Bool {
        
        if txtfld1.text?.count == 0 || txtfld2.text?.count == 0 || txtfld3.text?.count == 0 || txtfld4.text?.count == 0 || txtfld5.text?.count == 0 || txtfld6.text?.count == 0{
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func moveToEdit(){
       
        
        completionHandler()
        DispatchQueue.main.async {
            
            self.vwVerificationDone.alpha = 0.0
            self.view.endEditing(true)
            self.vwVerificationDone.isHidden = false
            
            UIView.animate(withDuration: 0.3) {
                self.vwVerificationDone.alpha = 1.0
            }
        }
        
        
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+0.7) {
            UIView.animate(withDuration: 0.3, animations: {
                self.vwBg.alpha = 0.0
            }) { (complete) in
                if complete{
                    self.dismiss(animated: true, completion: {
                         Util.shared.showLoader(loadingText: "   Loading Data...")
                    })
                }
            }
        }
        
    }
    
    func moveToBasic() -> Void {
        
        completionHandler()
        DispatchQueue.main.async {
            
            self.vwVerificationDone.alpha = 0.0
            self.view.endEditing(true)
            self.vwVerificationDone.isHidden = false
            
            UIView.animate(withDuration: 0.3) {
                self.vwVerificationDone.alpha = 1.0
            }
        }

        
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+0.7) {
            self.actionClose(UIButton())
        }
        
    }
    
     // MARK: - Save
    
//    func saveData() -> Void {
//        switch verificationType{
//        case .EmailVerification: saveUserEmail()
//        case .PhoneVerification:saveUserPhone()
//
//        case .EditVerification:return
//
//        }
//    }
    func saveUserEmail() -> Void {
        //Save email to model
        BasicDetailsModel.shared.isEmailVerified  = true
        BasicDetailsModel.shared.email  = stringVerify
        moveToBasic()
    }
    
    func saveUserPhone() -> Void {
        //Save email to model
        BasicDetailsModel.shared.isPhoneVerified  = true
        BasicDetailsModel.shared.contactNumber  = stringVerify
        BasicDetailsModel.shared.countryCode  = stringVerifyCountryCode.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)

        moveToBasic()
    }
    
     // MARK: - Validate
    
    func validateAllFields() -> Void {
        let otpStr = txtfld1.text!+txtfld2.text!+txtfld3.text!+txtfld4.text!+txtfld5.text!+txtfld6.text!
        
        if otpStr.count == 6 {
            //call API
            switch verificationType{
                case .EmailVerification:APIVerifyEmail(otpString: Util.shared.convertToMD5(string: otpStr))
                case .PhoneVerification:APIVerifyPhone(otpString: Util.shared.convertToMD5(string: otpStr))
            case .EditVerification:resubmitInitialiseOTP(otpString:Util.shared.convertToMD5(string: otpStr))
            }
            self.view.endEditing(true)
        }
    }
    
    func clearAllFields()  {
        txtfld1.text = ""
        txtfld2.text = ""
        txtfld3.text = ""
        txtfld4.text = ""
        txtfld5.text = ""
         txtfld6.text = ""
        txtfld1.becomeFirstResponder()
    }
    
//    func shakeView()  {
//        let animation = CABasicAnimation(keyPath: "position")
//        animation.duration = 0.07
//        animation.repeatCount = 4
//        animation.autoreverses = true
//        animation.fromValue = NSValue(cgPoint: CGPoint(x: vwPinHolder.center.x - 2, y: vwPinHolder.center.y))
//        animation.toValue = NSValue(cgPoint: CGPoint(x: vwPinHolder.center.x + 2, y: vwPinHolder.center.y))
//        
//        vwPinHolder.layer.add(animation, forKey: "position")
//    }
    // MARK: - Textfield
    
    func textFieldDidDelete(textfield: UITextField) {
        if textfield.text!.count < 1 {
            let previousTag = textfield.tag - 1
            if previousTag > 0{
                let previousResponder = self.view?.viewWithTag(previousTag) as! BackSpaceTextfield
                previousResponder.text = ""
                previousResponder.becomeFirstResponder()
            }
        }
    }

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.text!.count < 1  && string.count > 0{
            let nextTag = textField.tag + 1
            
            // get next responder
            var nextResponder = self.view?.viewWithTag(nextTag)
            
            if (nextResponder == nil){
                
                nextResponder = textField.superview?.viewWithTag(1)
            }
            textField.text = string
            if nextTag == 7 {
                //call Validate
                validateAllFields()
            }
            else{
                 nextResponder?.becomeFirstResponder()
                let textfldNext = nextResponder as! UITextField
                textfldNext.text = ""
//                textfldNext.selectedTextRange = textfldNext.textRange(from: textfldNext.beginningOfDocument, to: textfldNext.endOfDocument)

            }
           
            
            return false
        }
        else if textField.text!.count > 0  && string.count > 0 {
            return false
        }
//        else if textField.text!.count >= 1  && string.count == 0{
//            // on deleting value from Textfield
//            let previousTag = textField.tag - 1
//
//            // get next responder
//            var previousResponder = self.view?.viewWithTag(previousTag)
//
//            if (previousResponder == nil){
//                previousResponder = self.view?.viewWithTag(1)
//            }
//            textField.text = ""
//            previousResponder?.becomeFirstResponder()
//            return false
//        }
        return true
        
    }
    
    // MARK: - Actions
    
    @IBAction func actionResend(_ sender: Any) {
        //Call API tp resend
        switch verificationType{
        case .EmailVerification:APIGetEMailOtp(email: stringVerify.lowercased())
        case .PhoneVerification:APIGetPhoneOtp(countryCode: stringVerifyCountryCode, phoneNumner: stringVerify.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined())
        case .EditVerification:generateOTP(countryCode: stringVerifyCountryCode, phoneNumner: stringVerify.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined())
        }
        btnResend.isUserInteractionEnabled = false
        self.view.endEditing(true)
        
    }
    
    @IBAction func actionVerify(_ sender: Any) {
        if checkValidations() {
            //Call API
//             self.view.endEditing(true)
//            switch verificationType{
//            case .EmailVerification:APIVerifyEmail(otpString: GlobalMethods.shared.convertToMD5(string: txtfldOtp.text!))
//            case .PhoneVerification:APIVerifyPhone(otpString: GlobalMethods.shared.convertToMD5(string: txtfldOtp.text!))
//
//            }
           
            
           
        }
    }
    @IBAction func actionClose(_ sender: Any) {
        UIView.animate(withDuration: 0.3, animations: {
            self.vwBg.alpha = 0.0
        }) { (complete) in
            if complete{
                self.completionHandler()
                self.dismiss(animated: true, completion: nil)
            }
        }
        
    }
    
 // MARK: - WebService
    func APIVerifyEmail(otpString:String) -> Void {
        btnResend.isUserInteractionEnabled = false
        let params = ["email":stringVerify,"email_code":otpString]
       activityIndicatorLoader.startAnimating()
        NetworkManager.shared.verifyEmailOTP(params: params, success: { [weak self] (responseDict) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.btnResend.isUserInteractionEnabled = true
            }
            self?.saveUserEmail()
        }) { [weak self] (errorMsg) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.clearAllFields()
                self?.vwPinHolder.shakeView()
                self?.btnResend.isUserInteractionEnabled = true
            }
        }
    }
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        let result = countryCode.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)
        
        let params = ["mobile":phoneNumner,"country_code":result]
        activityIndicatorLoader.startAnimating()
        NetworkManager.shared.generateMobileOTP(params: params, success: {  [weak self]  (responseDict) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.startTimer()
                self?.clearAllFields()
            }
            
        }) { [weak self] (errorMsg) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.btnResend.isUserInteractionEnabled = true
            }
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
    }
    func APIVerifyPhone(otpString:String) -> Void {
        let result = stringVerifyCountryCode.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)

        let params = ["mobile":stringVerify,"phone_code":otpString,"country_code":result]
        activityIndicatorLoader.startAnimating()
         btnResend.isUserInteractionEnabled = false
        NetworkManager.shared.verifyMobileOTP(params: params, success: { [weak self] (responseDict) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.btnResend.isUserInteractionEnabled = true
            }
            self?.saveUserPhone()
        }) { [weak self] (errorMsg) in
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
            DispatchQueue.main.async {
                    self?.activityIndicatorLoader.stopAnimating()
                self?.clearAllFields()
                self?.vwPinHolder.shakeView()
                self?.btnResend.isUserInteractionEnabled = true
            }
         
           
        }
    }
    
    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        activityIndicatorLoader.startAnimating()
        NetworkManager.shared.generateEmailOTP(params: params, success: { [weak self] (responseDict) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.startTimer()
                self?.clearAllFields()
            }
            
        }) { [weak self] (errorMsg) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.btnResend.isUserInteractionEnabled = true
            }
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
    }
    
    // MARK: - Response
    
    func processGetOTP(responseJSON:Dictionary<String,Any>)  {
        
        stringAppKey = RawdataConverter.string(responseJSON["key"])
        activityIndicatorLoader.stopAnimating()
        clearAllFields()
        startTimer()
    }
    
    func processResubmitResponse(responseJSON:Dictionary<String,Any>)  {
        
        DispatchQueue.global(qos: .default).async {
            Util.shared.processEditResponse(responesJSON: responseJSON)
        }
    }
    
    // MARK: - Edit Web Service
    
    func generateOTP(countryCode:String,phoneNumner:String) {
        
        activityIndicatorLoader.startAnimating()
        let result = countryCode.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)
        let params = ["mobile":phoneNumner,"isd_code":result,"vendor_uuid":Util.shared.getUniqueIdForDevice()] as [String : Any]
        
        NetworkManager.shared.getEditOTPAPI(params: params, success: { (responseJSON) in
            DispatchQueue.main.async {
                self.processGetOTP(responseJSON: responseJSON)
            }
        }) { [weak self](errorMsg, data) in
//            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.btnResend.isUserInteractionEnabled = true
            }
        }
    }
    
    func resubmitInitialiseOTP(otpString:String) {
        
        activityIndicatorLoader.startAnimating()
        
        let params = ["resubmit_pin":otpString,"vendor_uuid":Util.shared.getUniqueIdForDevice(),"appkey":stringAppKey]
        
        NetworkManager.shared.verifyEditOTPAPI(params: params, success: { (responseJSON) in
            DispatchQueue.main.async {
                self.activityIndicatorLoader.stopAnimating()
                self.btnResend.isUserInteractionEnabled = true
                self.moveToEdit()
//                 _userDefault.set(responseJSON, forKey: "edit_response")
                self.processResubmitResponse(responseJSON: responseJSON)
            }
        }) { [weak self] (errorMsg, data) in
            DispatchQueue.main.async {
                self?.activityIndicatorLoader.stopAnimating()
                self?.clearAllFields()
                self?.vwPinHolder.shakeView()
                self?.btnResend.isUserInteractionEnabled = true
            }
            //            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
            
        }
    }
}
