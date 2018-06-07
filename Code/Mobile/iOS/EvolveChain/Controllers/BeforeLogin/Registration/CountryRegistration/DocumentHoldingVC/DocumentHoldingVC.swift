//
//  DocumentHoldingVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 06/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class DocumentHoldingVC: UIViewController,UIImagePickerControllerDelegate,UINavigationControllerDelegate {

    @IBOutlet weak var lblOTP: UILabel!
    @IBOutlet weak var lblHelText: UILabel!
    @IBOutlet weak var imgPic: UIImageView!
    
    var holdingImage : UIImage?
    
    var completionHandler: (Int)->Void = {_ in }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //MARK: - Custom Actions
    
    func permissionCheckGallery() {
        GlobalMethods.sharedInstance.checkForGalleryPermission(success: {
            DispatchQueue.main.async {
                self.openGallery()
            }
        }) {
            
        }
    }
    
    func openGallery()
    {
        let imagePicker = UIImagePickerController()
        imagePicker.delegate = self
        imagePicker.sourceType = UIImagePickerControllerSourceType.photoLibrary
        imagePicker.allowsEditing = false
        self.present(imagePicker, animated: true, completion: nil)
    }
    
    //MARK: - Actions
    
    @IBAction func actionSelectImage(_ sender: Any) {
        self.view.endEditing(true)
        self.permissionCheckGallery()
    }
    
    @IBAction func actionSave(_ sender: Any) {
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
