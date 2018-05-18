//
//  BasicDetailsModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 17/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class BasicDetailsModel: NSObject {

    static let sharedInstance = BasicDetailsModel()
    
    var countryCode: String = ""
    var fname: String = ""
    var mname: String = ""
    var lname: String = ""
    var userImage : UIImage = UIImage.init(named: "ic_profile_placeholder")!
    var contactNumber : String = ""
    var email : String = ""
    var isEmailVerified : Bool = false
    var isPhoneVerified : Bool = false
    var isBasicDetailsComplete : Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        countryCode             = ""
        fname            = ""
        mname         = ""
        lname       = ""
        contactNumber    = ""
        userImage       = UIImage.init(named: "ic_profile_placeholder")!
        email            = ""
        isEmailVerified           = false
        isPhoneVerified          =  false
        isBasicDetailsComplete  = false
    }
    func getCompletePhoneNumber() -> String {
        return ("+"+countryCode+" "+contactNumber)
    }
}
