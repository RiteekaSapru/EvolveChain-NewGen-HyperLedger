//
//  TaxationModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 23/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class TaxationModel: NSObject {
    var number: String          = ""
    var country: String         = ""
    var dob: Date            = Date()
    var frontImage : UIImage    = UIImage.init(named: "ic_img_placeholder")!
    var backImage : UIImage     = UIImage.init(named: "ic_img_placeholder")!
    var iscomplete :Bool        = false
    
    // MARK:- Init
    override init() {
        super.init()
        number              = ""
        country             = ""
        frontImage          = UIImage.init(named: "ic_img_placeholder")!
        backImage           = UIImage.init(named: "ic_img_placeholder")!
        iscomplete          = false
        dob              = Date()
    }
}
