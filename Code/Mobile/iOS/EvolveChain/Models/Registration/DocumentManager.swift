//
//  DocumentManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

enum DocumentType : String {
    case  IdentityType
    case  AddressType
}

enum CellType : String {
    case  PickerType
    case  SelectionType
    case  TextfieldType
    case  LabelType
    case  DatePickerType
    case  TwoImagePickerType
}

class DocumentManager: NSObject {
    
    static let shared               = DocumentManager()
    
    var selectedIdentityModel : DocModel = DocModel.init()
    var selectedAddressModel : DocModel = DocModel.init()

    
    var arrIdentity : [DocModel] = []
    var arrAddress : [DocModel] = []
    
    var isIdentityDocsUploaded : Bool   = false
    var isAddressDocsUploaded : Bool   = false
    
    func sortModel(doc:DocModel)  {
        
        switch doc.type{
        case "B":
            arrIdentity.append(doc)
            arrAddress.append(doc)
            
        case "I":arrIdentity.append(doc)
            
        case "A":arrAddress.append(doc)
            
        default :break
        }
    }
    
    // MARK: - Delete
    
    func eraseData() {
        arrIdentity.removeAll()
        arrAddress.removeAll()
        
        isIdentityDocsUploaded    = false
        isAddressDocsUploaded    = false
        
         selectedIdentityModel = DocModel.init()
         selectedAddressModel  = DocModel.init()

    }
    
    // MARK: - INIT
    
    func initWith(docArray:[Dictionary<String,Any>]) {
        
        arrIdentity.removeAll()
        arrAddress.removeAll()
        
         isIdentityDocsUploaded    = false
         isAddressDocsUploaded    = false
        
        for dict in docArray{
            let model = DocModel.init()
            model.initWith(model: dict)
            sortModel(doc: model)
        }
        
        if arrIdentity.count > 0{
            self.selectedIdentityModel = arrIdentity[0]
        }
        
        if arrAddress.count > 0{
            self.selectedAddressModel = arrAddress[0]
        }
    }
    
    func getFieldArrayForModel(model : DocModel,docType : DocumentType) -> [[FieldsModel]] {
        
        var fieldArray = [[FieldsModel]]()
        
        switch docType {
        case .IdentityType:
            var pickerArray = [FieldsModel]()
            pickerArray.append(FieldsModel.init())
            
            for _ in arrIdentity{
                let obj = FieldsModel.init()
                obj.type = .SelectionType
                pickerArray.append(obj)
            }
            
            fieldArray.append(pickerArray)
            
        case .AddressType:
            var pickerArray = [FieldsModel]()
            pickerArray.append(FieldsModel.init())
            
            for _ in arrAddress{
                let obj = FieldsModel.init()
                obj.type = .SelectionType
                pickerArray.append(obj)
            }
            
            fieldArray.append(pickerArray)
        }
        
        if model.subDocs.count > 0{
            
            model.isExpiryDate = model.selectedSubType!.isExpiryDate
            
            var pickerArray = [FieldsModel]()
            pickerArray.append(FieldsModel.init())
            
            for _ in model.subDocs{
                let obj = FieldsModel.init()
                obj.type = .SelectionType
                pickerArray.append(obj)
            }
            
            fieldArray.append(pickerArray)
        }
        else{
            fieldArray.append([])
        }
        
        var inputFieldArray = [FieldsModel]()
        
        let obj1 = FieldsModel.init()
        obj1.type = .TextfieldType
        inputFieldArray.append(obj1)
        
        let obj2 = FieldsModel.init()
        obj2.type = .LabelType
        inputFieldArray.append(obj2)
        
        if model.isExpiryDate{
            let obj3 = FieldsModel.init()
            obj3.type = .DatePickerType
            inputFieldArray.append(obj3)
        }
        
        let obj4 = FieldsModel.init()
        obj4.type = .TwoImagePickerType
        inputFieldArray.append(obj4)
        
        fieldArray.append(inputFieldArray)
        
        return fieldArray
        
    }
    
    // MARK: - Edit
    
