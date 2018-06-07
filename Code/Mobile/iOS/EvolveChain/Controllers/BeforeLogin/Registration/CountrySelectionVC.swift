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
    var countryArray : [CountryModel] = []
    
    var refreshControl = UIRefreshControl()

    
    override func viewDidLoad() {
        super.viewDidLoad()
//        countryArray = ["India","North America / Canada"]
//        refreshControl.attributedTitle = NSAttributedString(string: "Pull to refresh")
        refreshControl.addTarget(self, action: #selector(refresh), for: UIControlEvents.valueChanged)
        tableviewCountry.addSubview(refreshControl)
        
        tableviewCountry.register(UINib(nibName: "RadioSelectionCell", bundle: nil), forCellReuseIdentifier: "RadioSelectionCell")
        tableviewCountry.delegate = self
        tableviewCountry.dataSource = self
        
        refreshControl.beginRefreshingManually()
        getCountryList()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Custom Methods
    
    @objc func refresh() {
        // Code to refresh table view
        getCountryList()
    }
    
    func processResponse(response:Array<Any>){
        countryArray.removeAll()
        
        for item in response{
            let model = CountryModel.init()
            model.initWithDictionary(countryDict: RawdataConverter.dictionary(item)!)
            countryArray.append(model)
        }
        DispatchQueue.main.async {
            self.refreshControl.endRefreshing()
            self.tableviewCountry.reloadSections(IndexSet.init(integer: 0), with: .top)
        }
    }
    
    fileprivate func popVC() {
        GlobalMethods.sharedInstance.cleanUpRegistrationData()
        _navigator.popViewController(animated: true)
    }
    
    func processToRegister(response:Dictionary<String,Any>) {
        
        DocumentManager.sharedInstance.initWith(docArray: RawdataConverter.array(response["documents"]) as! [Dictionary<String, Any>])
        let regVC = self.storyboard?.instantiateViewController(withIdentifier: "AmericaRegistrationVC") as! AmericaRegistrationVC
//        regVC.titleString = countryArray[selectedIndex]
        GlobalMethods.sharedInstance.pushVC(regVC)
//        BasicDetailsModel.sharedInstance.countryType = .India
    }
    
    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return countryArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "RadioSelectionCell", for: indexPath) as! RadioSelectionCell
        
        cell.setupCell(text: countryArray[indexPath.row].name, isSelected: indexPath.row == selectedIndex)
        
        return cell;
        
        
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selectedIndex = indexPath.row
        
        tableviewCountry.reloadData()
    }
    
    
    // MARK: - Actions
    
   
    
    @IBAction func actionNext(_ sender: UIButton) {
        
        intialiseAPI()
    }
    
    
    
    @IBAction func actionBack(_ sender: Any) {
        self.popVC()
    }
    
    // MARK: - Web Service
    
    func getCountryList() {
        NetworkManager.sharedInstance.countryListAPI(success: { (response) in
            self.processResponse(response: response)
        }) { (errorMsg) in
            self.refreshControl.endRefreshing()
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg!)
        }
    }
    
    fileprivate func intialiseAPI() {
        SignupConfigModel.sharedInstance.selectedCountry = countryArray[selectedIndex]
        
        NetworkManager.sharedInstance.initialiseAPI(success: { (responseJson) in
            self.processToRegister(response: responseJson)
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: errorMsg!)
        }
    }
}
