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
    
    func initialiseKey() -> Void {
        NetworkManager.sharedInstance.initialiseAPI(success: { (responseJSON) in
            _userDefault.set(responseJSON["key"], forKey: kApplicationKey)
        }) { (errorMsg) in
            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+1.0) {
                self.initialiseKey()
            }
        }
    }

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
}

extension AppDelegate {
    
    //TODO : Check for login and Sesion. Accordingly decide flow , also compare prev and new url
    

    func initNavigationManager() -> Void {
        
        navigator = UINavigationController.init(rootViewController: UIStoryboard.init(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "EntryHomeVC"))
        navigator?.setNavigationBarHidden(true, animated: false)
        self.window = UIWindow(frame: _screenFrame)
        self.window?.rootViewController = navigator
        self.window?.makeKeyAndVisible()
        
        if (_userDefault.object(forKey: kApplicationKey) == nil)
        {
            FlowManager.sharedInstance.initialiseKey();
        }
    }
    
    
    
}
