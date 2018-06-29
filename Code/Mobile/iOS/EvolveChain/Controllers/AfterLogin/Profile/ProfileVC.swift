//
//  ProfileVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class ProfileVC: UIViewController,UITableViewDelegate,UITableViewDataSource,UITextFieldDelegate,BackSpaceTextFieldDelegate {
    
    
    @IBOutlet weak var tblvwProfile: UITableView!
    
    @IBOutlet weak var txtfldEmail: UITextField!
    @IBOutlet weak var imgUser: UIImageView!
    @IBOutlet weak var imgUserBg: UIImageView!
    @IBOutlet weak var lblEmail: UILabel!
    
    @IBOutlet var arrView: [UIView]!
    
    @IBOutlet weak var vwPhone: UIView!
    @IBOutlet weak var txtfldPhone: NoCursorTextfield!
    @IBOutlet weak var vwEmail: UIView!
    @IBOutlet weak var bottomEmailView: NSLayoutConstraint!
    @IBOutlet weak var lblDob: UILabel!
    @IBOutlet weak var lblPOB: UILabel!
    @IBOutlet weak var lblPhone: UILabel!
    @IBOutlet weak var lblUserAddressCompact: UILabel!
    @IBOutlet weak var lblUserName: UILabel!
    
    @IBOutlet weak var bottomPhoneView: NSLayoutConstraint!
    @IBOutlet weak var txtfldCountryCode: UITextField!
    
    @IBOutlet weak var btnGetCountry: UIButton!

    
    var selectedCountry : CountryModel?
    
    var countryArray : [CountryModel] = []
    
    var pickerClass : PickerClass = PickerClass.init()
    
   
    
    override func viewDidLoad() {
        super.viewDidLoad()
       
        tblvwProfile.register(UINib(nibName: "ProfileType1Cell", bundle: nil), forCellReuseIdentifier: "ProfileType1Cell")
        tblvwProfile.delegate = self
        tblvwProfile.dataSource = self
        txtfldPhone.backDelegate = self
        // Do any additional setup after loading the view.
        addShadow(viewToChange: arrView.first!)
        addShadow(viewToChange: arrView.last!)
        
        updateUI()
        
        if SignupConfigModel.shared.arrCountryList.count > 0{
            countryArray = SignupConfigModel.shared.arrCountryList
            self.btnGetCountry.isUserInteractionEnabled = false
            self.setupCountryCode()
        }
        else{
            getCountryList()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
       
        lblPhone.text = BasicDetailsModel.shared.getCompletePhoneNumber()
       
       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
       
        // Dispose of any resources that can be recreated.
    }
     // MARK: - Custom Methods
    
    func updateUI()  {
//        getCountryList()
//        countryArray = Country.getCountryList()
//        setupCountryCode()
        
        lblUserName.text = BasicDetailsModel.shared.getCompleteName()
        
        lblUserAddressCompact.text =  BasicDetailsModel.shared.kycId + "\n" + BasicDetailsModel.shared.gender
        
        lblEmail.text = BasicDetailsModel.shared.email
        lblPhone.text = BasicDetailsModel.shared.getCompletePhoneNumber()
        txtfldCountryCode.text = "+" + BasicDetailsModel.shared.countryCode
        if BasicDetailsModel.shared.dob != nil{
            lblDob.text = BasicDetailsModel.shared.dob?.localDateWithStringFormat("MMM dd, yyyy")

        }
        else{
            lblDob.text = ""
        }
        
        lblPOB.text = BasicDetailsModel.shared.placeOfBirth
        
        if let url = URL(string: BasicDetailsModel.shared.userImageURL) {
           imgUser.downloadImage(url: url)
            imgUserBg.downloadImage(url: url)
        }
        
    }
    
    
    func setupCountryCode()  {
        
        self.selectedCountry = self.countryArray[0]
        self.txtfldCountryCode.text = "+" + self.selectedCountry!.phoneCode
        
        var arrList = [String]()
        
        for item in countryArray{
            arrList.append(item.name + " (+" + item.phoneCode + ")")
        }
        
        txtfldCountryCode.inputView = pickerClass.setUpPicker(customList: arrList)
        txtfldCountryCode.inputAccessoryView = pickerClass.setUpToolbar()
        
        pickerClass.doneBlock = {
            (index ) in
            if self.selectedCountry?.iso !=  self.countryArray[index].iso{
                self.txtfldCountryCode.text = "+" + self.countryArray[index].phoneCode
                self.selectedCountry = self.countryArray[index]
                if self.txtfldPhone.text!.count > 0{
                    let text = String.init(stringLiteral: self.txtfldPhone.text!)
                    self.txtfldPhone.text = ""
                    self.txtfldPhone.text = self.changeTextFormatting(newString: text)
                }
            }
            self.txtfldCountryCode.resignFirstResponder()
            
            self.txtfldPhone.becomeFirstResponder()
        }
        
        pickerClass.cancelBlock = {
            self.txtfldCountryCode.resignFirstResponder()
        }
    }
    
    func changeTextFormatting(newString:String) -> String {

        var text = txtfldPhone.text!
        let formatText = selectedCountry?.phoneFormat
        let result = newString.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined()

        for (index, char) in result.enumerated() {

            if text.count < formatText!.count{
                text.append(char)
                if text.count < formatText!.count{
                    let indexNext = formatText?.index((formatText?.startIndex)!, offsetBy: text.count )

                    if formatText![indexNext!] == "-"{
                        text.append("-")
                    }
                }
            }
        }

        return text
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
    
    // MARK: - Validation Methods

    
    func checkEmailValidations() -> Bool {
        
        if txtfldEmail.text!.isEmpty {
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.EmailEmpty)
//            hideEmailView()
//            self.view.endEditing(true)
            txtfldEmail.animatePlaceholderColor()
            txtfldEmail.becomeFirstResponder()
            return false;
        }
        else if !Util.shared.isValidEmail(testStr: txtfldEmail.text!){
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.EmailInvalid)
            return false;
        }
        else if BasicDetailsModel.shared.email == txtfldEmail.text?.lowercased(){
            hideEmailView()
            self.view.endEditing(true)
            return false;
        }
        else{
            return true;
        }
        
    }
    
    func checkPhoneValidations() -> Bool {
        
        if selectedCountry == nil{
            getCountryList()
            return false;
        }
        else if txtfldPhone.text!.isEmpty {
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneEmpty)
//            hidePhoneView()
//            self.view.endEditing(true)
            txtfldPhone.animatePlaceholderColor()
            txtfldPhone.becomeFirstResponder()

            return false;
        }
        else if BasicDetailsModel.shared.contactNumber == txtfldPhone.text && BasicDetailsModel.shared.countryCode == txtfldCountryCode.text?.trimmingCharacters(in: CharacterSet.init(charactersIn: "1234567890").inverted){
            hidePhoneView()
            self.view.endEditing(true)
            return false;
        }
        else if txtfldPhone.text!.count < selectedCountry!.phoneFormat.count {
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneInvalid)
            return false;
        }
        else{
            return true;
        }
    }
    
    // MARK: - Navigation Methods

    
    func moveToPhoneOtpVerify() -> Void {
        
        let verifyOtpObj = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .PhoneVerification
        verifyOtpObj.stringVerifyCountryCode = txtfldCountryCode.text!
        verifyOtpObj.stringVerify = txtfldPhone.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        Util.shared.presentVC(verifyOtpObj)
        
        verifyOtpObj.completionHandler = {
            () -> Void in
            DispatchQueue.main.async {
                self.lblPhone.text = BasicDetailsModel.shared.getCompletePhoneNumber()
                self.hidePhoneView()
            }
        }
    }
    
    func moveToEmailOtpVerify() -> Void {
        
        let verifyOtpObj = FlowManager.shared.getBeforeLoginStoryboard().instantiateViewController(withIdentifier: "VerifyOtpVC") as! VerifyOtpVC
        verifyOtpObj.verificationType = .EmailVerification
        verifyOtpObj.stringVerify = txtfldEmail.text!
        verifyOtpObj.modalPresentationStyle = .overCurrentContext
        Util.shared.presentVC(verifyOtpObj)

        
        verifyOtpObj.completionHandler = {
            () -> Void in
            DispatchQueue.main.async {
                self.lblEmail.text = BasicDetailsModel.shared.email
                self.hideEmailView()
            }
        }
    }
    
