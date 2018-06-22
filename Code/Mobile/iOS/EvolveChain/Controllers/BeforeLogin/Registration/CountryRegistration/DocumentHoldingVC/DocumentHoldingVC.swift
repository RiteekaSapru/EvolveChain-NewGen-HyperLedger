//
//  DocumentHoldingVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 06/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class DocumentHoldingVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate {

    @IBOutlet weak var lblOTP: UILabel!
    @IBOutlet weak var lblHelText: UILabel!
    @IBOutlet weak var imgPic: UIImageView!
    
    var holdingImage : UIImage?
    
    var completionHandler: (Int)->Void = {_ in }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        filldata()
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //MARK: - Custom Actions
    
    fileprivate func filldata(){
        lblOTP.text = SignupConfigModel.shared.verificationCode
        if BasicDetailsModel.shared.holdingImage != nil{
            imgPic.image = BasicDetailsModel.shared.holdingImage
            holdingImage = BasicDetailsModel.shared.holdingImage
        }
    }
    
    fileprivate func permissionCheckGallery() {
        GlobalMethods.shared.checkForGalleryPermission(success: {
            DispatchQueue.main.async {
                self.openGallery()
            }
        }) {
            
        }
    }
    
    fileprivate func showInfoAlert() {
        
        let alertInfo = UIAlertController.init(title: "Info", message: StringConstants.UpholdingInfo, preferredStyle: .alert)
        
        let okAction = UIAlertAction.init(title: StringConstants.okText, style: .cancel) { (alert) in
            
        }
        
        alertInfo.addAction(okAction)
        GlobalMethods.shared.presentVC(alertInfo)
        
    }
    
    fileprivate func saveDetails(){
        
        DispatchQueue.main.async {
            BasicDetailsModel.shared.holdingImage = self.holdingImage
            self.completionHandler(4)
            GlobalMethods.shared.popVC()
        }
        
    }
    
    fileprivate func checkvalidation() -> Bool{
        if holdingImage == nil{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.UpholdingMissing)
            return false
        }
        return true

    }
    
    func openGallery()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        GlobalMethods.shared.presentVC(imagePicker)
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            
            holdingImage = pickedImage
            imgPic.image = pickedImage
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
    //MARK: - Actions
    
    @IBAction func actionSelectImage(_ sender: Any) {
        self.view.endEditing(true)
        self.permissionCheckGallery()
    }
    
    @IBAction func actionSave(_ sender: Any) {
        if checkvalidation(){
            upholdingAPI()
        }
    }
    
    @IBAction func actionInfo(_ sender: Any) {
        showInfoAlert()
    }
   
     //MARK: - Web Services
    
    fileprivate func upholdingAPI(){
        
        let params = ["step":"face","number":SignupConfigModel.shared.verificationCode,"substep":"face","iso":SignupConfigModel.shared.selectedCountry.iso]
        
        NetworkManager.shared.POSTUpholdingDetails(params: params, fileArray: [holdingImage!], filenameArray: ["file[]"], success: { (responseJSON) in
            self.saveDetails()
        }) { (errorMsg) in
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.UpholdingMissing)

        }
    }

}
