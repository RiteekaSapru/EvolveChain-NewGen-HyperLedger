//
//  CountrySelectionVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 15/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class CountrySelectionVC: UIViewController,UITableViewDelegate,UITableViewDataSource {
   
    @IBOutlet weak var vwNextHolder: UIView!
    @IBOutlet weak var tableviewCountry: UITableView!
    var selectedIndex : Int = -1
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
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        GlobalMethods.shared.initialiseLocation()
        
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
        
        if countryArray.count > 0{
            selectedIndex = 0
        }
        
        DispatchQueue.main.async {
            self.refreshControl.endRefreshing()
            self.tableviewCountry.reloadSections(IndexSet.init(integer: 0), with: .top)
        }
    }
    
    fileprivate func popVC() {
        GlobalMethods.shared.cleanUpRegistrationData()
        GlobalMethods.shared.popVC()
    }
    
    func processToRegister(response:Dictionary<String,Any>) {
        
        DocumentManager.shared.initWith(docArray: RawdataConverter.array(response["documents"]) as! [Dictionary<String, Any>])
        
        _userDefault.set(response["key"], forKey: kApplicationKey)
        SignupConfigModel.shared.verificationCode = RawdataConverter.string(response["verification_code"])
        
        if DocumentManager.shared.arrAddress.count > 0 && DocumentManager.shared.arrIdentity.count > 0 {
            let regVC = self.storyboard?.instantiateViewController(withIdentifier: "AmericaRegistrationVC") as! RegistrationVC
            GlobalMethods.shared.pushVC(regVC)
        }
        else{
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: "Documents not available.")
        }
      
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
    
    func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        let noInternetLabel = UILabel.init(frame: CGRect.init(x: 0, y: 0, width: _screenSize.width, height: 60.0))
        
        noInternetLabel.backgroundColor = .clear
        noInternetLabel.textColor = UIColor.darkGray
        noInternetLabel.textAlignment = .center
        noInternetLabel.font = UIFont.init(name: "Avenir-Light", size: 12)
        
        noInternetLabel.text = RequestManager.shared.isConnectedToNetwork() ? refreshControl.isRefreshing ? "Retrieving country list..." : "No Countries available right now." : StringConstants.NoInternet
        
        return noInternetLabel
    }
    
    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return countryArray.count == 0 ? 60.0 : 0
    }
    // MARK: - Actions
    
   
    
    @IBAction func actionNext(_ sender: UIButton) {
        if selectedIndex > -1{
            vwNextHolder.loadingIndicator(show: true)
            intialiseAPI()
        }
    }
    
    
    
    @IBAction func actionBack(_ sender: Any) {
        self.popVC()
    }
    
    // MARK: - Web Service
    
    func getCountryList() {
        NetworkManager.shared.countryListAPI(success: { (response) in
            self.processResponse(response: response)
        }) { [weak self] (errorMsg)  in
            DispatchQueue.main.async {
                self?.refreshControl.endRefreshing()
                self?.tableviewCountry.reloadData()
            }
            
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
    
    fileprivate func intialiseAPI() {
    
        SignupConfigModel.shared.selectedCountry = countryArray[selectedIndex]
        
        NetworkManager.shared.initialiseAPI(success: { (responseJson) in
            DispatchQueue.main.async {
                self.vwNextHolder.loadingIndicator(show: false)
                GlobalMethods.shared.stopLocation()
                 self.processToRegister(response: responseJson)
            }
           
        }) { (errorMsg) in
            self.vwNextHolder.loadingIndicator(show: false)
            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
}
