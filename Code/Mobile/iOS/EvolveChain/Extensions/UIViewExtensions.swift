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
    
    func addShadow() {
        var shadowLayer: CAShapeLayer!
        if shadowLayer == nil {
            shadowLayer = CAShapeLayer()
            shadowLayer.path = UIBezierPath(roundedRect: bounds, cornerRadius: 50.0).cgPath
            shadowLayer.fillColor = UIColor.clear.cgColor
            
            shadowLayer.shadowColor = UIColor.darkGray.cgColor
            shadowLayer.shadowPath = shadowLayer.path
            shadowLayer.shadowOffset = CGSize(width: 3.0, height: 3.0)
            shadowLayer.shadowOpacity = 0.7
            shadowLayer.shadowRadius = 50.0
            
//            layer.insertSublayer(shadowLayer, at: 0)
            layer.insertSublayer(shadowLayer, below: nil) // also works
        }
    }
    
}

extension UIImageView {
    
    func downloadImage(url: URL) {
//       addLoader()
        if GlobalMethods.sharedInstance.checkIfFileExists(fileName: url.lastPathComponent){
             print("File Exists")
            let image = GlobalMethods.sharedInstance.getLocallySavedImage(fileName: url.lastPathComponent)
            DispatchQueue.main.async() {
//                self.removeLoader()
                self.image = image
            }
        }
        else{
//            addLoader()
             print("Download Started")
            RequestManager.sharedInstance.getDataFromUrl(url: url) { data, response, error in
                guard let data = data, error == nil else { return }
                print(response?.suggestedFilename ?? url.lastPathComponent)
                print("Download Finished")
                if let downloadedImage = UIImage(data: data){
                    if GlobalMethods.sharedInstance.saveImage(image: downloadedImage, fileName: url.lastPathComponent){
                        print("Saved")
                        DispatchQueue.main.async() {
                            //                    self.removeLoader()
                            self.image = downloadedImage
                        }
                    }
                }
                else{
                    print("Not Saved")
                }
                
            }
        }
    }
    
//    func addLoader() {
//        DispatchQueue.main.async() {
//            let loader = UIActivityIndicatorView.init(activityIndicatorStyle: .gray)
//            loader.center = self.center
//            loader.tag = 999
//            loader.hidesWhenStopped = true
//            self.addSubview(loader)
//            loader.startAnimating()
//        }
//
//    }
//
//    func removeLoader() {
//        if let loader = self.viewWithTag(999) as? UIActivityIndicatorView{
//            DispatchQueue.main.async() {
//                loader.stopAnimating()
//                loader.removeFromSuperview()
//            }
//        }
//    }
}

extension UIRefreshControl {
    func beginRefreshingManually() {
        if let scrollView = superview as? UIScrollView {
            scrollView.setContentOffset(CGPoint(x: 0, y: scrollView.contentOffset.y - frame.height), animated: true)
        }
        beginRefreshing()
    }
}

extension StringProtocol where Index == String.Index {
    func index<T: StringProtocol>(of string: T, options: String.CompareOptions = []) -> Index? {
        return range(of: string, options: options)?.lowerBound
    }
    func endIndex<T: StringProtocol>(of string: T, options: String.CompareOptions = []) -> Index? {
        return range(of: string, options: options)?.upperBound
    }
    func indexes<T: StringProtocol>(of string: T, options: String.CompareOptions = []) -> [Index] {
        var result: [Index] = []
        var start = startIndex
        while start < endIndex, let range = range(of: string, options: options, range: start..<endIndex) {
            result.append(range.lowerBound)
            start = range.lowerBound < range.upperBound ? range.upperBound : index(range.lowerBound, offsetBy: 1, limitedBy: endIndex) ?? endIndex
        }
        return result
    }
    func ranges<T: StringProtocol>(of string: T, options: String.CompareOptions = []) -> [Range<Index>] {
        var result: [Range<Index>] = []
        var start = startIndex
        while start < endIndex, let range = range(of: string, options: options, range: start..<endIndex) {
            result.append(range)
            start = range.lowerBound < range.upperBound  ? range.upperBound : index(range.lowerBound, offsetBy: 1, limitedBy: endIndex) ?? endIndex
        }
        return result
    }
}
