//
//  RadioSelectionCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class RadioSelectionCell: UITableViewCell {

    @IBOutlet weak var lblDesciption: UILabel!
    @IBOutlet weak var btnRadio: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setupCell(text:String,isSelected:Bool) -> Void {
        
        self.btnRadio.isUserInteractionEnabled = false
        self.lblDesciption.text = text
        self.btnRadio.isSelected = isSelected
    }
}
