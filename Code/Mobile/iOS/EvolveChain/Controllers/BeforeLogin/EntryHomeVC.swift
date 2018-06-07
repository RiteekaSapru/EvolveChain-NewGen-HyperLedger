//
//  EntryHome.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class EntryHomeVC: UIViewController {

    @IBOutlet weak var topLayoutLogo: NSLayoutConstraint!
    @IBOutlet weak var viewHolder: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.initializeUI();
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+1.0) {
            self.animateUI()
        }
        
    }
    //MARK: - Initialize
    
    func initializeUI() -> Void {
        viewHolder.alpha = 0.0;
        topLayoutLogo.constant = (_screenSize.height - 120.0)/2.0
    }
    
    //MARK: - Animations
    func animateUI() -> Void {
        if viewHolder.alpha == 0.0 {
            topLayoutLogo.constant = 60
            UIView.animate(withDuration: 0.3) {
                self.viewHolder.alpha = 1.0
                self.view.layoutIfNeeded()
            }
        }
    }
    
    //MARK: - Actions
    
    fileprivate func moveToRegister() {
        let countrySelectionVC = self.storyboard?.instantiateViewController(withIdentifier: "CountrySelectionVC")
        
        GlobalMethods.sharedInstance.pushVC(countrySelectionVC!)
    }
    
    @IBAction func actionRegister(_ sender: UIButton) {
        
//        FlowManager.sharedInstance.initialiseKey(success: {
//            DispatchQueue.main.async {
//                self.moveToRegister()
//            }
//        }) { (errorMsg) in
//            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg!)
//        }
        self.moveToRegister()
    }
    
    @IBAction func actionLogin(_ sender: Any) {

         FlowManager.sharedInstance.moveToLogin()
    }
    

}
