//
//  BackSpaceTextfield.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 22/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

protocol BackSpaceTextFieldDelegate {
    func textFieldDidDelete(textfield:UITextField)
}



class BackSpaceTextfield: NoPasteUITextField {

    var backDelegate: BackSpaceTextFieldDelegate?
    
    override func deleteBackward() {
        
        backDelegate?.textFieldDidDelete(textfield: self)
        super.deleteBackward()
    }


}

class NoPasteUITextField: UITextField {
    override public func canPerformAction(_ action: Selector, withSender sender: Any?) -> Bool {
        if action == #selector(copy(_:)) || action == #selector(paste(_:)) {
            return false
        }
        
        return super.canPerformAction(action, withSender: sender)
    }
}
