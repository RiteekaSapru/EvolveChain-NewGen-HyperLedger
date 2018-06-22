//
//  GenerateOtpVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class GenerateOtpVC: UIViewController,BackSpaceTextFieldDelegate,UITextFieldDelegate {

    @IBOutlet weak var txtFldKycId: NoCursorTextfield!
    
    var kycID : String = ""
    
//    var kycIdText:String = ""

    
    override func viewDidLoad() {
        super.viewDidLoad()

        txtFldKycId.backDelegate = self
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
        
        if txtFldKycId.text!.isEmpty {
            txtFldKycId.animatePlaceholderColor()
            txtFldKycId.becomeFirstResponder()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.KYCIDEmpty)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func moveToOtpVerify() -> Void {
        
        let setPinVCObj = self.storyboard?.instantiateViewController(withIdentifier: "SetPinVC") as! SetPinVC
        setPinVCObj.stringVerify = txtFldKycId.text!
        GlobalMethods.shared.pushVC(setPinVCObj)
    }

     // MARK: - Actions
    
    @IBAction func actionGetOtp(_ sender: Any) {
        if checkValidations() {
            self.view.endEditing(true)
           generatePin()
        }
    }
    
    //MARK: - Textfield
    
    func textFieldDidDelete(textfield: UITextField) {

//            var text = textfield.text

//            if text?.last == "-" {
//                text?.removeLast()
////                text?.removeLast()
//                textfield.text = text
//                //                textfield.text = changeTextToStar(stringToChange: kycIdText)
//            }
    }
    
        func textFieldShouldClear(_ textField: UITextField) -> Bool {
//            kycIdText = ""
            return true
        }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        if checkValidations(){
            
            generatePin()
        }
        return true
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        let offsetToUpdate = textField.text?.index(textField.text!.startIndex, offsetBy: range.location)
        let result = string.components(separatedBy: CharacterSet.alphanumerics.inverted).joined()


        if string == "" {
            if textField.text!.last! == "-" {
//                print(kycIdText)
                textField.text!.removeLast()
                textField.text!.removeLast()
//                textField.text = changeTextToStar(stringToChange: kycIdText)
                return false
            }
            else{
                textField.text!.remove(at: offsetToUpdate!)
            }
            return false
        }
        else if textField.text!.count >= 18 || result.count == 0{
            return false
        }
        else if result.count > 1{
            //                passwordText.insert(newChar!, at: offsetToUpdate)
//            let indexEnd = string.index(string.startIndex, offsetBy: 18 - kycIdText.count )
//            kycIdText.append(String(string[..<indexEnd]))
            for (_, char) in result.enumerated() {

                if textField.text!.count < 18{
                    textField.text!.append(char)
                    if textField.text!.count == 3 || textField.text!.count == 8 || textField.text!.count == 13{
                        textField.text!.append("-")
                    }
                }
            }
        }
        else{
            
            textField.text!.append(result.first!)
            if textField.text!.count == 3 || textField.text!.count == 8 || textField.text!.count == 13{
                textField.text!.append("-")
            }
        }
        return false
        
    }
    // MARK: - Webservice
    
    func generatePin()  {
        
        let params = ["ekyc_id":txtFldKycId.text!.uppercased()]
        
        NetworkManager.shared.generateOtpForKydId(params: params, success: { (responseJson) in
            self.moveToOtpVerify()
        }) { (errorMsg) in
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
}
