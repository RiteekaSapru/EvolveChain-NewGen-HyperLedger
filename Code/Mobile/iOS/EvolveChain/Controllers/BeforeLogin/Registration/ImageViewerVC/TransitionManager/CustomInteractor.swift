//
//  CustomInteractor.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 04/07/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
 

class CustomInteractor : UIPercentDrivenInteractiveTransition {
    
    var gestureView : UIView
    var shouldCompleteTransition = false
    var transitionInProgress = false
     var panGesture : UIPanGestureRecognizer?
    
    init?(attachToView view : UIView) {
        gestureView = view
        super.init()
        
        addGesture()
       
    }
      // MARK: - Methods
    private func addGesture(){
        panGesture = UIPanGestureRecognizer.init(target: self, action: #selector(handlePan))
        gestureView.addGestureRecognizer(panGesture!)
        gestureView.isUserInteractionEnabled = true
    }
    
    @objc func handlePan(gesture:UIPanGestureRecognizer){
        let viewTranslation = gesture.translation(in: gesture.view?.superview)
        var progress = (viewTranslation.y / gestureView.frame.height)
        
        let gestureVelocity = gesture.velocity(in: gestureView)
       print("velocity \(gestureVelocity)")
        progress = min(0.99, progress)
        progress = max(0.01, progress)
        
        switch gesture.state {
        case .began:
            
            transitionInProgress = true
            Util.shared.popVC()
        case .changed:
            shouldCompleteTransition = progress > 0.2 || gestureVelocity.y > 150.0
            update(CGFloat(progress))
            
            print("progress \(progress)")
        case .ended:
            print("Ended")
            
            transitionInProgress = false
            shouldCompleteTransition ? finish() : cancel()
        case .cancelled:
            print("Cancelled")
            transitionInProgress = false
            cancel()
        default:
            return
        }
    }
    
}
