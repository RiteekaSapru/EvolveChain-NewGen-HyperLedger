//
//  CountrySelectionVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class CountrySelectionVC: UIViewController,UITableViewDelegate,UITableViewDataSource {
   
    @IBOutlet weak var tableviewCountry: UITableView!
    var selectedIndex : Int = 0
    var countryArray : [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        countryArray = ["India","North America / Canada"]
        tableviewCountry.register(UINib(nibName: "RadioSelectionCell", bundle: nil), forCellReuseIdentifier: "RadioSelectionCell")
        tableviewCountry.delegate = self
        tableviewCountry.dataSource = self
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return countryArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "RadioSelectionCell", for: indexPath) as! RadioSelectionCell
        
        cell.setupCell(text: countryArray[indexPath.row], isSelected: indexPath.row == selectedIndex)
        
        return cell;
        
        
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selectedIndex = indexPath.row
        
        tableviewCountry.reloadData()
    }
    // MARK: - Actions
    
    @IBAction func actionNext(_ sender: UIButton) {
        
        switch selectedIndex {
        case 0:GlobalMethods.sharedInstance.underDevelopmentAlert()
            break

        case 1:
            do {
           let americaVC = self.storyboard?.instantiateViewController(withIdentifier: "AmericaRegistrationVC")
                GlobalMethods.sharedInstance.pushVC(americaVC!)
                
        }

        
        default: break
            
        }
    }
}
