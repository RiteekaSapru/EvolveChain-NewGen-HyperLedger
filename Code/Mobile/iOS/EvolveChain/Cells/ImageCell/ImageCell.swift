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
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    // MARK: - Methods
    
    func setData(imgFront:UIImage,imgBack:UIImage) {
        
        imgImageLeft.image = imgFront
        imgImageRight.image = imgBack
    }
    
}
