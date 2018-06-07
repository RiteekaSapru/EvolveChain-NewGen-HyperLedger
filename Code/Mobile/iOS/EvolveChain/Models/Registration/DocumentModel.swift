//
//  DocumentModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 23/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
enum IdentityType : String {
    case  PassportIdentityType
    case  DrivingLicenceIdentityType
    case  TaxationIdentityType
}

enum AddressType : String {
    case  UtilityAddressType
    case  PassportAddressType
    case  DrivingLicenceAddressType
}

class DocumentModel: NSObject {
    
    static let sharedInstance               = DocumentModel()
    
    var dateFormatter                       = DateFormatter.init()
    
    var identityType: IdentityType          = .PassportIdentityType
    
    var addressType: AddressType            = .PassportAddressType
    
    var passportModel : PassportModel       = PassportModel.init()
    var drivingModel : DrivingLicenseModel  = DrivingLicenseModel.init()
    var taxationModel : TaxationModel       = TaxationModel.init()
    var utilityModel : UtilityBillModel     = UtilityBillModel.init()
    
    var isIdentityDetailsComplete : Bool   = false
    
    var isAddressDetailsComplete : Bool   = false
    
    // MARK:- Init
    override init() {
        super.init()
        identityType                    = .PassportIdentityType
        addressType                     = .PassportAddressType
        self.passportModel              = PassportModel.init()
        self.drivingModel               = DrivingLicenseModel.init()
        self.taxationModel              = TaxationModel.init()
        self.utilityModel               = UtilityBillModel.init()
        
        dateFormatter.dateFormat        = "yyyy-MM-dd"
    }
    
    // MARK:- Methods
    
    func eraseData() {
        identityType                    = .PassportIdentityType
        addressType                     = .PassportAddressType
        self.passportModel              = PassportModel.init()
        self.drivingModel               = DrivingLicenseModel.init()
        self.taxationModel              = TaxationModel.init()
        self.utilityModel               = UtilityBillModel.init()
        self.isAddressDetailsComplete = false
        self.isIdentityDetailsComplete = false
    }
    
    // MARK:- Identity Details
//    func isIdentityComplete() -> Bool {
//        switch identityType{
//        case .DrivingLicenceIdentityType:
//            if !DocumentModel.sharedInstance.drivingModel.iscomplete{
//                return false
//            }
//        case .PassportIdentityType:
//            if !DocumentModel.sharedInstance.passportModel.iscomplete{
//                return false
//            }
//        case .TaxationIdentityType:
//            if !DocumentModel.sharedInstance.taxationModel.iscomplete{
//                return false
//            }
//        }
//        return true
//    }
    
