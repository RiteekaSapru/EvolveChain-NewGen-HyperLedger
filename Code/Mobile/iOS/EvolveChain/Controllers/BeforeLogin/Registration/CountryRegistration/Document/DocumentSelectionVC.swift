//
//  DocumentSelectionVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 23/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

enum DocumentType : String {
    case  IdentityType
    case  AddressType
}

import UIKit

class DocumentSelectionVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UITextFieldDelegate {

    @IBOutlet weak var btnDocumentType: UIButton!
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var tblvwDoc: UITableView!
    
    @IBOutlet var vwIdentityDoc: UIView!
    @IBOutlet var vwUtilityBill: UIView!
    
    @IBOutlet weak var txtfldNumberIdentity: UITextField!
    @IBOutlet weak var txtfldCountry: UITextField!
    @IBOutlet weak var txtfldDate: UITextField!
    
    @IBOutlet weak var imgFrontIdentity: UIImageView!
    @IBOutlet weak var imgBackIdentity: UIImageView!
    
    @IBOutlet weak var imgFrontUtility: UIImageView!
     @IBOutlet weak var imgBackUtility: UIImageView!
    
    @IBOutlet weak var txtfldType: UITextField!
    @IBOutlet weak var txtfldNumberUtility: UITextField!
    @IBOutlet weak var txtfldAddress: UITextField!
    
    var arrType : [String] = []
    
    var selectedCountry : Country?
    var selectedBillType : UtilityBillTypeModel?
     var datePicker : UIDatePicker?
    
    var frontImage : UIImage?
    var backImage : UIImage?
    var currentImageIndex : Int = 0
    
    var dateformatter : DateFormatter = DateFormatter.init()
    var expiryDate : Date!
    
    var currentType : DocumentType = .IdentityType
    
    var currentIdentityType: IdentityType = .PassportIdentityType
    var currentAddressType: AddressType = .PassportAddressType
    
    var completionHandler: (Int)->Void = {_ in }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        datePicker = GlobalMethods.sharedInstance.getDatePicker(controller:self,txtFld: txtfldDate, doneAction: #selector(doneMethod), cancelAction: #selector(cancelMethod))
        
        dateformatter.dateFormat = "dd MMM yyyy"
        
        
        updateUI()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
     // MARK: - Custom Methods
    @objc func doneMethod(){
        expiryDate = datePicker?.date
        txtfldDate.text = dateformatter.string(from: expiryDate)
        self.view.endEditing(true)
    }
    
    @objc func cancelMethod(){
        self.view.endEditing(true)
    }
    
    // MARK: - Setup UI
    
    func setupIdentity() {
        lblTitle.text = "Identity Proof"
        arrType = ["Passport","Driving License","Taxation"]
        
        updateIdentitySelection()
    }
        
    func setupAddress() {
        lblTitle.text = "Address Proof"
         arrType = ["Passport","Driving License","Utility Bill"]
        updateAddressSelection()
    }
    
    func updateUI() {
        
        switch currentType {
        case .IdentityType:
            currentIdentityType = DocumentModel.sharedInstance.identityType
            setupIdentity()
        case .AddressType:
            currentAddressType = DocumentModel.sharedInstance.addressType
            setupAddress()
        }
    }
    
    func setPaspport() {
        
        datePicker?.minimumDate = Date()
        datePicker?.maximumDate = nil
        
        txtfldNumberIdentity.text = ""
        txtfldCountry.text = ""
        txtfldDate.text = ""
        txtfldDate.placeholder = "Expiry Date"
        prefillCountryBasedData()
        
       btnDocumentType.setTitle(arrType[0], for: .normal)
        
        if DocumentModel.sharedInstance.passportModel.iscomplete{
            txtfldNumberIdentity.text = DocumentModel.sharedInstance.passportModel.number
            txtfldCountry.text = DocumentModel.sharedInstance.passportModel.country
            txtfldDate.text = dateformatter.string(from: DocumentModel.sharedInstance.passportModel.expiry)
            expiryDate = DocumentModel.sharedInstance.passportModel.expiry
            imgFrontIdentity.image = DocumentModel.sharedInstance.passportModel.frontImage
            frontImage = DocumentModel.sharedInstance.passportModel.frontImage
            
            imgBackIdentity.image = DocumentModel.sharedInstance.passportModel.backImage
            backImage = DocumentModel.sharedInstance.passportModel.backImage
        }
         tblvwDoc.tableHeaderView = vwIdentityDoc
    }
    
    func setDrivingLicence() {
        
        datePicker?.minimumDate = Date()
        datePicker?.maximumDate = nil
        
        txtfldNumberIdentity.text = ""
        txtfldCountry.text = ""
        txtfldDate.text = ""
        txtfldDate.placeholder = "Expiry Date"
        btnDocumentType.setTitle(arrType[1], for: .normal)
        
        prefillCountryBasedData()
        
        if DocumentModel.sharedInstance.drivingModel.iscomplete{
            txtfldNumberIdentity.text = DocumentModel.sharedInstance.drivingModel.number
            txtfldCountry.text = DocumentModel.sharedInstance.drivingModel.country
            txtfldDate.text = dateformatter.string(from: DocumentModel.sharedInstance.drivingModel.expiry)
            expiryDate = DocumentModel.sharedInstance.drivingModel.expiry
            imgFrontIdentity.image = DocumentModel.sharedInstance.drivingModel.frontImage
            frontImage = DocumentModel.sharedInstance.drivingModel.frontImage
            
            imgBackIdentity.image = DocumentModel.sharedInstance.drivingModel.backImage
            backImage = DocumentModel.sharedInstance.drivingModel.backImage
        }
         tblvwDoc.tableHeaderView = vwIdentityDoc
    }
    
    func setTaxation() {

        datePicker?.maximumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.minAge, after: false)
        datePicker?.minimumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.maxAge, after: false)
        