    func getDocModelWithType(doc_type:String, inArray arrDocs:[DocModel]) -> DocModel? {
        for model in arrDocs{
            if model.code == doc_type{
                return model
            }
        }
        return nil
    }
    
    func initWithResponesEdit(responseJSON:Dictionary<String,Any> ) {
        
        if let identityDict = RawdataConverter.dictionary(responseJSON["IdentityInfo"]){
            if let docDetails = RawdataConverter.dictionary(identityDict["DocDetails"]){
                if let docType = RawdataConverter.optionalString(docDetails["document_type"]){
                    let model = getDocModelWithType(doc_type: docType, inArray: arrIdentity)
                    if model != nil{
                        
                        model?.value = RawdataConverter.string(docDetails["number"])
                        if let expiry = RawdataConverter.optionalString(docDetails["expiry_date"]){
                            model?.date = Date.dateFromFormatted3_String(expiry)
                        }
                        
                        model?.isSavedComplete = true
                        selectedIdentityModel = model!
                        isIdentityDocsUploaded = true
                        
                        if let subDocType = RawdataConverter.optionalString(docDetails["sub_document_type"]){
                            if model!.subDocs.count > 0{
                                for item in model!.subDocs{
                                    if item.code == subDocType{
                                        model?.selectedSubType = item
                                    }
                                }
                            }
                        }
                        
                        if let docImages = RawdataConverter.array(identityDict["DocImages"]){
                            if docImages.count > 1{
                                if let frontImageDict = RawdataConverter.dictionary(docImages[0]){
                                    if let urlStr = RawdataConverter.optionalString(frontImageDict["url"]){
                                        do {
                                            let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                                            model?.frontImage = UIImage.init(data: imageData)
                                        }
                                        catch let error as NSError {
                                            print("Error: \(error.localizedDescription)")
                                        }
                                    }
                                }
                                
                                if let backImageDict = RawdataConverter.dictionary(docImages[1]){
                                    if let urlStr = RawdataConverter.optionalString(backImageDict["url"]){
                                        do {
                                            let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                                            model?.backImage = UIImage.init(data: imageData)
                                        }
                                        catch let error as NSError {
                                            print("Error: \(error.localizedDescription)")
                                        }
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    
    
    
    if let addressDict = RawdataConverter.dictionary(responseJSON["AddressInfo"]){
        if let docDetails = RawdataConverter.dictionary(addressDict["DocDetails"]){
            if let docType = RawdataConverter.optionalString(docDetails["document_type"]){
                let model = getDocModelWithType(doc_type: docType, inArray: arrAddress)
                if model != nil{
                    
                    model?.value = RawdataConverter.string(docDetails["number"])
                    if let expiry = RawdataConverter.optionalString(docDetails["expiry_date"]){
                        model?.date = Date.dateFromFormatted3_String(expiry)
                    }
                    model?.isSavedComplete = true
                    selectedAddressModel = model!
                    isAddressDocsUploaded = true
                    if let subDocType = RawdataConverter.optionalString(docDetails["sub_document_type"]){
                        if model!.subDocs.count > 0{
                            for item in model!.subDocs{
                                if item.code == subDocType{
                                    model?.selectedSubType = item
                                }
                            }
                        }
                    }
                   
                    
                    if let docImages = RawdataConverter.array(addressDict["DocImages"]){
                        if docImages.count > 1{
                            if let frontImageDict = RawdataConverter.dictionary(docImages[0]){
                                if let urlStr = RawdataConverter.optionalString(frontImageDict["url"]){
                                    do {
                                        let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                                        model?.frontImage = UIImage.init(data: imageData)
                                    }
                                    catch let error as NSError {
                                        print("Error: \(error.localizedDescription)")
                                    }
                                }
                            }
                            
                            if let backImageDict = RawdataConverter.dictionary(docImages[1]){
                                if let urlStr = RawdataConverter.optionalString(backImageDict["url"]){
                                    do {
                                        let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                                        model?.backImage = UIImage.init(data: imageData)
                                    }
                                    catch let error as NSError {
                                        print("Error: \(error.localizedDescription)")
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }
        }
    }
}
}





class FieldsModel: NSObject {
    
    var type : CellType = .PickerType
    var isExpanded : Bool = false
    
}