    func getIdentityDetailsForKYC() -> Dictionary<String,Any> {
        
         var params  : Dictionary = ["step":"identity"]
        
        switch self.identityType {
        case .DrivingLicenceIdentityType:
            
            let model = self.drivingModel
            params.updateValue("license", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(model.expiry.getUTCDateStringFromDateString(), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            
        case .PassportIdentityType:
            
            let model = self.passportModel
            params.updateValue("passport", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(model.expiry.getUTCDateStringFromDateString(), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            
        case .TaxationIdentityType:
            let model = self.taxationModel
            params.updateValue("taxation", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(model.dob.getUTCDateStringFromDateString(), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            
        }
        
        return params
    }
    
    func getIdentityImagesForKYC() -> [UIImage] {
         var imagesArray : [UIImage] = []
        
        switch self.identityType {
        case .DrivingLicenceIdentityType:
            
            let model = self.drivingModel
          
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
            
        case .PassportIdentityType:
            
            let model = self.passportModel
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
            
        case .TaxationIdentityType:
            let model = self.taxationModel
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
            
        }
        
        return imagesArray
    }
    
    // MARK:- Address Details
    
//    func isAddressComplete() -> Bool {
//        switch addressType{
//        case .DrivingLicenceAddressType:
//            if !DocumentModel.sharedInstance.drivingModel.iscomplete{
//                return false
//            }
//        case .PassportAddressType:
//            if !DocumentModel.sharedInstance.passportModel.iscomplete{
//                return false
//            }
//        case .UtilityAddressType:
//            if !DocumentModel.sharedInstance.utilityModel.iscomplete{
//                return false
//            }
//        }
//        
//        return true
//    }
    func getAddressDetailsForKYC() ->  Dictionary<String,Any>  {
        
         var params  : Dictionary = ["step":"address"]
        
        switch self.addressType {
        case .DrivingLicenceAddressType:
            
            let model = self.drivingModel
            params.updateValue("license", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(model.expiry.getUTCDateStringFromDateString(), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            
        case .PassportAddressType:
            
            let model = self.passportModel
            params.updateValue("passport", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue(model.expiry.getUTCDateStringFromDateString(), forKey: "expiry_date")
            params.updateValue(model.country, forKey: "country")
            params.updateValue("", forKey: "document_type")
            
        case .UtilityAddressType:
            let model = self.utilityModel
            params.updateValue("utility_bill", forKey: "substep")
            params.updateValue(model.number, forKey: "number")
            params.updateValue("", forKey: "expiry_date")
            params.updateValue(model.address, forKey: "country")
            params.updateValue(model.type.key, forKey: "document_type")
            
        }
        
        
        return params
    }
    
    func getAddressImagesForKYC() -> [UIImage] {
        var imagesArray : [UIImage] = []
        
        switch self.addressType {
        case .DrivingLicenceAddressType:
             let model = DocumentModel.sharedInstance.drivingModel
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
        case .PassportAddressType:
            let model = DocumentModel.sharedInstance.passportModel
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
        case .UtilityAddressType:
             let model = DocumentModel.sharedInstance.utilityModel
            imagesArray = [GlobalMethods.sharedInstance.resizeImage(image: model.frontImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0)),GlobalMethods.sharedInstance.resizeImage(image: model.backImage, targetSize: CGSize.init(width: 1000.0, height: 1000.0))]
            
        }
        
        return imagesArray
    }
    
    // MARK:- Summary Details
    
    func getPassportDataAsArray() -> [[Any]] {
        
        var passportData = [[Any]]()
        passportData.append(["Type","Passport"])
        passportData.append(["Number",passportModel.number])
        passportData.append(["Issuing Country",passportModel.country])
        passportData.append(["Expiry Date",dateFormatter.string(from: passportModel.expiry)])
        
        passportData.append(["Front Image",passportModel.frontImage,passportModel.backImage])
//        passportData.append(["Back Image",passportModel.backImage])

        return passportData

    }
    
    func getDrivingLicenseDataAsArray() -> [[Any]] {
        
        var drivingData = [[Any]]()
        drivingData.append(["Type","Driving License"])
        drivingData.append(["Number",drivingModel.number])
        drivingData.append(["Issuing Country",drivingModel.country])
        drivingData.append(["Expiry Date",dateFormatter.string(from: drivingModel.expiry)])
        
        drivingData.append(["Front Image",drivingModel.frontImage,drivingModel.backImage])
//        drivingData.append(["Back Image",drivingModel.backImage])
        
        return drivingData
        
    }
    
    func getTaxationDataAsArray() -> [[Any]] {
        
        var taxationData = [[Any]]()
        taxationData.append(["Type","Taxation"])
        taxationData.append(["Number",taxationModel.number])
        taxationData.append(["Issuing Country",taxationModel.country])
        taxationData.append(["Expiry Date",dateFormatter.string(from: taxationModel.dob)])
        
        taxationData.append(["Front Image",taxationModel.frontImage,taxationModel.backImage])
//        taxationData.append(["Back Image",taxationModel.backImage])
        
        return taxationData
        
    }
    
    func getUtiltityDataAsArray() -> [[Any]] {
        
        var utilityData = [[Any]]()
        utilityData.append(["Type","Utility Bill"])
        utilityData.append(["Bill Type",utilityModel.type.name])
        utilityData.append(["Number",utilityModel.number])
        utilityData.append(["Address",utilityModel.address])
        
        utilityData.append(["Front Image",utilityModel.frontImage,utilityModel.backImage])
//        utilityData.append(["Back Image",utilityModel.backImage])
        
        return utilityData
        
    }
    
    func getAddressDataInArray() -> [[Any]] {
        switch self.addressType {
        case .DrivingLicenceAddressType:
            return getDrivingLicenseDataAsArray()
        case .PassportAddressType:
            return getPassportDataAsArray()
        case .UtilityAddressType:
            return getUtiltityDataAsArray()
        }
    }
    
    func getIdentityDataInArray() -> [[Any]] {
        
        switch self.identityType {
        case .DrivingLicenceIdentityType:
            return getPassportDataAsArray()
        case .PassportIdentityType:
            return getPassportDataAsArray()
        case .TaxationIdentityType:
            return getTaxationDataAsArray()
        }
        
    }
    
    
}
