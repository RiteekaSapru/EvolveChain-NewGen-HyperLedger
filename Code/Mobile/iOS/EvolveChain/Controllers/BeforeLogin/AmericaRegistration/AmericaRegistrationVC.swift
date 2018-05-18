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
    case  SSN = 3
    case  Bank = 4
}

import UIKit

class AmericaRegistrationVC: UIViewController,UITableViewDelegate,UITableViewDataSource {

    @IBOutlet weak var tblvwData: UITableView!
     var headerArray : [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        headerArray = ["Basic Details","Identity Proof","Address Proof","SSN Details","Bank Details"]
        tblvwData.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwData.delegate = self
        tblvwData.dataSource = self
        tblvwData.rowHeight = 50;
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
            
            let identityDetailsObj = self.storyboard?.instantiateViewController(withIdentifier: "IdentityProofVC")
            GlobalMethods.sharedInstance.pushVC(identityDetailsObj!)
            break
        case RegisterDetailsAmericaType.Address.rawValue:
            
            let addressDetailsObj = self.storyboard?.instantiateViewController(withIdentifier: "AddressProofVC")
            GlobalMethods.sharedInstance.pushVC(addressDetailsObj!)
            break
        default:
            break
        }
    }
    // MARK: - Actions
    
    @IBAction func actionNext(_ sender: UIButton) {
        
        
    }

}
