//
//  SignupConfigModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SignupConfigModel: NSObject {
 static let shared = SignupConfigModel()
    
    var maxAge: Int             = 90
    var minAge: Int                   = 11
    
    var dateFormat: String             = ""
    var selectedCountry: CountryModel   = CountryModel.init()
    var arrCountryList: [CountryModel]   = []
    
    var verificationCode: String = ""
    
    
    // MARK:- Init
    override init() {
        super.init()
        maxAge              = 90
        minAge                    = 11
        dateFormat                    = ""
        arrCountryList                    = []
    }
    
    func initWithDictionary(configDict:Dictionary<String, Any>){
        
        if let ageLimit = RawdataConverter.dictionary(configDict["AGE_LIMIT"]){
            
            maxAge = RawdataConverter.integer(ageLimit["MAX"])
            minAge = RawdataConverter.integer(ageLimit["MIN"])
        }
        
        dateFormat = RawdataConverter.string(configDict["DATE_FORMAT"])
        
        if let countryList = RawdataConverter.array(configDict["COUNTRIES"]){
            arrCountryList.removeAll()
            
            for(_,item) in countryList.enumerated(){
                let model = CountryModel.init()
                model.initWithDictionary(countryDict: RawdataConverter.dictionary(item)!)
                arrCountryList.append(model)
            }
        }
        
        
        
    }
    
    func initCountryList(response:Array<Any>){
        arrCountryList.removeAll()
        for item in response{
            let model = CountryModel.init()
            model.initWithDictionary(countryDict: RawdataConverter.dictionary(item)!)
            arrCountryList.append(model)
        }
    }
    
    func getCountryListArray() -> [String] {
        var list = [String]()
        
        for item in arrCountryList{
            
            list.append(item.name + " (+" + item.phoneCode + ")")
        }
        return list
    }

    func initWithDocDictionary(docDict:Dictionary<String, Any>) {
        
    }
}
