//
//  UIViewExtensions.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import Foundation
import UIKit

@IBDesignable
extension UIView {
    
    @IBInspectable
    public var cornerRadius: CGFloat
    {
        set (radius) {
            self.layer.cornerRadius = radius
            self.layer.masksToBounds = radius > 0
        }
        
        get {
            return self.layer.cornerRadius
        }
    }
    
    @IBInspectable
    public var borderWidth: CGFloat
    {
        set (borderWidth) {
            self.layer.borderWidth = borderWidth
        }
        
        get {
            return self.layer.borderWidth
        }
    }
    
    @IBInspectable
    public var borderColor:UIColor?
    {
        set (color) {
            self.layer.borderColor = color?.cgColor
        }
        
        get {
            if let color = self.layer.borderColor
            {
                return UIColor(cgColor: color)
            } else {
                return nil
            }
        }
    }
    
//    @IBInspectable
//    public var cornerRadius: CGFloat = 2.0 {
//        didSet {
//            self.layer.cornerRadius = self.cornerRadius
//        }
//    }
//
//    func addCornerRadius(radius:CGFloat) -> Void {
//
//        self.layer.masksToBounds = true;
//        self.layer.cornerRadius = radius;
//    }
    
//    func addBorder(borderWidth:CGFloat, border) -> Void {
//
//        self.layer.masksToBounds = true;
//        self.layer.cornerRadius = radius;
//    }
}