//    func openCountryCodePicker() -> Void {
//        self.view.endEditing(true)
//
//        if SignupConfigModel.shared.arrCountryList.count == 0 {
//            getCountryList()
//            return
//        }
//        let customPicker = CustomPickerView.instanceFromNib() as CustomPickerView
//
//        customPicker.frame = CGRect(x: 0, y: 0, width: _screenFrame.width, height: _screenFrame.height)
//
//        let window = UIApplication.shared.keyWindow!
//
//        window.addSubview(customPicker)
//
//        window.bringSubview(toFront: customPicker)
//
//        customPicker.showView()
//
//        customPicker.setUpView(custom: false, customList: [],arrCountry: Country.getCountryList())
//
//        customPicker.completionCountry = {
//            (country ) in
//            self.selectedCountry = country
//            self.txtfldCountryCode.text = "+" + country.phoneCode
//            self.txtfldPhone.becomeFirstResponder()
//        }
//    }
    
    // MARK: - Process Methods

    
    func processCountryResponse(responseJson:Array<Any>)  {
        
        SignupConfigModel.shared.initCountryList(response: responseJson)
        
        countryArray = SignupConfigModel.shared.arrCountryList
        
        if countryArray.count > 0{
            DispatchQueue.main.async {
                self.btnGetCountry.isUserInteractionEnabled = false
                self.setupCountryCode()
                if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
                {
                    if let isdCode = _userDefault.object(forKey: kUserISDCodeKey) as? String{
                        for country in self.countryArray{
                            if isdCode == country.phoneCode{
                                self.selectedCountry = country
                                self.txtfldCountryCode.text = "+" + (self.selectedCountry?.phoneCode)!
                            }
                        }
                    }
                }
                else{
                    //                    self.txtfldCountryCode.becomeFirstResponder()
                }
            }
        }
    }
    
    //MARK: - Textfield
    
    func textFieldDidDelete(textfield: UITextField) {

        if textfield.tag == 10 {
            var text = textfield.text

            if text?.last == "-" {
                text?.removeLast()
                textfield.text = text
                //                textfield.text = changeTextToStar(stringToChange: kycIdText)
            }
        }
    }
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.tag == 10 {
            
            if string == "" || selectedCountry == nil{
                return true
            }
            
            let formatText = selectedCountry?.phoneFormat
            
            if formatText?.count == 0{
                return true
            }
            if textField.text?.count == formatText?.count{
                return false
            }
            
            if string.count == 1{
                
                if "1234567890".contains(string.first!){
                    var text = textField.text! + string
                    
                    if text.count < (formatText?.count)!{
                        let indexNext = formatText?.index((formatText?.startIndex)!, offsetBy: text.count )
                        
                        if formatText![indexNext!] == "-"{
                            text.append("-")
                        }
                    }
                    txtfldPhone.text = text
                    
                }
            }
            else{
                txtfldPhone.text = changeTextFormatting(newString: string)
            }
            
            
            return false
        }
        
       
        return true
        
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
        txtfldEmail.text = ""
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
        txtfldPhone.text = ""
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
        Util.shared.pushVC(settingsVC!)
    }
    
    @IBAction func actionEditEmail(_ sender: Any) {
        showEmailView()
//        GlobalMethods.shared.underDevelopmentAlert()
    }
    
    @IBAction func actionAddEmail(_ sender: Any) {
        if checkEmailValidations(){
            self.view.endEditing(true)
            APIGetEMailOtp(email: txtfldEmail.text!.lowercased())
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
           let phone = (txtfldPhone.text?.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined())!
            APIGetPhoneOtp(countryCode: result!,phoneNumner: phone)
        }
    }
    
    @IBAction func actionSelectCountryCode(_ sender: Any) {
        self.view.endEditing(true)
        
        if SignupConfigModel.shared.arrCountryList.count == 0 {
            getCountryList()

        }
        else{
            txtfldCountryCode.becomeFirstResponder()
        }

    }
    
    // MARK: - Webservice
    
    func APIGetPhoneOtp(countryCode:String,phoneNumner:String) -> Void {
        
        
        Util.shared.showLoader(loadingText: StringConstants.OTPLoader)
        let params = ["mobile":phoneNumner,"country_code":countryCode]
        
        
        NetworkManager.shared.generateMobileOTP(params: params, success: { (responseDict) in
            Util.shared.dismissLoader(complete: {
                self.moveToPhoneOtpVerify()
            })
            
        }) { (errorMsg) in
            Util.shared.dismissLoader(complete: {
                Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
            })
            
        }
    }
    
    func APIGetEMailOtp(email:String) -> Void {
        
        let params = ["email":email]
        Util.shared.showLoader(loadingText: StringConstants.OTPLoader)
        NetworkManager.shared.generateEmailOTP(params: params, success: { (responseDict) in
            Util.shared.dismissLoader(complete: {
                self.moveToEmailOtpVerify()
            })
            
        }) { (errorMsg) in
            Util.shared.dismissLoader(complete: {
                Util.shared.showAlert(alertTitle: StringConstants.AppName, alertText: errorMsg!)
            })
        }
    }
    
    func getCountryList() {

        NetworkManager.shared.countryListAPI(success: { (response) in
                self.processCountryResponse(responseJson: response)
        }) { (errorMsg) in
                Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
    
}
