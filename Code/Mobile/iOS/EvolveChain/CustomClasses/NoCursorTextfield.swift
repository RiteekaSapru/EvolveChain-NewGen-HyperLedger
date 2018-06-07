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
}
