//
//  BankDetailsModel.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class BankDetailsModel: NSObject {
    static let sharedInstance = BankDetailsModel()
    
    var number: String = ""
    var ifsc: String = ""
    var bankName: String = ""
    var payPalID: String = ""
    var bankType : BankDetailsType = .AccountBankDetailsType
 
    
    var isBankDetailsComplete : Bool = false
    
    // MARK:- Init
    override init() {
        super.init()
        number             = ""
        ifsc             = ""
        bankName             = ""
        payPalID             = ""
        isBankDetailsComplete  = false
    }
}
