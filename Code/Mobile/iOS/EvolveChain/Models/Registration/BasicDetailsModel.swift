//
//  BasicDetailsModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
enum CountryType : String {
    case  India
    case  NorthAmerica
}

class BasicDetailsModel: NSObject, NSCoding {

    static let sharedInstance = BasicDetailsModel()
    
    var countryType: CountryType             = .India
    var countryCode: String             = ""
    var fname: String                   = ""
    var mname: String                   = ""
    var lname: String                   = ""
    var dob: Date                       = Date()
    var placeOfBirth: String            = ""
    
    var add1: String                    = ""
    var add2: String                    = ""
    var street: String                  = ""
    var city: String                    = ""
    var state: String                   = ""
    var country: String                 = ""
    var zipCode: String                 = ""
    
    var userImage : UIImage             = UIImage.init(named: "ic_profile_placeholder")!
    var contactNumber : String          = ""
    var email : String                  = ""
    var isEmailVerified : Bool          = false
    var isPhoneVerified : Bool          = false
    var isBasicDetailsComplete : Bool   = false
    var isAddressDetailsComplete : Bool   = false
    var userImageURL : String           =  ""
    
    
    // MARK:- Init
    override init() {
        super.init()
        countryCode              = ""
        fname                    = ""
        mname                    = ""
        lname                    = ""
        city                     = ""
        contactNumber            = ""
        userImage                = UIImage.init(named: "ic_profile_placeholder")!
        email                    = ""
        isEmailVerified          = false
        isPhoneVerified          =  false
        isBasicDetailsComplete   = false
        isAddressDetailsComplete   = false
    }
    
    required convenience init(coder aDecoder: NSCoder) {
        
        self.init()
        countryCode = aDecoder.decodeObject(forKey: "countryCode") as! String
        fname = aDecoder.decodeObject(forKey: "fname") as! String
        mname = aDecoder.decodeObject(forKey: "mname") as! String
        lname = aDecoder.decodeObject(forKey: "lname") as! String
        dob = aDecoder.decodeObject(forKey: "dob") as! Date
        placeOfBirth = aDecoder.decodeObject(forKey: "placeOfBirth") as! String

        add1 = aDecoder.decodeObject(forKey: "add1") as! String
        add2 = aDecoder.decodeObject(forKey: "add2") as! String
        street = aDecoder.decodeObject(forKey: "street") as! String
        city = aDecoder.decodeObject(forKey: "city") as! String
        state = aDecoder.decodeObject(forKey: "state") as! String
        country = aDecoder.decodeObject(forKey: "country") as! String
        zipCode = aDecoder.decodeObject(forKey: "zipCode") as! String
        contactNumber = aDecoder.decodeObject(forKey: "contactNumber") as! String
        email = aDecoder.decodeObject(forKey: "email") as! String
        userImageURL = aDecoder.decodeObject(forKey: "userImageURL") as! String

//        self.init(id: id, name: name, shortname: shortname)
    }
    
    func encode(with aCoder: NSCoder) {
        aCoder.encode(countryCode, forKey: "countryCode")
        aCoder.encode(fname, forKey: "fname")
        aCoder.encode(mname, forKey: "mname")
        aCoder.encode(lname, forKey: "lname")
        aCoder.encode(dob, forKey: "dob")
        aCoder.encode(placeOfBirth, forKey: "placeOfBirth")
        aCoder.encode(add1, forKey: "add1")
        aCoder.encode(add2, forKey: "add2")
        aCoder.encode(street, forKey: "street")
        aCoder.encode(city, forKey: "city")
        aCoder.encode(state, forKey: "state")
        aCoder.encode(country, forKey: "country")
        aCoder.encode(zipCode, forKey: "zipCode")
        aCoder.encode(contactNumber, forKey: "contactNumber")
        aCoder.encode(email, forKey: "email")
        aCoder.encode(userImageURL, forKey: "userImageURL")
       
    }
      // MARK: - Methods
    
    func getCompletePhoneNumber() -> String {
        return ("+"+countryCode+" "+contactNumber)
    }
    
    func getCompleteName() -> String {
        
        var name = fname
        
        if mname.count > 0{
            name.append(" "+mname)
        }
         name.append(" "+lname)
        
        return name
    }
    
    func eraseData() {
        countryCode             = ""
        fname                   = ""
        mname                   = ""
        lname                   = ""
        city                    = ""
        contactNumber           = ""
        userImage               = UIImage.init(named: "ic_profile_placeholder")!
        email                   = ""
        isEmailVerified         = false
        isPhoneVerified         =  false
        isBasicDetailsComplete  = false
        add1                    = ""
        add2                    = ""
        isAddressDetailsComplete = false
    }
    
    // MARK: - Get Basic Details
    
    func getBasicParamsForSaveKYC() -> Dictionary<String, Any> {
       
         let params = ["step":"basic","firstname":self.fname,"lastname":self.lname,"dob": self.dob.getUTCDateStringFromDateString(),"place_of_birth":self.placeOfBirth,"address1":self.add1,"address2":self.add2,"street":self.street,"city":self.city,"zip":self.zipCode,"state":self.state,"country":self.country,"middlename":self.mname,"substep":"basic"]
        
        return params
    }
    
    func getBasicDataInArray() -> [[Any]] {
        
        var basicData = [["User Image",self.userImage]]
        
//        basicData.append(["User Image",self.userImage])
        
        basicData.append(["Email",self.email])
        basicData.append(["Contact Number",self.getCompletePhoneNumber()])
        
        basicData.append(["First Name",self.fname])
        if self.mname.count > 0 {
            basicData.append(["Middle Name",self.mname])
        }
        
        basicData.append(["Last Name",self.lname])
        
        basicData.append(["Date of Birth",self.dob.getUTCDateStringFromDateString()])
        basicData.append(["Place of Birth",self.placeOfBirth])

        basicData.append(["Address Line 1",self.add1])
        if self.add2.count > 0 {
            basicData.append(["Address Line 2",self.add2])
        }
       
        basicData.append(["Street",self.street])
        basicData.append(["City",self.city])
        basicData.append(["Zip",self.zipCode])
        basicData.append(["State",self.state])
        basicData.append(["Country",self.country])
        
        return basicData
    }
    
    func initWithResponse(responseJson:Dictionary<String, Any>)
    {
        countryCode             = RawdataConverter.string(responseJson["country_code"])
        contactNumber            = RawdataConverter.string(responseJson["phone"])
        
        email                   = RawdataConverter.string(responseJson["email"])
        
        userImageURL            = RawdataConverter.string(responseJson["profile_pic"])
            
        fname                   = RawdataConverter.string(responseJson["firstname"])
        mname                   = RawdataConverter.string(responseJson["middlename"])
        lname                   = RawdataConverter.string(responseJson["lastname"])
        
        dob                     = Date.dateFromFormatted3_String(RawdataConverter.string(responseJson["dob"]))!
        
        placeOfBirth            = RawdataConverter.string(responseJson["place_of_birth"])
        
        add1                    = RawdataConverter.string(responseJson["address1"])
        add2                    = RawdataConverter.string(responseJson["address2"])
        street                  = RawdataConverter.string(responseJson["street"])
        zipCode                 = RawdataConverter.string(responseJson["zip"])
        city                    = RawdataConverter.string(responseJson["city"])
        state                   = RawdataConverter.string(responseJson["state"])
        country                 = RawdataConverter.string(responseJson["country"])
        isBasicDetailsComplete  = true
        isAddressDetailsComplete = true
    }
}
