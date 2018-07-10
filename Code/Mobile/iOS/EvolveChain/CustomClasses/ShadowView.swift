//
//  ShadowView.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ShadowView: UIView {

    var previousBound : CGRect = CGRect.zero
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    override var bounds: CGRect {
        didSet {
            setupShadow()
        }
    }
    
    private func setupShadow() {
        
        if previousBound != self.bounds{
            previousBound = self.bounds
            self.clipsToBounds = false
            let shadowLayer = CAShapeLayer()
            shadowLayer.path = UIBezierPath(roundedRect: self.bounds, cornerRadius: 3).cgPath
            shadowLayer.fillColor = UIColor.white.cgColor
            
            shadowLayer.shadowColor = UIColor.darkGray.cgColor
            shadowLayer.shadowPath = shadowLayer.path
            shadowLayer.shadowOffset = CGSize(width: 0.8, height: 1.2)
            shadowLayer.shadowOpacity = 0.3
            shadowLayer.shadowRadius = 0.7
            
            self.layer.insertSublayer(shadowLayer, at: 0)
        }
//        let frame = _screenFrame.width - 20.0
       
    }
}


class ShadowButtonWithbgColor: UIButton {
    
    var previousBound : CGRect = CGRect.zero
    /*
     // Only override draw() if you perform custom drawing.
     // An empty implementation adversely affects performance during animation.
     override func draw(_ rect: CGRect) {
     // Drawing code
     }
     */
    override func layoutSubviews() {
        super.layoutSubviews()
        setupShadow()
    }
    override var bounds: CGRect {
        didSet {
            setupShadow()
        }
    }
    
    private func setupShadow() {
        
        if previousBound != self.bounds{
            previousBound = self.bounds
            self.clipsToBounds = false
            let shadowLayer = CAShapeLayer()
            shadowLayer.path = UIBezierPath(roundedRect: self.bounds, cornerRadius: 5.0).cgPath
            shadowLayer.fillColor = self.backgroundColor?.cgColor ?? UIColor.white.cgColor
            
            shadowLayer.shadowColor = UIColor.darkGray.cgColor
            shadowLayer.shadowPath = shadowLayer.path
            shadowLayer.shadowOffset = CGSize(width: 0.8, height: 0.8)
            shadowLayer.shadowOpacity = 0.7
            shadowLayer.shadowRadius = 2.0
            
            self.layer.insertSublayer(shadowLayer, at: 0)
        }
        //        let frame = _screenFrame.width - 20.0
        
    }
}
