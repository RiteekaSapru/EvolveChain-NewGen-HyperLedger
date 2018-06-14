//
//  ProfileType1Cell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 29/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ProfileType1Cell: UITableViewCell {

    @IBOutlet weak var vwHolder: UIView!
    
    @IBOutlet weak var lbladd1: UILabel!
    @IBOutlet weak var lbladd2: UILabel!
    @IBOutlet weak var lblstreet: UILabel!
    @IBOutlet weak var lblCity: UILabel!
    @IBOutlet weak var lblZip: UILabel!
    @IBOutlet weak var lblState: UILabel!
    @IBOutlet weak var lblCountry: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setupCell() {
        var line1 = BasicDetailsModel.sharedInstance.add1
        if BasicDetailsModel.sharedInstance.add2.count > 0 {
            line1.append(", " + BasicDetailsModel.sharedInstance.add2)
        }
        
        lbladd1.text = line1
        lbladd2.text = BasicDetailsModel.sharedInstance.street + ", " + BasicDetailsModel.sharedInstance.city + ", " + BasicDetailsModel.sharedInstance.zipCode
        
        lblstreet.text = BasicDetailsModel.sharedInstance.state + ", " + BasicDetailsModel.sharedInstance.country
        lblCity.text = ""
        lblZip.text = ""
        lblState.text = ""
        lblCountry.text = ""
        
    }
}
