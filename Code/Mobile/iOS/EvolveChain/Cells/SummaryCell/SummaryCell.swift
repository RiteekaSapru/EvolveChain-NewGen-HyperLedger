//
//  SummaryCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 28/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SummaryCell: UITableViewCell {

    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var lblDesc: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
   
    // MARK: - Methods
    
    func setData(title:String,desc:String) {
        self.lblTitle.text = title
        self.lblDesc.text  = desc
    }
}
