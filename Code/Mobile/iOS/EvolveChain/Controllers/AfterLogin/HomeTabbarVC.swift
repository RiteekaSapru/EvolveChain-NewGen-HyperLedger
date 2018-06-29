//
//  HomeTabbarVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 26/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class HomeTabbarVC: UITabBarController,UITabBarControllerDelegate {

    var previousSelectedIndex: Int = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.shared.statusBarStyle = .default
        self.delegate = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
    
    
    // MARK: - Tab Bar Delegate
    
    func tabBarController(_ tabBarController: UITabBarController, shouldSelect viewController: UIViewController) -> Bool {
        
        previousSelectedIndex = tabBarController.viewControllers!.index(of: viewController)!
        return true
    }
    
    func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
        if selectedIndex == previousSelectedIndex {
            if let nav = viewController as? UINavigationController{
                if nav.viewControllers.count > 1{
                    nav.popViewController(animated: true)
                }
            }
            
        }
    }

   

}
