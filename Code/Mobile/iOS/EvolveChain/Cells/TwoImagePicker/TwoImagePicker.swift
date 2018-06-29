//
//  TwoImagePicker.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class TwoImagePicker: UITableViewCell,UIImagePickerControllerDelegate,UINavigationControllerDelegate {

    @IBOutlet weak var imgFront: UIImageView!
    @IBOutlet weak var imgBack: UIImageView!
    @IBOutlet weak var lblHint: UILabel!
    
    var currentImageIndex : Int = 0
    
     var model = DocModel.init()
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    // MARK: - Custom Methods

    
     func setModel(mdl:DocModel,cellType:CellType) {
        self.model = mdl
        
        var placeHolderImage = UIImage.init(named: "ic_upload_doc")!
        
        if mdl.code == "UB"{
            placeHolderImage = UIImage.init(named: "sample-Utility")!
        }
        
        if  model.frontImage != nil {
            imgFront.image = model.frontImage
        }
        else{
             imgFront.image = placeHolderImage
        }
        
        if  model.backImage != nil {
            imgBack.image  = model.backImage
        }
        else{
            imgBack.image = placeHolderImage
        }
        
        lblHint.text = ""
    }
    
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
    
    func openGallery()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        Util.shared.presentVC(imagePicker)
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
    
    
    func showImageOptions() {
        Util.shared.showAlertForImagePicker { (index) in
            switch index{
            case 1 : self.permissionCheckCamera()
            case 2: self.permissionCheckGallery()
            default:
                break
            }
        }
    }
    // MARK: - Actions

    @IBAction func actionBackImage(_ sender: Any) {
        currentImageIndex = 1
        showImageOptions()
    }
    @IBAction func actionFrontImage(_ sender: Any) {
        currentImageIndex = 0
        showImageOptions()
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            switch currentImageIndex {
            case 0:
                model.frontImage = pickedImage
                imgFront.image = pickedImage
            case 1:
                model.backImage = pickedImage
                imgBack.image = pickedImage
            default:
                break
            }
            
        }
        picker.dismiss(animated: true, completion: nil)
    }
    
}
