//
//  DocModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit


class DocModel: NSObject {

    var code: String                    = ""
    var isExpiryDate: Bool                   = false
     var type: String                   = ""
     var name: String                   = ""
    var subDocs: [DocModel]                   = []
    
    var value : String = ""
    var date : Date = Date()
    var frontImage : UIImage = UIImage.init(named: "Passport-Face-Sample")!
    var backImage : UIImage = UIImage.init(named: "Passport-Face-Sample")!
    var selectedSubType : DocModel = DocModel.init()
    
    var isSavedComplete : Bool   = false
    
    // MARK:- Init
    override init() {
        super.init()
        
    }
    
    // MARK:- Methods
    
    func initWith(model:Dictionary<String, Any>) {
        
        self.code = RawdataConverter.string(model["code"])
        self.isExpiryDate = RawdataConverter.boolean(model["expiry_date"])
        self.name = RawdataConverter.string(model["name"])
        self.type = RawdataConverter.string(model["type"])
        self.subDocs.removeAll()
        
        if let arrSubType = RawdataConverter.array(model["sub_docs"]) {
            for item in arrSubType{
                let docModel = DocModel.init()
                docModel.initWith(model: item as! Dictionary<String, Any>)
                self.subDocs.append(docModel)
            }
            if self.subDocs.count > 0{
                 self.selectedSubType = self.subDocs[0]
            }
           
        }
    }
    
    func eraseData(){
        value = ""
         date = Date()
         frontImage  = UIImage.init(named: "Passport-Face-Sample")!
         backImage = UIImage.init(named: "Passport-Face-Sample")!
        if self.subDocs.count > 0{
            self.selectedSubType = self.subDocs[0]
        }
    }
    
}
