//
//  BasicDetailsAmerica.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class BasicDetailsAmericaVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UITextFieldDelegate {

    @IBOutlet weak var txtfldFName: UITextField!
    @IBOutlet weak var txtfldMName: UITextField!
    @IBOutlet weak var txtfldLName: UITextField!
    
   
    @IBOutlet weak var txtfldBirthPlace: UITextField!
    @IBOutlet weak var txtfldDOB: UITextField!
    
    @IBOutlet weak var btnAddEmail: UIButton!
  
    
    @IBOutlet weak var btnAddPhone: UIButton!
   
    @IBOutlet weak var txtfldCountryCode: UITextField!
    @IBOutlet weak var tblvwBasic: UITableView!
    @IBOutlet var vwMain: UIView!
    @IBOutlet weak var lblEmail: UILabel!
    @IBOutlet weak var lblPhone: UILabel!
    @IBOutlet weak var vwPhone: UIView!
    @IBOutlet weak var vwEmail: UIView!
    @IBOutlet weak var imgUserPic: UIImageView!
    
    @IBOutlet weak var txtfldPhone: UITextField!
    @IBOutlet weak var txtfldEmail: UITextField!
    var userImage : UIImage?
    var datePicker : UIDatePicker?
    var dateformatter : DateFormatter = DateFormatter.init()
    var dateDOB : Date!
    
     var selectedCountry : Country?
    
     var completionHandler: (Int)->Void = {_ in }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        datePicker = GlobalMethods.sharedInstance.getDatePicker(controller:self,txtFld: txtfldDOB, doneAction: #selector(doneMethod), cancelAction: #selector(cancelMethod))
        datePicker?.maximumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.minAge, after: false)
        datePicker?.minimumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.maxAge, after: false)
        dateformatter.dateFormat = "dd MMM yyyy"
        tblvwBasic.tableHeaderView = vwMain
        
        setEmailForDev()
