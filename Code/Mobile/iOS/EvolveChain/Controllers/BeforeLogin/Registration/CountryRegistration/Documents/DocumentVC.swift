//
//  DocumentVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 07/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

protocol TextFieldNextDelegate {
    func textFieldNextPressed(cell:UITableViewCell)
}

class DocumentVC: UIViewController,UITableViewDelegate,UITableViewDataSource,TextFieldNextDelegate {

    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var tblvwDoc: UITableView!
    
   
    
    var currentType : DocumentType = .IdentityType
    var arrDocArray : [DocModel] = []
    var selectedDocModel : DocModel = DocModel.init()
    
    var arrFieldArray : [[FieldsModel]] = [[]]
    
    var completionHandler: (Int)->Void = {_ in }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        updateUI()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    // MARK: - Custom
    
    fileprivate func updateUI() {
        
        switch currentType {
        case .IdentityType:
           setupIdentity()

        case .AddressType:
           setupAddress()

        }
        
        arrFieldArray = DocumentManager.shared.getFieldArrayForModel(model: selectedDocModel,docType:currentType )
        
        tblvwDoc.register(UINib(nibName: "RadioSelectionCell", bundle: nil), forCellReuseIdentifier: "RadioSelectionCell")
        tblvwDoc.register(UINib(nibName: "TwoImagePicker", bundle: nil), forCellReuseIdentifier: "TwoImagePicker")
        tblvwDoc.register(UINib(nibName: "TextFieldCell", bundle: nil), forCellReuseIdentifier: "TextFieldCell")
        tblvwDoc.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        
        
        tblvwDoc.delegate = self
        tblvwDoc.dataSource = self
    }
    
    fileprivate func setupIdentity() {
        lblTitle.text = "Identity Proof"
        arrDocArray = DocumentManager.shared.arrIdentity
        selectedDocModel = DocumentManager.shared.selectedIdentityModel.getCopy()

    }
    
    fileprivate func setupAddress() {
        lblTitle.text = "Address Proof"
        arrDocArray = DocumentManager.shared.arrAddress
        selectedDocModel = DocumentManager.shared.selectedAddressModel.getCopy()

    }
    // MARK: - Data Handling
    
    fileprivate func saveData() {
        switch currentType {
        case .IdentityType:
            DocumentManager.shared.saveIdentityModel(model: selectedDocModel)
             DocumentManager.shared.isIdentityDocsUploaded = true
            self.completionHandler(2)
        case .AddressType:
            DocumentManager.shared.saveAddressModel(model: selectedDocModel)
            DocumentManager.shared.isAddressDocsUploaded = true
            self.completionHandler(3)
        }
        
        Util.shared.popVC()
    }
    
    fileprivate func validateData(){
        let val = selectedDocModel.validateModel()
        
        if val.count == 0{
            uploadDetails()
//            saveData()
        }
        else{
            for item in val{
                if item.indexPath.section == 2 && (item.indexPath.row == 0 || item.indexPath.row == 2){
                    let cell = tblvwDoc.cellForRow(at: item.indexPath)
                    if let txtFld = cell?.contentView.viewWithTag(99) as? UITextField{
                        txtFld.becomeFirstResponder()
                        txtFld.animatePlaceholderColor()
                    }
                }
            }
           
        }
    }
    
    fileprivate func focusRow(indexPath:IndexPath){
        
        let cell = tblvwDoc.cellForRow(at: indexPath)
        
        if let txtFld = cell?.contentView.viewWithTag(99) as? UITextField{
            txtFld.becomeFirstResponder()
            txtFld.animatePlaceholderColor()
        }
    }
    
    // MARK: - Cells
    
    fileprivate func getPickerTypeCell(model:FieldsModel,indexPath: IndexPath) -> TickCell {
        
        let cell = tblvwDoc.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
        if indexPath.section == 0 {
            cell.setUpCell(title: selectedDocModel.name, sideImage: "ic_down_arrow_black", textColor: UIColor.black)

        }
        else{
            cell.setUpCell(title: selectedDocModel.selectedSubType!.name, sideImage: "ic_down_arrow_black", textColor: UIColor.black)

        }
        
        return cell;
        
    }
    
    fileprivate func getRadioTypeCell(model:FieldsModel,indexPath: IndexPath) -> RadioSelectionCell {
        
        let cell = tblvwDoc.dequeueReusableCell(withIdentifier: "RadioSelectionCell", for: indexPath) as! RadioSelectionCell

        if indexPath.section == 0 {
            cell.setupCell(text: arrDocArray[indexPath.row - 1].name, isSelected: arrDocArray[indexPath.row - 1].code == selectedDocModel.code)
        }
        else{
            cell.setupCell(text: selectedDocModel.subDocs[indexPath.row - 1].name, isSelected: selectedDocModel.subDocs[indexPath.row - 1].code == selectedDocModel.selectedSubType?.code)
        }

        return cell;
    }
    
