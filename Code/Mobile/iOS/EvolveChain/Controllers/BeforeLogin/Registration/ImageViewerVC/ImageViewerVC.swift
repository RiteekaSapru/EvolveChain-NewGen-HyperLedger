//
//  ImageViewerVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 29/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ImageViewerVC: UIViewController {

    @IBOutlet weak var imgPhoto: UIImageView!
    var img : UIImage?
    var viewHolder : UIView?
    var imgFrame : CGRect?
    var popAnimator : PopAnimator!
    private var customInteractor : CustomInteractor?

    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpUI()
        _navigator.delegate = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
         _navigator.delegate = nil
         img = nil
        popAnimator = nil
        viewHolder = nil
       
    }
    
    // MARK: - Custom
    func setImage(photo:UIImage,frame:CGRect,holder:UIView) {
        img = photo
        imgFrame = frame
        viewHolder = holder
    }
    
    fileprivate func setUpUI() {
        imgPhoto.image = img
        
       self.customInteractor = CustomInteractor(attachToView: imgPhoto)
        popAnimator = PopAnimator.init(image: img!, finalFrame: imgFrame!,holder:viewHolder!)

    }
   
    // MARK: - Actions
    
    @IBAction func actionClose(_ sender: Any) {
       
        Util.shared.popVC()
    }
}
// MARK: - UINavigationControllerDelegate
extension ImageViewerVC : UINavigationControllerDelegate {
    func navigationController(_ navigationController: UINavigationController, animationControllerFor operation: UINavigationControllerOperation, from fromVC: UIViewController, to toVC: UIViewController) -> UIViewControllerAnimatedTransitioning? {
        
        switch operation {
        case .pop:return popAnimator
        case .push : return nil
            
        default:
            return nil
        }
    }
    

    func navigationController(_ navigationController: UINavigationController, interactionControllerFor animationController: UIViewControllerAnimatedTransitioning) -> UIViewControllerInteractiveTransitioning? {
        
        guard let ci = customInteractor else { return nil }
        return ci.transitionInProgress ? customInteractor : nil 

    }
}