        btnDocumentType.setTitle(arrType[2], for: .normal)
        txtfldNumberIdentity.text = ""
        txtfldCountry.text = ""
        txtfldDate.text = ""
        txtfldDate.placeholder = "Date of Birth"
        
        prefillCountryBasedData()
        
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete{
            
            expiryDate = BasicDetailsModel.sharedInstance.dob
            txtfldDate.text = dateformatter.string(from: expiryDate)
        }
        
        if DocumentModel.sharedInstance.taxationModel.iscomplete{
            txtfldNumberIdentity.text = DocumentModel.sharedInstance.taxationModel.number
            txtfldCountry.text = DocumentModel.sharedInstance.taxationModel.country
            txtfldDate.text = dateformatter.string(from: DocumentModel.sharedInstance.taxationModel.dob)
            expiryDate = DocumentModel.sharedInstance.taxationModel.dob
            imgFrontIdentity.image = DocumentModel.sharedInstance.taxationModel.frontImage
            frontImage = DocumentModel.sharedInstance.taxationModel.frontImage
            
            imgBackIdentity.image = DocumentModel.sharedInstance.taxationModel.backImage
            backImage = DocumentModel.sharedInstance.taxationModel.backImage
        }
         tblvwDoc.tableHeaderView = vwIdentityDoc
    }
    
    func setUtilityBill() {
        btnDocumentType.setTitle(arrType[2], for: .normal)
        if DocumentModel.sharedInstance.utilityModel.iscomplete{
            txtfldType.text = DocumentModel.sharedInstance.utilityModel.type.name
            txtfldNumberUtility.text = DocumentModel.sharedInstance.utilityModel.number
            txtfldAddress.text = DocumentModel.sharedInstance.utilityModel.address
            selectedBillType = DocumentModel.sharedInstance.utilityModel.type
            imgFrontUtility.image = DocumentModel.sharedInstance.utilityModel.frontImage
            frontImage = DocumentModel.sharedInstance.utilityModel.frontImage
            
            imgBackUtility.image = DocumentModel.sharedInstance.utilityModel.backImage
            backImage = DocumentModel.sharedInstance.utilityModel.backImage
        }
         tblvwDoc.tableHeaderView = vwUtilityBill
    }
    
    func prefillCountryBasedData(){
        if BasicDetailsModel.sharedInstance.countryType == .India {
            txtfldCountry.text = "India"
        }
    }
    // MARK: - Selection Changes
    
    func updateIdentitySelection()  {
        switch currentIdentityType {
        case .PassportIdentityType : setPaspport()
        case .DrivingLicenceIdentityType : setDrivingLicence()
        case .TaxationIdentityType : setTaxation()
        }
    }
    
    func updateAddressSelection()  {
        switch currentAddressType {
        case .PassportAddressType : setPaspport()
        case .DrivingLicenceAddressType : setDrivingLicence()
        case .UtilityAddressType : setUtilityBill()
        }
    }
    
    func updateTypeSelection(index:Int) {
        imgBackUtility.image = UIImage.init(named: "sample-Utility")
        imgBackIdentity.image = UIImage.init(named: "Passport-Face-Sample")
        imgFrontUtility.image = UIImage.init(named: "sample-Utility")
        imgFrontIdentity.image = UIImage.init(named: "Passport-Face-Sample")
        
        frontImage = nil
        backImage = nil
        
        if currentType == .IdentityType{
            switch index{
            case 0:currentIdentityType = .PassportIdentityType
            case 1:currentIdentityType = .DrivingLicenceIdentityType
            case 2:currentIdentityType = .TaxationIdentityType
            default:
                break
            }
            
            updateIdentitySelection()
        }
        else{
            switch index{
            case 0:currentAddressType = .PassportAddressType
            case 1:currentAddressType = .DrivingLicenceAddressType
            case 2:currentAddressType = .UtilityAddressType
            default:
                break
            }
            
            updateAddressSelection()
        }
        
        
    }
    
    func openCountryPicker()  {
        if BasicDetailsModel.sharedInstance.countryType == .NorthAmerica {
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
                self.txtfldCountry.text = country.name
                self.txtfldDate.becomeFirstResponder()
            }
        }
        
    }
    
    // MARK: - Image Picking
    
    func permissionCheckGallery() {
        GlobalMethods.sharedInstance.checkForGalleryPermission(success: {
            DispatchQueue.main.async {
                self.openGallery()
            }
        }) {
            
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
    
    func openPicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: true, customList: arrType,arrCountry: [])
        
        customPicker.completionCustom = {
            (index ) in
            self.updateTypeSelection(index: index)
//            self.updateUI()
        }
        
        
    }
    
    func openBillTypePicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: true, customList: SignupConfigModel.sharedInstance.getBillArray(),arrCountry:[])
        
        customPicker.completionCustom = {
            (index ) in
           self.selectedBillType = SignupConfigModel.sharedInstance.arrUtilityBillTypeList[index]
            self.txtfldType.text = self.selectedBillType?.name
            
        }
        
        
    }
    
   
    
    //MARK: - Validation
    
    func checkIdentityValidation() -> Bool {
        if (txtfldNumberIdentity.text?.count)! == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringNumberEmpty)
            txtfldNumberIdentity.becomeFirstResponder()
            return false;
        }
        else if (txtfldNumberIdentity.text?.count)! < 8{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringNumberIncorrect)
            txtfldNumberIdentity.becomeFirstResponder()
            return false;
        }
        else if txtfldCountry.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringCountryEmpty)
            actionOpenCountryPicker(UIButton())
            return false;
        }
        else if txtfldDate.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityExpiryEmpty)
            txtfldDate.becomeFirstResponder()
            return false;
        }
        else if frontImage == nil{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityFrontPicEmpty)
            return false;
        }
        else if backImage == nil {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityBackPicEmpty)
            return false;
        }
            
        else{
            return true
        }
    }
    
    func checkAddressValidation() -> Bool {
        if currentAddressType == .UtilityAddressType {
            return checkUtilityBillValidation()
        }
        else
        {
            return checkIdentityValidation()
        }
    }
    
    func checkUtilityBillValidation() -> Bool {
        if txtfldNumberUtility.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringNumberEmpty)
            txtfldNumberUtility.becomeFirstResponder()
            return false;
        }
        else if txtfldAddress.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAdd1Empty)
            txtfldNumberUtility.becomeFirstResponder()
            return false;
        }
        else if txtfldType.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringBillTypeEmpty)
            actionBillType(UIButton())
            return false;
        }
        else if frontImage == nil{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityFrontPicEmpty)
            return false;
        }
        else if backImage == nil {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityBackPicEmpty)
            return false;
        }
            
        else{
            return true
        }
    }
    //MARK: - Document Save
    
    func saveIdentityDocument() {
        switch currentIdentityType {
        case .PassportIdentityType:
            DocumentModel.sharedInstance.passportModel.number = txtfldNumberIdentity.text!
            DocumentModel.sharedInstance.passportModel.country = txtfldCountry.text!
            DocumentModel.sharedInstance.passportModel.expiry = expiryDate
            DocumentModel.sharedInstance.passportModel.frontImage = frontImage!
            DocumentModel.sharedInstance.passportModel.backImage = backImage!
            DocumentModel.sharedInstance.passportModel.iscomplete = true
            
            DocumentModel.sharedInstance.identityType = .PassportIdentityType
            
        case .DrivingLicenceIdentityType:
            DocumentModel.sharedInstance.drivingModel.number = txtfldNumberIdentity.text!
            DocumentModel.sharedInstance.drivingModel.country = txtfldCountry.text!
            DocumentModel.sharedInstance.drivingModel.expiry = expiryDate
            DocumentModel.sharedInstance.drivingModel.frontImage = frontImage!
            DocumentModel.sharedInstance.drivingModel.backImage = backImage!
            DocumentModel.sharedInstance.drivingModel.iscomplete = true
            
            DocumentModel.sharedInstance.identityType = .DrivingLicenceIdentityType
            
        case .TaxationIdentityType:
            DocumentModel.sharedInstance.taxationModel.number = txtfldNumberIdentity.text!
            DocumentModel.sharedInstance.taxationModel.country = txtfldCountry.text!
            DocumentModel.sharedInstance.taxationModel.dob = expiryDate
            BasicDetailsModel.sharedInstance.dob = expiryDate
            DocumentModel.sharedInstance.taxationModel.frontImage = frontImage!
            DocumentModel.sharedInstance.taxationModel.backImage = backImage!
            DocumentModel.sharedInstance.taxationModel.iscomplete = true
            
            DocumentModel.sharedInstance.identityType = .TaxationIdentityType
    }
        DocumentModel.sharedInstance.isIdentityDetailsComplete = true
         self.completionHandler(2)
        _navigator.popViewController(animated: true)
    }
    
    func saveAddressDocument() {
        switch currentAddressType {
        case .PassportAddressType:
            DocumentModel.sharedInstance.passportModel.number = txtfldNumberIdentity.text!
            DocumentModel.sharedInstance.passportModel.country = txtfldCountry.text!
            DocumentModel.sharedInstance.passportModel.expiry = expiryDate
            DocumentModel.sharedInstance.passportModel.frontImage = frontImage!
            DocumentModel.sharedInstance.passportModel.backImage = backImage!
            DocumentModel.sharedInstance.passportModel.iscomplete = true
            
            DocumentModel.sharedInstance.addressType = .PassportAddressType
            
        case .DrivingLicenceAddressType:
            DocumentModel.sharedInstance.drivingModel.number = txtfldNumberIdentity.text!
            DocumentModel.sharedInstance.drivingModel.country = txtfldCountry.text!
            DocumentModel.sharedInstance.drivingModel.expiry = expiryDate
            DocumentModel.sharedInstance.drivingModel.frontImage = frontImage!
            DocumentModel.sharedInstance.drivingModel.backImage = backImage!
            DocumentModel.sharedInstance.drivingModel.iscomplete = true
            
            DocumentModel.sharedInstance.addressType = .DrivingLicenceAddressType
            
        case .UtilityAddressType:
            DocumentModel.sharedInstance.utilityModel.number = txtfldNumberUtility.text!
            DocumentModel.sharedInstance.utilityModel.type = selectedBillType!
            DocumentModel.sharedInstance.utilityModel.address = txtfldAddress.text!
            DocumentModel.sharedInstance.utilityModel.frontImage = frontImage!
            DocumentModel.sharedInstance.utilityModel.backImage = backImage!
            DocumentModel.sharedInstance.utilityModel.iscomplete = true
            
            DocumentModel.sharedInstance.addressType = .UtilityAddressType
        }
         DocumentModel.sharedInstance.isAddressDetailsComplete = true
         self.completionHandler(3)
        _navigator.popViewController(animated: true)
    }
        
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            switch currentImageIndex {
            case 0:
                if currentType == .IdentityType{
                    imgFrontIdentity.image = pickedImage
                }
                else{
                    imgFrontIdentity.image = pickedImage
                    imgFrontUtility.image = pickedImage
                }
                frontImage = pickedImage
            case 1:
                if currentType == .IdentityType{
                    imgBackIdentity.image = pickedImage
                }
                else{
                    imgBackIdentity.image = pickedImage
                    imgBackUtility.image = pickedImage
                }
                backImage = pickedImage
            default:
                break
            }
            
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
    //MARK: - Textfield
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        if textField.tag == 0{
            self.view.endEditing(true)
            openCountryPicker()
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
    
    // MARK: - Actions
    
    @IBAction func actionOpenDocumentPicker(_ sender: Any) {
        self.view.endEditing(true)
        
        openPicker()
    }
   
    @IBAction func actionSave(_ sender: Any) {
        
        switch currentType {
        case .IdentityType:
            if checkIdentityValidation(){
                saveIdentityDocument()
            }
        case .AddressType:
            if checkAddressValidation(){
                 saveAddressDocument()
            }
        }
    }
    
    @IBAction func actionSelectFrontImage(_ sender: UIButton) {
        self.view.endEditing(true)
        currentImageIndex = 0
        permissionCheckGallery()
        
    }
    @IBAction func actionSelectBackImage(_ sender: UIButton) {
        self.view.endEditing(true)
        currentImageIndex = 1
        permissionCheckGallery()
    }
    
    @IBAction func actionOpenCountryPicker(_ sender: Any) {
        self.view.endEditing(true)
        openCountryPicker()
    }
    @IBAction func actionBillType(_ sender: Any) {
        openBillTypePicker()
    }
}
