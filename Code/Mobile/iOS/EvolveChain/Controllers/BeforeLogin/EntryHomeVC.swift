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
            self.getCountryList()
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
    //MARK: - Custom Actions
    
    fileprivate func moveToRegister() {
        let countrySelectionVC = self.storyboard?.instantiateViewController(withIdentifier: "CountrySelectionVC")
        
        GlobalMethods.sharedInstance.pushVC(countrySelectionVC!)
    }
    
    func processResponse(response:Array<Any>){
        
        SignupConfigModel.sharedInstance.initCountryList(response: response)

    }
    
    fileprivate func moveToEdit(arrCountry:[CountryModel]) {
        let editApplicationObj = self.storyboard?.instantiateViewController(withIdentifier: "EditApplicationVC") as! EditApplicationVC
        
        editApplicationObj.countryArray = arrCountry
        
        GlobalMethods.sharedInstance.pushVC(editApplicationObj)
    }
    
    func openTermsLink() {
        let safariVC = SFSafariViewController(url: URL.init(string: terms_url)!)
        present(safariVC, animated: true, completion: nil)
    }
    
    func openPrivacyLink() {
        let safariVC = SFSafariViewController(url: URL.init(string: privacy_url)!)
        present(safariVC, animated: true, completion: nil)
    }
    
    func askTermsAndCondition() {
        
        let alert = UIAlertController.init(title: StringConstants.AppName, message: "By accepting, you agree to our Terms & Conditions and Privacy Policy.", preferredStyle: .alert)
        
        let termsAction = UIAlertAction.init(title: "Terms & Conditions", style: .default) { (alert) in
            self.openTermsLink()
        }
        
        alert.addAction(termsAction)
        
        let policyAction = UIAlertAction.init(title: "Privacy Policy", style: .default) { (alert) in
            self.openPrivacyLink()
        }
        
        alert.addAction(policyAction)
        
        let acceptAction = UIAlertAction.init(title: "I Accept", style: .default) { (alert) in
            self.moveToRegister()
        }
        
        alert.addAction(acceptAction)
        
        let cancelAction = UIAlertAction.init(title: "Cancel", style: .destructive) { (alert) in
            
        }
        
        alert.addAction(cancelAction)
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    //MARK: - Actions
    
    @IBAction func actionRegister(_ sender: UIButton) {
        
        askTermsAndCondition()
        
        
    }
    
    @IBAction func actionLogin(_ sender: Any) {

         FlowManager.sharedInstance.moveToLogin()
    }
    
    @IBAction func actionEdit(_ sender: Any) {
        
//       getCountryList()
        let editApplicationObj = self.storyboard?.instantiateViewController(withIdentifier: "EditApplicationVC") as! EditApplicationVC
        
      GlobalMethods.sharedInstance.pushVC(editApplicationObj)
        
    }
    
    //MARK: - Web Service
    
    func getCountryList() {
//        GlobalMethods.sharedInstance.showLoader(loadingText: "   Fetching Countries...")
        NetworkManager.sharedInstance.countryListAPI(success: { (response) in
//            GlobalMethods.sharedInstance.dismissLoader {
                self.processResponse(response: response)
//            }
        }) { (errorMsg) in
//            GlobalMethods.sharedInstance.dismissLoader {
//                GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
//            }
            
        }
    }
    
}
