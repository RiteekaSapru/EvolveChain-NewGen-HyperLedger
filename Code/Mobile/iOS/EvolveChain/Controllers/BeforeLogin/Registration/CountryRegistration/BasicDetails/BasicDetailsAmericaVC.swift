//
//  BasicDetailsAmerica.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import Photos

class BasicDetailsAmericaVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UITextFieldDelegate,BackSpaceTextFieldDelegate {

    @IBOutlet weak var txtfldFName: UITextField!
    @IBOutlet weak var txtfldMName: UITextField!
    @IBOutlet weak var txtfldLName: UITextField!
    
    @IBOutlet weak var txtFldGender: UITextField!
    
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
    
    @IBOutlet weak var txtfldPhone: NoCursorTextfield!
    @IBOutlet weak var txtfldEmail: UITextField!
    var userImage : UIImage?
    var datePicker : UIDatePicker?
    var dateformatter : DateFormatter = DateFormatter.init()
    var dateDOB : Date!
    
     var selectedCountry : Country?
    
     var completionHandler: (Int)->Void = {_ in }
    
    var pickerClass : PickerClass = PickerClass.init()
        
    override func viewDidLoad() {
        super.viewDidLoad()
        datePicker = Util.shared.getDatePicker(controller:self,txtFld: txtfldDOB, doneAction: #selector(doneMethod), cancelAction: #selector(cancelMethod))
        datePicker?.maximumDate = Util.shared.getDate(year: SignupConfigModel.shared.minAge, after: false)
        datePicker?.minimumDate = Util.shared.getDate(year: SignupConfigModel.shared.maxAge, after: false)
        dateformatter.dateFormat = "MMM dd, yyyy"
        tblvwBasic.tableHeaderView = vwMain
        setUpGender()
//        setEmailForDev()
        fillData()
        setupUI()
       txtfldPhone.backDelegate = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
//        NotificationCenter.default.addObserver(self, selector: #selector(editingEnded), name: NSNotification.Name(rawValue: "Editing_ended"), object: nil)
//       setupUI()
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
//        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(rawValue: "Editing_ended"), object: nil)
    }
     // MARK: - Setup Methods
    
    @objc func editingEnded(){
        txtfldEmail.text = txtfldEmail.text?.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        if Util.shared.isValidEmail(testStr: txtfldEmail.text!) && txtfldEmail.text?.lowercased() != BasicDetailsModel.shared.email.lowercased(){
            showEmailAlert()
        }
        else if txtfldPhone.text!.count == SignupConfigModel.shared.selectedCountry.phoneFormat.count && txtfldPhone.text != BasicDetailsModel.shared.contactNumber{
            showPhoneAlert()
        }
        else{
            setEmailAndPhone()
        }
    }
    
    fileprivate func setUpGender(){
    
        let arrGenders = ["Male","Female","Other"]
    
//        let pickerClass = PickerClass.init()
        
        txtFldGender.inputView = pickerClass.setUpPicker(customList: arrGenders)
        txtFldGender.inputAccessoryView = pickerClass.setUpToolbar()
        
        pickerClass.doneBlock = {
            (index ) in
           
            self.txtFldGender.text = arrGenders[index]
            self.txtFldGender.resignFirstResponder()
        }
        
        pickerClass.cancelBlock = {
             self.txtFldGender.resignFirstResponder()
        }
        
    
    }
    
    fileprivate func setEmailAndPhone() {
        if BasicDetailsModel.shared.isEmailVerified{
            vwEmail.isHidden = false
            vwEmail.alpha = 1.0
            txtfldEmail.text = BasicDetailsModel.shared.email
            txtfldEmail.isUserInteractionEnabled = false
            btnAddEmail.isUserInteractionEnabled = false
            btnAddEmail.setTitle("Verified", for: .normal)
        }
        else{
            txtfldEmail.text = ""
        }
        if BasicDetailsModel.shared.isPhoneVerified{
            vwPhone.isHidden = false
            vwPhone.alpha = 1.0
            txtfldPhone.text = BasicDetailsModel.shared.contactNumber
            txtfldPhone.isUserInteractionEnabled = false
            txtfldCountryCode.text = "+" + BasicDetailsModel.shared.countryCode
            btnAddPhone.isUserInteractionEnabled = false
            btnAddPhone.setTitle("Verified", for: .normal)
        }
        else{
            txtfldPhone.text = ""
        }
    }
    
    func setupUI() -> Void {
        setEmailAndPhone()
    }
    
    func fillData() {
        
        txtfldCountryCode.text = "+" + SignupConfigModel.shared.selectedCountry.phoneCode
        
        if BasicDetailsModel.shared.isBasicDetailsComplete {
            setEmailAndPhone()
            txtfldFName.text = BasicDetailsModel.shared.fname
            txtfldMName.text = BasicDetailsModel.shared.mname
            txtfldLName.text = BasicDetailsModel.shared.lname
            txtFldGender.text = BasicDetailsModel.shared.gender
            userImage = BasicDetailsModel.shared.userImage
            imgUserPic.image = BasicDetailsModel.shared.userImage
            txtfldBirthPlace.text = BasicDetailsModel.shared.placeOfBirth

            if BasicDetailsModel.shared.dob != nil{
                txtfldDOB.text = dateformatter.string(from: BasicDetailsModel.shared.dob!)
                dateDOB = BasicDetailsModel.shared.dob

            }
            else{
                txtfldDOB.text = ""
            }
        }
    }
    
    // MARK: - Gallery and Camera
    
    func permissionCheckGallery() {
        Util.shared.checkForGalleryPermission(success: {
            DispatchQueue.main.async {
                 self.openGallery()
            }
        }) {
            
        }
    }
    
    fileprivate func permissionCheckCamera() {
        Util.shared.checkForCameraPermission(success: {
            self.openCamera()
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
            Util.shared.presentVC(imagePicker)
        }
        else
        {
            let alert  = UIAlertController(title: "Warning", message: "You don't have camera", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: StringConstants.okText, style: .default, handler: nil))
            Util.shared.presentVC(alert)
        }
    }
    
    func openGallery()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        Util.shared.presentVC(imagePicker)

    }
    
