//
//  ShareKycVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 26/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ShareKycVC: UIViewController {

    @IBOutlet weak var lblTempKycID: UILabel!
    @IBOutlet weak var lblKycID: UILabel!
   
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupUI()
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Methods
    
    fileprivate func setupUI() {
         lblTempKycID.isHidden = true
        lblTempKycID.isUserInteractionEnabled = true
        
        lblKycID.text = BasicDetailsModel.shared.kycId
        
//        let gestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPressGesture:))
//        lblTempKycID.addGestureRecognizer(gestureRecognizer)
    }
    
   @objc func handleLongPressGesture(recognizer: UIGestureRecognizer) {
        if let recognizerView = recognizer.view,
            let recognizerSuperView = recognizerView.superview
        {
            let highlightMenuItem = UIMenuItem(title: "Copy", action: #selector(copyItems))
            
//            UIMenuController.sharedMenuController().menuItems = [highlightMenuItem]
            
            let menuController = UIMenuController.init()
            menuController.menuItems = [highlightMenuItem]
            menuController.setTargetRect(recognizerView.frame, in: recognizerSuperView)
            menuController.setMenuVisible(true, animated:true)
            
        }
    }
    
    @objc func copyItems(){
         UIPasteboard.general.string = lblTempKycID.text
    }
    
    fileprivate func setupTempKyc(){
         lblTempKycID.text = BasicDetailsModel.shared.kycId
        
        lblTempKycID.alpha = 0.0
        lblTempKycID.isHidden = false
        
        UIView.animate(withDuration: 0.3) {
            self.lblTempKycID.alpha = 1.0
        }
    }
    
    
    // MARK: - Action
    
    @IBAction func actionGenerateKYC(_ sender: Any) {
        setupTempKyc()
    }
    
}
