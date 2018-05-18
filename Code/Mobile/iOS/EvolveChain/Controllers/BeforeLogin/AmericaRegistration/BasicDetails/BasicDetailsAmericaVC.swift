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
    
    @IBOutlet weak var tblvwBasic: UITableView!
    @IBOutlet var vwMain: UIView!
    @IBOutlet weak var lblEmail: UILabel!
    @IBOutlet weak var lblPhone: UILabel!
    //380 + 50
    @IBOutlet weak var imgUserPic: UIImageView!
    
    var userImage : UIImage?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if _screenSize.height < 500.0 {
            vwMain.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 450.0)
        }
        else
        {
            vwMain.frame = CGRect.init(x: 0, y: 0, width: _screenSize.width, height: _screenSize.height - 70)
            
        }
        
        tblvwBasic.tableHeaderView = vwMain
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
       setupUI()
    }
    
    func setupUI() -> Void {
        if BasicDetailsModel.sharedInstance.isEmailVerified{
            lblEmail.text = BasicDetailsModel.sharedInstance.email
        }
        if BasicDetailsModel.sharedInstance.isPhoneVerified{
            lblPhone.text = BasicDetailsModel.sharedInstance.getCompletePhoneNumber()
        }
        
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete {
            if BasicDetailsModel.sharedInstance.isEmailVerified{
                lblEmail.text = BasicDetailsModel.sharedInstance.email
            }
            if BasicDetailsModel.sharedInstance.isPhoneVerified{
                lblPhone.text = BasicDetailsModel.sharedInstance.getCompletePhoneNumber()
            }
            txtfldFName.text = BasicDetailsModel.sharedInstance.fname
            txtfldMName.text = BasicDetailsModel.sharedInstance.mname
            txtfldLName.text = BasicDetailsModel.sharedInstance.lname
            userImage = BasicDetailsModel.sharedInstance.userImage
            imgUserPic.image = BasicDetailsModel.sharedInstance.userImage
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
            imgUserPic.image = pickedImage
            userImage = pickedImage
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
    func checkValidation() -> Bool {
        if txtfldFName.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringFnameEmpty)
            return false;
        }
        else if txtfldLName.text?.count == 0{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringLnameEmpty)
            return false;
        }
        else if !BasicDetailsModel.sharedInstance.isEmailVerified{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailNotVerified)
            return false;
        }
        else if !BasicDetailsModel.sharedInstance.isPhoneVerified {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPhoneNotVerified)
            return false;
        }
        else if userImage == nil {
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringUserPicEmpty)
            return false;
        }
        else{
            return true
        }
    }
    
    func saveBasicDetails() -> Void {
        BasicDetailsModel.sharedInstance.fname = txtfldFName.text!
        BasicDetailsModel.sharedInstance.mname = txtfldMName.text!
        BasicDetailsModel.sharedInstance.lname = txtfldLName.text!
        
        BasicDetailsModel.sharedInstance.userImage = userImage!
        BasicDetailsModel.sharedInstance.isBasicDetailsComplete = true
        
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
    
    //MARK: - Actions
    
    @IBAction func actionSelectUserPic(_ sender: UIButton) {
        
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
    
    @IBAction func actionAddEmail(_ sender: UIButton) {
        
        let addEmailObj = self.storyboard?.instantiateViewController(withIdentifier: "AddEmailVC")
        
        GlobalMethods.sharedInstance.pushVC(addEmailObj!)
    }
    @IBAction func actionAddPhone(_ sender: UIButton) {
         let addPhoneObj = self.storyboard?.instantiateViewController(withIdentifier: "AddPhoneVC")
          GlobalMethods.sharedInstance.pushVC(addPhoneObj!)
    }
    
    @IBAction func actionSave(_ sender: UIButton) {
        
        if checkValidation(){
            saveBasicDetails()
        }
        
    }
    
}
