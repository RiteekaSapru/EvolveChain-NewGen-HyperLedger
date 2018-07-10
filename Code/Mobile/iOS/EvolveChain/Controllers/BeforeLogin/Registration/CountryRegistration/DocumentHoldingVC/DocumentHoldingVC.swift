//
//  DocumentHoldingVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 06/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import Photos
import AssetsLibrary

class DocumentHoldingVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate {

    @IBOutlet weak var lblOTP: UILabel!
    @IBOutlet weak var lblHelText: UILabel!
    @IBOutlet weak var imgPic: UIImageView!
    @IBOutlet weak var lblInfo: UILabel!
    
    var holdingImage : UIImage?
    var holdingImageDate : Date?
    var holdingImageLocation : (lat:String,long:String)?
    
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
        lblOTP.text = ConfigModel.shared.verificationCode
        
        
        if BasicDetailsModel.shared.holdingImage != nil{
            imgPic.image = BasicDetailsModel.shared.holdingImage
            holdingImage = BasicDetailsModel.shared.holdingImage
        }
        
        let attribInstructionText = NSMutableAttributedString.init(string: StringConstants.UpholdingInfo)
        attribInstructionText.addAttribute(.font, value: UIFont.init(name: "AvenirNext-Regular", size: 14)!, range: NSMakeRange(0, attribInstructionText.string.count))
        
        let range = (attribInstructionText.string as NSString).range(of: ConfigModel.shared.verificationCode)
        attribInstructionText.addAttribute(.font, value: UIFont.init(name: "AvenirNext-Medium", size: 14)!, range: range)

        
        lblInfo.attributedText = attribInstructionText
    }
    
    fileprivate func permissionCheckCamera() {
        Util.shared.checkForCameraPermission(success: {
            self.openCamera()
        }) {
            
        }
    }
    fileprivate func permissionCheckGallery() {
        
        Util.shared.checkForGalleryPermission(success: {
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
        Util.shared.presentVC(alertInfo)
        
    }
    
    fileprivate func saveDetails(){
        
        DispatchQueue.main.async {
            BasicDetailsModel.shared.holdingImage = self.holdingImage
            BasicDetailsModel.shared.holdingImageLocation = self.holdingImageLocation
            BasicDetailsModel.shared.holdingImageDate = self.holdingImageDate
            self.completionHandler(4)
            Util.shared.popVC()
        }
        
    }
    
    fileprivate func checkvalidation() -> Bool{
        if holdingImage == nil{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.UpholdingMissing)
            return false
        }
        else if holdingImage === BasicDetailsModel.shared.holdingImage{
            Util.shared.popVC()
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
        Util.shared.presentVC(imagePicker)
    }
    
    func openCamera()
    {
        if(UIImagePickerController .isSourceTypeAvailable(UIImagePickerControllerSourceType.camera))
        {
            let imagePicker = UIImagePickerController()
            imagePicker.delegate = self
            imagePicker.sourceType = UIImagePickerControllerSourceType.camera
            imagePicker.cameraDevice = .front
            imagePicker.allowsEditing = false
            Util.shared.presentVC(imagePicker)
        }
        else
        {
//            let alert  = UIAlertController(title: "Warning", message: "You don't have camera", preferredStyle: .alert)
//            alert.addAction(UIAlertAction(title: StringConstants.okText, style: .default, handler: nil))
//            Util.shared.presentVC(alert)
            permissionCheckGallery()
        }
    }
    
    //MARK: - ImagePicker delegate
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        if let pickedImage = info[UIImagePickerControllerOriginalImage] as? UIImage {
            
            holdingImage = pickedImage
            imgPic.image = pickedImage
        }
        self.holdingImageDate = nil
        self.holdingImageLocation = ("","")
        
        if let url: URL = info[UIImagePickerControllerReferenceURL] as? URL{
            
            if let asset = PHAsset.fetchAssets(withALAssetURLs: [url], options: nil).firstObject{
                self.holdingImageDate = asset.creationDate
                self.holdingImageLocation = (String(format:"%f", (asset.location?.coordinate.latitude)!),String(format:"%f", (asset.location?.coordinate.longitude)!))
                
            }
        }
        else if let metaDict = info[UIImagePickerControllerMediaMetadata] as? Dictionary<String,Any>{
            if let exifData = metaDict["{Exif}"] as? Dictionary<String,Any>{
                if let dateTime = exifData["DateTimeOriginal"] as? String{
                    print(dateTime)
                    if let date = Date.dateFromFormattedLocaldateTime_String(dateTime){
                        print(date)
                        self.holdingImageDate = date
                    }
                }
            }
        }
        if self.holdingImageLocation == nil{
            let loc = Util.shared.getLocation()
            self.holdingImageLocation = loc
        }
        
        picker.dismiss(animated: true, completion: nil)
    }
    
    //MARK: - Actions
    
    @IBAction func actionSelectImage(_ sender: Any) {
        self.view.endEditing(true)
        openCamera()
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
        //self.dob?.getUTCDateStringFromDateString() ?? " "
        
        let dateStr = self.holdingImageDate?.getUTCDateStringFromDateString() ?? ""
//        let params = ["step":"face","number":SignupConfigModel.shared.verificationCode,"substep":"face","iso":SignupConfigModel.shared.selectedCountry.iso,"time":dateStr,"ip":Util.shared.getIFAddresses()[1],"latitude":self.holdingImageLocation?.lat,"longitude":self.holdingImageLocation?.long]
        
        var param :[String: Any]  = [:]
        param["step"]    = "face"
        param["number"]     = ConfigModel.shared.verificationCode
        param["substep"]             = "face"
        
         param["iso"]             = ConfigModel.shared.selectedCountry.iso
         param["time"]             = dateStr
         param["ip"]             = Util.shared.getIFAddresses()[1]
         param["latitude"]             = self.holdingImageLocation?.lat
         param["longitude"]             = self.holdingImageLocation?.long
        param["location"]             = "No Location"
        
        
        NetworkManager.shared.POSTUpholdingDetails(params: param, fileArray: [holdingImage!], filenameArray: ["file[]"], success: { (responseJSON) in
            self.saveDetails()
        }) { (errorMsg) in
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)

        }
    }

}
