//
//  SettingsVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 30/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SettingsVC: UIViewController,UITableViewDelegate,UITableViewDataSource {

    @IBOutlet weak var tblvwData: UITableView!
    var arrSettings : [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()

        arrSettings = ["Change Pin","Logout"]
        tblvwData.register(UINib(nibName: "TickCell", bundle: nil), forCellReuseIdentifier: "TickCell")
        tblvwData.delegate = self
        tblvwData.dataSource = self
        tblvwData.rowHeight = 60;
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom Methods

    
    func addShadow(viewToChange:UIView)  {
        viewToChange.clipsToBounds = false
        let shadowLayer = CAShapeLayer()
        shadowLayer.path = UIBezierPath(roundedRect: viewToChange.bounds, cornerRadius: 3).cgPath
        shadowLayer.fillColor = UIColor.white.cgColor
        
        shadowLayer.shadowColor = UIColor.darkGray.cgColor
        shadowLayer.shadowPath = shadowLayer.path
        shadowLayer.shadowOffset = CGSize(width: 1.0, height: 1.5)
        shadowLayer.shadowOpacity = 0.4
        shadowLayer.shadowRadius = 0.7
        
        viewToChange.layer.insertSublayer(shadowLayer, at: 0)
    }

    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return arrSettings.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "TickCell", for: indexPath) as! TickCell
        
        cell.setUpCell(title: arrSettings[indexPath.row], sideImage:"ic_right_arrow_black",textColor: UIColor.black )
        cell.vwHolder.cornerRadius = 4
        return cell;
        
        
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        tableView .deselectRow(at: indexPath, animated: true)
        switch indexPath.row {
        case 0:
            let changePinVC = self.storyboard?.instantiateViewController(withIdentifier: "ChangePinVC")
            GlobalMethods.shared.pushVC(changePinVC!)
            
        case 1:
            GlobalMethods.shared.logoutUserWithAlert()
        default:
            break
        }
    }
    

}
