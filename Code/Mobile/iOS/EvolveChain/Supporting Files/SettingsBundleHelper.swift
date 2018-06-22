//
//  SettingsBundleHelper.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SettingsBundleHelper {
 static let shared = SettingsBundleHelper()
    
    func checkForURLChange() -> Void {
        if _userDefault.object(forKey: kSettingsBundleURL) != nil{
            let appURL = RawdataConverter.string(_userDefault.object(forKey: kSettingsBundleURL))
            if let url = URL(string: appURL) {
                
                if UIApplication.shared.canOpenURL(url){
                     let appURLPrevious = RawdataConverter.string(_userDefault.object(forKey: kApplicationURL))
                    if appURL != appURLPrevious{
                        _userDefault.set(appURL, forKey: kApplicationURL)
                        BaseURL = appURL
                        GlobalMethods.shared.logOutUser()
                    }
                }
                else{
                    resetToLocalURL()
                }
            }
            else{
                resetToLocalURL()
            }
        }
        else{
           resetToLocalURL()
        }
//        let appURL = _userDefault.object(forKey: kApplicationURL)
//         let appURLString = String(describing: appURL)
//        if appURLString.count == 0{
//            _userDefault.set(kLocalURL, forKey: kApplicationURL)
//        }
//        else{
//
//        }
    }
    
    func resetToLocalURL() {
        _userDefault.set("http://192.168.60.130:4600", forKey: kSettingsBundleURL)
        _userDefault.set("http://192.168.60.130:4600", forKey: kApplicationURL)
    }
}
