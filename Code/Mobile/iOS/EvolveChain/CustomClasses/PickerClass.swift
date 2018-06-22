//
//  PickerClass.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 11/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class PickerClass: NSObject,UIPickerViewDelegate, UIPickerViewDataSource {

    var doneBlock: ((Int) -> Void) = {_ in }
    
    var cancelBlock: (() -> Void) = {  }

    
    var arrData : [String] = []
    
    var customPicker: UIPickerView!
    
    
    func setUpPicker(customList:[String]) -> UIPickerView
    {
        arrData = customList;
        
        customPicker = UIPickerView.init()
        
        customPicker.backgroundColor = UIColor.white
        
        customPicker.delegate = self
        customPicker.dataSource = self
        
        customPicker.reloadAllComponents()
        
        return customPicker
    }
    
    func setUpToolbar() -> UIToolbar {
        let toolbar = UIToolbar(frame: CGRect(x: 0, y: 0, width: Int(_screenSize.width), height:40))
        
        toolbar.isTranslucent = false
        
        toolbar.barTintColor = UIColor.white
        let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(actionDone))
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(actionCancel))
        let flexibleSpace = UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil)
        
        doneButton.tintColor = UIColor.black
        
        cancelButton.tintColor = UIColor.black
        
        toolbar.setItems([cancelButton,flexibleSpace,doneButton], animated: true)
        
        return toolbar
    }
    
    
    //MARK:- Picker Actions
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        
        return arrData.count
       
    }
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String?{
        
        return arrData[row]
        
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
      
        
    }
    
    // MARK: - Obj C Methods
    
    @objc func actionDone(){
        doneBlock(customPicker.selectedRow(inComponent: 0))
        
    }
    
    @objc func actionCancel(){
        cancelBlock()
//        txtfldInput.resignFirstResponder()
    }
}
