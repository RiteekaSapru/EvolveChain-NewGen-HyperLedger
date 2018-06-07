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

class AmericaRegistrationVC: UIViewController,UITableViewDelegate,UITableViewDataSource,UICollectionViewDelegateFlowLayout {
   

    @IBOutlet weak var tblvwData: UITableView!
     var headerArray : [String] = []
//    var titleString : String = ""
    
    var shouldUpdate : Bool = false
    var indexToUpdate : Int = 0
    
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var colvwData: UICollectionView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        headerArray = ["Basic Details","Address Details","Identity Proof","Address Proof","Upload Holding Photo"]
        tblvwData.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwData.delegate = self
        tblvwData.dataSource = self
        tblvwData.rowHeight = 60;
        
        updateUI()
//        lblTitle.text = titleString
//        colvwData.register(UINib(nibName: "OptionsCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "OptionsCollectionViewCell")

//        colvwData.register(UINib(nibName: "OptionsCollectionViewCell", bundle: nil), forCellReuseIdentifier: "OptionsCollectionViewCell")
//        colvwData.delegate = self
//        colvwData.dataSource = self
        
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
        
    }
    // MARK: - Custom Methods

    func updateUI() {
        lblTitle.text = SignupConfigModel.sharedInstance.selectedCountry.name
    }
    
    func updateTableView() {
        tblvwData.reloadRows(at: [IndexPath.init(row: indexToUpdate, section: 0),IndexPath.init(row: indexToUpdate+1, section: 0)], with: .automatic)
    }

    
    func getStatusForIndex(index:Int) -> Bool {
        switch index {
            case -1: return true
        case 0:
            return BasicDetailsModel.sharedInstance.isBasicDetailsComplete
        case 1:
            return BasicDetailsModel.sharedInstance.isAddressDetailsComplete
        case 2:
            return DocumentModel.sharedInstance.isIdentityDetailsComplete
            
        case 3:
            return DocumentModel.sharedInstance.isAddressDetailsComplete
        default:
            return false
        }
    }
    
    func checkValidation() -> Bool {
        if !BasicDetailsModel.sharedInstance.isBasicDetailsComplete{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringBasicNotSaved)
            return false
        }
        else if !DocumentModel.sharedInstance.isIdentityDetailsComplete{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
            return false
        }
        else if !DocumentModel.sharedInstance.isAddressDetailsComplete{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
            return false
        }
//        else {
//
//            switch DocumentModel.sharedInstance.identityType{
//            case .DrivingLicenceIdentityType:
//                if !DocumentModel.sharedInstance.drivingModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
//                    return false
//                }
//            case .PassportIdentityType:
//                if !DocumentModel.sharedInstance.passportModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
//                    return false
//                }
//            case .TaxationIdentityType:
//                if !DocumentModel.sharedInstance.taxationModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
//                    return false
//                }
//            }
//
//            switch DocumentModel.sharedInstance.addressType{
//            case .DrivingLicenceAddressType:
//                if !DocumentModel.sharedInstance.drivingModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
//                    return false
//                }
//            case .PassportAddressType:
//                if !DocumentModel.sharedInstance.passportModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
//                    return false
//                }
//            case .UtilityAddressType:
//                if !DocumentModel.sharedInstance.utilityModel.iscomplete{
//                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
//                    return false
//                }
//            }
//
//            return true
//        }
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
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    func checkIfDataPresent() -> Bool {
        if BasicDetailsModel.sharedInstance.isBasicDetailsComplete {
            return true
        }
        else if BasicDetailsModel.sharedInstance.isEmailVerified{
            return true
        }
        else if BasicDetailsModel.sharedInstance.isPhoneVerified{
            return true
        }
        else if DocumentModel.sharedInstance.passportModel.iscomplete || DocumentModel.sharedInstance.drivingModel.iscomplete || DocumentModel.sharedInstance.taxationModel.iscomplete || DocumentModel.sharedInstance.utilityModel.iscomplete{
            return true
        }
        else {
            return false
        }
        
    }
    
    fileprivate func popVC() {
        GlobalMethods.sharedInstance.cleanUpRegistrationData()
        _navigator.popViewController(animated: true)
    }
    
    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return headerArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
        cell.setUpCell(title: headerArray[indexPath.row], sideImage:getStatusForIndex(index: indexPath.row) ? "ic_tick" : "ic_right_arrow_black", textColor: getStatusForIndex(index: indexPath.row - 1) ? UIColor.black : UIColor.lightGray)
        
        cell.vwHolder.cornerRadius = 4.0
        cell.vwHolder.borderColor = UIColor.lightGray
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
                GlobalMethods.sharedInstance.pushVC(basicDetailsObj)
                
                basicDetailsObj.completionHandler = { index in
                    self.indexToUpdate = index
                    self.shouldUpdate = true
                }
                break
            
            case RegisterDetailsAmericaType.Address.rawValue:
                let addressObj = self.storyboard?.instantiateViewController(withIdentifier: "AddressVC") as! AddressVC
                
                GlobalMethods.sharedInstance.pushVC(addressObj)
                addressObj.completionHandler = { index in
                    self.indexToUpdate = index
                    self.shouldUpdate = true
                }
                break
            
            case RegisterDetailsAmericaType.IdentityProof.rawValue:
                
                let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentSelectionVC") as! DocumentSelectionVC
                
                documentSelectionObj.currentType = .IdentityType
                
                GlobalMethods.sharedInstance.pushVC(documentSelectionObj)
                documentSelectionObj.completionHandler = { index in
                    self.indexToUpdate = index
                    self.shouldUpdate = true
                }
                
                break
            case RegisterDetailsAmericaType.AddressProof.rawValue:
                
                let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentSelectionVC") as! DocumentSelectionVC
                
                documentSelectionObj.currentType = .AddressType
                
                GlobalMethods.sharedInstance.pushVC(documentSelectionObj)
                
                documentSelectionObj.completionHandler = { index in
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
            GlobalMethods.sharedInstance.pushVC(summaryObj!)
            
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
