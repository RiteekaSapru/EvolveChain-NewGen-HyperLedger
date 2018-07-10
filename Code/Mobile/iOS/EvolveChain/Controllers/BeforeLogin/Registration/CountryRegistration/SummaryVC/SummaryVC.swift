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

  
    override func viewDidLoad() {
        super.viewDidLoad()
      
        setupTableview()
        
        // Do any additional setup after loading the view.
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        
       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
     // MARK: - Custom Methods
    
    
    fileprivate func setupTableview() {
        tblvwSummary.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwSummary.register(UINib(nibName: "SummaryImageCell", bundle: nil), forCellReuseIdentifier: "SummaryImageCell")
        
        tblvwSummary.delegate = self
        tblvwSummary.dataSource = self
        let footer = UIView.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 25))
        footer.backgroundColor = UIColor.clear
        tblvwSummary.tableFooterView = footer
    }
    
    
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
        

    }

    
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
           
            
//            if indexPath.section != expandedSection && expandedSection > -1{
//                arrSummary[expandedSection][0].isExpanded = false
//                let cell = tableView.cellForRow(at: IndexPath.init(row: 0, section: expandedSection)) as! TickCell
//                let angle = arrSummary[expandedSection][0].isExpanded ? CGFloat.pi/2 : 0.0
//                self.rotateImage(img: cell.imgTick, angle: angle)
//                tableView.deleteRows(at: getIndexPathArrayFor(arrSection: expandedSection), with: UITableViewRowAnimation.automatic)
//
//            }
            
            expandedSection = arrSummary[indexPath.section][indexPath.row].isExpanded ? indexPath.section : -1
            tableView.endUpdates()
        }
        
    }

    // MARK: - Actions
    
    @IBAction func actionSubmit(_ sender: Any) {
        if ConfigModel.shared.getTestingStatus(){
            moveToSuccessScreen()
            return
        }
        self.kycComplete()
        
    }
    
    // MARK: - Web Services
    
    fileprivate func moveToSuccessScreen() {
        //mve to nxt screen
        Util.shared.cleanUpRegistrationData()
        DispatchQueue.main.async {
              _navigator.delegate = self
            let successfullVC = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "SuccessfullVC") as! SuccessfullVC
            
            _navigator.setViewControllers([_navigator.viewControllers.first!,successfullVC], animated: true)
            
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

extension SummaryVC:UINavigationControllerDelegate{
    func navigationController(_ navigationController: UINavigationController, animationControllerFor operation: UINavigationControllerOperation, from fromVC: UIViewController, to toVC: UIViewController) -> UIViewControllerAnimatedTransitioning? {

        switch operation {
        case .pop:return nil
        case .push : return RegCompletePushAnimator.init()

        default:
            return nil
        }
    }
}

