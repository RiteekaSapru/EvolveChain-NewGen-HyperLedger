//
//  IdentityModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 18/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class IdentityModel: NSObject {
    static let sharedInstance = IdentityModel()
    
    var number: String = ""
    var expiry: Date = Date()
    var identityType : IdentityType = .PassportIdentityType
    var frontImage : UIImage = UIImage.init(named: "ic_img_placeholder")!
    var backImage : UIImage = UIImage.init(named: "ic_img_placeholder")!

    var isIdentityDetailsComplete : Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        number             = ""
        expiry            = Date()
        identityType = .PassportIdentityType
        frontImage       = UIImage.init(named: "ic_img_placeholder")!
        backImage       = UIImage.init(named: "ic_img_placeholder")!

        isIdentityDetailsComplete  = false
    }
}
