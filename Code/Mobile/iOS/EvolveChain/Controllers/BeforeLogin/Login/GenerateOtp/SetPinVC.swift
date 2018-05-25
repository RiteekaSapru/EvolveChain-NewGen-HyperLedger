//
//  SetPinVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SetPinVC: UIViewController,UITextFieldDelegate,BackSpaceTextFieldDelegate  {

    @IBOutlet weak var vwOTPHolder: UIView!
    @IBOutlet weak var vwPinHolder: UIView!
    @IBOutlet weak var vwRePinHolder: UIView!
    
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    
    @IBOutlet weak var txtfld7: BackSpaceTextfield!
    @IBOutlet weak var txtfld8: BackSpaceTextfield!
    @IBOutlet weak var txtfld9: BackSpaceTextfield!
    @IBOutlet weak var txtfld10: BackSpaceTextfield!
    @IBOutlet weak var txtfld11: BackSpaceTextfield!
    @IBOutlet weak var txtfld12: BackSpaceTextfield!
    
    @IBOutlet weak var txtfld13: BackSpaceTextfield!
    @IBOutlet weak var txtfld14: BackSpaceTextfield!
    @IBOutlet weak var txtfld15: BackSpaceTextfield!
    @IBOutlet weak var txtfld16: BackSpaceTextfield!
    @IBOutlet weak var txtfld17: BackSpaceTextfield!
    @IBOutlet weak var txtfld18: BackSpaceTextfield!
    
    @IBOutlet weak var btnResend: UIButton!
    
    var stringVerify : String = ""
    var timerOtp : Timer?
    var secCount : Int = 60
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        
        txtfld7.backDelegate = self
        txtfld8.backDelegate = self
        txtfld9.backDelegate = self
        txtfld10.backDelegate = self
        txtfld11.backDelegate = self
        txtfld12.backDelegate = self
        
        txtfld13.backDelegate = self
        txtfld14.backDelegate = self
        txtfld15.backDelegate = self
        txtfld16.backDelegate = self
        txtfld17.backDelegate = self
        txtfld18.backDelegate = self
        
        txtfld1.becomeFirstResponder()
        startTimer()
    }

     // MARK: - Custom Methods
    
    func startTimer() -> Void {
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
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: "Please enter OTP")
            return false;
        }
        else if txtfld7.text?.count == 0 || txtfld8.text?.count == 0 || txtfld9.text?.count == 0 || txtfld10.text?.count == 0 || txtfld11.text?.count == 0 || txtfld12.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: "Please enter new pin.")
            return false;
        }
        else if txtfld13.text?.count == 0 || txtfld14.text?.count == 0 || txtfld15.text?.count == 0 || txtfld16.text?.count == 0 || txtfld17.text?.count == 0 || txtfld18.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: "Please  re enter new pin.")
            return false;
        }
        else if getNewPin() != getNewPinReEnter(){
//            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: "Pins do not match.")
            clearPins()
            shakeView(viewToShake: vwPinHolder)
            shakeView(viewToShake: vwRePinHolder)
            txtfld7.becomeFirstResponder()
            return false;
        }
        else{
            self.view.endEditing(true)
            return true;
        }
        
    }
    
    func clearOTP()  {
        txtfld1.text = ""
        txtfld2.text = ""
        txtfld3.text = ""
        txtfld4.text = ""
        txtfld5.text = ""
        txtfld6.text = ""
        
    }
    
    func clearPins()  {

        txtfld7.text = ""
        txtfld8.text = ""
        txtfld9.text = ""
        txtfld10.text = ""
        txtfld11.text = ""
        txtfld12.text = ""
        
        txtfld13.text = ""
        txtfld14.text = ""
        txtfld15.text = ""
        txtfld16.text = ""
        txtfld17.text = ""
        txtfld18.text = ""
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
    
    func pinGenerated() {
        let alert = UIAlertController.init(title: nil, message: "Pin generated.", preferredStyle: .actionSheet)
        let defaultAction = UIAlertAction.init(title: "Okay", style: .cancel) { (alert: UIAlertAction!) in
            self.moveToLogin()
        }
        alert.addAction(defaultAction)
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func moveToLogin() {
        
        var viewControllers = _navigator.viewControllers
        viewControllers.removeLast(2) // views to pop
        navigationController?.setViewControllers(viewControllers, animated: true)
    }
    
     // MARK: - Extract text
    
    func getOTP() -> String {
        let otpStr = txtfld1.text!+txtfld2.text!+txtfld3.text!+txtfld4.text!+txtfld5.text!+txtfld6.text!
        
        return otpStr
    }
    
    func getNewPin() -> String {
        let pinStr = txtfld7.text!+txtfld8.text!+txtfld9.text!+txtfld10.text!+txtfld11.text!+txtfld12.text!
        
        return pinStr
    }
    
    func getNewPinReEnter() -> String {
        let pinStr = txtfld13.text!+txtfld14.text!+txtfld15.text!+txtfld16.text!+txtfld17.text!+txtfld18.text!
        
        return pinStr
    }
    
//    func moveToLogin() -> Void {
//
//        _navigator.popViewController(animated: true)
//    }
    
    // MARK: - Textfield
    
    func textFieldDidDelete(textfield: BackSpaceTextfield) {
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
            if nextTag == 19 {
                //call Validate
                if checkValidations(){
                    // Call API
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
    
    // MARK: - Action
    
    @IBAction func actionResend(_ sender: Any) {
        //Call API tp resend
        self.view.endEditing(true)
        clearOTP()
       self.generateOTP()
    }

    @IBAction func actionVerify(_ sender: Any) {
        if checkValidations() {
            //Call API
            self.view.endEditing(true)
            self.generatePin()
        }
    }
    
    // MARK: - Webservice
    
    func generatePin() {
        
        let params = ["ekyc_id":stringVerify,"pin_otp":GlobalMethods.sharedInstance.convertToMD5(string: getOTP()),"pin":GlobalMethods.sharedInstance.convertToMD5(string: getNewPin()),"vendor_uuid":UIDevice.current.identifierForVendor?.uuidString]
        
        NetworkManager.sharedInstance.setPinForKydId(params: params, success: { (responseJson) in
            self.pinGenerated()
        }) { (errorMsg) in
            self.clearOTP()
            self.clearPins()
            self.shakeView(viewToShake: self.vwOTPHolder)
            self.shakeView(viewToShake: self.vwPinHolder)
            self.shakeView(viewToShake: self.vwRePinHolder)
        }
    }
    
    // MARK: - Webservice
    
    func generateOTP()  {
        let params = ["ekyc_id":stringVerify]
        
        NetworkManager.sharedInstance.generateOtpForKydId(params: params, success: { (responseJson) in
            self.startTimer()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg!)
        }
    }
    
}