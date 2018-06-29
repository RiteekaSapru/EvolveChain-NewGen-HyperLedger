//
//  DocModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit


class DocModel: NSObject {

    var code: String                    = ""
    var isExpiryDate: Bool                   = false
     var type: String                   = ""
     var name: String                   = ""
    var subDocs: [DocModel]                   = []
    
    var value : String = ""
    var date : Date?// = Date()
    var frontImage : UIImage?// = UIImage.init(named: "ic_img_placeholder")!
    var backImage : UIImage?// = UIImage.init(named: "ic_img_placeholder")!
    var selectedSubType : DocModel?
    
    var isSavedComplete : Bool   = false
    
    // MARK:- Init
    override init() {
        super.init()
        
    }
    
    
    
    func initWith(model:Dictionary<String, Any>) {
        
        self.code = RawdataConverter.string(model["code"])
        self.isExpiryDate = RawdataConverter.boolean(model["expiry_date"])
        self.name = RawdataConverter.string(model["name"])
        self.type = RawdataConverter.string(model["type"])
        self.subDocs.removeAll()
        
        if let arrSubType = RawdataConverter.array(model["sub_docs"]) {
            for item in arrSubType{
                let docModel = DocModel.init()
                docModel.initWith(model: item as! Dictionary<String, Any>)
                self.subDocs.append(docModel)
            }
            if self.subDocs.count > 0{
                 self.selectedSubType = self.subDocs[0]
//                if self.selectedSubType!.isExpiryDate{
                    self.isExpiryDate = self.selectedSubType!.isExpiryDate
//                }
            }
        }
    }
    
    // MARK:- Methods
    
//    func eraseData(){
//        value = ""
//         date = nil
//         frontImage  = UIImage.init(named: "Passport-Face-Sample")!
//         backImage = UIImage.init(named: "Passport-Face-Sample")!
//
//        if self.subDocs.count > 0{
//            self.selectedSubType = self.subDocs[0]
//        }
//    }
    
    func getCopy() ->DocModel{
        let model = DocModel.init()
        
         model.code               = self.code
         model.isExpiryDate                  = self.isExpiryDate
         model.type                 = self.type
         model.name                 = self.name
         model.subDocs = self.subDocs
         model.selectedSubType = self.selectedSubType
         model.value = self.value
         model.date = self.date
        
        model.frontImage = self.frontImage
        model.backImage = self.backImage
        
        return model
    }
    
   
    
    // MARK:- Validations
    
    func validateModel() -> (isValid:Bool,indexPath:IndexPath?){
        
        if self.value.count == 0{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.NumberEmpty)
//            txtfldNumberIdentity.becomeFirstResponder()
            return (false,IndexPath.init(row: 0, section: 2));
        }
        else if self.value.count < 8{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.NumberIncorrect)
//            txtfldNumberIdentity.becomeFirstResponder()
            return (false,IndexPath.init(row: 0, section: 2));
        }
        else if self.isExpiryDate && self.date == nil{
             Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.IdentityExpiryEmpty)
             return (false,IndexPath.init(row: 2, section: 2));
        }
        else if self.frontImage == nil{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.IdentityFrontPicEmpty)
            return (false,IndexPath.init(row: 3, section: 2))
        }
        else if self.backImage == nil {
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.IdentityBackPicEmpty)
            return (false,IndexPath.init(row: 3, section: 2))
        }
        return (true,nil)
        
    }
    
    // MARK: - JSON
    
    func getModelAsDictionary(type:DocumentType) -> Dictionary<String,Any>{
        
        var step = ""
        
        switch type {
        case .AddressType:
            step = "address"
        case .IdentityType:
            step = "identity"
        }
        
        var params  : Dictionary = ["step":step]
        
        params.updateValue(self.code, forKey: "substep")
        params.updateValue(self.value, forKey: "number")
        
        if self.isExpiryDate {
            params.updateValue(self.date!.getUTCDateStringFromDateString(), forKey: "expiry_date")
        }
        else{
            params.updateValue("", forKey: "expiry_date")
        }
        
        params.updateValue(SignupConfigModel.shared.selectedCountry.iso, forKey: "country")
        if self.subDocs.count > 0 {
            params.updateValue(self.selectedSubType!.code, forKey: "subdoc")
        }
        else{
             params.updateValue("", forKey: "subdoc")
        }
        
        params.updateValue(SignupConfigModel.shared.selectedCountry.iso, forKey: "iso")
        
        return params
    }
    
    func getImagesForKYC() -> [UIImage] {
        
       let imagesArray = [Util.shared.resizeImage(image: self.frontImage!, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),Util.shared.resizeImage(image: self.backImage!, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
        
         return imagesArray

    }
    
    
     // MARK: - Summary
    
    func getDataAsArray() -> [[Any]] {
        
        var modelData = [[Any]]()
        modelData.append(["Type",self.name])
        if self.subDocs.count > 0 {
            modelData.append(["Bill Type",self.selectedSubType?.name ?? ""])
        }
        modelData.append(["Number",self.value])
        modelData.append(["Issuing Country",SignupConfigModel.shared.selectedCountry.name])
        if self.isExpiryDate {
            modelData.append(["Expiry Date",self.date?.dateWithStringFormat("MMM dd, yyyy") ?? " "])
        }
        
        
        modelData.append(["Front Image",self.frontImage!,self.backImage!])
        
        return modelData
        
    }
    
    
}