    // MARK: - Alerts
    
    func showEmailAlert()  {
        let alert = UIAlertController.init(title: StringConstants.Error, message: StringConstants.EmailNotVerified, preferredStyle: .alert)
        
        let otpAction = UIAlertAction.init(title: "Send OTP", style: .default) { [weak self] (action) in
            self?.APIGetEMailOtp(email: (self?.txtfldEmail.text!.lowercased())!)
        }
        
        let cancelAction = UIAlertAction.init(title: "Cancel", style: .destructive) { [weak self](action) in
            self?.setEmailAndPhone()
        }
        
        alert.addAction(otpAction)
        alert.addAction(cancelAction)

        Util.shared.presentVC(alert)
    }
    
    func showPhoneAlert()  {
        let alert = UIAlertController.init(title: StringConstants.Error, message: StringConstants.PhoneNotVerified, preferredStyle: .alert)
        
        let otpAction = UIAlertAction.init(title: "Send OTP", style: .default) { [weak self] (action) in
            let result = self?.txtfldCountryCode.text?.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)
            
            self?.APIGetPhoneOtp(countryCode: result!,phoneNumner: (self?.txtfldPhone.text?.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined())!)
        }
        
        let cancelAction = UIAlertAction.init(title: "Cancel", style: .destructive) { [weak self](action) in
            self?.setEmailAndPhone()
        }
        
        alert.addAction(otpAction)
        alert.addAction(cancelAction)
        
