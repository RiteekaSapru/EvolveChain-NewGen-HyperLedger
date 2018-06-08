//
//  AddressVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 06/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class AddressVC: UIViewController,UITextFieldDelegate {

    @IBOutlet weak var txtfldCity: UITextField!
    @IBOutlet weak var txtfldState: UITextField!
    @IBOutlet weak var txtfldAddress2: UITextField!
    @IBOutlet weak var txtfldStreet: UITextField!
    @IBOutlet weak var txtfldAddressCountry: UITextField!
    @IBOutlet weak var txtfldAreaCode: UITextField!
    @IBOutlet weak var txtfldAddress1: UITextField!
    
    var completionHandler: (Int)->Void = {_ in }
    
    var addressCountry : Country?
    
    override func viewDidLoad() {
        super.viewDidLoad()
          fillData()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Methods
    func fillData() {
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete {
            txtfldAddress1.text = BasicDetailsModel.sharedInstance.add1
            txtfldAddress2.text = BasicDetailsModel.sharedInstance.add2
            txtfldStreet.text = BasicDetailsModel.sharedInstance.street
            txtfldCity.text = BasicDetailsModel.sharedInstance.city
            txtfldAreaCode.text = BasicDetailsModel.sharedInstance.zipCode
            txtfldState.text = BasicDetailsModel.sharedInstance.state
            txtfldAddressCountry.text = BasicDetailsModel.sharedInstance.country
        }
        if BasicDetailsModel.sharedInstance.countryType == .India {
            txtfldAddressCountry.text = "India"
        }
    }
    
    func checkValidation() -> Bool {
        if txtfldAddress1.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAdd1Empty)
            txtfldAddress1.becomeFirstResponder()
            return false;
        }
            //        else if txtfldAddress2.text?.count == 0{
            //            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAdd2Empty)
            //            return false;
            //        }
        else if txtfldStreet.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddStreetEmpty)
            txtfldStreet.becomeFirstResponder()
            return false;
        }
        else if txtfldCity.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringCityEmpty)
            txtfldCity.becomeFirstResponder()
            return false;
        }
        else if txtfldState.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringStateEmpty)
            txtfldState.becomeFirstResponder()
            return false;
        }
        else if txtfldAreaCode.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAreaCodeEmpty)
            txtfldAreaCode.becomeFirstResponder()
            return false;
        }
        else if (txtfldAreaCode.text?.count)! < 4{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAreaCodeIncorrect)
            txtfldAreaCode.becomeFirstResponder()
            return false;
        }
        else if txtfldAddressCountry.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringCountryEmpty)
            actionPickerAddCountry(UIButton())
            return false;
        }
        else{
            return true
        }
    }
    
    func saveAddressDetails() -> Void {
        
        BasicDetailsModel.sharedInstance.add1 = txtfldAddress1.text!
        BasicDetailsModel.sharedInstance.add2 = txtfldAddress2.text!
        BasicDetailsModel.sharedInstance.street = txtfldStreet.text!
        BasicDetailsModel.sharedInstance.city = txtfldCity.text!
        
        BasicDetailsModel.sharedInstance.state = txtfldState.text!
        BasicDetailsModel.sharedInstance.zipCode = txtfldAreaCode.text!
        BasicDetailsModel.sharedInstance.country = txtfldAddressCountry.text!
        
       uploadBasicDetails()
//        _navigator.popViewController(animated: true)

        //        GlobalMethods.sharedInstance.uploadBasicDetails()
    }
    
    //MARK: - Textfield
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if textField.tag == 10{
            textField.resignFirstResponder()
            self.actionPickerAddCountry(UIButton())
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
    
    
       //MARK: - Actions

    @IBAction func actionSave(_ sender: UIButton) {
        
        if checkValidation(){
             saveAddressDetails()
        }
        
    }
    
    @IBAction func actionPickerAddCountry(_ sender: Any) {
        self.view.endEditing(true)
        if BasicDetailsModel.sharedInstance.countryType == .NorthAmerica {
            let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
            
            customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
            
            let window = UIApplication.shared.keyWindow!
            
            window.addSubview(customPicker)
            
            window.bringSubview(toFront: customPicker)
            
            customPicker.showView()
            
            customPicker.setUpView(custom: false, customList: [],arrCountry: Country.getCountryArray(["USA","CMR"])!)
            
            customPicker.completionCountry = {
                (country ) in
                self.addressCountry = country
                self.txtfldAddressCountry.text = country.name
            }
        }
    }
    
    // MARK: - Webservice
    
    func uploadBasicDetails() {
        
        let filenameArray = ["file[]"]
        let image = GlobalMethods.sharedInstance.resizeImage(image: BasicDetailsModel.sharedInstance.userImage, targetSize: CGSize.init(width: 200.0, height: 200.0))
        let imagesArray = [image]
        
        NetworkManager.sharedInstance.POSTBasicDetails(params: BasicDetailsModel.sharedInstance.getBasicParamsForSaveKYC(), fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Basic Details Saved")
            BasicDetailsModel.sharedInstance.isAddressDetailsComplete = true
            self.completionHandler(1)
            GlobalMethods.sharedInstance.popVC()

        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
        
    }
}
