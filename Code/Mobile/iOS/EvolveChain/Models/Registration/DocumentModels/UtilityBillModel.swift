//
//  UtilityBillModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 23/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class UtilityBillModel: NSObject {
    
    var type: String = ""
   
    var number: String = ""
    var address: String = ""
    
    var frontImage : UIImage = UIImage.init(named: "ic_img_placeholder")!
    var backImage : UIImage = UIImage.init(named: "ic_img_placeholder")!
     var iscomplete :Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        number             = ""
        address             = ""
        type             = ""
        frontImage       = UIImage.init(named: "ic_img_placeholder")!
        backImage       = UIImage.init(named: "ic_img_placeholder")!
        iscomplete = false
    }
}
