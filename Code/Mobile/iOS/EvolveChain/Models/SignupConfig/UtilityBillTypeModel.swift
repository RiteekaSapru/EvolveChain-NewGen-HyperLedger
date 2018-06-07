//
//  UtilityBillModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class UtilityBillTypeModel: NSObject {

    var key: String             = ""
    var name: String                   = ""
    
    // MARK:- Init
    override init() {
        super.init()
        key              = ""
        name                    = ""
    }
    

    
    func initWithDictionary(billDict:Dictionary<String, Any>){
        
        self.key = RawdataConverter.string(billDict["CODE"])
        self.name = RawdataConverter.string(billDict["NAME"])
    }
    
   
}
