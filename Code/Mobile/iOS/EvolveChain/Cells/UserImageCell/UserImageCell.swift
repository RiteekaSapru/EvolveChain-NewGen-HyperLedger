//
//  UserImageCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 31/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class UserImageCell: UITableViewCell {

    @IBOutlet weak var imgUser: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    // MARK: - Custom Methods

    func setData(imgUserPic:UIImage) {
        
        imgUser.image = imgUserPic
        
    }
}
