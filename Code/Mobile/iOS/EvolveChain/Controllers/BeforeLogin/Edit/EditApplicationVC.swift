//
//  EditApplicationVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 11/06/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class EditApplicationVC: UIViewController,BackSpaceTextFieldDelegate,UITextFieldDelegate {

    @IBOutlet weak var tblvwEdit: UITableView!
    
    @IBOutlet weak var vwOTP: UIView!
    @IBOutlet weak var txtfldPhone: NoCursorTextfield!
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    @IBOutlet weak var txtfldCountryCode: UITextField!
    
    @IBOutlet weak var btnSend: UIButton!
    @IBOutlet weak var vwOTPHolder: UIView!
    
    @IBOutlet weak var btnGetCountry: UIButton!

    
    var selectedCountry : CountryModel?
    var timerOtp : Timer?
    var secCount : Int = 60
    @IBOutlet weak var btnResend: UIButton!
    var countryArray : [CountryModel] = []
    
    var pickerClass : PickerClass = PickerClass.init()

    var appKey : String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        txtfldPhone.backDelegate = self
        vwOTP.alpha = 0;
        if SignupConfigModel.sharedInstance.arrCountryList.count > 0{
            countryArray = SignupConfigModel.sharedInstance.arrCountryList
            self.btnGetCountry.isUserInteractionEnabled = false
            self.setupCountryCode()
        }
        else{
            getCountryList()
        }
        
//        setUpCells()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        txtfldPhone.becomeFirstResponder()
    }
    
    // MARK: - Custom Methods

    func processCountryResponse(responseJson:Array<Any>)  {
        
//        countryArray.removeAll()
//
//        for item in responseJson{
//            let model = CountryModel.init()
//            model.initWithDictionary(countryDict: RawdataConverter.dictionary(item)!)
//            countryArray.append(model)
//        }
        
        SignupConfigModel.sharedInstance.initCountryList(response: responseJson)
        
        countryArray = SignupConfigModel.sharedInstance.arrCountryList

        
        if SignupConfigModel.sharedInstance.arrCountryList.count > 0{
            DispatchQueue.main.async {
                self.btnGetCountry.isUserInteractionEnabled = false
                self.setupCountryCode()
            }
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
            if self.selectedCountry?.phoneCode !=  self.countryArray[index].phoneCode{
                self.txtfldCountryCode.text = "+" + self.countryArray[index].phoneCode
                self.selectedCountry = self.countryArray[index]
                self.changeVisibility(alpha: 0.0)
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
    func clearPin()  {
        txtfld1.text = ""
        txtfld2.text = ""
        txtfld3.text = ""
        txtfld4.text = ""
        txtfld5.text = ""
        txtfld6.text = ""
        
    }
    
    func getPIN() -> String {
        let otpStr = txtfld1.text!+txtfld2.text!+txtfld3.text!+txtfld4.text!+txtfld5.text!+txtfld6.text!
        
        return otpStr
    }
    
    func shakeView(viewToShake:UIView)  {
        let animation = CABasicAnimation(keyPath: "position")
        animation.duration = 0.07
        animation.repeatCount = 4
        animation.autoreverses = true
        animation.fromValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x - 5, y: viewToShake.center.y))
        animation.toValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x + 5, y: viewToShake.center.y))
        
        viewToShake.layer.add(animation, forKey: "position")
    }
    
    func changeVisibility(alpha:CGFloat)  {
        
        btnSend.isEnabled = (alpha == 0.0)
        
        UIView.animate(withDuration: 0.3, animations: {
            self.vwOTP.alpha = alpha

        }) { (status) in
            if status && alpha == 1.0{
                self.txtfld1.becomeFirstResponder()
                 self.clearPin()
            }
            else if status && alpha == 0.0{
                self.stopTimer()
               
            }
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
    
    //MARK: - Timer
    
    func startTimer() -> Void {
        timerOtp?.invalidate()
        timerOtp = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(updateResendBtn), userInfo: nil, repeats: true)
    }
    func stopTimer() {
        timerOtp?.invalidate()
        btnResend.setTitle("Resend in 01:00", for: .normal)

    }
   
    
    @objc func updateResendBtn() -> Void {
        if secCount <= 0 {
            timerOtp?.invalidate()
            secCount = 60
            btnResend.isUserInteractionEnabled = true
            btnResend.backgroundColor = UIColor.init(red: 74.0/255.0, green: 177.0/255.0, blue: 157.0/255.0, alpha: 1.0)
            btnResend.setTitle("Resend", for: .normal)
        }
        else {
            
            secCount = secCount - 1
            btnResend.isUserInteractionEnabled = false
            btnResend.backgroundColor = UIColor.lightGray
            if secCount < 10
            {
                btnResend.setTitle("Resend in 00:0" + String(secCount), for: .normal)
            }
            else{
                btnResend.setTitle("Resend in 00:" + String(secCount), for: .normal)
            }
            
        }
    }
    
    //MARK: - Validations
    
    func checkPinValidation() -> Bool {
         if getPIN().count < 6{
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PinEmpty)
            self.clearPin()
            self.shakeView(viewToShake: self.vwOTPHolder)
            self.txtfld1.becomeFirstResponder()
            return false;
        }
        return true
    }
    
    func checkPhoneValidations() -> Bool {
        if selectedCountry == nil{
            getCountryList()
            return false;
        }
        else if txtfldPhone.text?.count == 0 {
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneEmpty)
            txtfldPhone.becomeFirstResponder()
            return false;
        }
        else if txtfldPhone.text!.count < selectedCountry!.phoneFormat.count {
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneInvalid)
            return false;
        }
        else{
            return true;
        }
    }
    
    //MARK: - Textfield
    
    func textFieldDidDelete(textfield: UITextField) {
       
        if textfield.tag == 0 {
            var text = textfield.text
            
            if text?.last == "-" {
                text?.removeLast()
                textfield.text = text
                //                textfield.text = changeTextToStar(stringToChange: kycIdText)
            }
        }
        else if textfield.text!.count < 1 {
            let previousTag = textfield.tag - 1
            if previousTag > 6{
                let previousResponder = self.view?.viewWithTag(previousTag) as! BackSpaceTextfield
                previousResponder.text = ""
                previousResponder.becomeFirstResponder()
            }
        }
    }
    
    func textFieldShouldClear(_ textField: UITextField) -> Bool {
        changeVisibility(alpha: 0.0)
        return true
    }
    
