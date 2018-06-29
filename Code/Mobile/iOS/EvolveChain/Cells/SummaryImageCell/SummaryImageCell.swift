//
//  SummaryImageCell.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 29/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//
struct SummaryStruct {
    var imageTop : UIImage?
    var imageBottom : UIImage?
    var text : String
    var type : SummaryCellType
    var isExpanded : Bool
}

enum SummaryCellType : String {
    case  BasicCell
    case  NoImageCell
    case HeaderCell
    case TwoImageCell
    case OneImageCell
}

import UIKit

class SummaryImageCell: UITableViewCell {

    @IBOutlet weak var constraintHeightImageTop: NSLayoutConstraint!
    @IBOutlet weak var constraintHeightImageBottom: NSLayoutConstraint!

    @IBOutlet weak var constraintWidthImageTop: NSLayoutConstraint!
    @IBOutlet weak var constraintWidthImageBottom: NSLayoutConstraint!

    @IBOutlet weak var constraintLeadingLabel: NSLayoutConstraint!
    @IBOutlet weak var imgPhotoTop: UIImageView!
    @IBOutlet weak var imgPhotoBottom: UIImageView!

    @IBOutlet weak var lblText: UILabel!
    
     // MARK: - Custom Methods
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
     // MARK: - Custom Methods
    
    func setupCell(data:SummaryStruct ) {
        setupUI(cellType: data.type)
        lblText.text = data.text
        setupImage(data: data)
    }
    
    fileprivate func setupImage(data:SummaryStruct){
        if data.type == .BasicCell {
            imgPhotoTop.image = data.imageTop
            imgPhotoBottom.image = nil
        }
        else if data.type == .TwoImageCell{
            imgPhotoTop.image = data.imageTop
            imgPhotoBottom.image = data.imageBottom
        }
        else if data.type == .NoImageCell{
            imgPhotoTop.image = nil
            imgPhotoBottom.image = nil
        }
        else if data.type == .OneImageCell{
            imgPhotoTop.image = data.imageTop
            imgPhotoBottom.image = nil
        }
    }
    
    fileprivate func setupUI(cellType:SummaryCellType){
        if cellType == .BasicCell {
            constraintWidthImageTop.constant = 100.0
            constraintHeightImageTop.constant = 100.0
            
            constraintWidthImageBottom.constant = 100.0
            constraintHeightImageBottom.constant = 0.0
            
            constraintLeadingLabel.constant = 5.0
            
            imgPhotoTop.contentMode = .scaleAspectFill
            imgPhotoTop.cornerRadius = 5.0
            
            imgPhotoTop.borderWidth = 0.0
            imgPhotoTop.borderColor = UIColor.clear
            
            imgPhotoBottom.cornerRadius = 0.0
            imgPhotoBottom.borderWidth = 0.0
            imgPhotoBottom.borderColor = UIColor.clear
            
        }
        else if cellType == .TwoImageCell{
            constraintWidthImageTop.constant = 50.0
            constraintHeightImageTop.constant = 50.0
            
            constraintWidthImageBottom.constant = 50.0
            constraintHeightImageBottom.constant = 50.0
            
            constraintLeadingLabel.constant = 5.0
            
            imgPhotoTop.contentMode = .scaleAspectFill
            imgPhotoTop.cornerRadius = 5.0
            imgPhotoTop.borderWidth = 1.0
            imgPhotoTop.borderColor = UIColor.init(red: 220, green: 220, blue: 220, alpha: 0.5)
            
            imgPhotoBottom.contentMode = .scaleAspectFill
            imgPhotoBottom.cornerRadius = 5.0
            imgPhotoBottom.borderWidth = 1.0
            imgPhotoBottom.borderColor = UIColor.init(red: 220, green: 220, blue: 220, alpha: 0.5)
        }
        else if cellType == .NoImageCell{
            constraintWidthImageTop.constant = 0.0
            constraintHeightImageTop.constant = 0.0
            
            constraintWidthImageBottom.constant = 0.0
            constraintHeightImageBottom.constant = 0.0
            
            constraintLeadingLabel.constant = 0.0
            
            imgPhotoBottom.cornerRadius = 0.0
            imgPhotoBottom.borderWidth = 0.0
            imgPhotoBottom.borderColor = UIColor.clear
            
            imgPhotoTop.cornerRadius = 0.0
            imgPhotoTop.borderWidth = 0.0
            imgPhotoTop.borderColor = UIColor.clear
            
        }
        else if cellType == .OneImageCell{
            constraintWidthImageTop.constant = 50.0
            constraintHeightImageTop.constant = 50.0
            
            constraintWidthImageBottom.constant = 50.0
            constraintHeightImageBottom.constant = 0.0
            
            constraintLeadingLabel.constant = 5.0
            
            imgPhotoTop.contentMode = .scaleAspectFill
            imgPhotoTop.cornerRadius = 5.0
            imgPhotoTop.borderWidth = 1.0
            imgPhotoTop.borderColor = UIColor.init(red: 220, green: 220, blue: 220, alpha: 0.5)
            
            imgPhotoBottom.cornerRadius = 0.0
            imgPhotoBottom.borderWidth = 0.0
            imgPhotoBottom.borderColor = UIColor.clear
        }
    }
    
     // MARK: - Actions
    
    @IBAction func actionTopImageopen(_ sender: Any) {
        if imgPhotoTop.image != nil{
            let imageViewer = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "ImageViewerVC") as! ImageViewerVC
            
            imageViewer.setImage(photo: imgPhotoTop.image!)
            
            Util.shared.presentVC(imageViewer)
        }
    }
    
    @IBAction func actionBottomImageOpen(_ sender: Any) {
        if imgPhotoBottom.image != nil{
            let imageViewer = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "ImageViewerVC") as! ImageViewerVC
            
            imageViewer.setImage(photo: imgPhotoBottom.image!)
            
            Util.shared.presentVC(imageViewer)
        }
    }
}
