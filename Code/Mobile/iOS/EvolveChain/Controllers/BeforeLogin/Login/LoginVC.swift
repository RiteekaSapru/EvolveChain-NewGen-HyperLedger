//
//  LoginVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class LoginVC: UIViewController, UITextFieldDelegate,BackSpaceTextFieldDelegate {

    @IBOutlet weak var txtfldKYCId: UITextField!
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    
    @IBOutlet weak var vwPinHolder: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        
        txtfldKYCId.text = "344565456462323786786"
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfldKYCId.becomeFirstResponder()
    }
    
     // MARK: - Custom Methods
    
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
        if txtfldKYCId.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringKYCIDEmpty)
            return false;
        }
        else if getPIN().count < 6{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPinEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
 // MARK: - Actions
    
    @IBAction func actionLogin(_ sender: Any) {
        
        if checkValidation() {
                loginAPI()
        }
    }
    
    @IBAction func actionGeneratePin(_ sender: Any) {
        let generateObj = self.storyboard?.instantiateViewController(withIdentifier: "GenerateOtpVC") as! GenerateOtpVC
        generateObj.kycID = txtfldKYCId.text!
        GlobalMethods.sharedInstance.pushVC(generateObj)
        
    }

    //MARK: - Textfield
    
    func textFieldDidDelete(textfield: BackSpaceTextfield) {
        if textfield.text!.count < 1 {
            let previousTag = textfield.tag - 1
            if previousTag > 7{
                let previousResponder = self.view?.viewWithTag(previousTag) as! BackSpaceTextfield
                previousResponder.text = ""
                previousResponder.becomeFirstResponder()
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

    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.tag == 0 {
            return true
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
                   
                    loginAPI()
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
    
    func loginAPI() {
        let pin = GlobalMethods.sharedInstance.convertToMD5(string: getPIN())
        let param = ["ekyc_id":txtfldKYCId.text!,"pin":pin,"vendor_uuid":UIDevice.current.identifierForVendor?.uuidString] as [String : Any]
        
        NetworkManager.sharedInstance.loginAPI(params: param, success: { (responseJson) in
          GlobalMethods.sharedInstance.loginUser(details: responseJson)
        }) { (errorMsg) in
            self.clearPin()
            self.shakeView(viewToShake: self.vwPinHolder)
        }
    }
}