//        fillData()
       
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
//       setupUI()
    }
     // MARK: - Methods
    fileprivate func setEmailAndPhone() {
        if BasicDetailsModel.sharedInstance.isEmailVerified{
            vwEmail.isHidden = false
            vwEmail.alpha = 1.0
            txtfldEmail.text = BasicDetailsModel.sharedInstance.email
            btnAddEmail.isSelected = true
        }
        if BasicDetailsModel.sharedInstance.isPhoneVerified{
            vwPhone.isHidden = false
            vwPhone.alpha = 1.0
            txtfldPhone.text = BasicDetailsModel.sharedInstance.contactNumber
            txtfldCountryCode.text = "+" + BasicDetailsModel.sharedInstance.countryCode
            btnAddPhone.isSelected = true
        }
    }
    
    func setupUI() -> Void {
        setEmailAndPhone()
    }
    
    func fillData() {
        
        txtfldCountryCode.text = "+" + SignupConfigModel.sharedInstance.selectedCountry.phoneCode
        
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete {
            setEmailAndPhone()
            txtfldFName.text = BasicDetailsModel.sharedInstance.fname
            txtfldMName.text = BasicDetailsModel.sharedInstance.mname
            txtfldLName.text = BasicDetailsModel.sharedInstance.lname
            userImage = BasicDetailsModel.sharedInstance.userImage
            imgUserPic.image = BasicDetailsModel.sharedInstance.userImage
            
            txtfldDOB.text = dateformatter.string(from: BasicDetailsModel.sharedInstance.dob)
            dateDOB = BasicDetailsModel.sharedInstance.dob
            
            txtfldBirthPlace.text = BasicDetailsModel.sharedInstance.placeOfBirth
          
            
        }
//        else if DocumentModel.sharedInstance.isIdentityDetailsComplete && DocumentModel.sharedInstance.identityType == .TaxationIdentityType{
//            txtfldDOB.text = dateformatter.string(from: DocumentModel.sharedInstance.taxationModel.dob)
//            dateDOB = DocumentModel.sharedInstance.taxationModel.dob
//        }
        
//        switch BasicDetailsModel.sharedInstance.countryType {
//        case .India:
//            txtfldCountryCode.text = "+91"
//        case .NorthAmerica:
//            txtfldCountryCode.text = "+1"
////            txtfldAddressCountry.text = "United States of America"
//        }
    }
    
    func permissionCheckGallery() {
        GlobalMethods.sharedInstance.checkForGalleryPermission(success: {
            DispatchQueue.main.async {
                 self.openGallery()
            }
        }) {
            
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
    
    func openGallery()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        self.present(imagePicker, animated: true, completion: nil)
    }
    
    func checkPhoneValidations() -> Bool {
        
        if txtfldPhone.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPhoneEmpty)
            return false;
        }
        else{
            return true;
        }
    }
    
    func checkEmailValidations() -> Bool {
        
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
    
    func moveToPhoneOtpVerify() -> Void {
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .PhoneVerification
        verifyOtpObj.stringVerifyCountryCode = txtfldCountryCode.text!
        verifyOtpObj.stringVerify = txtfldPhone.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        _navigator.present(verifyOtpObj, animated: true, completion: nil)
//        GlobalMethods.sharedInstance.pushVC(verifyOtpObj)
        
        verifyOtpObj.completionHandler = {
            DispatchQueue.main.async {
                self.setupUI()
            }
        }
        
    }
    func moveToEmailOtpVerify() -> Void {
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .EmailVerification
        verifyOtpObj.stringVerify = txtfldEmail.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        
         _navigator.present(verifyOtpObj, animated: true, completion: nil)
        
        verifyOtpObj.completionHandler = {
            DispatchQueue.main.async {
                self.setupUI()
            }
        }
    }
    
    func openCountryCodePicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: false, customList: [],arrCountry: Country.getCountryArray(["USA","CMR"])!)
        
        customPicker.completionCountry = {
            (country ) in
            self.selectedCountry = country
            self.txtfldCountryCode.text = "+" + country.phoneCode
            self.txtfldPhone.becomeFirstResponder()
        }
    }
    
    @objc func doneMethod(){
        dateDOB = datePicker?.date
        txtfldDOB.text = dateformatter.string(from: dateDOB)
        txtfldBirthPlace.becomeFirstResponder()
    }
    
    @objc func cancelMethod(){
        self.view.endEditing(true)
    }
   
    func checkValidation() -> Bool {
        if txtfldFName.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringFnameEmpty)
            txtfldFName.becomeFirstResponder()
            return false;
        }
        else if (txtfldFName.text?.count)! > 99{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringFnameIncorrect)
            txtfldFName.becomeFirstResponder()
            return false;
        }
        else if txtfldLName.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringLnameEmpty)
            txtfldLName.becomeFirstResponder()
            return false;
        }
        else if (txtfldLName.text?.count)! > 99{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringLnameIncorrect)
            txtfldLName.becomeFirstResponder()
            return false;
        }
        else if (txtfldMName.text?.count)! > 99{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringMnameIncorrect)
            txtfldMName.becomeFirstResponder()
            return false;
        }
        else if !BasicDetailsModel.sharedInstance.isEmailVerified{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailNotVerified)
            actionAddEmail(UIButton())
            return false;
        }
        else if !BasicDetailsModel.sharedInstance.isPhoneVerified {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPhoneNotVerified)
            actionAddPhone(UIButton())
            return false;
        }
        else if userImage == nil {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringUserPicEmpty)
            return false;
        }
        else if txtfldDOB.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringDOBEmpty)
            txtfldDOB.becomeFirstResponder()
            return false;
        }
        else if txtfldBirthPlace.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringBirthStateEmpty)
            txtfldBirthPlace.becomeFirstResponder()
            return false;
        }
       
