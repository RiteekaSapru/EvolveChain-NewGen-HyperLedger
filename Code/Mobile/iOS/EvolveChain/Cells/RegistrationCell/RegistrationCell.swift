//
//  RegistrationCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 03/07/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class RegistrationCell: UITableViewCell {

     @IBOutlet weak var lblText: UILabel!
     @IBOutlet weak var imgLeft: UIImageView!
     @IBOutlet weak var imgRight: UIImageView!
        @IBOutlet weak var vwHolder: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setUpCell(title:String,leftImage:String,rightImage:String,textColor:UIColor) -> Void{
        lblText.text = title
        imgLeft.image = UIImage.init(named: leftImage)
        imgLeft.tintColor = textColor
        imgRight.image = UIImage.init(named: rightImage)

        lblText.textColor = textColor
    }
}
