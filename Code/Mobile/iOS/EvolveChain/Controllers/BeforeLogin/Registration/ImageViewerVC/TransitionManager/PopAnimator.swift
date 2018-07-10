//
//  PopAnimator.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 04/07/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class PopAnimator: NSObject {
    var transitionDuration : TimeInterval = 0.4
    var viewHolder : UIView!
    var finalFrame : CGRect!
    var image : UIImage!
    
    
    let bgImage : UIImageView = {
        let bgImage = UIImageView.init(image: UIImage.init(named: "ic_splash_bg"))
        bgImage.backgroundColor = UIColor.clear
        bgImage.contentMode = .scaleToFill
        bgImage.autoresizingMask = [.flexibleWidth,.flexibleHeight]
        bgImage.alpha = 1.0
        
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
    
    convenience init( image:UIImage, finalFrame:CGRect, holder:UIView) {
        
        self.init()
        self.viewHolder = holder
        self.finalFrame = finalFrame
        self.image = image
     
        
    }
    
      // MARK: - Methods
    
    private func getInitialFrame(fromController:UIViewController) ->CGRect{
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

extension PopAnimator: UIViewControllerAnimatedTransitioning{
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return transitionDuration
    }
    
    fileprivate func animateCornerRadius() {
        let animation = CABasicAnimation(keyPath:"cornerRadius")
        animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
        animation.fromValue = 0
        animation.toValue = 5
        animation.duration = transitionDuration
        destImage.layer.add(animation, forKey: "cornerRadius")
        destImage.layer.cornerRadius = 5
    }
    
    fileprivate func animateFrame(_ finalFrame: CGRect, _ toController: UIViewController?, _ fromController: UIViewController?, _ containerView: UIView, _ transitionContext: UIViewControllerContextTransitioning) {
        
        UIView.animate(withDuration: transitionDuration, delay: 0, usingSpringWithDamping: 0.7, initialSpringVelocity: 0, options: .curveEaseIn, animations: {
            self.destImage.frame = finalFrame
        }) { (status) in
            if status{
            self.viewHolder.isHidden = false
            self.bgImage.removeFromSuperview()
            self.destImage.removeFromSuperview()
                if transitionContext.transitionWasCancelled{
                    print("cancelled")
                }

                transitionContext.completeTransition(!transitionContext.transitionWasCancelled)

            }
        }
        

        UIView.animate(withDuration: transitionDuration/2, delay: 0, options: .curveEaseIn, animations: {
            self.bgImage.alpha = 0.0
            
        }) { (status) in
            
        }
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
        
        let toController = transitionContext.viewController(forKey: .to)
        let fromController = transitionContext.viewController(forKey: .from)
        
        let containerView = transitionContext.containerView
        
        toController?.view.frame = (fromController?.view.frame)!
        containerView.addSubview(toController!.view)
        
        bgImage.frame = CGRect.init(x: 0, y: 70, width: containerView.frame.size.width, height: containerView.frame.size.height - 70)
        containerView.addSubview(bgImage)
        
        
        destImage.frame = getInitialFrame(fromController: fromController!)
        destImage.image = self.image
        
        containerView.addSubview(destImage)
        
        
        animateCornerRadius()
        
        animateFrame(finalFrame, toController, fromController, containerView, transitionContext)
    }
    
    
    
}
