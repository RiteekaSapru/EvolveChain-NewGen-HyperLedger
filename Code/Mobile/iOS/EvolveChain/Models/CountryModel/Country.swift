//
//  Country.swift
//  MedikChain
//
//  Created by Yudiz Solutions on 07/03/18.
//  Copyright © 2018 Yudiz Solutions. All rights reserved.
//

import Foundation
import UIKit
//import PhoneNumberKit

// MARK:- CountrySpecific
struct CountrySpecific {
    var title: String = ""
    var arr: [Country] = []
    
    init(key: String, value: [Country]) {
        title = key
        arr = value
    }
}
//let defaultCountry : Country = Country()
// MARK:- Country
class Country: NSObject , NSCopying,NSMutableCopying{
    
    // MARK:- Variables
    var iso: String = ""
    var name: String = ""
    var capital: String = ""
    var continent: String = ""
    var currencyCode: String = ""
    var phoneCode: String = ""
    var iso2: String = ""
    var order: String = ""
    var banned: Bool   = false
    var isSelected: Bool   = false
    
    // MARK:- Init
    override init() {
        super.init()
        iso             = ""
        name            = ""
        capital         = ""
        continent       = ""
        currencyCode    = ""
        phoneCode       = ""
        iso2            = ""
        order           = ""
        banned          =  false
        isSelected      =  false
    }
    
    init(dict: [String: Any], isDefault: Bool = false) {
        super.init()
        if isDefault {
            iso             = "IN"
            name            = "India"
            capital         = "New Delhi"
            continent       = "AS"
            currencyCode    = "INR"
            phoneCode       = "91"
            iso2            = "IND"
            order           = "105"
            banned          =  false
        }else{
            iso             = RawdataConverter.string(dict["ISO"])
            name            = RawdataConverter.string(dict["Country"])
            capital         = RawdataConverter.string(dict["Capital"])
            continent       = RawdataConverter.string(dict["Continent"])
            currencyCode    = RawdataConverter.string(dict["CurrencyCode"])
            phoneCode       = RawdataConverter.string(dict["PhoneCode"])
            iso2            = RawdataConverter.string(dict["ISO2"])
            order           = RawdataConverter.string(dict["order"])
            banned          = RawdataConverter.boolean(dict["banned"])
        }
    }
    
    func copy(with zone: NSZone? = nil) -> Any {
        let copy = Country()
        copy.iso                 = self.iso
        copy.name                = self.name
        copy.capital             = self.capital
        copy.continent           = self.continent
        copy.currencyCode        = self.currencyCode
        copy.phoneCode           = self.phoneCode
        copy.iso2                = self.iso2
        copy.order               = self.order
        copy.banned              = self.banned
        copy.isSelected          = self.isSelected
        
        return copy
    }
    
    func mutableCopy(with zone: NSZone? = nil) -> Any{
        let copy = Country()
        copy.iso                 = self.iso
        copy.name                = self.name
        copy.capital             = self.capital
        copy.continent           = self.continent
        copy.currencyCode        = self.currencyCode
        copy.phoneCode           = self.phoneCode
        copy.iso2                = self.iso2
        copy.order               = self.order
        copy.banned              = self.banned
        copy.isSelected          = self.isSelected
        return copy
    }
    
    // MARK:- Get Country List
    class func getCountryList() -> [Country] {
        if let contryPath = Bundle.main.path(forResource: "countries", ofType: "json") {
            do {
                let data = try Data(contentsOf: URL(fileURLWithPath: contryPath))
                var countries : [Country] = []
                if let dictList = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments) as? [[String:Any]] {
                    for dictCountry in dictList {
                        countries.append(Country(dict: dictCountry))
                    }
                    //                countries.sort(by: { (ds1, ds2) -> Bool in
                    //                    return ds1.name.localizedCaseInsensitiveCompare(ds2.name) == ComparisonResult.orderedAscending
                    //                })
                }
                return countries
                
            } catch let error as NSError {
//                jprint("Error: \(error.localizedDescription)")
            }
        }
        return []
    }
    
    
//    class func getDefaultCountry() -> Country {
//        if let contryPath = Bundle.main.path(forResource: "countries", ofType: "json") {
//            do {
//                let data = try Data(contentsOf: URL(fileURLWithPath: contryPath))
//                if let dictList = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments) as? [[String:Any]] {
//
//                    let regionCode =  PhoneNumberKit.defaultRegionCode()
//                    for dictCountry in dictList {
//                        let country =  Country(dict: dictCountry)
//                        if regionCode == country.iso.uppercased(){
//                            return country
//                        }
//                    }
//                }
//            } catch let error as NSError {
//                jprint("Error: \(error.localizedDescription)")
//            }
//        }
//        return Country(dict: [:], isDefault: true)
//    }
    
    class func getCountry(_ isoCode: String) -> Country? {
        if let contryPath = Bundle.main.path(forResource: "countries", ofType: "json") {
            do {
                let data = try Data(contentsOf: URL(fileURLWithPath: contryPath))
                if let dictList = try JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments) as? [[String:Any]] {
                    
                    for dictCountry in dictList {
                        let country =  Country(dict: dictCountry)
                        if isoCode == country.iso2{
                            return country
                        }
                    }
                }
            } catch let error as NSError {
//                jprint("Error: \(error.localizedDescription)")
            }
        }
        return nil
    }
    
    class func getCountryArray(_ arrIsoCode : [String]) -> [Country]?{
        var countries : [Country] = []
        for isoCode in arrIsoCode{
            countries.append(Country.getCountry(isoCode)!)
        }
        return countries
    }
    
    class func getCountryArrayAsString(arrCountryList:[Country]) -> [String]?{
        var countries : [String] = []
        for item in arrCountryList{
            countries.append(item.name + " (+" + item.phoneCode + ")")
        }
        return countries
    }
}

