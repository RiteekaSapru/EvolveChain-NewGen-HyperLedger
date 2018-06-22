//
//  FlowManager.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class FlowManager: NSObject {

    static let shared = FlowManager()
    
    // MARK: - Custom Methods

    
//    func moveToLogin() -> Void {
//
//        GlobalMethods.shared.pushVC(getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC"))
//    }
    
    func moveToHome() -> Void {
        GlobalMethods.shared.pushVC(getHomeStoryBoard().instantiateViewController(withIdentifier: "ProfileVC"))
    }
    
    func resetToLogin() {
        let splashVC = getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")

        let loginVC = getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC")
        _navigator.setViewControllers([splashVC,loginVC], animated: true)
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
        if _navigator.topViewController is EntryHomeVC {
            return
        }
        _navigator.setViewControllers([ getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")], animated: true)
    }
    
    func resetToGeneratePin() {
        
        let splashVC = getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")
        
        let loginVC = getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC")
        
        let generateVC = getLoginStoryBoard().instantiateViewController(withIdentifier: "GenerateOtpVC") as! GenerateOtpVC
    
//        let setPinVCObj = getLoginStoryBoard().instantiateViewController(withIdentifier: "SetPinVC") as! SetPinVC
//
//        if let kycId = _userDefault.object(forKey: kApplicationKycIdKey) as? String{
//            generateVC.kycID = kycId
//            setPinVCObj.stringVerify = kycId
//        }
        _navigator.interactivePopGestureRecognizer?.isEnabled = false
        _navigator.setViewControllers([splashVC,loginVC,generateVC], animated: true)
    }
    
    func resetToEdit() {
        let splashVC = getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EntryHomeVC")
        
        let editApplicationObj = getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "EditApplicationVC") as! EditApplicationVC
        
         _navigator.setViewControllers([splashVC,editApplicationObj], animated: true)
    }
    
    func showPinUI() {
        
        
        if !(_navigator.topViewController is LoginVC){
            GlobalMethods.shared.pushVC(getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC"))
            _navigator.interactivePopGestureRecognizer?.isEnabled = false
        }
    }
}

extension AppDelegate:UIGestureRecognizerDelegate {
    
    //TODO : Check for login and Sesion. Accordingly decide flow , also compare prev and new url
    

    func initNavigationManager() -> Void {
        
        navigator = UINavigationController.init(rootViewController: UIStoryboard.init(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "EntryHomeVC"))
        navigator?.setNavigationBarHidden(true, animated: false)
        navigator?.interactivePopGestureRecognizer?.delegate = self ;
        navigator?.interactivePopGestureRecognizer?.isEnabled = true
        self.window = UIWindow(frame: _screenFrame)
        self.window?.rootViewController = navigator
        self.window?.makeKeyAndVisible()
        
        if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
        {
//            let details = _userDefault.object(forKey: kApplicationUserDetailsKey) as! Dictionary<String, Any>
//            BasicDetailsModel.shared.initWithResponse(responseJson: details)
//            FlowManager.shared.moveToHome()
            navigator?.interactivePopGestureRecognizer?.isEnabled = false
            GlobalMethods.shared.pushVC(FlowManager.shared.getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC"))
        }
    }
    
    func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        return navigator!.viewControllers.count > 1
    }
    
}