//        else if txtfldAddress2.text?.count == 0{
//            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAdd2Empty)
//            return false;
//        }
        
        else{
            return true
        }
    }
    
    func saveBasicDetails() -> Void {
        BasicDetailsModel.sharedInstance.fname = txtfldFName.text!
        BasicDetailsModel.sharedInstance.mname = txtfldMName.text!
        BasicDetailsModel.sharedInstance.lname = txtfldLName.text!
        
        BasicDetailsModel.sharedInstance.dob = dateDOB
        
        BasicDetailsModel.sharedInstance.placeOfBirth = txtfldBirthPlace.text!
        
        BasicDetailsModel.sharedInstance.userImage = userImage!
        BasicDetailsModel.sharedInstance.isBasicDetailsComplete = true
        
        if BasicDetailsModel.sharedInstance.isAddressDetailsComplete {
            uploadBasicDetails()
        }
        else{
             self.completionHandler(0)
            _navigator.popViewController(animated: true)
        }
        
//        GlobalMethods.sharedInstance.uploadBasicDetails()
    }
    
    func setEmailForDev() {
        BasicDetailsModel.sharedInstance.isEmailVerified  = true
        BasicDetailsModel.sharedInstance.email  = "abhay.shankar@newgen.co.in"
        
        BasicDetailsModel.sharedInstance.isPhoneVerified  = true
        BasicDetailsModel.sharedInstance.contactNumber  = "9643587944"
         BasicDetailsModel.sharedInstance.countryCode   = "91"
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            // imageViewPic.contentMode = .scaleToFill
            imgUserPic.image = pickedImage
            userImage = pickedImage
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
     //MARK: - Textfield
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
       
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
    
    @IBAction func actionSelectUserPic(_ sender: UIButton) {
        
        self.view.endEditing(true)
        self.permissionCheckGallery()
//        GlobalMethods.sharedInstance.showAlertForImagePicker { (index) in
//            switch index{
//            case 1 : self.openCamera()
//            case 2: self.openGallary()
//            default:
//                break
//            }
//        }
    }
    
    @IBAction func actionAddEmail(_ sender: UIButton) {

        vwEmail.isHidden = false
        
        UIView.animate(withDuration: 0.3, animations: {
             self.vwEmail.alpha = 1.0
        }) { (isComplete) in
            if isComplete{
                self.txtfldEmail.becomeFirstResponder()
            }
        }
    }
    @IBAction func actionAddPhone(_ sender: UIButton) {
        vwPhone.isHidden = false
        
        UIView.animate(withDuration: 0.3, animations: {
            self.vwPhone.alpha = 1.0
        }) { (isComplete) in
            if isComplete{
                self.txtfldPhone.becomeFirstResponder()
            }
        }
    }
    
    @IBAction func actionSave(_ sender: UIButton) {
        
        if checkValidation(){
            saveBasicDetails()
        }
        
    }
    @IBAction func actionSendEmailOTP(_ sender: Any) {
        if checkEmailValidations() {
            //API Call
            self.view.endEditing(true)
            APIGetEMailOtp(email: txtfldEmail.text!)
        }
    }
    @IBAction func actionSendPhoneOTP(_ sender: Any) {
        if checkPhoneValidations() {
            //API Call
            self.view.endEditing(true)
            let result = txtfldCountryCode.text?.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)

            APIGetPhoneOtp(countryCode: result!,phoneNumner: txtfldPhone.text!)
        }
    }
    
    @IBAction func actionSelectCountryCode(_ sender: Any) {
        if BasicDetailsModel.sharedInstance.countryType == .NorthAmerica {
            openCountryCodePicker()
        }
    }
    
    
    
    // MARK: - Webservice
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Sending OTP...")
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        NetworkManager.sharedInstance.generateMobileOTP(params: params, success: { (responseDict) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                self.moveToPhoneOtpVerify()
            })
            
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
               GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
            })
            
        }
    }

    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Sending OTP...")
        NetworkManager.sharedInstance.generateEmailOTP(params: params, success: { (responseDict) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                self.moveToEmailOtpVerify()
            })
            
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
            })
        }
    }
    
    func uploadBasicDetails() {
        
        let filenameArray = ["file[]"]
        let image = GlobalMethods.sharedInstance.resizeImage(image: BasicDetailsModel.sharedInstance.userImage, targetSize: CGSize.init(width: 200.0, height: 200.0))
        let imagesArray = [image]
        
        NetworkManager.sharedInstance.POSTBasicDetails(params: BasicDetailsModel.sharedInstance.getBasicParamsForSaveKYC(), fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Basic Details Saved")
             self.completionHandler(0)
            _navigator.popViewController(animated: true)
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
        }
        
    }
}
