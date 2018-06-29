//
//  SummaryVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 28/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit
import SafariServices

class SummaryVC: UIViewController,UITableViewDelegate,UITableViewDataSource {

    @IBOutlet weak var tblvwSummary: UITableView!
    var expandedSection : Int = -1
    
    var arrSummary : [[SummaryStruct]] = [BasicDetailsModel.shared.getBasicDataForSummary(),BasicDetailsModel.shared.getAddressDataForSummary(),DocumentManager.shared.getDataForSummary(type: .IdentityType),DocumentManager.shared.getDataForSummary(type: .AddressType),BasicDetailsModel.shared.getHoldingDataForSummary()]
//    var arrHeader : [String] = []
//    var arrBasicDetails : [ [Any]] = [[]]
//    var arrAddressDetails : [ [Any]] = [[]]
//    var arrIdentityDocs : [ [Any]] = [[]]
//    var arrAddressDoc : [ [Any]] = [[]]
//    var arrHoldingImage : [ [Any]] = [[]]
    
    override func viewDidLoad() {
        super.viewDidLoad()

//        arrHeader = ["Basic Details","Address Details","Identity Proof","Address Proof","Document Holding Photo"]
//        arrBasicDetails = BasicDetailsModel.shared.getBasicDataInArray()
//        arrAddressDetails = BasicDetailsModel.shared.getAddressDataInArray()
//        arrIdentityDocs = DocumentManager.shared.selectedIdentityModel.getDataAsArray()
//        arrAddressDoc = DocumentManager.shared.selectedAddressModel.getDataAsArray()
//        arrHoldingImage = BasicDetailsModel.shared.getHoldingAsArray()
        
        tblvwSummary.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwSummary.register(UINib(nibName: "SummaryImageCell", bundle: nil), forCellReuseIdentifier: "SummaryImageCell")
//        tblvwSummary.register(UINib(nibName: "UserImageCell", bundle: nil), forCellReuseIdentifier: "UserImageCell")

        tblvwSummary.delegate = self
        tblvwSummary.dataSource = self
        let footer = UIView.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 25))
        footer.backgroundColor = UIColor.clear
        tblvwSummary.tableFooterView = footer
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
     // MARK: - Custom Methods
    
    func rotateImage(img:UIImageView, angle : CGFloat) {
        let tr = CGAffineTransform.identity.rotated(by: angle)
        UIView.animate(withDuration: 0.2) {
            img.transform = tr
        }
        
    }
    
    func getIndexPathArrayFor(arrSection : Int) -> [IndexPath] {
        var arrIndex : [IndexPath] = []
        for row in 1..<arrSummary[arrSection].count{
            arrIndex.append(IndexPath.init(row: row, section: arrSection))
        }
        
        return arrIndex
    }
//    func getArrayModelFor(section:Int,row:Int) -> [Any] {
//        var arrModel :[Any] = []
//
//        switch section {
//        case 0:
//            arrModel = arrBasicDetails[row]
//        case 1:
//            arrModel = arrAddressDetails[row]
//        case 2:
//            arrModel = arrIdentityDocs[row]
//
//        case 3:
//            arrModel = arrAddressDoc[row]
//        case 4:
//            arrModel = arrHoldingImage[row]
//        default:
//            break
//        }
//        return arrModel
//    }
//
//    func getArrayForSection(section:Int) -> [Any]
//    {
//        switch section {
//        case 0:
//            return arrBasicDetails
//        case 1:
//            return arrAddressDetails
//        case 2:
//            return arrIdentityDocs
//        case 3:
//            return arrAddressDoc
//        case 4:
//            return arrHoldingImage
//        default: return []
//
//        }
//    }
    
   
    // MARK: - Tableview
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return arrSummary.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return (arrSummary[section].first?.isExpanded)! ? arrSummary[section].count : 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if indexPath.row == 0{
            let cell = tableView.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
            
            cell.backgroundColor = UIColor.clear
            cell.contentView.backgroundColor = UIColor.clear
            cell.vwHolder.backgroundColor = UIColor.white
            cell.vwHolder.cornerRadius = 5.0
            cell.vwHolder.borderColor = UIColor.init(red: 220, green: 220, blue: 220, alpha: 0.5)
            cell.vwHolder.borderWidth = 1.0
            
            cell.setUpCell(title: arrSummary[indexPath.section][indexPath.row].text, sideImage:"ic_right_arrow_black", textColor: UIColor.black )
            
            let angle = arrSummary[indexPath.section][indexPath.row].isExpanded ? CGFloat.pi/2 : 0.0
            let tr = CGAffineTransform.identity.rotated(by: angle)
            cell.imgTick.transform = tr
            
            return cell
            
        }
        else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "SummaryImageCell", for: indexPath) as! SummaryImageCell
            cell.setupCell(data: arrSummary[indexPath.section][indexPath.row])
            return cell
        }
        
