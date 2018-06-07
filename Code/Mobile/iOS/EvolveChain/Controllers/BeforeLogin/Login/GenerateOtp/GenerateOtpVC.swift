//
//  GenerateOtpVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class GenerateOtpVC: UIViewController {

    @IBOutlet weak var txtFldKycId: UITextField!
    
    var kycID : String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()

        if kycID.count > 0 {
            txtFldKycId.text = kycID
        }
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtFldKycId.becomeFirstResponder()
    }
    // MARK: - Custom

    func checkValidations() -> Bool {
        
        if txtFldKycId.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringKYCIDEmpty)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func moveToOtpVerify() -> Void {
        
        let setPinVCObj = self.storyboard?.instantiateViewController(withIdentifier: "SetPinVC") as! SetPinVC
        setPinVCObj.stringVerify = txtFldKycId.text!
        GlobalMethods.sharedInstance.pushVC(setPinVCObj)
    }

     // MARK: - Actions
    
    @IBAction func actionGetOtp(_ sender: Any) {
        if checkValidations() {
            self.view.endEditing(true)
           generatePin()
        }
    }
    
    // MARK: - Webservice
    
    func generatePin()  {
        
        let params = ["ekyc_id":txtFldKycId.text!]
        
        NetworkManager.sharedInstance.generateOtpForKydId(params: params, success: { (responseJson) in
            self.moveToOtpVerify()
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg!)
        }
    }
}
