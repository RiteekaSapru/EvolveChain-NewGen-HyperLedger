//
//  BasicDetailsModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//
import CoreLocation
import UIKit
enum CountryType : String {
    case  India
    case  NorthAmerica
}

class BasicDetailsModel: NSObject, NSCoding {

    static let shared = BasicDetailsModel()
    
    var countryType: CountryType             = .India
    var countryCode: String             = ""
    var fname: String                   = ""
    var mname: String                   = ""
    var lname: String                   = ""
    var dob: Date?                       = Date()
    var placeOfBirth: String            = ""
    var gender: String                  = ""
    
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

    var kycId : String                  = ""

    
    var userImageURL : String           =  ""
    
    var holdingImage : UIImage?
    var holdingImageDate : Date?
    var holdingImageLocation : (lat:String,long:String)?
    
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
        street                  = ""
        gender                    = ""
        isAddressDetailsComplete = false
        zipCode = ""
        state = ""
        country = ""
         kycId                   = ""
        
        
         userImageURL            =  ""
        
         holdingImage = nil
        holdingImageDate = nil
        holdingImageLocation = nil
    }
    
    // MARK: - Get Basic Details
    
    func getBasicParamsForSaveKYC() -> Dictionary<String, Any> {
       
        let params : Dictionary<String, Any> = ["step":"basic","firstname":self.fname,"lastname":self.lname,"dob": self.dob?.getUTCDateStringFromDateString() ?? " ","place_of_birth":self.placeOfBirth,"address1":self.add1,"address2":self.add2,"street":self.street,"city":self.city,"zip":self.zipCode,"state":self.state,"country":self.country,"middlename":self.mname,"substep":"basic","gender":self.gender,"iso":ConfigModel.shared.selectedCountry.iso]
        //        basicData.append(["iso",SignupConfigModel.shared.selectedCountry.iso])

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
        basicData.append(["Date of Birth",self.dob?.dateWithStringFormat("MMM dd, yyyy") ?? " "])
        basicData.append(["Place of Birth",self.placeOfBirth])
        basicData.append(["Gender",self.gender])

        
        return basicData
    }
    
   
    
    func getAddressDataInArray() -> [[Any]] {
        
        var basicData = [["Address Line 1",self.add1]]
        
        if self.add2.count > 0 {
            basicData.append(["Address Line 2",self.add2])
        }
        
        basicData.append(["Street",self.street])
        basicData.append(["City",self.city])
        basicData.append(["Zip",self.zipCode])
        basicData.append(["State",self.state])
        basicData.append(["Country",self.country])
//        basicData.append(["iso",SignupConfigModel.shared.selectedCountry.iso])
        
        return basicData
    }
    
    
    func getHoldingAsArray() -> [[Any]] {
        
        var modelData = [[Any]]()
        modelData.append(["Code",ConfigModel.shared.verificationCode])
        modelData.append(["Holding Image","Holding Image",self.holdingImage])
        
        return modelData
        
    }
    
   
    
    func initWithResponse(responseJson:Dictionary<String, Any>)
    {
        countryCode             = RawdataConverter.string(responseJson["country_code"])
        contactNumber            = RawdataConverter.string(responseJson["phone"])
        
        email                   = RawdataConverter.string(responseJson["email"])
        
        userImageURL            = RawdataConverter.string(responseJson["profile_pic"])
        
        kycId                   = RawdataConverter.string(responseJson["kyc_id"])
        
        guard let basicDetails = RawdataConverter.dictionary(responseJson["basic_details"]) else {
            return
        }
        
        fname                   = RawdataConverter.string(basicDetails["firstname"])
        mname                   = RawdataConverter.string(basicDetails["middlename"])
        lname                   = RawdataConverter.string(basicDetails["lastname"])
        
        dob                     = Date.dateFromFormatted2_String(RawdataConverter.string(basicDetails["dob"]))!
        
        placeOfBirth            = RawdataConverter.string(basicDetails["place_of_birth"])
        
        add1                    = RawdataConverter.string(basicDetails["address1"])
        add2                    = RawdataConverter.string(basicDetails["address2"])
        street                  = RawdataConverter.string(basicDetails["street"])
        zipCode                 = RawdataConverter.string(basicDetails["zip"])
        city                    = RawdataConverter.string(basicDetails["city"])
        state                   = RawdataConverter.string(basicDetails["state"])
        country                 = RawdataConverter.string(basicDetails["country"])
        gender                 = RawdataConverter.string(basicDetails["gender"])
        
        isBasicDetailsComplete  = true
        isAddressDetailsComplete = true
        
        
       
    }
    
    //edit
    
    func initWithResponseEdit(responseJson:Dictionary<String, Any>)
    {
        countryCode             = RawdataConverter.string(responseJson["country_code"])
        contactNumber            = RawdataConverter.string(responseJson["phone"])
        
        email                   = RawdataConverter.string(responseJson["email"])
        
        if email.count > 0{
             isEmailVerified          = true
        }
        if contactNumber.count > 0{
            isPhoneVerified           = true
        }
        
        
        
       
        
        
        
        userImageURL            = RawdataConverter.string(responseJson["profile_pic"])
        
        kycId                   = RawdataConverter.string(responseJson["kyc_id"])
        
        guard let basicInfo = RawdataConverter.dictionary(responseJson["BasicInfo"]) else {
            return
        }
        
        if let docImages = RawdataConverter.array(basicInfo["DocImages"]){
            if docImages.count > 0 {
                if let dict = RawdataConverter.dictionary(docImages[0]){
                    if let urlStr = RawdataConverter.optionalString(dict["url"]){
                        userImageURL = urlStr
                        do {
                            let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                            if let image = UIImage.init(data: imageData){
                                userImage = image
                            }
                            
                        }
                        catch let error as NSError {
                            print("Error: \(error.localizedDescription)")
                        }
                        
                    }
                }
            }
        }
        
        
        guard let basicDetails = RawdataConverter.dictionary(basicInfo["DocDetails"]) else {
            return
        }
        
        fname                   = RawdataConverter.string(basicDetails["firstname"])
        mname                   = RawdataConverter.string(basicDetails["middlename"])
        lname                   = RawdataConverter.string(basicDetails["lastname"])
        
        if let date = RawdataConverter.optionalString(basicDetails["dob"]){
            dob = Date.dateFromFormatted3_String(date)
        }
//        dob                     = Date.dateFromFormatted3_String(RawdataConverter.string(basicDetails["dob"]))
        
        placeOfBirth            = RawdataConverter.string(basicDetails["place_of_birth"])
        
        add1                    = RawdataConverter.string(basicDetails["address1"])
        add2                    = RawdataConverter.string(basicDetails["address2"])
        street                  = RawdataConverter.string(basicDetails["street"])
        zipCode                 = RawdataConverter.string(basicDetails["zip"])
        city                    = RawdataConverter.string(basicDetails["city"])
        state                   = RawdataConverter.string(basicDetails["state"])
        country                 = RawdataConverter.string(basicDetails["country"])
        gender                 = RawdataConverter.string(basicDetails["gender"])
        
        isBasicDetailsComplete  = true
        isAddressDetailsComplete = true
        
        
    }
    
    func initUpholdingDocEdit(response:Dictionary<String,Any>) {
        guard let upholdingDict = RawdataConverter.dictionary(response["FaceInfo"]) else {
            return
        }
        
        if let docImages = RawdataConverter.array(upholdingDict["DocImages"]){
            if docImages.count > 0 {
                if let dict = RawdataConverter.dictionary(docImages[0]){
                    if let urlStr = RawdataConverter.optionalString(dict["url"]){
                    
                        do {
                            let imageData = try Data.init(contentsOf: URL.init(string: urlStr)!)
                            if let image = UIImage.init(data: imageData){
                                holdingImage = image
                            }
                        }
                        catch let error as NSError {
                            print("Error: \(error.localizedDescription)")
                        }
                        
                    }
                }
            }
        }
        
    }
    
    // MARK: - Summary
    
    func getBasicDataForSummary() -> [SummaryStruct] {
        
        var basicArray = [SummaryStruct(imageTop: nil, imageBottom: nil, text: "Basic Details", type: .HeaderCell, isExpanded: true)]
        
        var text = self.fname
        if self.mname.count > 0 {
            text.append(" "+self.mname)
        }
        text.append(" "+self.lname+"\n")
        
        text.append(self.email+"\n")
        
        text.append(self.getCompletePhoneNumber()+"\n")
        text.append(self.dob?.dateWithStringFormat("MMM dd, yyyy") ?? "")
        text.append(", " + self.placeOfBirth + ", " + self.gender)
        
        basicArray.append(SummaryStruct(imageTop: self.userImage,imageBottom: nil, text: text, type: .BasicCell, isExpanded: true ))
        return basicArray
    }

    func getAddressDataForSummary() -> [SummaryStruct] {
        
        var basicArray = [SummaryStruct(imageTop: nil,imageBottom: nil, text: "Address Details", type: .HeaderCell, isExpanded: true)]
        
        var line1 = self.add1
        if self.add2.count > 0 {
            line1.append(", " + self.add2)
        }
        
        line1.append("\n" + self.street + ", " + self.city + ", " + self.zipCode)
        
        line1.append("\n" + self.state + ", " + self.country)
        basicArray.append(SummaryStruct(imageTop: nil,imageBottom: nil, text: line1, type: .NoImageCell, isExpanded: true))
        
        
        return basicArray
    }
    
    func getHoldingDataForSummary() -> [SummaryStruct] {
        
        var basicArray = [SummaryStruct(imageTop: nil,imageBottom: nil, text: "Document Holding Photo", type: .HeaderCell, isExpanded: true)]
        
        let line1 = "Code : " + ConfigModel.shared.verificationCode
        
        basicArray.append(SummaryStruct(imageTop: self.holdingImage,imageBottom: nil, text: line1, type: .OneImageCell, isExpanded: true))
        
        
        return basicArray
    }
    
}
