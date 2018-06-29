//
//  AmericaRegistrationVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

enum RegisterDetailsAmericaType : Int {
    case  Basic = 0
    case  Address = 1
    case  IdentityProof = 2
    case  AddressProof = 3
    case  DocumentHolding = 4
}

import UIKit

class RegistrationVC: UIViewController,UITableViewDelegate,UITableViewDataSource,UICollectionViewDelegateFlowLayout {
   

    @IBOutlet weak var tblvwData: UITableView!
     var headerArray : [String] = []
//    var titleString : String = ""
    
    var shouldUpdate : Bool = false
    var indexToUpdate : Int = 0
    
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var colvwData: UICollectionView!
    
   
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpTableview()        
        updateUI()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if shouldUpdate{
            shouldUpdate = false
            updateTableView()
        }
        updateIconForBasic()
    }
    
    // MARK: - Custom Methods

    fileprivate func updateIconForBasic(){
        
        if !BasicDetailsModel.shared.isBasicDetailsComplete && (BasicDetailsModel.shared.isEmailVerified || BasicDetailsModel.shared.isPhoneVerified){
            let image = UIImage.init(named: "ic_info_blue")
            let cell = tblvwData.cellForRow(at: IndexPath.init(row: 0, section: 0)) as! TickCell
            UIView.animate(withDuration: 0.3) {
                cell.imgTick.image = image
            }
            
        }
    }
    fileprivate func setUpTableview() {
        headerArray = ["Basic Details","Address Details","Identity Proof","Address Proof","Document Holding Photo"]
        tblvwData.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwData.delegate = self
        tblvwData.dataSource = self
    }
    
    func updateUI() {
        lblTitle.text = SignupConfigModel.shared.selectedCountry.name
    }
    
    func updateTableView() {
        if indexToUpdate == headerArray.count - 1 {
            updateCellImage(row: indexToUpdate)
//            tblvwData.reloadRows(at: [IndexPath.init(row: indexToUpdate, section: 0)], with: .automatic)
        }
        else{
            updateCellImage(row: indexToUpdate)
            updateCellTextColor(row: indexToUpdate + 1)
//            tblvwData.reloadRows(at: [IndexPath.init(row: indexToUpdate, section: 0),IndexPath.init(row: indexToUpdate+1, section: 0)], with: .automatic)
        }
    }

    func updateCellImage(row:Int) {
        
        let cell = tblvwData.cellForRow(at: IndexPath.init(row: row, section: 0)) as! TickCell
        
        var image = UIImage.init(named: "ic_tick")
        
       
        UIView.transition(with: cell.imgTick, duration: 0.3, options: .transitionCrossDissolve, animations: {
            cell.imgTick.image = image
        }, completion: nil)
        
        
    }
    
    func updateCellTextColor(row:Int) {
        
        let cell = tblvwData.cellForRow(at: IndexPath.init(row: row, section: 0)) as! TickCell
        
        UIView.transition(with: cell.lblText, duration: 0.3, options: .transitionCrossDissolve, animations: {
            cell.lblText.textColor = UIColor.black
        }, completion: nil)
        
        
    }
    
    func getStatusForIndex(index:Int) -> Bool {
//        return true
        switch index {
            case -1: return true
        case RegisterDetailsAmericaType.Basic.rawValue:
            return BasicDetailsModel.shared.isBasicDetailsComplete
        case RegisterDetailsAmericaType.Address.rawValue:
            return BasicDetailsModel.shared.isAddressDetailsComplete
        case RegisterDetailsAmericaType.IdentityProof.rawValue:
            return DocumentManager.shared.isIdentityDocsUploaded
            
        case RegisterDetailsAmericaType.AddressProof.rawValue:
            return DocumentManager.shared.isAddressDocsUploaded
            
        case RegisterDetailsAmericaType.DocumentHolding.rawValue:
            return BasicDetailsModel.shared.holdingImage != nil
            
        default:
            return false
        }
    }
    
    func checkValidation() -> Bool {
        if !BasicDetailsModel.shared.isBasicDetailsComplete{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.RegisterNotComplete)
            return false
        }
        else if !BasicDetailsModel.shared.isAddressDetailsComplete{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.RegisterNotComplete)
            return false
        }
        else if !DocumentManager.shared.isIdentityDocsUploaded{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.RegisterNotComplete)
            return false
        }
        else if !DocumentManager.shared.isAddressDocsUploaded{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.RegisterNotComplete)
            return false
        }
        else if BasicDetailsModel.shared.holdingImage == nil{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.RegisterNotComplete)
            return false
        }

        return true
    }
    
    fileprivate func showAlertForData() {
        let alert = UIAlertController.init(title: "Are you sure?", message: "Going back will remove all data.", preferredStyle: .alert)
        
        
        let deleteAction = UIAlertAction.init(title: "Delete", style: .destructive) { (alert: UIAlertAction!) in
            DispatchQueue.main.async {
                self.popVC()
            }
            
        }
        alert.addAction(deleteAction)
        
        let defaultAction = UIAlertAction.init(title: "Cancel", style: .cancel) { (alert: UIAlertAction!) in
        }
        alert.addAction(defaultAction)
        Util.shared.presentVC(alert)
    }
    
   
    
    fileprivate func popVC() {
        Util.shared.cleanUpRegistrationData()
        Util.shared.popVC()
    }
    
    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return headerArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
        cell.setUpCell(title: headerArray[indexPath.row], sideImage:getStatusForIndex(index: indexPath.row) ? "ic_tick" : "ic_right_arrow_black", textColor: getStatusForIndex(index: indexPath.row - 1) ? UIColor.black : UIColor.lightGray)
        
        if indexPath.row == 0 && (!BasicDetailsModel.shared.isBasicDetailsComplete && (BasicDetailsModel.shared.isEmailVerified || BasicDetailsModel.shared.isPhoneVerified)){
            cell.setUpCell(title: headerArray[indexPath.row], sideImage:"ic_info_blue", textColor: getStatusForIndex(index: indexPath.row - 1) ? UIColor.black : UIColor.lightGray)
        }
        
        cell.backgroundColor = UIColor.clear
        cell.vwHolder.backgroundColor = UIColor.clear
        cell.vwHolder.cornerRadius = 4.0
        cell.vwHolder.borderColor = UIColor.black
        cell.vwHolder.borderWidth = 0.5
        return cell;
        
        
    }
    
