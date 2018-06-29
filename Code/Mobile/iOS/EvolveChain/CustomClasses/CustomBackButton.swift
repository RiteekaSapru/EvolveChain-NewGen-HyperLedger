//
//  CustomBackButton.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 16/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class CustomBackButton: UIButton {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

    override init(frame: CGRect) {
        super.init(frame: frame)
        addBackAction()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        addBackAction()
    }
    private func addBackAction() {
        
        self.addTarget(self, action: #selector(backAction), for: .touchUpInside)
       
    }
    
   @objc  func backAction() -> Void {
       Util.shared.popVC()
    }
}
