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
}

import UIKit

class VerifyOtpVC: UIViewController {

    @IBOutlet weak var txtfldOtp: UITextField!
    @IBOutlet weak var btnResend: UIButton!
    var verificationType : VerifyOtpType = .EmailVerification
    var stringVerify : String = ""
    var stringVerifyCountryCode : String = ""
    var timerOtp : Timer?
    var secCount : Int = 60
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfldOtp.becomeFirstResponder()
        startTimer()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func startTimer() -> Void {
        timerOtp?.invalidate()
        timerOtp = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(updateResendBtn), userInfo: nil, repeats: true)
    }

   @objc func updateResendBtn() -> Void {
        if secCount <= 0 {
            timerOtp?.invalidate()
            secCount = 60
            btnResend.isUserInteractionEnabled = true
            btnResend.backgroundColor = color_green
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
        
        if txtfldOtp.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringOtpEmpty)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func moveToBasic() -> Void {
        var viewControllers = _navigator.viewControllers
        viewControllers.removeLast(2) // views to pop
        _navigator.setViewControllers(viewControllers, animated: true)
    }
    
    func saveData() -> Void {
        switch verificationType{
        case .EmailVerification: saveUserEmail()
        case .PhoneVerification:saveUserPhone()
            
        }
    }
    func saveUserEmail() -> Void {
        //Save email to model
        BasicDetailsModel.sharedInstance.isEmailVerified  = true
        BasicDetailsModel.sharedInstance.email  = stringVerify
        moveToBasic()
    }
    
    func saveUserPhone() -> Void {
        //Save email to model
        BasicDetailsModel.sharedInstance.isPhoneVerified  = true
        BasicDetailsModel.sharedInstance.contactNumber  = stringVerify
        BasicDetailsModel.sharedInstance.countryCode  = stringVerifyCountryCode

        moveToBasic()
    }
    
    // MARK: - Actions
    
    @IBAction func actionResend(_ sender: Any) {
        //Call API tp resend
        switch verificationType{
        case .EmailVerification:APIGetEMailOtp(email: stringVerify)
        case .PhoneVerification:APIGetPhoneOtp(countryCode: stringVerifyCountryCode, phoneNumner: stringVerify)
            
        }
        
        
        
    }
    
    @IBAction func actionVerify(_ sender: Any) {
        if checkValidations() {
            //Call API
             self.view.endEditing(true)
            switch verificationType{
            case .EmailVerification:APIVerifyEmail(otpString: GlobalMethods.sharedInstance.convertToMD5(string: txtfldOtp.text!))
            case .PhoneVerification:APIVerifyPhone(otpString: GlobalMethods.sharedInstance.convertToMD5(string: txtfldOtp.text!))
                
            }
           
            
           
        }
    }

 // MARK: - WebService
    func APIVerifyEmail(otpString:String) -> Void {
        let params = ["email":stringVerify,"email_code":otpString]
        NetworkManager.sharedInstance.verifyEmailOTP(params: params, success: { (responseDict) in
            self.saveUserEmail()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        NetworkManager.sharedInstance.generateMobileOTP(params: params, success: { (responseDict) in
            self.startTimer()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }
    func APIVerifyPhone(otpString:String) -> Void {
        let params = ["mobile":stringVerify,"phone_code":otpString,"country_code":stringVerifyCountryCode]
        
        NetworkManager.sharedInstance.verifyMobileOTP(params: params, success: { (responseDict) in
            self.saveUserPhone()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }
    
    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        
        NetworkManager.sharedInstance.generateEmailOTP(params: params, success: { (responseDict) in
            self.startTimer()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }
}
