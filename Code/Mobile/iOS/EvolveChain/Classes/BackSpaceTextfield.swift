//
//  BackSpaceTextfield.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 22/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

protocol BackSpaceTextFieldDelegate {
    func textFieldDidDelete(textfield:BackSpaceTextfield)
}

class BackSpaceTextfield: UITextField {

    var backDelegate: BackSpaceTextFieldDelegate?
    
    override func deleteBackward() {
        
        backDelegate?.textFieldDidDelete(textfield: self)
        super.deleteBackward()
    }


}
