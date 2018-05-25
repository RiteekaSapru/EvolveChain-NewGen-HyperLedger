//
//  AddressProofVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 18/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class AddressProofVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UITextFieldDelegate {

    @IBOutlet weak var tblvwAddress: TableviewKeyboard!
    @IBOutlet weak var heightLayout: NSLayoutConstraint!
    @IBOutlet weak var imgUtility: UIImageView!

    @IBOutlet weak var txtfldAreaCode: UITextField!
    @IBOutlet weak var txtfldAdd1: UITextField!
    @IBOutlet weak var txtfldAdd2: UITextField!
    @IBOutlet weak var txtfldState: UITextField!
    @IBOutlet weak var txtfldCountry: UITextField!
    
    @IBOutlet weak var btnAddressType: UIButton!
 
    var selectedAddressType : AddressType = .UtilityAddressType
    
    
    var arrTypes : [String] = []
    var addressImage : UIImage?
   
   
    override func viewDidLoad() {
        super.viewDidLoad()
        arrTypes = ["Utility Bill","Taxation Identity","SSN Identity"]
        
        setAddress();
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom Methods
//    func updateUI() -> Void {
//        switch selectedAddressType {
//        case .UtilityAddressType:setAddress()
//        case .TaxationAddressType:setTaxationID()
//        case .SSNAddressType:setSSNID()
//        }
//    }
    
    func setAddress() {
        
            txtfldAdd1.placeholder = "Address Line 1"
            txtfldAdd2.placeholder = "Address Line 2"
            txtfldState.placeholder = "State"
            txtfldCountry.placeholder = "Country"
            txtfldAreaCode.placeholder = "Area Code"
            txtfldAdd1.returnKeyType = .next
        self.btnAddressType.setTitle(arrTypes[0], for: .normal)
        
        if heightLayout.constant != 230.5 {
            
            let headerView = tblvwAddress.tableHeaderView
            let newHeight = (headerView?.frame.size.height)! + 180.5
            
            headerView?.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: newHeight)
            
            tblvwAddress.tableHeaderView = headerView
            
            heightLayout.constant = 230.5
            
            UIView.animate(withDuration: 0.3) {
                headerView?.layoutIfNeeded()
            }
            
        }
    }
    
    func setTaxationID() {
        txtfldAdd1.placeholder = "Taxation ID"
        txtfldAdd1.returnKeyType = .done
        self.btnAddressType.setTitle(arrTypes[1], for: .normal)
        if heightLayout.constant != 50.0 {
            
            let headerView = tblvwAddress.tableHeaderView
            let newHeight = (headerView?.frame.size.height)! - 180.5
            
            headerView?.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: newHeight)
            
            tblvwAddress.tableHeaderView = headerView
            
            heightLayout.constant = 50.0
            
            UIView.animate(withDuration: 0.3) {
                headerView?.layoutIfNeeded()
            }
            
        }
    }
    
    func setSSNID() {
        txtfldAdd1.placeholder = "SSN ID"
        txtfldAdd1.returnKeyType = .done
        self.btnAddressType.setTitle(arrTypes[1], for: .normal)
        if heightLayout.constant != 50.0 {
            
            let headerView = tblvwAddress.tableHeaderView
            let newHeight = (headerView?.frame.size.height)! - 180.5
            
            headerView?.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: newHeight)
            
            tblvwAddress.tableHeaderView = headerView
            
            heightLayout.constant = 50.0
            
            UIView.animate(withDuration: 0.3) {
                headerView?.layoutIfNeeded()
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
        
        customPicker.setUpView(custom: true, customList: arrTypes)
        
        customPicker.completionCustom = {
            (index ) in
//            switch index {
//            case 0:
//                self.selectedAddressType = .UtilityAddressType
//            case 1:
//                self.selectedAddressType = .TaxationAddressType
//            case 2:
//                self.selectedAddressType = .SSNAddressType
//            default:
//                break
//            }
//            self.updateUI()
//
        }
        
        
    }
    
    func openCamera()
    {
        if(UIImagePickerController .isSourceTypeAvailable(UIImagePickerControllerSourceType.camera))
        {
            let imagePicker = UIImagePickerController()
            imagePicker.delegate = self
            imagePicker.sourceType = UIImagePickerControllerSourceType.camera
            imagePicker.allowsEditing = false
            self.present(imagePicker, animated: true, completion: nil)
        }
        else
        {
            let alert  = UIAlertController(title: "Warning", message: "You don't have camera", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            self.present(alert, animated: true, completion: nil)
        }
    }
    
    func openGallary()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        self.present(imagePicker, animated: true, completion: nil)
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            // imageViewPic.contentMode = .scaleToFill
            
                imgUtility.image = pickedImage
                addressImage = pickedImage
            
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
    func checkValidationUtiltity() -> Bool {
        if txtfldAdd1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringAdd1Empty)
            return false;
        }
        else if txtfldAdd2.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAdd2Empty)
            return false;
        }
        else if txtfldState.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringStateEmpty)
            return false;
        }
        else if txtfldCountry.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringCountryEmpty)
            return false;
        }
        else if txtfldAreaCode.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAreaCodeEmpty)
            return false;
        }
        else if addressImage == nil{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringUtilityEmpty)
            return false;
        }
       
        else{
            return true
        }
    }
  
    func checkValidationTaxation() -> Bool {
        if txtfldAdd1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringTaxationIDEmpty)
            return false;
        }
        else if addressImage == nil{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringUtilityEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
    func checkValidationSSN() -> Bool {
        if txtfldAdd1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:stringSSNIDEmpty)
            return false;
        }
        else if addressImage == nil{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringUtilityEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
//    func saveAddressDetails() -> Void {
//        switch selectedAddressType {
//        case .UtilityAddressType:
//            AddressProofModel.sharedInstance.add1 = txtfldAdd1.text!
//            AddressProofModel.sharedInstance.add2 = txtfldAdd2.text!
//            AddressProofModel.sharedInstance.state = txtfldState.text!
//            AddressProofModel.sharedInstance.country = txtfldCountry.text!
//            AddressProofModel.sharedInstance.areaCode = txtfldAreaCode.text!
//            AddressProofModel.sharedInstance.addressType = .UtilityAddressType
//        case .TaxationAddressType:
//            AddressProofModel.sharedInstance.taxationID = txtfldAdd1.text!
//            AddressProofModel.sharedInstance.addressType = .TaxationAddressType
//        case .SSNAddressType:
//            AddressProofModel.sharedInstance.SSNiD = txtfldAdd1.text!
//            AddressProofModel.sharedInstance.addressType = .SSNAddressType
//        }
//
//        AddressProofModel.sharedInstance.addressImage = addressImage!
//        AddressProofModel.sharedInstance.isAddressDetailsComplete = true
//        _navigator.popViewController(animated: true)
//
//    }
    
    //MARK: - Textfield
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if selectedAddressType != .UtilityAddressType{
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
    
    
    

    @IBAction func actionSelectAddressImage(_ sender: Any) {
        self.view.endEditing(true)
    
        GlobalMethods.sharedInstance.showAlertForImagePicker { (index) in
            switch index{
            case 1 : self.openCamera()
            case 2: self.openGallary()
            default:
                break
            }
        }
    }
    
    
    @IBAction func actionSave(_ sender: Any) {
        
//        switch selectedAddressType {
//        case .UtilityAddressType:
//            if checkValidationUtiltity(){
//                saveAddressDetails()
//            }
//        case .TaxationAddressType:
//            if checkValidationTaxation(){
//                saveAddressDetails()
//            }
//        case .SSNAddressType:
//            if checkValidationSSN(){
//                saveAddressDetails()
//            }
//
//    }
    }
}
