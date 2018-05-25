//
//  AddPhoneVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class AddPhoneVC: UIViewController {

    @IBOutlet weak var txtFldCountryCode: UITextField!
    
    @IBOutlet weak var txtfldPhoneNumber: UITextField!
     var selectedCountry : Country?
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
        
        txtfldPhoneNumber.becomeFirstResponder()
        
    }
    
    // MARK: - Methods
    
    func checkValidations() -> Bool {
        
        if txtfldPhoneNumber.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPhoneEmpty)
            return false;
        }
        else{
            return true;
        }
    }
    
    func moveToOtpVerify() -> Void {
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .PhoneVerification
        verifyOtpObj.stringVerifyCountryCode = txtFldCountryCode.text!
        verifyOtpObj.stringVerify = txtfldPhoneNumber.text!
        GlobalMethods.sharedInstance.pushVC(verifyOtpObj)
    }
    func openPicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: false, customList: [])
        
        customPicker.completionCountry = {
             (country ) in
            self.selectedCountry = country
            self.txtFldCountryCode.text = country.phoneCode
        }
        

    }
    // MARK: - Actions
    
    @IBAction func actionGetOtp(_ sender: Any) {
        if checkValidations() {
            //API Call
            self.view.endEditing(true)
            APIGetPhoneOtp(countryCode: txtFldCountryCode.text!,phoneNumner: txtfldPhoneNumber.text!)
        }
    }
    
    @IBAction func actionSelectCountry(_ sender: Any) {
        openPicker()
    }
    // MARK: - Webservice
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        NetworkManager.sharedInstance.generateMobileOTP(params: params, success: { (responseDict) in
            self.moveToOtpVerify()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
    }

}
