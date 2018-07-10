//
//  SignupConfigModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//
struct Configuration : Decodable {
    let addExpirationDays: String?
    let appExpiryNotificationDays: String?
    let minDaysToExpiry: Int?
    let siteUrl: String?
    let supportEmails: String?
    let supportPhone: String?
}

struct CountryStruct : Decodable {
    let id: String?
    let ageLimit: age_limit?
    let currency_code: String?
    let isActive: Bool?
    let name: String?
    let iso: String?
    let order: Int?
    let phone_code: Int?
    let phone_format: String?
    
    enum CodingKeys: String, CodingKey {
        case ageLimit = "age_limit"
        case id = "_id"
        case currency_code
        case isActive = "is_active"
        case name
        case iso
        case order
        case phone_code
        case phone_format

    }
}

struct age_limit : Decodable  {
     let maxAge: Int?
     let minAge: Int?
    
    enum CodingKeys: String, CodingKey {
        case maxAge = "max"
        case minAge = "min"

    }
}

struct Config :Decodable {
    let configuration : Configuration?
    let country : [CountryStruct]?
}


import UIKit

class ConfigModel: NSObject {
 static let shared = ConfigModel()
    
//    var isTesting: Bool             = false
    var maxAge: Int             = 90
    var minAge: Int                   = 11
    
    var dateFormat: String             = ""
    var selectedCountry: CountryModel   = CountryModel.init()
    var arrCountryList: [CountryModel]   = []
    
    var verificationCode: String = ""
    
    var supportPhone: String = ""
    var supportEmails: String = ""
    var siteUrl: String = ""
    var minDaysToExpiry: Int = 1
    
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
    
    func processConfig(response:Dictionary<String,Any>){
        if let phone = RawdataConverter.optionalString(response["supportPhone"]){
            supportPhone = phone
        }
        if let emails = RawdataConverter.optionalString(response["supportEmails"]){
            supportEmails = emails
        }
        if let site = RawdataConverter.optionalString(response["siteUrl"]){
            siteUrl = site
        }
        if let minDays = RawdataConverter.optionalInteger(response["minDaysToExpiry"]){
            minDaysToExpiry = minDays
        }
        
//         supportEmails = RawdataConverter.string(response["supportEmails"])
//         siteUrl = RawdataConverter.string(response["siteUrl"])
//         minDaysToExpiry = RawdataConverter.integer(response["minDaysToExpiry"])

    }
    
    // MARK:- Testing
    
    func getTestingStatus() -> Bool{
       return _userDefault.bool(forKey: "KtestingEnableKey")
    }
}