        Util.shared.presentVC(alert)
    }
    
    // MARK: - Validation Methods
    
    func checkPhoneValidations() -> Bool {
        
        
        if txtfldPhone.text!.isEmpty {
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneEmpty)
            txtfldPhone.animatePlaceholderColor()
            txtfldPhone.becomeFirstResponder()
            return false;
        }
        else if txtfldPhone.text!.count < SignupConfigModel.shared.selectedCountry.phoneFormat.count {
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneInvalid)
            txtfldPhone.becomeFirstResponder()
            return false;
        }
        else if txtfldPhone.text == BasicDetailsModel.shared.contactNumber &&  BasicDetailsModel.shared.isPhoneVerified{
            txtfldPhone.becomeFirstResponder()
            return false;
        }
        else{
            return true;
        }
    }
    
    func checkEmailValidations() -> Bool {
        
        if txtfldEmail.text!.isEmpty {
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.EmailEmpty)
            txtfldEmail.animatePlaceholderColor()
            txtfldEmail.becomeFirstResponder()
            return false;
        }
        else if !Util.shared.isValidEmail(testStr: txtfldEmail.text!){
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.EmailInvalid)
            txtfldEmail.becomeFirstResponder()
            return false;
        }
        else if txtfldEmail.text?.lowercased() == BasicDetailsModel.shared.email.lowercased() &&  BasicDetailsModel.shared.isEmailVerified{
            txtfldEmail.becomeFirstResponder()
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func checkValidation() -> Bool {
        if !BasicDetailsModel.shared.isEmailVerified{
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.EmailNotVerified)
            actionAddEmail(UIButton())
            txtfldEmail.animatePlaceholderColor()
            return false;
        }
        else if !BasicDetailsModel.shared.isPhoneVerified {
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneNotVerified)
            actionAddPhone(UIButton())
            txtfldPhone.animatePlaceholderColor()
            return false;
        }
        else if txtfldFName.text!.count < 2{
            txtfldFName.animatePlaceholderColor()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.FnameEmpty)
            txtfldFName.becomeFirstResponder()
            return false;
        }
        else if (txtfldFName.text?.count)! > 99{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.FnameIncorrect)
            txtfldFName.becomeFirstResponder()
            return false;
        }
        else if txtfldLName.text!.count < 2{
            txtfldLName.animatePlaceholderColor()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.LnameEmpty)
            txtfldLName.becomeFirstResponder()
            return false;
        }
        else if (txtfldLName.text?.count)! > 99{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.LnameIncorrect)
            txtfldLName.becomeFirstResponder()
            return false;
        }
        else if (txtfldMName.text?.count)! > 99{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.MnameIncorrect)
            txtfldMName.becomeFirstResponder()
            return false;
        }
        else if userImage == nil {
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.UserPicEmpty)
            return false;
        }
        else if txtfldDOB.text!.isEmpty{
            txtfldDOB.animatePlaceholderColor()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.DOBEmpty)
            txtfldDOB.becomeFirstResponder()
            return false;
        }
        else if txtfldBirthPlace.text!.count < 2{
            txtfldBirthPlace.animatePlaceholderColor()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.BirthStateEmpty)
            txtfldBirthPlace.becomeFirstResponder()
            return false;
        }
            
        else if txtFldGender.text!.isEmpty{
            txtFldGender.animatePlaceholderColor()
            txtFldGender.becomeFirstResponder()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.GenderEmpty)
            return false;
        }
            
        else{
            return true
        }
    }
    
     // MARK: - OTP Verification Methods
    
    func moveToPhoneOtpVerify() -> Void {
        
//         self.view.endEditing(true)
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .PhoneVerification
        verifyOtpObj.stringVerifyCountryCode = txtfldCountryCode.text!
        verifyOtpObj.stringVerify = txtfldPhone.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        Util.shared.presentVC(verifyOtpObj)

//        GlobalMethods.shared.pushVC(verifyOtpObj)
        
        verifyOtpObj.completionHandler = {
            DispatchQueue.main.async {
                self.setupUI()
            }
        }
        
    }
    func moveToEmailOtpVerify() -> Void {
        
//        self.view.endEditing(true)
        
        let verifyOtpObj = self.storyboard?.instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .EmailVerification
        verifyOtpObj.stringVerify = txtfldEmail.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        Util.shared.presentVC(verifyOtpObj)

        
        verifyOtpObj.completionHandler = {
            DispatchQueue.main.async {
                self.setupUI()
            }
        }
    }
    
     // MARK: - Picker Methods
    
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
    
    
   
    // MARK: - Save Details
    
    func saveBasicDetails() -> Void {
        BasicDetailsModel.shared.fname = txtfldFName.text!
        BasicDetailsModel.shared.mname = txtfldMName.text!
        BasicDetailsModel.shared.lname = txtfldLName.text!
        
        BasicDetailsModel.shared.dob = dateDOB
        
        BasicDetailsModel.shared.placeOfBirth = txtfldBirthPlace.text!
        BasicDetailsModel.shared.gender = txtFldGender.text!
        
        BasicDetailsModel.shared.userImage = userImage!
        BasicDetailsModel.shared.isBasicDetailsComplete = true
        
        if BasicDetailsModel.shared.isAddressDetailsComplete {
            uploadBasicDetails()
        }
        else{
             self.completionHandler(0)
            Util.shared.popVC()
        }
        
//        GlobalMethods.shared.uploadBasicDetails()
    }
    
     // MARK: - Testing Methods
    
    func setEmailForDev() {
        BasicDetailsModel.shared.isEmailVerified  = true
        BasicDetailsModel.shared.email  = "abhay.shankar@newgen.co.in"
        
        BasicDetailsModel.shared.isPhoneVerified  = true
        BasicDetailsModel.shared.contactNumber  = "9643587944"
         BasicDetailsModel.shared.countryCode   = "91"
        
//         self.completionHandler(0)
    }
    
     // MARK: - Formating  Methods
    
    func changeTextFormatting(newString:String) -> String {
        
        var text = txtfldPhone.text!
        let formatText = SignupConfigModel.shared.selectedCountry.phoneFormat
        let result = newString.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined()
        
        for (_, char) in result.enumerated() {
            
            if text.count < formatText.count{
                text.append(char)
                if text.count < formatText.count{
                    let indexNext = formatText.index((formatText.startIndex), offsetBy: text.count )
                    
                    if formatText[indexNext] == "-"{
                        text.append("-")
                    }
                }
            }
        }
        
        return text
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            // imageViewPic.contentMode = .scaleToFill
            imgUserPic.image = pickedImage
            userImage = pickedImage
        }
        
