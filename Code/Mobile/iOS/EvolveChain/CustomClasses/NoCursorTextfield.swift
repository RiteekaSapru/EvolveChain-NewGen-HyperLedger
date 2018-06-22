//
//  NoCursorTextfield.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 01/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class NoCursorTextfield: UITextField {

    var backDelegate: BackSpaceTextFieldDelegate?
    
    override func deleteBackward() {
        
        backDelegate?.textFieldDidDelete(textfield: self)
        super.deleteBackward()
    }
    
    override func closestPosition(to point: CGPoint) -> UITextPosition? {
        let beginning = self.beginningOfDocument
        let end = self.position(from: beginning, offset: self.text?.count ?? 0)
        return end
    }
    
    override public func canPerformAction(_ action: Selector, withSender sender: Any?) -> Bool {
        if action == #selector(copy(_:)) || action == #selector(select(_:)){
            return false
        }
        
        return super.canPerformAction(action, withSender: sender)
    }
}
