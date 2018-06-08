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
    
    var nextDelegate : TextFieldNextDelegate?
    
//    var datePicker = DocModel.init()
    
    var datePicker : UIDatePicker?
    var dateformatter : DateFormatter = DateFormatter.init()
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    // MARK: - Custom
    
    func setModel(mdl:DocModel,cellType:CellType) {
        self.model = mdl
        dateformatter.dateFormat = "MMM, dd yyyy"
        if cellType == .TextfieldType{
             txtfldInput.placeholder = "Number"
            txtfldInput.delegate = self
            txtfldInput.inputView = nil
            txtfldInput.inputAccessoryView = nil
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
            txtfldInput.inputView = nil
            txtfldInput.inputAccessoryView = nil
        }
        else if cellType == .DatePickerType{
            txtfldInput.placeholder = "Expiry Date"
            if (model.date != nil){
                txtfldInput.text = dateformatter.string(from: model.date!)
            }
            else{
                txtfldInput.text = ""
            }
            
            txtfldInput.isUserInteractionEnabled = true
            txtfldInput.delegate = nil
            
            datePicker = GlobalMethods.sharedInstance.getDatePicker(controller:self,txtFld: txtfldInput, doneAction: #selector(doneMethod), cancelAction: #selector(cancelMethod))
            datePicker?.minimumDate = Date()
            datePicker?.maximumDate = nil
//            datePicker?.maximumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.selectedCountry.minAge, after: false)
//            datePicker?.minimumDate = GlobalMethods.sharedInstance.getDate(year: SignupConfigModel.sharedInstance.selectedCountry.maxAge, after: false)
            
        }
       
    }
    
    // MARK: - Textfield Delegates
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        model.value = textField.text!
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        nextDelegate?.textFieldNextPressed(cell: self)
        return false
    }
    
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
        model.value = ""
        return true
    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if string.count == 0{
            return true
        }
        else{
            let result = string.trimmingCharacters(in: CharacterSet.alphanumerics)
            return result.count == 0
        }
    }
    
    // MARK: - Obj C Methods
    
    @objc func doneMethod(){
        model.date = (datePicker?.date)!
        txtfldInput.text = dateformatter.string(from: (datePicker?.date)!)
         txtfldInput.resignFirstResponder()
    }
    
    @objc func cancelMethod(){
        txtfldInput.resignFirstResponder()
    }
}
