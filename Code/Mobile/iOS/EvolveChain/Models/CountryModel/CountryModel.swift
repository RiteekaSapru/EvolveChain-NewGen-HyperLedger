//
//  CountryModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class CountryModel: NSObject {
    var phoneCode: String             = ""
    var name: String                   = ""
    var iso: String                   = ""
    var order: String                   = ""
    var isActive: Bool                   = false
    var phoneFormat: String                   = ""
    var currencyCode: String                   = ""
 
    var maxAge: Int             = 90
    var minAge: Int                   = 11
    
    // MARK:- Init
    override init() {
        super.init()
        phoneCode              = ""
        name                    = ""
    }
    
    func initWithDictionary(countryDict:Dictionary<String, Any>){
        
        phoneCode = RawdataConverter.string(countryDict["phone_code"])
        name = RawdataConverter.string(countryDict["name"])
        iso = RawdataConverter.string(countryDict["iso"])
        order = RawdataConverter.string(countryDict["order"])
        isActive = RawdataConverter.boolean(countryDict["is_active"])
        phoneFormat = RawdataConverter.string(countryDict["phone_format"])
        currencyCode = RawdataConverter.string(countryDict["currency_code"])
        
        if let ageLimit = RawdataConverter.dictionary(countryDict["age_limit"]){
            maxAge = RawdataConverter.integer(ageLimit["max"])
            minAge = RawdataConverter.integer(ageLimit["min"])
        }
        

    }
}