    fileprivate func getTextFieldTypeCell(model:FieldsModel,indexPath: IndexPath) -> TextFieldCell {
        
        let cell = tblvwDoc.dequeueReusableCell(withIdentifier: "TextFieldCell", for: indexPath) as! TextFieldCell
        
        cell.setModel(mdl: selectedDocModel, cellType: model.type)
        cell.nextDelegate = self
        return cell;
    }
    
    fileprivate func getImageTypeCell(model:FieldsModel,indexPath: IndexPath) -> TwoImagePicker {
        
        let cell = tblvwDoc.dequeueReusableCell(withIdentifier: "TwoImagePicker", for: indexPath) as! TwoImagePicker
        
        cell.setModel(mdl: selectedDocModel, cellType: .TwoImagePickerType)
        
        return cell;
    }
    
    // MARK: - Tableview
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return arrFieldArray.count
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        if arrFieldArray[section].count > 0{
           let fieldModel = arrFieldArray[section][0]
            
            if fieldModel.type == .PickerType{
                return fieldModel.isExpanded ? arrFieldArray[section].count : 1
            }
            else{
                return arrFieldArray[section].count
            }
        }
        
        return arrFieldArray[section].count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let fieldModel = arrFieldArray[indexPath.section][indexPath.row]
        
        switch fieldModel.type {
        case .PickerType:
            return getPickerTypeCell(model: fieldModel, indexPath: indexPath)
        
        case .SelectionType:
            return getRadioTypeCell(model: fieldModel, indexPath: indexPath)
            
        case .TextfieldType:
            return getTextFieldTypeCell(model: fieldModel, indexPath: indexPath)
            
        case .DatePickerType:
            return getTextFieldTypeCell(model: fieldModel, indexPath: indexPath)
            
        case .LabelType:
            return getTextFieldTypeCell(model: fieldModel, indexPath: indexPath)
            
        case .TwoImagePickerType:
            return getImageTypeCell(model: fieldModel, indexPath: indexPath)
        }
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
         let fieldModel = arrFieldArray[indexPath.section][indexPath.row]
        
        if fieldModel.type == .PickerType{
            fieldModel.isExpanded = !fieldModel.isExpanded
            
            tableView.reloadSections(IndexSet.init(integer: indexPath.section), with: .automatic)
        }
        else if fieldModel.type == .SelectionType{

            let mainField = arrFieldArray[indexPath.section][0]
            mainField.isExpanded = false
            if indexPath.section == 0 {
                if selectedDocModel.code != arrDocArray[indexPath.row - 1].code{
//                    switch currentType {
//                    case .IdentityType:
//                        DocumentManager.shared.selectedIdentityModel = arrDocArray[indexPath.row - 1]
//                    case .AddressType:
//                        DocumentManager.shared.selectedAddressModel = arrDocArray[indexPath.row - 1]
//                    }
//                    selectedDocModel.eraseData()
                    selectedDocModel = arrDocArray[indexPath.row - 1].getCopy()
                    arrFieldArray = DocumentManager.shared.getFieldArrayForModel(model: selectedDocModel,docType:currentType )
                }
                tableView.reloadSections(IndexSet(integersIn: 0...arrFieldArray.count - 1), with: .automatic)
            }
            else {
                if selectedDocModel.selectedSubType?.code != selectedDocModel.subDocs[indexPath.row - 1].code{
                    selectedDocModel.selectedSubType = selectedDocModel.subDocs[indexPath.row - 1]
                    arrFieldArray = DocumentManager.shared.getFieldArrayForModel(model: selectedDocModel,docType:currentType )

                }
                tableView.reloadSections(IndexSet([indexPath.section,tblvwDoc.numberOfSections - 1]), with: .automatic)
            }
        }
    }
    
    // MARK: - Actions
    
    @IBAction func actionSave(_ sender: Any) {
        validateData()
    }
    
    @IBAction func actionBack(_ sender: Any) {
        self.view.endEditing(true)
        Util.shared.popVC()
    }
    
    // MARK: - Next Textfield Delegate
    
    func textFieldNextPressed(cell: UITableViewCell) {
        let index = tblvwDoc.indexPath(for: cell)
        
        let newIndex = IndexPath.init(row: index!.row + 2, section: index!.section)
        if (tblvwDoc.cellForRow(at: newIndex) != nil) {
            focusRow(indexPath: newIndex)
        }
    }
    
     // MARK: - Web Services
    
    fileprivate func uploadDetails() {
        
        let filenameArray = ["file[]","file[]"]
        
        NetworkManager.shared.POSTIdentityDetails(params:selectedDocModel.getModelAsDictionary(type: currentType) , fileArray: selectedDocModel.getImagesForKYC(), filenameArray: filenameArray, success: { (responseDict) in
            print(responseDict)
            print("Document Details Saved")
            self.saveData()
        }) { (errorMsg) in
            Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
        
    }
}