//    func textFieldShouldReturn(_ textField: UITextField) -> Bool
//    {
//        // Try to find next responder
//        if let nextField = self.view.viewWithTag(textField.tag + 1) as? UITextField {
//            nextField.becomeFirstResponder()
//        }
//        else if textField.tag == 0{
//            //Validate and call API
//           txtfld1.becomeFirstResponder()
//        }
//        else {
//            // Not found, so remove keyboard.
//            txtfld1.becomeFirstResponder()
//        }
//        // Do not add a line break
//        return false
//    }
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.tag == 0 {
            changeVisibility(alpha: 0.0)
            if string == "" {
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
//            return true
        }
        
        if textField.text!.count < 1  && string.count > 0{
            let nextTag = textField.tag + 1
            
            // get next responder
            var nextResponder = self.view?.viewWithTag(nextTag)
            
            if (nextResponder == nil){
                
                nextResponder = textField.superview?.viewWithTag(1)
            }
            textField.text = string
            if nextTag == 13 {
                //call Validate
                textField.resignFirstResponder()
                if checkPinValidation(){
                    resubmitInitialiseOTP()
                }
            }
            else{
                nextResponder?.becomeFirstResponder()
                let textfldNext = nextResponder as! UITextField
                textfldNext.text = ""
                
            }
            
            
            return false
        }
        return true
        
    }
    
    // MARK: - Actions

    @IBAction func actionNext(_ sender: Any) {
        if checkPinValidation(){
            resubmitInitialiseOTP()
        }
    }
    

    @IBAction func actionSend(_ sender: Any) {
        if checkPhoneValidations() {
            self.view.endEditing(true)
            generateOTP()
        }
    }
    
    @IBAction func actionResend(_ sender: Any) {
        if checkPhoneValidations() {
            self.view.endEditing(true)
            generateOTP()
        }
    }
    
    @IBAction func actionFetchCountry(_ sender: Any) {
        getCountryList()
    }
    
    // MARK: - Response
    
    func processGetOTP(responseJSON:Dictionary<String,Any>)  {
        
        appKey = RawdataConverter.string(responseJSON["key"])
        startTimer()
        changeVisibility(alpha: 1.0)
    }
    
    func processResubmitResponse(responseJSON:Dictionary<String,Any>)  {
        
//        DispatchQueue.gl
        DispatchQueue.global(qos: .default).async {
             GlobalMethods.sharedInstance.processEditResponse(responesJSON: responseJSON)
        }
    }
    
    //MARK: - Webservice

    func generateOTP() {
        
        let params = ["mobile":txtfldPhone.text!,"isd_code":selectedCountry!.phoneCode,"vendor_uuid":GlobalMethods.sharedInstance.getUniqueIdForDevice()] as [String : Any]
        
        NetworkManager.sharedInstance.getEditOTPAPI(params: params, success: { (responseJSON) in
            DispatchQueue.main.async {
                self.processGetOTP(responseJSON: responseJSON)
            }
        }) { (errorMsg, data) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)

        }
    }
    
    func resubmitInitialiseOTP() {
        
        let params = ["resubmit_pin":GlobalMethods.sharedInstance.convertToMD5(string: getPIN()),"vendor_uuid":GlobalMethods.sharedInstance.getUniqueIdForDevice(),"appkey":appKey]
        
        NetworkManager.sharedInstance.verifyEditOTPAPI(params: params, success: { (responseJSON) in
            DispatchQueue.main.async {
                GlobalMethods.sharedInstance.showLoader(loadingText: "   Loading Data...")
                self.processResubmitResponse(responseJSON: responseJSON)
            }
        }) { (errorMsg, data) in
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)

        }
    }
    
    func getCountryList() {
        NetworkManager.sharedInstance.countryListAPI(success: { (response) in
            self.processCountryResponse(responseJson: response)
        }) { (errorMsg) in
            DispatchQueue.main.async {
                self.btnGetCountry.isUserInteractionEnabled = true
            }
            
            GlobalMethods.sharedInstance.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
}