//
//  ChangePinVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 01/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ChangePinVC: UIViewController,UITextFieldDelegate,BackSpaceTextFieldDelegate  {

    @IBOutlet weak var vwOldPinHolder: UIView!
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
    
//    @IBOutlet weak var btnResend: UIButton!
    
//    var stringVerify : String = ""
//    var timerOtp : Timer?
//    var secCount : Int = 60
    
    override func viewDidLoad() {
        super.viewDidLoad()
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
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfld1.becomeFirstResponder()
//        startTimer()
    }
    
    // MARK: - Custom Methods
    
   
    func checkValidations() -> Bool {
        
        if txtfld1.text?.count == 0 || txtfld2.text?.count == 0 || txtfld3.text?.count == 0 || txtfld4.text?.count == 0 || txtfld5.text?.count == 0 || txtfld6.text?.count == 0{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Please enter previous pin")
            return false;
        }
        else if txtfld7.text?.count == 0 || txtfld8.text?.count == 0 || txtfld9.text?.count == 0 || txtfld10.text?.count == 0 || txtfld11.text?.count == 0 || txtfld12.text?.count == 0{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Please enter new pin.")
            return false;
        }
        else if txtfld13.text?.count == 0 || txtfld14.text?.count == 0 || txtfld15.text?.count == 0 || txtfld16.text?.count == 0 || txtfld17.text?.count == 0 || txtfld18.text?.count == 0{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Please  re enter new pin.")
            return false;
        }
        else if getNewPin() != getNewPinReEnter(){
            //            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Pins do not match.")
            clearPins()
            vwPinHolder.shakeView()
            vwRePinHolder.shakeView()
            txtfld7.becomeFirstResponder()
            return false;
        }
        else{
            self.view.endEditing(true)
            return true;
        }
        
    }
    
    func clearOldPin()  {
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
    
//    func shakeView(viewToShake:UIView)  {
//        let animation = CABasicAnimation(keyPath: "position")
//        animation.duration = 0.07
//        animation.repeatCount = 4
//        animation.autoreverses = true
//        animation.fromValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x - 5, y: viewToShake.center.y))
//        animation.toValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x + 5, y: viewToShake.center.y))
//
//        viewToShake.layer.add(animation, forKey: "position")
//    }
    
    func pinGenerated(msg:String) {
        let alert = UIAlertController.init(title: nil, message: msg + StringConstants.PinChangeText, preferredStyle: .alert)
        let defaultAction = UIAlertAction.init(title: StringConstants.okText, style: .cancel) { (alert: UIAlertAction!) in
            GlobalMethods.shared.cleanUpRegistrationData()
            GlobalMethods.shared.removeTempImages()
            self.resetToLogin()
        }
        alert.addAction(defaultAction)
        GlobalMethods.shared.presentVC(alert)

    }
    
    func resetToLogin() {
        DispatchQueue.main.async {
            FlowManager.shared.resetToLogin()
        }
    }
    
    func processResponse(data:Data,errorMsg:String) {
        do {
            if let jsonDict = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String,Any> {
                let errorCode = RawdataConverter.optionalString(jsonDict["error_code"])
                
                if errorCode == ErrorCode.INCORRECT_PIN.rawValue{
                    self.clearOldPin()
                    self.vwOldPinHolder.shakeView()
                    self.txtfld1.becomeFirstResponder()
                }
                else{
                    GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg)
                    self.clearOldPin()
                    self.clearPins()
                    self.vwOldPinHolder.shakeView()
                    self.vwPinHolder.shakeView()
                    self.vwRePinHolder.shakeView()
                    self.txtfld1.becomeFirstResponder()
                }
            }
            else{
                GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Please retry.")
            }
        }
        catch let error as NSError {
            print(error)
            
        }
    }
    
    // MARK: - Extract text
    
    func getOldPin() -> String {
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
            if nextTag == 19 {
                //call Validate
                if checkValidations(){
                    // Call API
                    self.view.endEditing(true)
                    self.changePin()
                }
            }
            else{
                nextResponder?.becomeFirstResponder()
                let textfldNext = nextResponder as! UITextField
                textfldNext.text = ""
                
            }
            
            
            return false
        }
        else if textField.text!.count > 0  && string.count > 0{
            return false
        }
        return true
        
    }
    
    // MARK: - Action
    
   
    
    @IBAction func actionVerify(_ sender: Any) {
        if checkValidations() {
            //Call API
            self.view.endEditing(true)
            self.changePin()
        }
    }
    
    // MARK: - Webservice
    
    func changePin() {
        
        let params = ["ekyc_id":BasicDetailsModel.shared.kycId,"pin":GlobalMethods.shared.convertToMD5(string: getOldPin()),"new_pin":GlobalMethods.shared.convertToMD5(string:getNewPin()),"vendor_uuid":GlobalMethods.shared.getUniqueIdForDevice()]
        
        NetworkManager.shared.changePinAPI(params: params, success: { (responseJson) in
            _userDefault.set(GlobalMethods.shared.convertToMD5(string: self.getNewPin()), forKey: kApplicationPinKey)
            self.pinGenerated(msg: RawdataConverter.string(responseJson["result"]))
        }) { [weak self] (errorMsg,data) in
            self?.processResponse(data: data!, errorMsg: errorMsg!)
        }
    }
}