//    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
//        let tickCell = cell as! TickCell
//        tickCell.vwHolder.clipsToBounds = false
//        addShadow(viewToChange: tickCell.vwHolder)
//
//    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView .deselectRow(at: indexPath, animated: true)
        if getStatusForIndex(index: indexPath.row - 1){
            switch indexPath.row {
            case RegisterDetailsAmericaType.Basic.rawValue:
                
                let basicDetailsObj = self.storyboard?.instantiateViewController(withIdentifier: "BasicDetailsAmericaVC") as! BasicDetailsAmericaVC
                Util.shared.pushVC(basicDetailsObj)
                
                basicDetailsObj.completionHandler = { index in
                    self.indexToUpdate = index
                    self.shouldUpdate = true
                }
                break
            
            case RegisterDetailsAmericaType.Address.rawValue:
                let addressObj = self.storyboard?.instantiateViewController(withIdentifier: "AddressVC") as! AddressVC
                
                Util.shared.pushVC(addressObj)
                addressObj.completionHandler = { index in
                    self.indexToUpdate = index
                    self.shouldUpdate = true
                }
                break
            
            case RegisterDetailsAmericaType.IdentityProof.rawValue:
                
                if DocumentManager.shared.arrIdentity.count > 0{
                    let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentVC") as! DocumentVC
                    
                    documentSelectionObj.currentType = .IdentityType
                    
                    Util.shared.pushVC(documentSelectionObj)
                    documentSelectionObj.completionHandler = { index in
                        self.indexToUpdate = index
                        self.shouldUpdate = true
                    }
                    
                }
              
                break
            case RegisterDetailsAmericaType.AddressProof.rawValue:
                
                if DocumentManager.shared.arrAddress.count > 0{
                    let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentVC") as! DocumentVC
                    
                    documentSelectionObj.currentType = .AddressType
                    
                    Util.shared.pushVC(documentSelectionObj)
                    
                    documentSelectionObj.completionHandler = { index in
                        self.indexToUpdate = index
                        self.shouldUpdate = true
                    }
                    
                }
               
                break
            
            case RegisterDetailsAmericaType.DocumentHolding.rawValue:
                
                
                    let documentHoldingObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentHoldingVC") as! DocumentHoldingVC
                    
                    
                    Util.shared.pushVC(documentHoldingObj)
                    
                    documentHoldingObj.completionHandler = { index in
                        self.indexToUpdate = index
                        self.shouldUpdate = true
                    }
                    
                
                
                break
                
            default:
                break
            }
        }
      
    }
    
    // MARK: - Collections
    
//    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
//        return headerArray.count
//    }
//
//    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
//
//        let cell : OptionsCollectionViewCell = collectionView.dequeueReusableCell(withReuseIdentifier: "OptionsCollectionViewCell", for: indexPath) as! OptionsCollectionViewCell
//
//        cell.lblOption.text = headerArray[indexPath.row]
//        return cell
//    }
//
//    func collectionView(_ collectionView: UICollectionView,
//                        layout collectionViewLayout: UICollectionViewLayout,
//                        sizeForItemAt indexPath: IndexPath) -> CGSize {
//
//        return CGSize.init(width: _screenSize.width/2, height: _screenSize.width/2)
//    }
//
    // MARK: - Actions
    
    @IBAction func actionNext(_ sender: UIButton) {
        
        if checkValidation() {
        
            let summaryObj = self.storyboard?.instantiateViewController(withIdentifier: "SummaryVC")
            Util.shared.pushVC(summaryObj!)
            
        }
        
        
    }
    @IBAction func actionBack(_ sender: Any) {
        
//        if checkIfDataPresent(){
//            showAlertForData()
//        }
//        else
//        {
            self.popVC()
//        }
        
    }
}
