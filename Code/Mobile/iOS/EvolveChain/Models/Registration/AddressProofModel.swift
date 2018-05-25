//
//  AddressProofModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class AddressProofModel: NSObject {
    static let sharedInstance = AddressProofModel()
    
    var add1: String = ""
    var add2: String = ""
    var state: String = ""
    var country: String = ""
    var areaCode: String = ""
    
    var taxationID: String = ""
    
    var SSNiD: String = ""

    var addressType : AddressType = .UtilityAddressType
    var addressImage : UIImage = UIImage.init(named: "ic_img_placeholder")!

    
    var isAddressDetailsComplete : Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        add1             = ""
        add2             = ""
        state             = ""
        country             = ""
        areaCode             = ""
        
        taxationID             = ""
        
        SSNiD             = ""

        addressImage       = UIImage.init(named: "ic_img_placeholder")!
  
        
        isAddressDetailsComplete  = false
    }
}
