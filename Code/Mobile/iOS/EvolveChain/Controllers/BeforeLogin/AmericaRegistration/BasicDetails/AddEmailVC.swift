//
//  AddEmailVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class AddEmailVC: UIViewController {

    @IBOutlet weak var txtfldEmail: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfldEmail.becomeFirstResponder()
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func checkValidations() -> Bool {
        
        if txtfldEmail.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailEmpty)
            return false;
        }
        else if !GlobalMethods.sharedInstance.isValidEmail(testStr: txtfldEmail.text!){
             GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailInvalid)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func moveToOtpVerify() -> Void {
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .EmailVerification
        verifyOtpObj.stringVerify = txtfldEmail.text!
        
        GlobalMethods.sharedInstance.pushVC(verifyOtpObj)
    }
    // MARK: - Actions

    @IBAction func actionGetOtp(_ sender: UIButton) {
        
        
        if checkValidations() {
            //API Call
            self.view.endEditing(true)
            APIGetEMailOtp(email: txtfldEmail.text!)
        }
    }
    // MARK: - Webservice
    
    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        
        NetworkManager.sharedInstance.generateEmailOTP(params: params, success: { (responseDict) in
             self.moveToOtpVerify()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }

}
