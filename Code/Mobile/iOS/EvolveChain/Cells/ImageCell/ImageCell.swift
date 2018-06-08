//
//  ImageCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 28/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ImageCell: UITableViewCell {

    @IBOutlet weak var imgImageLeft: UIImageView!
    @IBOutlet weak var imgImageRight: UIImageView!
    
    @IBOutlet weak var widthRightImageLayout: NSLayoutConstraint!
    @IBOutlet weak var widthLeftImageLayout: NSLayoutConstraint!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    // MARK: - Methods
    
    func setData(imgFront:Any,imgBack:UIImage) {
        
        imgImageRight.image = imgBack
        
        if imgFront is UIImage {
            imgImageLeft.image = imgFront as? UIImage
            widthRightImageLayout.constant = (_screenSize.width - 30 - 10) / 2
            widthLeftImageLayout.constant = (_screenSize.width - 30 - 10) / 2
        }
        else{
            
            imgImageLeft.image = nil
            widthRightImageLayout.constant = _screenSize.width - 30
            widthLeftImageLayout.constant = 0

            
           
        }
    }
    
}
