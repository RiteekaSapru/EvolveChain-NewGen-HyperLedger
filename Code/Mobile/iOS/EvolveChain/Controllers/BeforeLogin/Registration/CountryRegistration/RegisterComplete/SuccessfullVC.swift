//
//  SuccessfullVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 24/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SuccessfullVC: UIViewController {

    @IBOutlet weak var imgHeader: UIImageView!
    @IBOutlet weak var lblMsg: UILabel!
    @IBOutlet weak var lblTitle: UILabel!
    
    @IBOutlet weak var layoutTopImage: NSLayoutConstraint!
    @IBOutlet weak var layoutTopHeading: NSLayoutConstraint!
    @IBOutlet weak var layoutTopBtn: NSLayoutConstraint!
    @IBOutlet weak var layoutTopSubText: NSLayoutConstraint!
    
    @IBOutlet weak var btnDone: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
//        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1.0) {
             self.animateUI()
          _navigator.delegate = nil
//        }
       
    }
    
// MARK: - Methods
    fileprivate func setupUI() {
        lblMsg.text = StringConstants.RegistrationComplete
        layoutTopImage.constant = 100.0 + layoutTopImage.constant
        layoutTopHeading.constant = 100.0 + layoutTopHeading.constant
        layoutTopSubText.constant = 100.0 + layoutTopSubText.constant
        layoutTopBtn.constant = 100.0 + layoutTopBtn.constant
        
        imgHeader.alpha = 0.0
        lblMsg.alpha = 0.0
        lblTitle.alpha = 0.0
        btnDone.alpha = 0.0
        
        imgHeader.transform = CGAffineTransform.init(scaleX: 0.6, y: 0.6)
        lblMsg.transform =  CGAffineTransform.init(scaleX: 0.6, y: 0.6)
        lblTitle.transform =  CGAffineTransform.init(scaleX: 0.6, y: 0.6)
        btnDone.transform =  CGAffineTransform.init(scaleX: 0.6, y: 0.6)
    }
    
    fileprivate func animateUI(){
        self.layoutTopImage.constant = 75.0
        self.layoutTopHeading.constant = 25.0
        self.layoutTopSubText.constant = 15.0
        self.layoutTopBtn.constant = 20.0
        
        UIView.animate(withDuration: 0.5, delay: 0.0, usingSpringWithDamping: 0.85, initialSpringVelocity: 0.5, options: .curveEaseOut, animations: {
            self.view.layoutIfNeeded()
            
            self.imgHeader.alpha = 1.0
            self.lblMsg.alpha = 1.0
            self.lblTitle.alpha = 1.0
            self.btnDone.alpha = 1.0
            
            self.imgHeader.transform = CGAffineTransform.init(scaleX: 1.0, y: 1.0)
            self.lblMsg.transform = CGAffineTransform.init(scaleX: 1.0, y: 1.0)
            self.lblTitle.transform = CGAffineTransform.init(scaleX: 1.0, y: 1.0)
            self.btnDone.transform = CGAffineTransform.init(scaleX: 1.0, y: 1.0)
            
        }) { (status) in
            
        }
    }
    
    // MARK: - Actions


    @IBAction func actionDone(_ sender: Any) {
        Util.shared.popVC()
    }
}