//        if let url: URL = info[UIImagePickerControllerReferenceURL] as? URL
//        {
//            if let asset = PHAsset.fetchAssets(withALAssetURLs: [url], options: nil).firstObject{
//                
//                print(asset.creationDate)
//                
//                //            self.holdingImageDate = asset.creationDate
//                //            self.holdingImageLocation = asset.location?.coordinate
//            }
//        }
//        else if let metaDict = info[UIImagePickerControllerMediaMetadata] as? Dictionary<String,Any>{
//            
//            if let exifData = metaDict["{Exif}"] as? Dictionary<String,Any>{
////                print(exifData)
//                if let dateTime = exifData["DateTimeOriginal"] as? String{
//                     print(dateTime)
//                    let date = Date.dateFromFormattedLocaldateTime_String(dateTime)
//                    print(date)
//                    
//                }
//            }
//        }
        
       
        
        
        picker.dismiss(animated: true, completion: nil)
        
       
    }
    
     //MARK: - Textfield
    
    func textFieldDidBeginEditing(_ textField: UITextField) {
        
//        if textField == txtfldPhone{
//            txtfldEmail.text = txtfldEmail.text?.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
//            if Util.shared.isValidEmail(testStr: txtfldEmail.text!) && txtfldEmail.text?.lowercased() != BasicDetailsModel.shared.email.lowercased(){
//                showEmailAlert()
//            }
//            else{
//                setEmailAndPhone()
//            }
//        }
//        else if textField == txtfldEmail{
//            if txtfldPhone.text!.count == SignupConfigModel.shared.selectedCountry.phoneFormat.count && txtfldPhone.text != BasicDetailsModel.shared.contactNumber{
//                showPhoneAlert()
//            }
//            else{
//                setEmailAndPhone()
//            }
//        }
//        else{
//            editingEnded()
//        }
    }
