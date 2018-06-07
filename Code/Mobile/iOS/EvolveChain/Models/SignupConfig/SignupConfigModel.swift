//
//  SignupConfigModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SignupConfigModel: NSObject {
 static let sharedInstance = SignupConfigModel()
    
    var maxAge: Int             = 90
    var minAge: Int                   = 11
    
    var dateFormat: String             = ""
    var selectedCountry: CountryModel   = CountryModel.init()
    var arrCountryList: [CountryModel]   = []
    
    var arrUtilityBillTypeList:[UtilityBillTypeModel] = []
        
    // MARK:- Init
    override init() {
        super.init()
        maxAge              = 90
        minAge                    = 11
        dateFormat                    = ""
        arrCountryList                    = []
        arrUtilityBillTypeList                     = []
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
        
        if let billList = RawdataConverter.array(configDict["USA_UTILITY_BILL_TYPE"]){
            arrUtilityBillTypeList.removeAll()
            
            for(_,item) in billList.enumerated(){
                let model = UtilityBillTypeModel.init()
                model.initWithDictionary(billDict: RawdataConverter.dictionary(item)!)
                arrUtilityBillTypeList.append(model)
            }
        }
        
    }
    
    func getBillArray() -> [String] {
        var arrBill = [String]()
        
        for(_,item) in arrUtilityBillTypeList.enumerated(){
            arrBill.append(item.name)
        }
        return arrBill;
    }
    
    func initWithDocDictionary(docDict:Dictionary<String, Any>) {
        
    }
}
