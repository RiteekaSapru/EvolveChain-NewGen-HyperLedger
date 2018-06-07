//
//  BankDetailsVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//
enum BankDetailsType : String {
    case  AccountBankDetailsType
    case  PaypalBankDetailsType
}

import UIKit

class BankDetailsVC: UIViewController ,UITextFieldDelegate{

    @IBOutlet weak var tblvwBank: TableviewKeyboard!
    @IBOutlet weak var heightLayout: NSLayoutConstraint!
    
    @IBOutlet weak var txtfld1: UITextField!
    @IBOutlet weak var txtfld2: UITextField!
    @IBOutlet weak var txtfld3: UITextField!
    
    @IBOutlet weak var btnBankType: UIButton!
    
    var selectedDetailsType : BankDetailsType = .AccountBankDetailsType
    
    var arrTypes : [String] = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        arrTypes = ["Bank Account Details","PayPal Details"]
        setUpHeader();
        setBankDetails();
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom Methods
    func updateUI() -> Void {
        switch selectedDetailsType {
        case .AccountBankDetailsType:setBankDetails()
        case .PaypalBankDetailsType:setPaypalID()
            
        }
    }
    func setUpHeader() -> Void {
        let headerView = tblvwBank.tableHeaderView
        let newHeight = _screenSize.height - 70.0
        
        headerView?.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: newHeight)
        
        tblvwBank.tableHeaderView = headerView
    }
    
    func setBankDetails() {
        
        txtfld1.placeholder = "Account Number"
        txtfld2.placeholder = "IFSC "
        txtfld3.placeholder = "Bank Name"
        txtfld1.returnKeyType = .next
        self.btnBankType.setTitle(arrTypes[0], for: .normal)
        
        if heightLayout.constant != 150.0 {
            
            heightLayout.constant = 150.0
            
            UIView.animate(withDuration: 0.3) {
                self.view.layoutIfNeeded()
            }
            
        }
    }
    
    func setPaypalID() {
        txtfld1.placeholder = "PayPal ID"
        txtfld1.returnKeyType = .done
        self.btnBankType.setTitle(arrTypes[1], for: .normal)
        if heightLayout.constant != 50.0 {
            
            heightLayout.constant = 50.0
            
            UIView.animate(withDuration: 0.3) {
                self.view.layoutIfNeeded()
            }
            
        }
    }
    
    func openPicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: true, customList: arrTypes,arrCountry: [])
        
        customPicker.completionCustom = {
            (index ) in
            switch index {
            case 0:
                self.selectedDetailsType = .AccountBankDetailsType
            case 1:
                self.selectedDetailsType = .PaypalBankDetailsType
            default:
                break
            }
            self.updateUI()
        }
    }
    
    func checkBankDetailsValidation() -> Bool {
        if txtfld1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringAccountNumberIDEmpty)
            return false;
        }
        else if txtfld2.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIFSCEmpty)
            return false;
        }
        else if txtfld3.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringBankNameIDEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
    func checkValidationPayPal() -> Bool {
        if txtfld1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringPayPalIDEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
    func saveBankDetails() -> Void {
  
        switch selectedDetailsType {
        case .AccountBankDetailsType:
            BankDetailsModel.sharedInstance.number = txtfld1.text!
            BankDetailsModel.sharedInstance.ifsc = txtfld2.text!
            BankDetailsModel.sharedInstance.bankName = txtfld3.text!
            BankDetailsModel.sharedInstance.bankType = .AccountBankDetailsType
        case .PaypalBankDetailsType:
            BankDetailsModel.sharedInstance.payPalID = txtfld1.text!
            BankDetailsModel.sharedInstance.bankType = .PaypalBankDetailsType

        }
        
        BankDetailsModel.sharedInstance.isBankDetailsComplete = true
        _navigator.popViewController(animated: true)
    }
    
    //MARK: - Textfield
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if selectedDetailsType == .PaypalBankDetailsType{
            self.view.endEditing(true)
            return false
        }
        // Try to find next responder
        if let nextField = self.view.viewWithTag(textField.tag + 1) as? UITextField {
            nextField.becomeFirstResponder()
        } else {
            // Not found, so remove keyboard.
            textField.resignFirstResponder()
        }
        // Do not add a line break
        return false
    }
    
    // MARK: - Action
    @IBAction func actionSelectAddressType(_ sender: Any) {
        self.view.endEditing(true)
        openPicker()
        
    }
    
    @IBAction func actionSave(_ sender: Any) {
        
        switch selectedDetailsType {
        case .AccountBankDetailsType:
            if checkBankDetailsValidation(){
                saveBankDetails()
            }
        case .PaypalBankDetailsType:
            if checkValidationPayPal(){
                saveBankDetails()
            }
        }
    }
    
    


}
