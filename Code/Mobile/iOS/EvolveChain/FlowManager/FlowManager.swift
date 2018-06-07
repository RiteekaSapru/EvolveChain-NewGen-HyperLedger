//
//  FlowManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class FlowManager: NSObject {

    static let sharedInstance = FlowManager()
    
//    func initialiseKey(success:@escaping (  ) -> Void, failure: @escaping (String? )-> Void) -> Void {
//        NetworkManager.sharedInstance.initialiseAPI(success: { (responseJSON) in
//            _userDefault.set(responseJSON["key"], forKey: kApplicationKey)
//            _userDefault.set(responseJSON["init_config"], forKey: kApplicationInitConfigKey)
//            GlobalMethods.sharedInstance.initConfig()
//            success()
//        }) { (errorMsg) in
//            failure(errorMsg)
//        }
//    }

    func moveToLogin() -> Void {
        GlobalMethods.sharedInstance.pushVC(getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC"))
    }
    
    func moveToHome() -> Void {
        GlobalMethods.sharedInstance.pushVC(getHomeStoryBoard().instantiateViewController(withIdentifier: "ProfileVC"))
    }
    
    func getLoginStoryBoard() -> UIStoryboard {
       return UIStoryboard.init(name: "Login", bundle: nil)
    }
    
    func getHomeStoryBoard() -> UIStoryboard {
        return UIStoryboard.init(name: "Home", bundle: nil)
    }
    
    func getBeforeLoginStoryboard() -> UIStoryboard {
        return UIStoryboard.init(name: "Main", bundle: nil)

    }
    
    func resetToSplash() {
        
        _navigator.setViewControllers([ getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")], animated: true)
    }
    
    func resetToGeneratePin() {
        
        let splashVC = getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")
        
        let loginVC = getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC")
        
        let generateVC = getLoginStoryBoard().instantiateViewController(withIdentifier: "GenerateOtpVC") as! GenerateOtpVC
    
        let setPinVCObj = getLoginStoryBoard().instantiateViewController(withIdentifier: "SetPinVC") as! SetPinVC
        
        if let kycId = _userDefault.object(forKey: kApplicationKycIdKey) as? String{
            generateVC.kycID = kycId
            setPinVCObj.stringVerify = kycId
        }
        
        _navigator.setViewControllers([splashVC,loginVC,generateVC,setPinVCObj], animated: true)
    }
    
    func showPinUI() {
        
        if !(_navigator.topViewController is LoginVC){
            moveToLogin()
        }
    }
}

extension AppDelegate {
    
    //TODO : Check for login and Sesion. Accordingly decide flow , also compare prev and new url
    

    func initNavigationManager() -> Void {
        
        navigator = UINavigationController.init(rootViewController: UIStoryboard.init(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "EntryHomeVC"))
        navigator?.setNavigationBarHidden(true, animated: false)
        self.window = UIWindow(frame: _screenFrame)
        self.window?.rootViewController = navigator
        self.window?.makeKeyAndVisible()
        
        if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
        {
//            let details = _userDefault.object(forKey: kApplicationUserDetailsKey) as! Dictionary<String, Any>
//            BasicDetailsModel.sharedInstance.initWithResponse(responseJson: details)
//            FlowManager.sharedInstance.moveToHome()
            FlowManager.sharedInstance.moveToLogin()
        }
    }
    
    
    
}