//    func textFieldDidEndEditing(_ textField: UITextField) {
//        if textField == txtfldEmail{
//            txtfldEmail.text = txtfldEmail.text?.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
//            if Util.shared.isValidEmail(testStr: txtfldEmail.text!) && txtfldEmail.text?.lowercased() != BasicDetailsModel.shared.email.lowercased(){
//                showEmailAlert()
//            }
//            else{
//                setEmailAndPhone()
//            }
//        }
//        else if textField == txtfldPhone{
//            if txtfldPhone.text!.count == SignupConfigModel.shared.selectedCountry.phoneFormat.count && txtfldPhone.text != BasicDetailsModel.shared.contactNumber{
//                showPhoneAlert()
//            }
//            else{
//                setEmailAndPhone()
//            }
//        }
//    }
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
        
        return true
    }
    
    func textFieldDidDelete(textfield: UITextField) {
        
        if textfield == txtfldPhone {
            var text = textfield.text
            
            if text?.last == "-" {
                text?.removeLast()
                textfield.text = text
                //                textfield.text = changeTextToStar(stringToChange: kycIdText)
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
            textField.resignFirstResponder()
        }
        // Do not add a line break
        return false
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField === txtfldPhone {
            if string == "" {
                return true
            }
            
            let formatText = SignupConfigModel.shared.selectedCountry.phoneFormat
            
            if formatText.count == 0{
                return true
            }
            if textField.text?.count == formatText.count{
                return false
            }
            
            if string.count == 1{
                
                if "1234567890".contains(string.first!){
                    var text = textField.text! + string
                    
                    if text.count < formatText.count{
                        let indexNext = formatText.index((formatText.startIndex), offsetBy: text.count )
                        
                        if formatText[indexNext] == "-"{
                            text.append("-")
                        }
                    }
                    txtfldPhone.text = text
                }
            }
            else{
                txtfldPhone.text = changeTextFormatting(newString: string)
            }
            
            return false
            //            return true
        }
        else if textField == txtfldFName || textField == txtfldLName || textField == txtfldMName{
            if string == "" {
                return true
            }
            
            let inputString = string.components(separatedBy: CharacterSet.letters).joined()
            return inputString.count == 0
        }
        return true
        
    }
    
    //MARK: - Actions
    
    @IBAction func actionSelectUserPic(_ sender: UIButton) {
        
        self.view.endEditing(true)
//        self.permissionCheckGallery()
        Util.shared.showAlertForImagePicker { (index) in
            switch index{
            case 1 : self.permissionCheckCamera()
            case 2: self.permissionCheckGallery()
            default:
                break
            }
        }
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
    @IBAction func actionSendEmailOTP(_ sender: UIButton) {
        if sender.isSelected{
            txtfldEmail.isUserInteractionEnabled = true
            txtfldEmail.becomeFirstResponder()
            sender.isSelected = false
        }
        else{
            txtfldEmail.text = txtfldEmail.text?.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
            if checkEmailValidations() {
                //API Call
                
                APIGetEMailOtp(email: txtfldEmail.text!.lowercased())
            }
        }
      
    }
    @IBAction func actionSendPhoneOTP(_ sender: UIButton) {
        
        if sender.isSelected{
            txtfldPhone.isUserInteractionEnabled = true
            txtfldPhone.becomeFirstResponder()
            sender.isSelected = false
        }
        else{
            if checkPhoneValidations() {
                //API Call
               
                let result = txtfldCountryCode.text?.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)
                
                APIGetPhoneOtp(countryCode: result!,phoneNumner: (txtfldPhone.text?.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined())!)
            }
        }
    }
    
    @IBAction func actionSelectCountryCode(_ sender: Any) {
        if BasicDetailsModel.shared.countryType == .NorthAmerica {
            openCountryCodePicker()
        }
    }
    
    
    
    // MARK: - Webservice
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        Util.shared.showLoader(loadingText: StringConstants.OTPLoader)
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        NetworkManager.shared.generateMobileOTP(params: params, success: { (responseDict) in
            Util.shared.dismissLoader(complete: {
                self.moveToPhoneOtpVerify()
            })
            
        }) { (errorMsg) in
            Util.shared.dismissLoader(complete: {
               Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
            })
            
        }
    }

    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        Util.shared.showLoader(loadingText: StringConstants.OTPLoader)
        NetworkManager.shared.generateEmailOTP(params: params, success: { (responseDict) in
            Util.shared.dismissLoader(complete: {
                self.moveToEmailOtpVerify()
            })
            
        }) { (errorMsg) in
            Util.shared.dismissLoader(complete: {
                Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
            })
        }
    }
    
    func uploadBasicDetails() {
        
        let filenameArray = ["file[]"]
        let image = Util.shared.resizeImage(image: BasicDetailsModel.shared.userImage, targetSize: CGSize.init(width: 200.0, height: 200.0))
        let imagesArray = [image]
        
        NetworkManager.shared.POSTBasicDetails(params: BasicDetailsModel.shared.getBasicParamsForSaveKYC(), fileArray: imagesArray, filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Basic Details Saved")
             self.completionHandler(0)
            Util.shared.popVC()
        }) { (errorMsg) in
            Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
        
    }
}
