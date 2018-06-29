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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpUI()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom
    func setImage(photo:UIImage) {
        img = photo
    }
    
    fileprivate func setUpUI() {
        imgPhoto.image = img
    }
    
    // MARK: - Actions
    
    @IBAction func actionClose(_ sender: Any) {
        self.dismiss(animated: true, completion: nil)
    }
    
}
