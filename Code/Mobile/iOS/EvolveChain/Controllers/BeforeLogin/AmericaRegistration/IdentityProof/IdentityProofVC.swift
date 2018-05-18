//
//  IdentityProofVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 18/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//
enum IdentityType : String {
    case  PassportIdentityType
    case  DrivingLicenceIdentityType
}
import UIKit

class IdentityProofVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UITextFieldDelegate {

    @IBOutlet weak var imgBack: UIImageView!
    @IBOutlet weak var imgFront: UIImageView!
    @IBOutlet weak var txtfldNumber: UITextField!
    @IBOutlet weak var btnIdentyType: UIButton!
    @IBOutlet weak var txtfldDate: UITextField!
    var selectedIdentityType : IdentityType = .PassportIdentityType
    
    var datePicker : UIDatePicker?
    var arrTypes : [String] = []
    var frontImage : UIImage?
    var backImage : UIImage?
    var currentImageIndex : Int = 0
    var dateformatter : DateFormatter = DateFormatter.init()
    var expiryDate : Date!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        arrTypes = ["Passport","Driving License"]
        datePicker = GlobalMethods.sharedInstance.getDatePicker(controller:self,txtFld: txtfldDate, doneAction: #selector(doneMethod), cancelAction: #selector(cancelMethod))
        dateformatter.dateFormat = "dd MMM yyyy"
        updateUI();
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
// MARK: - Custom Methods
    func updateUI() -> Void {
        switch selectedIdentityType {
        case .PassportIdentityType:setPassport()
        case .DrivingLicenceIdentityType:setDrivingLicense()

        }
    }
    
    func setPassport() {
        btnIdentyType.setTitle(arrTypes[0], for: .normal)
        txtfldNumber.placeholder = "Passport number"
        txtfldDate.placeholder = "Expiry Date"
    }
    
    func setDrivingLicense() {
        btnIdentyType.setTitle(arrTypes[1], for: .normal)
        txtfldNumber.placeholder = "Driving License"
        txtfldDate.placeholder = "Expiry Date"
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
            switch index {
            case 0:
                self.selectedIdentityType = .PassportIdentityType
            case 1:
                self.selectedIdentityType = .DrivingLicenceIdentityType
            default:
                break
            }
            self.updateUI()
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
            switch currentImageIndex {
            case 0:
                imgFront.image = pickedImage
                frontImage = pickedImage
            case 1:
                imgBack.image = pickedImage
                backImage = pickedImage
            default:
                break
            }
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
    func checkValidation() -> Bool {
        if txtfldNumber.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText:selectedIdentityType == .PassportIdentityType ? stringPassportNumberEmpty : stringDrivingNumberEmpty)
            return false;
        }
        else if txtfldDate.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityExpiryEmpty)
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
    @objc func doneMethod(){
        expiryDate = datePicker?.date
        txtfldDate.text = dateformatter.string(from: expiryDate)
        self.view.endEditing(true)
    }
    @objc func cancelMethod(){
        self.view.endEditing(true)
    }
    func saveIdentityDetails() -> Void {
        IdentityModel.sharedInstance.number = txtfldNumber.text!
        IdentityModel.sharedInstance.expiry = expiryDate!
        IdentityModel.sharedInstance.frontImage = frontImage!
        IdentityModel.sharedInstance.backImage = backImage!

        IdentityModel.sharedInstance.isIdentityDetailsComplete = true

        _navigator.popViewController(animated: true)
        
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
    
     // MARK: - Action
    @IBAction func actionSelectIdentityType(_ sender: Any) {
        self.view.endEditing(true)
        openPicker()
        
    }
    
    
    
    @IBAction func actionSelectFrontImage(_ sender: Any) {
        self.view.endEditing(true)
        currentImageIndex = 0
        
        GlobalMethods.sharedInstance.showAlertForImagePicker { (index) in
            switch index{
            case 1 : self.openCamera()
            case 2: self.openGallary()
            default:
                break
            }
        }
    }
    @IBAction func actionSelectBackImage(_ sender: Any) {
        self.view.endEditing(true)
         currentImageIndex = 1
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
        
        if checkValidation(){
            saveIdentityDetails()
        }
        
    }
    
}