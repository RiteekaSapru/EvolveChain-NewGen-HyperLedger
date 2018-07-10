//
//  EntryHome.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import SafariServices

class EntryHomeVC: UIViewController {

    @IBOutlet weak var topLayoutLogo: NSLayoutConstraint!
    @IBOutlet weak var viewHolder: UIView!
    
    @IBOutlet weak var btnSupport: UIButton!
    @IBOutlet weak var imgLogo: UIImageView!
    

    
    override func viewDidLoad() {
        super.viewDidLoad()
        if ConfigModel.shared.arrCountryList.count == 0{
            self.initializeUI();
        }
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
       
        if ConfigModel.shared.arrCountryList.count == 0{
            self.getCountryList()
            animatePulse(shouldAnimate: true)
            NotificationCenter.default.addObserver(self, selector: #selector(self.didEnterBackground), name: .UIApplicationDidEnterBackground, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(self.willEnterForeground), name: .UIApplicationWillEnterForeground, object: nil)
        }
         UIApplication.shared.statusBarStyle = .default
    }
    
    deinit
    {
        NotificationCenter.default.removeObserver(self, name: .UIApplicationDidEnterBackground, object: nil)
        NotificationCenter.default.removeObserver(self, name: .UIApplicationWillEnterForeground, object: nil)

    }
    
    //MARK: - Notification
    
    @objc func didEnterBackground()
    {
        imgLogo.layer.removeAllAnimations()
    }
    
    @objc func willEnterForeground()
    {
        imgLogo.transform = CGAffineTransform.identity
        animatePulse(shouldAnimate: true)
    }
    
    //MARK: - Initialize
    
    func initializeUI() -> Void {
        viewHolder.alpha = 0.0;
        topLayoutLogo.constant = (_screenSize.height - 120.0)/2.0
        btnSupport.isHidden = true
    }
    func animatePulse(shouldAnimate:Bool){
        if shouldAnimate{
            UIView.animate(withDuration: 1.0, delay: 0, options: [.autoreverse , .repeat], animations: {
                self.imgLogo.transform = CGAffineTransform.init(scaleX: 1.1, y: 1.1)
            }, completion: nil)
        }
        else{
            imgLogo.layer.removeAllAnimations()
            NotificationCenter.default.removeObserver(self, name: .UIApplicationDidEnterBackground, object: nil)
            NotificationCenter.default.removeObserver(self, name: .UIApplicationWillEnterForeground, object: nil)

//            UIView.animate(withDuration: 0.1, delay: 0, options: .curveEaseOut, animations: {
//                self.imgLogo.transform = CGAffineTransform.identity
//            }, completion: {status in
//                DispatchQueue.main.asyncAfter(deadline: DispatchTime.now()+1.0) {
                    self.animateUI()
//
//                }
//            })
        }
    }
    //MARK: - Animations
    func animateUI() -> Void {
        if viewHolder.alpha == 0.0 {
            self.viewHolder.transform = CGAffineTransform.init(scaleX: 0.6, y: 0.6)
            topLayoutLogo.constant = ((_screenSize.height - 260.5) / 2.0 ) - 120
            UIView.animate(withDuration: 0.7, delay: 0, usingSpringWithDamping: 1.0, initialSpringVelocity: 0.5, options: .curveEaseOut, animations: {
                self.imgLogo.transform = CGAffineTransform.identity
                self.viewHolder.alpha = 1.0
                self.viewHolder.transform = CGAffineTransform.init(scaleX: 1.0, y: 1.0)
                self.view.layoutIfNeeded()
            }) { (status) in
                 self.btnSupport.isHidden = false
            }
        }
    }
    //MARK: - Custom Actions
    
    fileprivate func moveToRegister() {
         UIApplication.shared.statusBarStyle = .lightContent
        let countrySelectionVC = self.storyboard?.instantiateViewController(withIdentifier: "CountrySelectionVC")
        
        Util.shared.pushVC(countrySelectionVC!)
    }
    
    func processResponse(response:Array<Any>){
        
        ConfigModel.shared.initCountryList(response: response)
        DispatchQueue.main.async {
            self.animatePulse(shouldAnimate: false)
        }
        
    }
    
    fileprivate func moveToEdit(arrCountry:[CountryModel]) {
        let editApplicationObj = self.storyboard?.instantiateViewController(withIdentifier: "EditApplicationVC") as! EditApplicationVC
        
        editApplicationObj.countryArray = arrCountry
        
        Util.shared.pushVC(editApplicationObj)
    }
    
    func openTermsLink() {
        let safariVC = SFSafariViewController(url: URL.init(string: UrlConstants.terms_url)!)
        present(safariVC, animated: true, completion: nil)
    }
    
    func openPrivacyLink() {
        let safariVC = SFSafariViewController(url: URL.init(string: UrlConstants.privacy_url)!)
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
        
        Util.shared.presentVC(alert)
    }
    //MARK: - Actions
    
    @IBAction func actionRegister(_ sender: UIButton) {
        
        askTermsAndCondition()
        
        
    }
    
    @IBAction func actionLogin(_ sender: Any) {

         UIApplication.shared.statusBarStyle = .lightContent
         Util.shared.pushVC(FlowManager.shared.getLoginStoryBoard().instantiateViewController(withIdentifier: "LoginVC"))
    }
    
    @IBAction func actionEdit(_ sender: Any) {
        
        Util.shared.initialiseLocation()
        let editApplicationObj = self.storyboard?.instantiateViewController(withIdentifier: "EditApplicationVC") as! EditApplicationVC
        UIApplication.shared.statusBarStyle = .lightContent
      Util.shared.pushVC(editApplicationObj)
        
    }
    
    @IBAction func actionSupport(_ sender: Any) {
        if ConfigModel.shared.arrCountryList.count == 0{
            getCountryList()
            return
        }
        Util.shared.showAlertForSupport()
    }
    
    //MARK: - Web Service
    
    func getCountryList() {
        NetworkManager.shared.prefetchAPI(success: { (response) in
                self.processResponse(response: response)
        }) { (errorMsg) in
            self.getCountryList()

        }
    }
    
}
