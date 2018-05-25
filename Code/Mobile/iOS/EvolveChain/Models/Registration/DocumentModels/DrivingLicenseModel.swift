//
//  DrivingLicenseModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 23/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class DrivingLicenseModel: NSObject {

    var number: String = ""
    var expiry: Date = Date()
    var country: String = ""
    
    var frontImage : UIImage = UIImage.init(named: "ic_img_placeholder")!
    var backImage : UIImage = UIImage.init(named: "ic_img_placeholder")!
     var iscomplete :Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        number             = ""
        country             = ""
        expiry            = Date()
        frontImage       = UIImage.init(named: "ic_img_placeholder")!
        backImage       = UIImage.init(named: "ic_img_placeholder")!
         iscomplete = false
    }
}
