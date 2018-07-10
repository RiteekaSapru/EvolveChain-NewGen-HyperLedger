//
//  RegCompletePushAnimator.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 05/07/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class RegCompletePushAnimator:NSObject {
    
    var transitionDuration : TimeInterval = 0.3
    
    var toVC : UIViewController!
    var fromVC:UIViewController!
    var containerView:UIView!
    var context : UIViewControllerContextTransitioning!
    
    let bgView : UIView = {
        let bgView = UIView.init()
        bgView.backgroundColor = UIColor.white
        bgView.autoresizingMask = [.flexibleWidth,.flexibleHeight]
        bgView.alpha = 0.0
        
        return bgView
    }()
    
    
    func animateViewTranslation(vwToTranslate:UIView,delay:TimeInterval) {
        
        UIView.animate(withDuration: transitionDuration, delay: delay, usingSpringWithDamping: 0.5, initialSpringVelocity: 0.5, options: .curveEaseOut, animations: {
            var frame = vwToTranslate.frame
            frame.origin.y = frame.origin.y - 1000
            vwToTranslate.frame = frame

        }) { (status) in
            if status && delay > 0.2{
                self.containerView.addSubview(self.toVC!.view)
                self.bgView.removeFromSuperview()
                self.context.completeTransition(true)
            }
        }
    }
}

extension RegCompletePushAnimator: UIViewControllerAnimatedTransitioning{
    
    func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
        return transitionDuration
    }
    
    func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {

        context = transitionContext
        toVC = transitionContext.viewController(forKey: .to)
        fromVC = transitionContext.viewController(forKey: .from)
        
        self.toVC!.view.frame = self.fromVC!.view.frame
        self.toVC!.view.alpha = 0.0
        containerView = transitionContext.containerView
        
        self.containerView.addSubview(self.toVC!.view)
        
        UIView.animate(withDuration: 0.3, animations: {
             self.toVC!.view.alpha = 1.0
        }) { (status) in
            if status{
                self.context.completeTransition(!transitionContext.transitionWasCancelled)

            }
        }
        
        
        //add Bg view
        
    }
}

protocol RegCompleteProtocal {
    func getAppImage() -> CGRect
    func getSubViews() -> [CGRect] 
}
