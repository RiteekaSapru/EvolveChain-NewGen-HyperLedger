//
//  CircularProgressView.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 18/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class CircularProgressView: UIView {

    let progressCircle : CAShapeLayer = CAShapeLayer()
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

    func addCircularLayer() {
        
       self.backgroundColor = .clear
        
        let circlePath = UIBezierPath.init(arcCenter: self.center, radius: self.bounds.height/2, startAngle: -CGFloat.pi / 2, endAngle: CGFloat.pi - (CGFloat.pi / 2), clockwise: true)
        
        progressCircle.path = circlePath.cgPath
        progressCircle.strokeColor = UIColor.themeColor.cgColor
        progressCircle.fillColor = UIColor.clear.cgColor
        progressCircle.lineWidth = 3.0
        progressCircle.lineCap = kCALineCapRound
        progressCircle.strokeStart = 0.0
        progressCircle.strokeEnd = 0.0
        
        self.layer.addSublayer(progressCircle)
    }
    
    func animateProgress(fractionComplete:CGFloat)  {
        print("\(fractionComplete)")
//        let animation = CABasicAnimation(keyPath: "strokeEnd")
//        animation.fromValue = 0
        progressCircle.strokeEnd = CGFloat(fractionComplete)
//        animation.duration = 1
//        animation.fillMode = kCAFillModeForwards
//        animation.isRemovedOnCompletion = false
//
//        progressCircle.add(animation, forKey: "ani")
    }
}
