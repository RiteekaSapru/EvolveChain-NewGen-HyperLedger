//
//  PushAnimator.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 03/07/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class PushAnimator: NSObject {

    var transitionDuration : TimeInterval = 0.4
    var initialFrame : CGRect!
    var image : UIImage!
    var viewHolder : UIView!

    let bgImage : UIImageView = {
        let bgImage = UIImageView.init(image: UIImage.init(named: "ic_splash_bg"))
        bgImage.backgroundColor = UIColor.clear
        bgImage.contentMode = .scaleToFill
        bgImage.autoresizingMask = [.flexibleWidth,.flexibleHeight]
        bgImage.alpha = 0.0
        
        return bgImage
    }()
    
    let destImage : UIImageView = {
        
        let destImage = UIImageView.init()
        destImage.backgroundColor = UIColor.clear
        destImage.contentMode = .scaleAspectFill
        destImage.cornerRadius = 5.0
        destImage.clipsToBounds = true
        destImage.alpha = 1.0
        return destImage
    }()
    
    convenience init(initialFrame:CGRect, image:UIImage, holderView:UIView) {
        
        self.init()
        self.initialFrame = initialFrame
        self.image = image
        self.viewHolder = holderView
        
    }
    // MARK: - Methods

    private func getFinalFrame(fromController:UIViewController) ->CGRect{
        var finalFrame :CGRect
        
        if image.size.width > image.size.height{
            var heightOfImageView = (image.size.height / image.size.width) * fromController.view.frame.size.width
            var widthOfImageView = fromController.view.frame.size.width
            var x = 0.0
            var y = (fromController.view.frame.size.height - heightOfImageView ) / 2.0 + 35.0
            
            if heightOfImageView > fromController.view.frame.size.height - 70.0{
                heightOfImageView = fromController.view.frame.height - 70.0
                widthOfImageView = (image.size.width / image.size.height) * heightOfImageView
                x = Double((fromController.view.frame.size.width - widthOfImageView ) / 2.0)
                y = 70.0
            }
            
            finalFrame = CGRect.init(x: CGFloat(x), y: y, width: widthOfImageView , height: heightOfImageView)
        }
        else{
            
            var heightOfImageView = fromController.view.frame.height - 70.0
            var widthOfImageView = (image.size.width / image.size.height) * heightOfImageView
            var x = (fromController.view.frame.size.width - widthOfImageView ) / 2.0
            var y = 70.0
            
            if widthOfImageView > fromController.view.frame.size.width{
                
                widthOfImageView = fromController.view.frame.size.width
                heightOfImageView = (image.size.height / image.size.width) * widthOfImageView
                x = 0.0
                y = Double((fromController.view.frame.size.height - heightOfImageView ) / 2.0 + 35.0)
                
            }
            
            
            
            finalFrame = CGRect.init(x: CGFloat(x), y: CGFloat(y), width: widthOfImageView , height: heightOfImageView)
        }
        
        return finalFrame
    }
    
    
}

extension PushAnimator: UIViewControllerAnimatedTransitioning{
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return transitionDuration
    }
    
    fileprivate func animateCornerRadius() {
        let animation = CABasicAnimation(keyPath:"cornerRadius")
        animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
        animation.fromValue = 5
        animation.toValue = 0
        animation.duration = transitionDuration
        destImage.layer.add(animation, forKey: "cornerRadius")
        destImage.layer.cornerRadius = 0
    }
    
    fileprivate func animateFrame(_ finalFrame: CGRect, _ toController: UIViewController?, _ fromController: UIViewController?, _ containerView: UIView, _ transitionContext: UIViewControllerContextTransitioning) {
        
        UIView.animate(withDuration: transitionDuration, delay: 0, usingSpringWithDamping: 0.7, initialSpringVelocity: 0.5, options: .curveEaseOut, animations: {
             self.destImage.frame = finalFrame
        }) { (status) in
            if status{
                toController!.view.frame = fromController!.view.frame
                containerView.addSubview(toController!.view)
                self.bgImage.removeFromSuperview()
                self.destImage.removeFromSuperview()
                transitionContext.completeTransition(true)
            }
        }
        
        UIView.animate(withDuration: transitionDuration/2, delay: 0, options: .curveEaseIn, animations: {
            self.bgImage.alpha = 1.0
            
        }) { (status) in
            
        }
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        
        let toController = transitionContext.viewController(forKey: .to)
        let fromController = transitionContext.viewController(forKey: .from)
        
        let containerView = transitionContext.containerView

        
        bgImage.frame = CGRect.init(x: 0, y: 70, width: containerView.frame.size.width, height: containerView.frame.size.height - 70)
        containerView.addSubview(bgImage)

        
        destImage.frame = self.initialFrame
        destImage.image = self.image
     
        containerView.addSubview(destImage)
        
        viewHolder.isHidden = true
        
        let finalFrame = getFinalFrame(fromController: fromController!)
        
        animateCornerRadius()
        
        animateFrame(finalFrame, toController, fromController, containerView, transitionContext)
    }
    
    
    
}
