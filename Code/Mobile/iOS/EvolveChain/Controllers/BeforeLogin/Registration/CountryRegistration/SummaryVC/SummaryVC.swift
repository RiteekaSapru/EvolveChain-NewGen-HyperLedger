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
    
    var arrHeader : [String] = []
    var arrBasicDetails : [ [Any]] = [[]]
    var arrIdentityDetails : [ [Any]] = [[]]
    var arrAddressDetails : [ [Any]] = [[]]
    
    override func viewDidLoad() {
        super.viewDidLoad()

        arrHeader = ["Basic Details","Identity Details","Address Details"]
        arrBasicDetails = BasicDetailsModel.sharedInstance.getBasicDataInArray()
        arrIdentityDetails = DocumentModel.sharedInstance.getIdentityDataInArray()
        arrAddressDetails = DocumentModel.sharedInstance.getAddressDataInArray()
        
        tblvwSummary.register(UINib(nibName: "SummaryCell", bundle: nil), forCellReuseIdentifier: "SummaryCell")
        tblvwSummary.register(UINib(nibName: "ImageCell", bundle: nil), forCellReuseIdentifier: "ImageCell")
        tblvwSummary.register(UINib(nibName: "UserImageCell", bundle: nil), forCellReuseIdentifier: "UserImageCell")

        tblvwSummary.delegate = self
        tblvwSummary.dataSource = self
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func getArrayModelFor(section:Int,row:Int) -> [Any] {
        var arrModel :[Any] = []
        
        switch section {
        case 0:
            arrModel = arrBasicDetails[row]
        case 1:
            arrModel = arrIdentityDetails[row]
        case 2:
            arrModel = arrAddressDetails[row]
            
        default:
            break
        }
        return arrModel
    }
    
    func getArrayForSection(section:Int) -> [Any]
    {
        switch section {
        case 0:
            return arrBasicDetails
        case 1:
            return arrIdentityDetails
        case 2:
            return arrAddressDetails
        default: return []
            
        }
    }
    
    func openTermsLink() {
        let safariVC = SFSafariViewController(url: URL.init(string: terms_url)!)
        present(safariVC, animated: true, completion: nil)
    }
    
    func askTermsAndCondition() {
        
        let alert = UIAlertController.init(title: "Terms and Conditions", message: "Do you accept the Terms and Conditions?", preferredStyle: .alert)
        
        let termsAction = UIAlertAction.init(title: "Terms and Conditions", style: .default) { (alert) in
            self.openTermsLink()
        }
        
        alert.addAction(termsAction)
        
        let acceptAction = UIAlertAction.init(title: "I Accept", style: .default) { (alert) in
             GlobalMethods.sharedInstance.uploadBasicDetails()
        }
        
        alert.addAction(acceptAction)
        
        let cancelAction = UIAlertAction.init(title: "Cancel", style: .destructive) { (alert) in
            
        }
        
        alert.addAction(cancelAction)
        
        _navigator.present(alert, animated: true, completion: nil)
    }
    
    // MARK: - Tableview
    
    func numberOfSections(in tableView: UITableView) -> Int {
        return arrHeader.count
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
      return getArrayForSection(section: section).count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
      let arrModel = getArrayModelFor(section: indexPath.section, row: indexPath.row)
        
        if arrModel.last is UIImage {
            if arrModel.count > 2{
                let cell = tableView.dequeueReusableCell(withIdentifier: "ImageCell", for: indexPath) as! ImageCell
                
                cell.setData(imgFront: arrModel[1] as! UIImage, imgBack: arrModel[2] as! UIImage)
                
                return cell;
            }
            else{
                let cell = tableView.dequeueReusableCell(withIdentifier: "UserImageCell", for: indexPath) as! UserImageCell
                
                cell.setData(imgUserPic:  arrModel[1] as! UIImage)
                
                return cell;
            }
           
        }
        else{
            let cell = tableView.dequeueReusableCell(withIdentifier: "SummaryCell", for: indexPath) as! SummaryCell
            
            cell.setData(title: arrModel.first as! String, desc: arrModel.last as! String)
            
            return cell;
        }
    }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 45.0
    }
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        
        let vwHeader = UIView.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 45.0))
        vwHeader.backgroundColor = UIColor.clear
        
        let lblHeader = UILabel.init(frame: CGRect.init(x: 15, y: 0, width: _screenSize.width - 30.0, height: 45))
        lblHeader.font = UIFont.init(name: "AvenirNext-Medium", size: 24)
        lblHeader.textColor = UIColor.black
        lblHeader.text = arrHeader[section]
        vwHeader.addSubview(lblHeader)
        
        if(section > 0)
        {
            let seperatorview = UIView.init(frame: CGRect.init(x: 10, y: 0, width: _screenSize.width - 20.0, height: 1))
            seperatorview.backgroundColor = UIColor.lightGray
             vwHeader.addSubview(seperatorview)
        }
        
        return vwHeader
        
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView .deselectRow(at: indexPath, animated: true)
        
        
    }

    // MARK: - Actions
    
    @IBAction func actionSubmit(_ sender: Any) {
        askTermsAndCondition()
        
    }
}
