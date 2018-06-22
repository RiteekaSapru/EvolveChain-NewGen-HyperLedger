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
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfldAddress1.becomeFirstResponder()
    }
    
    // MARK: - Methods
    func fillData() {
        if BasicDetailsModel.shared.isAddressDetailsComplete {
            txtfldAddress1.text = BasicDetailsModel.shared.add1
            txtfldAddress2.text = BasicDetailsModel.shared.add2
            txtfldStreet.text = BasicDetailsModel.shared.street
            txtfldCity.text = BasicDetailsModel.shared.city
            txtfldAreaCode.text = BasicDetailsModel.shared.zipCode
            txtfldState.text = BasicDetailsModel.shared.state
            txtfldAddressCountry.text = BasicDetailsModel.shared.country
        }
        else{
            txtfldAddressCountry.text = SignupConfigModel.shared.selectedCountry.name
        }
//        if BasicDetailsModel.shared.countryType == .India {
//            txtfldAddressCountry.text = "India"
//        }
    }
    
    func checkValidation() -> Bool {
        if txtfldAddress1.text!.isEmpty{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.Add1Empty)
            txtfldAddress1.animatePlaceholderColor()
            txtfldAddress1.becomeFirstResponder()
            return false;
        }
            //        else if txtfldAddress2.text?.count == 0{
            //            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.Add2Empty)
            //            return false;
            //        }
        else if txtfldStreet.text!.isEmpty{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.AddStreetEmpty)
            txtfldStreet.animatePlaceholderColor()
            txtfldStreet.becomeFirstResponder()
            return false;
        }
        else if txtfldCity.text!.isEmpty{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.CityEmpty)
            txtfldCity.animatePlaceholderColor()
            txtfldCity.becomeFirstResponder()
            return false;
        }
        else if txtfldState.text!.isEmpty{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.StateEmpty)
            txtfldState.animatePlaceholderColor()
            txtfldState.becomeFirstResponder()
            return false;
        }
        else if txtfldAreaCode.text!.isEmpty{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.AreaCodeEmpty)
            txtfldAreaCode.animatePlaceholderColor()
            txtfldAreaCode.becomeFirstResponder()
            return false;
        }
        else if (txtfldAreaCode.text?.count)! < 4{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.AreaCodeIncorrect)
            txtfldAreaCode.becomeFirstResponder()
            return false;
        }
        else if txtfldAddressCountry.text!.isEmpty{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.CountryEmpty)
            actionPickerAddCountry(UIButton())
            return false;
        }
        else{
            return true
        }
    }
    
    func saveAddressDetails() -> Void {
        
        BasicDetailsModel.shared.add1 = txtfldAddress1.text!
        BasicDetailsModel.shared.add2 = txtfldAddress2.text!
        BasicDetailsModel.shared.street = txtfldStreet.text!
        BasicDetailsModel.shared.city = txtfldCity.text!
        
        BasicDetailsModel.shared.state = txtfldState.text!
        BasicDetailsModel.shared.zipCode = txtfldAreaCode.text!
        BasicDetailsModel.shared.country = txtfldAddressCountry.text!
        
       uploadBasicDetails()
//        _navigator.popViewController(animated: true)

        //        GlobalMethods.shared.uploadBasicDetails()
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
        if BasicDetailsModel.shared.countryType == .NorthAmerica {
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
        let image = GlobalMethods.shared.resizeImage(image: BasicDetailsModel.shared.userImage, targetSize: CGSize.init(width: 200.0, height: 200.0))
        let imagesArray = [image]
        
        NetworkManager.shared.POSTBasicDetails(params: BasicDetailsModel.shared.getBasicParamsForSaveKYC(), fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Basic Details Saved")
            BasicDetailsModel.shared.isAddressDetailsComplete = true
            self.completionHandler(1)
            GlobalMethods.shared.popVC()

        }) { (errorMsg) in
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
        
    }
}
