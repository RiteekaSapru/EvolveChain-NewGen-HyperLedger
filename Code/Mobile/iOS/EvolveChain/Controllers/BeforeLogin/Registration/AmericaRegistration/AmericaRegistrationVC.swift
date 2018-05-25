//
//  AmericaRegistrationVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

enum RegisterDetailsAmericaType : Int {
    case  Basic = 0
    case  Identity = 1
    case  Address = 2
}

import UIKit

class AmericaRegistrationVC: UIViewController,UITableViewDelegate,UITableViewDataSource,UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout {
   

    @IBOutlet weak var tblvwData: UITableView!
     var headerArray : [String] = []
    
    @IBOutlet weak var colvwData: UICollectionView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        headerArray = ["Basic Details","Identity Proof","Address Proof"]
        tblvwData.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwData.delegate = self
        tblvwData.dataSource = self
        tblvwData.rowHeight = 50;
        
        colvwData.register(UINib(nibName: "OptionsCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "OptionsCollectionViewCell")

//        colvwData.register(UINib(nibName: "OptionsCollectionViewCell", bundle: nil), forCellReuseIdentifier: "OptionsCollectionViewCell")
        colvwData.delegate = self
        colvwData.dataSource = self
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom Methods
    
    func checkValidation() -> Bool {
        if !BasicDetailsModel.sharedInstance.isBasicDetailsComplete{
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringBasicNotSaved)
            return false
        }
        else {
            
            switch DocumentModel.sharedInstance.identityType{
            case .DrivingLicenceIdentityType:
                if !DocumentModel.sharedInstance.drivingModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
                    return false
                }
            case .PassportIdentityType:
                if !DocumentModel.sharedInstance.passportModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
                    return false
                }
            case .TaxationIdentityType:
                if !DocumentModel.sharedInstance.taxationModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringIdentityNotSaved)
                    return false
                }
            }
            
            switch DocumentModel.sharedInstance.addressType{
            case .DrivingLicenceAddressType:
                if !DocumentModel.sharedInstance.drivingModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
                    return false
                }
            case .PassportAddressType:
                if !DocumentModel.sharedInstance.passportModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
                    return false
                }
            case .UtilityAddressType:
                if !DocumentModel.sharedInstance.utilityModel.iscomplete{
                    GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringAddressNotSaved)
                    return false
                }
            }
            
            return true
        }
    }

    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return headerArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
        
        cell.setUpCell(title: headerArray[indexPath.row], sideImage:"ic_right_arrow_black" )
        
        return cell;
        
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView .deselectRow(at: indexPath, animated: true)

        switch indexPath.row {
        case RegisterDetailsAmericaType.Basic.rawValue:
            
                let basicDetailsObj = self.storyboard?.instantiateViewController(withIdentifier: "BasicDetailsAmericaVC")
                GlobalMethods.sharedInstance.pushVC(basicDetailsObj!)
                break
        case RegisterDetailsAmericaType.Identity.rawValue:
            
            let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentSelectionVC") as! DocumentSelectionVC
            
            documentSelectionObj.currentType = .IdentityType
            
            GlobalMethods.sharedInstance.pushVC(documentSelectionObj)
            break
        case RegisterDetailsAmericaType.Address.rawValue:
            
            let documentSelectionObj = self.storyboard?.instantiateViewController(withIdentifier: "DocumentSelectionVC") as! DocumentSelectionVC
            
            documentSelectionObj.currentType = .AddressType
            
            GlobalMethods.sharedInstance.pushVC(documentSelectionObj)
            break
            
        default:
            break
        }
    }
    
    // MARK: - Collections
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return headerArray.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell : OptionsCollectionViewCell = collectionView.dequeueReusableCell(withReuseIdentifier: "OptionsCollectionViewCell", for: indexPath) as! OptionsCollectionViewCell
        
        cell.lblOption.text = headerArray[indexPath.row]
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        return CGSize.init(width: _screenSize.width/2, height: _screenSize.width/2)
    }
    
    // MARK: - Actions
    
    @IBAction func actionNext(_ sender: UIButton) {
        
        if checkValidation() {
            //save details
            GlobalMethods.sharedInstance.uploadBasicDetails()
        }
        
        
    }

}
