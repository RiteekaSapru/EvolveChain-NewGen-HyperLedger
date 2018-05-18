//
//  TickCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class TickCell: UITableViewCell {

    @IBOutlet weak var lblText: UILabel!
    @IBOutlet weak var imgTick: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setUpCell(title:String,sideImage:String) -> Void {
        lblText.text = title
        imgTick.image = UIImage.init(named: sideImage)
    }
}