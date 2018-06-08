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
    
    static let sharedInstance               = DocumentManager()
    
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
    
    func initWith(docArray:[Dictionary<String,Any>]) {
        
        arrIdentity.removeAll()
        arrAddress.removeAll()
        
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
}


class FieldsModel: NSObject {
    
    var type : CellType = .PickerType
    var isExpanded : Bool = false
    
}
