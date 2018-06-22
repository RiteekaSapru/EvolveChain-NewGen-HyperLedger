//
//  SuccessfullVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 24/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class SuccessfullVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    


    // MARK: - Actions


    @IBAction func actionDone(_ sender: Any) {
        GlobalMethods.shared.popVC()
    }
}