//      let arrModel = getArrayModelFor(section: indexPath.section, row: indexPath.row)
//
//        if arrModel.last is UIImage {
//            if arrModel.count > 2{
//                let cell = tableView.dequeueReusableCell(withIdentifier: "ImageCell", for: indexPath) as! ImageCell
//
//                cell.setData(imgFront: arrModel[1], imgBack: arrModel[2] as! UIImage)
//
//                return cell;
//            }
//            else{
//                let cell = tableView.dequeueReusableCell(withIdentifier: "UserImageCell", for: indexPath) as! UserImageCell
//
//                cell.setData(imgUserPic:  arrModel[1] as! UIImage)
//
//                return cell;
//            }
//
//        }
//        else{
//            let cell = tableView.dequeueReusableCell(withIdentifier: "SummaryCell", for: indexPath) as! SummaryCell
//
//            cell.setData(title: arrModel.first as! String, desc: arrModel.last as! String)
//
//            return cell;
//        }
    }
//    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
//        return 45.0
//    }
    
//    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
//
//        let vwHeader = UIView.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 45.0))
//        vwHeader.backgroundColor = UIColor.init(white: 1, alpha: 0.7)
//
//        let lblHeader = UILabel.init(frame: CGRect.init(x: 15, y: 0, width: _screenSize.width - 30.0, height: 45))
//        lblHeader.font = UIFont.init(name: "AvenirNext-Medium", size: 24)
//        lblHeader.textColor = UIColor.black
////        lblHeader.adjustsFontSizeToFitWidth = true
////        lblHeader.minimumScaleFactor = 0.5
//        lblHeader.text = arrHeader[section]
//        vwHeader.addSubview(lblHeader)
//
////        if(section > 0)
////        {
////            let seperatorview = UIView.init(frame: CGRect.init(x: 10, y: 0, width: _screenSize.width - 20.0, height: 1))
////            seperatorview.backgroundColor = UIColor.lightGray
////             vwHeader.addSubview(seperatorview)
////        }
//
//        return vwHeader
//
//    }
    
//    func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
//        let vwHeader = UIView.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 1.0))
//        vwHeader.backgroundColor = UIColor.clear
//
//        let vwSeperator = UIView.init(frame: CGRect.init(x: 10, y: 0, width: _screenSize.width - 20.0, height: 1.0))
//
//        vwSeperator.backgroundColor = UIColor.init(red: 220, green: 220, blue: 220, alpha: 0.7)
//        
//        vwHeader.addSubview(vwSeperator)
//
//        return vwHeader
//
//    }
//    
//    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
//        return 1.0
//    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView .deselectRow(at: indexPath, animated: true)
        if indexPath.row == 0{
            
            arrSummary[indexPath.section][indexPath.row].isExpanded = !arrSummary[indexPath.section][indexPath.row].isExpanded
            
            let cell = tableView.cellForRow(at: indexPath) as! TickCell
            let angle = arrSummary[indexPath.section][indexPath.row].isExpanded ? CGFloat.pi/2 : 0.0
            self.rotateImage(img: cell.imgTick, angle: angle)
            
            tableView.beginUpdates()
            
            if arrSummary[indexPath.section][indexPath.row].isExpanded{
                tableView.insertRows(at: getIndexPathArrayFor(arrSection: indexPath.section), with: UITableViewRowAnimation.automatic)
            }
            else{
                tableView.deleteRows(at: getIndexPathArrayFor(arrSection: indexPath.section), with: UITableViewRowAnimation.automatic)
            }
           
            
            if indexPath.section != expandedSection && expandedSection > -1{
                arrSummary[expandedSection][0].isExpanded = false
                let cell = tableView.cellForRow(at: IndexPath.init(row: 0, section: expandedSection)) as! TickCell
                let angle = arrSummary[expandedSection][0].isExpanded ? CGFloat.pi/2 : 0.0
                self.rotateImage(img: cell.imgTick, angle: angle)
                tableView.deleteRows(at: getIndexPathArrayFor(arrSection: expandedSection), with: UITableViewRowAnimation.automatic)

            }
            
            expandedSection = arrSummary[indexPath.section][indexPath.row].isExpanded ? indexPath.section : -1
            tableView.endUpdates()
        }
        
    }

    // MARK: - Actions
    
    @IBAction func actionSubmit(_ sender: Any) {
        self.kycComplete()
        
    }
    
    // MARK: - Web Services
    
    fileprivate func moveToSuccessScreen() {
        //mve to nxt screen
        Util.shared.cleanUpRegistrationData()
        DispatchQueue.main.async {
            let successfullVC = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "SuccessfullVC") as! SuccessfullVC
            
            _navigator.setViewControllers([_navigator.viewControllers.first!,successfullVC], animated: true)
            
//            GlobalMethods.shared.pushVC(successfullVC)
        }
    }
    
    func kycComplete() {
        
        let params = ["app_key":RawdataConverter.string(_userDefault.object(forKey: kApplicationKey))]
        
        NetworkManager.shared.POSTKYCComplete(params: params, success: { (responseObject) in
            self.moveToSuccessScreen()
            
        }) { (errorMsg) in
            Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
        }
    }
}
