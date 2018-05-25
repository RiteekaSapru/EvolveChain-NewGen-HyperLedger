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
    
    static let sharedInstance = DocumentModel()
    
    var identityType: IdentityType = .PassportIdentityType
    
    var addressType: AddressType = .PassportAddressType
    
    var passportModel : PassportModel = PassportModel.init()
    var drivingModel : DrivingLicenseModel = DrivingLicenseModel.init()
    var taxationModel : TaxationModel = TaxationModel.init()
    var utilityModel : UtilityBillModel = UtilityBillModel.init()
    
    // MARK:- Init
    override init() {
        super.init()
        identityType             = .PassportIdentityType
        addressType             = .PassportAddressType
        self.passportModel           = PassportModel.init()
        self.drivingModel           = DrivingLicenseModel.init()
        self.taxationModel           = TaxationModel.init()
        self.utilityModel           = UtilityBillModel.init()
        
    }
    
    func eraseData() {
        identityType             = .PassportIdentityType
        addressType             = .PassportAddressType
        self.passportModel           = PassportModel.init()
        self.drivingModel           = DrivingLicenseModel.init()
        self.taxationModel           = TaxationModel.init()
        self.utilityModel           = UtilityBillModel.init()
    }
}
