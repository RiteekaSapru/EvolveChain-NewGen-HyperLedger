//
//  TextFieldCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class TextFieldCell: UITableViewCell,UITextFieldDelegate {

    @IBOutlet weak var txtfldInput: UITextField!
    
    var model = DocModel.init()
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setModel(mdl:DocModel,cellType:CellType) {
        self.model = mdl
        
        if cellType == .TextfieldType{
             txtfldInput.placeholder = "Number"
            txtfldInput.delegate = self
//            if model.isSavedComplete{
                txtfldInput.text = model.value
//            }
//            else{
//                txtfldInput.text = ""
//            }
            txtfldInput.isUserInteractionEnabled = true
        }
        else if cellType == .LabelType{
             txtfldInput.placeholder = "Country"
            txtfldInput.text = SignupConfigModel.sharedInstance.selectedCountry.name
            txtfldInput.isUserInteractionEnabled = false
            txtfldInput.delegate = nil
        }
       
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        model.value = textField.text!
    }
}
