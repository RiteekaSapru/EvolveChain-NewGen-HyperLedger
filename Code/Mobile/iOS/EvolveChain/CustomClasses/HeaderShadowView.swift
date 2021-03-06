//
//  HeaderShadowView.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 26/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class HeaderShadowView: UIView {
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
            shadowLayer.path = UIBezierPath(roundedRect: self.bounds, cornerRadius: 0).cgPath
            shadowLayer.fillColor = UIColor.themeColor.cgColor
            
            shadowLayer.shadowColor = UIColor.darkGray.cgColor
            shadowLayer.shadowPath = shadowLayer.path
            shadowLayer.shadowOffset = CGSize(width: 0.0, height: 3.0)
            shadowLayer.shadowOpacity = 0.3
            shadowLayer.shadowRadius = 0.6
            
            self.layer.insertSublayer(shadowLayer, at: 0)
            
        }
        //        let frame = _screenFrame.width - 20.0
        
    }
}
