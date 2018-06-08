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
    
     func setModel(mdl:DocModel,cellType:CellType) {
        self.model = mdl
        
        let placeHolderImage = UIImage.init(named: "ic_img_placeholder")!
        
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
        _navigator.present(imagePicker, animated: true, completion: nil)
    }
    
    @IBAction func actionBackImage(_ sender: Any) {
        currentImageIndex = 1
        permissionCheckGallery()
    }
    @IBAction func actionFrontImage(_ sender: Any) {
        currentImageIndex = 0
        permissionCheckGallery()
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
