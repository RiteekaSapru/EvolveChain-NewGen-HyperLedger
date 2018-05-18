//
//  SettingsBundleHelper.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SettingsBundleHelper {
 static let sharedInstance = SettingsBundleHelper()
    
    func initialiseSettingsBundle() -> Void {
        let appURL = _userDefault.object(forKey: kApplicationURL)
         let appURLString = String(describing: appURL)
        if appURLString.count == 0{
            _userDefault.set(kLocalURL, forKey: kApplicationURL)
        }
        else{
            
        }
    }
}
