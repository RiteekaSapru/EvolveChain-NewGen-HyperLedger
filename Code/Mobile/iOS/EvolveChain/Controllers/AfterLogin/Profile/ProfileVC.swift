//
//  ProfileVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ProfileVC: UIViewController,UITableViewDelegate,UITableViewDataSource,UITextFieldDelegate {
    
    
    @IBOutlet weak var tblvwProfile: UITableView!
    
    @IBOutlet weak var txtfldEmail: UITextField!
    @IBOutlet weak var imgUser: UIImageView!
    @IBOutlet weak var imgUserBg: UIImageView!
    @IBOutlet weak var lblEmail: UILabel!
    
    @IBOutlet var arrView: [UIView]!
    
    @IBOutlet weak var vwPhone: UIView!
    @IBOutlet weak var txtfldPhone: UITextField!
    @IBOutlet weak var vwEmail: UIView!
    @IBOutlet weak var bottomEmailView: NSLayoutConstraint!
    @IBOutlet weak var lblDob: UILabel!
    @IBOutlet weak var lblPOB: UILabel!
    @IBOutlet weak var lblPhone: UILabel!
    @IBOutlet weak var lblUserAddressCompact: UILabel!
    @IBOutlet weak var lblUserName: UILabel!
    
    @IBOutlet weak var bottomPhoneView: NSLayoutConstraint!
    @IBOutlet weak var txtfldCountryCode: UITextField!
    
    var selectedCountry : Country?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tblvwProfile.register(UINib(nibName: "ProfileType1Cell", bundle: nil), forCellReuseIdentifier: "ProfileType1Cell")
        tblvwProfile.delegate = self
        tblvwProfile.dataSource = self
        
        // Do any additional setup after loading the view.
        addShadow(viewToChange: arrView.first!)
        addShadow(viewToChange: arrView.last!)
        
        updateUI()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
       
        lblPhone.text = BasicDetailsModel.sharedInstance.getCompletePhoneNumber()
        
       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
       
        // Dispose of any resources that can be recreated.
    }
     // MARK: - Custom Methods
    
    func updateUI()  {
        
        lblUserName.text = BasicDetailsModel.sharedInstance.getCompleteName()
        
        lblUserAddressCompact.text = _userDefault.object(forKey: kApplicationKycIdKey) as? String
        
        lblEmail.text = BasicDetailsModel.sharedInstance.email
        lblPhone.text = BasicDetailsModel.sharedInstance.getCompletePhoneNumber()
        txtfldCountryCode.text = "+" + BasicDetailsModel.sharedInstance.countryCode
//        lblEmail.text = "abhay.shankar@newgen.co.in"
        
        lblDob.text = BasicDetailsModel.sharedInstance.dob.localDateWithStringFormat("dd-MM-yyyy")
        
        lblPOB.text = BasicDetailsModel.sharedInstance.placeOfBirth
        
        if let url = URL(string: BasicDetailsModel.sharedInstance.userImageURL) {
           imgUser.downloadImage(url: url)
            imgUserBg.downloadImage(url: url)
        }
        
    }
    
    func addShadow(viewToChange:UIView)  {
        viewToChange.clipsToBounds = false
        let shadowLayer = CAShapeLayer()
        shadowLayer.path = UIBezierPath(roundedRect: viewToChange.bounds, cornerRadius: 3).cgPath
        shadowLayer.fillColor = UIColor.white.cgColor
        
        shadowLayer.shadowColor = UIColor.darkGray.cgColor
        shadowLayer.shadowPath = shadowLayer.path
        shadowLayer.shadowOffset = CGSize(width: 1.0, height: 1.5)
        shadowLayer.shadowOpacity = 0.4
        shadowLayer.shadowRadius = 0.7
        
        viewToChange.layer.insertSublayer(shadowLayer, at: 0)
    }
    
    func checkEmailValidations() -> Bool {
        
        if txtfldEmail.text?.count == 0 {
//            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailEmpty)
            hideEmailView()
            self.view.endEditing(true)
            return false;
        }
        else if !GlobalMethods.sharedInstance.isValidEmail(testStr: txtfldEmail.text!){
            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringEmailInvalid)
            return false;
        }
        else if BasicDetailsModel.sharedInstance.email == txtfldEmail.text{
            hideEmailView()
            self.view.endEditing(true)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func checkPhoneValidations() -> Bool {
        
        if txtfldPhone.text?.count == 0 {
//            GlobalMethods.sharedInstance.showAlert(alertTitle: stringError, alertText: stringPhoneEmpty)
            hidePhoneView()
            self.view.endEditing(true)
            return false;
        }
        else if BasicDetailsModel.sharedInstance.contactNumber == txtfldPhone.text && BasicDetailsModel.sharedInstance.countryCode == txtfldCountryCode.text{
            hidePhoneView()
            self.view.endEditing(true)
            return false;
        }
        else{
            return true;
        }
    }
    
    func moveToPhoneOtpVerify() -> Void {
        
        let verifyOtpObj = FlowManager.sharedInstance.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .PhoneVerification
        verifyOtpObj.stringVerifyCountryCode = txtfldCountryCode.text!
        verifyOtpObj.stringVerify = txtfldPhone.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        _navigator.present(verifyOtpObj, animated: true, completion: nil)
        
        verifyOtpObj.completionHandler = {
            () -> Void in
            DispatchQueue.main.async {
                self.lblPhone.text = BasicDetailsModel.sharedInstance.getCompletePhoneNumber()
                self.hidePhoneView()
            }
        }
    }
    
    func moveToEmailOtpVerify() -> Void {
        
        let verifyOtpObj = FlowManager.sharedInstance.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .EmailVerification
        verifyOtpObj.stringVerify = txtfldEmail.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        
        _navigator.present(verifyOtpObj, animated: true, completion: nil)
        
        verifyOtpObj.completionHandler = {
            () -> Void in
            DispatchQueue.main.async {
                self.lblEmail.text = BasicDetailsModel.sharedInstance.email
                self.hideEmailView()
            }
        }
    }
    
    func openCountryCodePicker() -> Void {
        self.view.endEditing(true)
        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
        
        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
        
        let window = UIApplication.shared.keyWindow!
        
        window.addSubview(customPicker)
        
        window.bringSubview(toFront: customPicker)
        
        customPicker.showView()
        
        customPicker.setUpView(custom: false, customList: [],arrCountry: Country.getCountryList())
        
        customPicker.completionCountry = {
            (country ) in
            self.selectedCountry = country
            self.txtfldCountryCode.text = "+" + country.phoneCode
            self.txtfldPhone.becomeFirstResponder()
        }
    }
    // MARK: - Tableview
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "ProfileType1Cell", for: indexPath) as! ProfileType1Cell
        cell.setupCell()
        return cell;
    
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
//        if textField.tag == 10{
//            textField.resignFirstResponder()
//            self.actionPickerAddCountry(UIButton())
//            return false
//        }
        // Try to find next responder
        if let nextField = self.view.viewWithTag(textField.tag + 1) as? UITextField {
            nextField.becomeFirstResponder()
        } else {
            // Not found, so remove keyboard.
            textField.resignFirstResponder()
        }
        // Do not add a line break
        return false
    }
    // MARK: - Animations
    
    func showEmailView() {
        hidePhoneView()
        vwEmail.alpha = 0;
        bottomEmailView.constant = 0
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
            self.vwEmail.alpha = 1;
        }
        txtfldEmail.becomeFirstResponder()
    }
    
    func hideEmailView() {
        
        bottomEmailView.constant = -50
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
            self.vwEmail.alpha = 0;
        }
        txtfldEmail.resignFirstResponder()
    }
    
    func showPhoneView() {
        vwPhone.alpha = 0;
        hideEmailView()
        bottomPhoneView.constant = 0
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
            self.vwPhone.alpha = 1;
        }
        txtfldPhone.becomeFirstResponder()
    }
    
    func hidePhoneView() {
        bottomPhoneView.constant = -50
        UIView.animate(withDuration: 0.3) {
            self.view.layoutIfNeeded()
            self.vwPhone.alpha = 0;
        }
        txtfldPhone.resignFirstResponder()
    }
 
    
    // MARK: - Actions
    
    
    @IBAction func actionSettings(_ sender: Any) {
        
        let settingsVC = self.storyboard?.instantiateViewController(withIdentifier: "SettingsVC")
        GlobalMethods.sharedInstance.pushVC(settingsVC!)
    }
    
    @IBAction func actionEditEmail(_ sender: Any) {
        showEmailView()
//        GlobalMethods.sharedInstance.underDevelopmentAlert()
    }
    
    @IBAction func actionAddEmail(_ sender: Any) {
        if checkEmailValidations(){
            self.view.endEditing(true)
            APIGetEMailOtp(email: txtfldEmail.text!)
        }
    }
    
    @IBAction func actionCloseEmail(_ sender: Any) {
        hideEmailView()
    }
    
    @IBAction func actionPhoneEdit(_ sender: Any) {
        showPhoneView()
    }
    
    @IBAction func actionClosePhone(_ sender: Any) {
        hidePhoneView()
    }
    
    @IBAction func actionAddPhone(_ sender: Any) {
        if checkPhoneValidations(){
            self.view.endEditing(true)
            let result = txtfldCountryCode.text?.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted)
            
            APIGetPhoneOtp(countryCode: result!,phoneNumner: txtfldPhone.text!)
        }
    }
    
    @IBAction func actionSelectCountryCode(_ sender: Any) {
        openCountryCodePicker()
    }
    // MARK: - Webservice
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Sending OTP...")
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        NetworkManager.sharedInstance.generateMobileOTP(params: params, success: { (responseDict) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                self.moveToPhoneOtpVerify()
            })
            
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
            })
            
        }
    }
    
    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        GlobalMethods.sharedInstance.showLoader(loadingText: "   Sending OTP...")
        NetworkManager.sharedInstance.generateEmailOTP(params: params, success: { (responseDict) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                self.moveToEmailOtpVerify()
            })
            
        }) { (errorMsg) in
            GlobalMethods.sharedInstance.dismissLoader(complete: {
                GlobalMethods.sharedInstance.showAlert(alertTitle: stringAppName, alertText: errorMsg!)
            })
        }
    }
    
}
