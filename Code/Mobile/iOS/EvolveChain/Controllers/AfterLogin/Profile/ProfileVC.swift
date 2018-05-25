//
//  ProfileVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ProfileVC: UIViewController {
    
    @IBOutlet weak var imgUser: UIImageView!
    @IBOutlet weak var txtfldFname: UITextField!
    @IBOutlet weak var txtfldMname: UITextField!
    @IBOutlet weak var txtfldLname: UITextField!
    
    @IBOutlet weak var lblPhoneNumber: UILabel!
    @IBOutlet weak var lblEmail: UILabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    
    // MARK: - Actions
    
    
    @IBAction func actionLogout(_ sender: Any) {
        GlobalMethods.sharedInstance.logoutUser()
    }
    
    

}
