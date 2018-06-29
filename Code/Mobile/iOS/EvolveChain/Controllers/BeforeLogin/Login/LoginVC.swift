//
//  LoginVC.swift
//  EvolveChain
//
//  Created by Abhay Shankar on 21/05/18.
//  Copyright © 2018 EvolveChain. All rights reserved.
//

import UIKit

class LoginVC: UIViewController, UITextFieldDelegate,BackSpaceTextFieldDelegate {

//    @IBOutlet weak var txtfldKYCId: NoCursorTextfield!
    @IBOutlet weak var txtfld1: BackSpaceTextfield!
    @IBOutlet weak var txtfld2: BackSpaceTextfield!
    @IBOutlet weak var txtfld3: BackSpaceTextfield!
    @IBOutlet weak var txtfld4: BackSpaceTextfield!
    @IBOutlet weak var txtfld5: BackSpaceTextfield!
    @IBOutlet weak var txtfld6: BackSpaceTextfield!
    @IBOutlet weak var lblTitle: UILabel!
    
    @IBOutlet weak var btnGetCountry: UIButton!
    @IBOutlet weak var txtfldPhone: NoCursorTextfield!
    @IBOutlet weak var txtfldCountryCode: UITextField!
    @IBOutlet weak var btnBack: UIButton!
    @IBOutlet weak var btnLogin: UIButton!
    @IBOutlet weak var vwPinHolder: UIView!
    
    @IBOutlet weak var lblKycId: UILabel!
    @IBOutlet weak var btnGeneratePin: UIButton!
    
    var selectedCountry : CountryModel?
    
    var countryArray : [CountryModel] = []
    
    var pickerClass : PickerClass = PickerClass.init()
    
//    var kycIdText:String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtfld1.backDelegate = self
        txtfld2.backDelegate = self
        txtfld3.backDelegate = self
        txtfld4.backDelegate = self
        txtfld5.backDelegate = self
        txtfld6.backDelegate = self
        txtfldPhone.backDelegate = self
        
//        self.setNeedsStatusBarAppearanceUpdate()
//        txtfldKYCId.backDelegate = self
        
//        setupCountryCode()
        
//        txtfldKYCId.text = changeTextToStar(stringToChange: (_userDefault.object(forKey: kApplicationKycIdKey) as? String)!)
        
//        if (BasicDetailsModel.shared.isBasicDetailsComplete)
//        {
//            setupForPinCheck()
//        }
        
        if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
        {
             btnBack.isHidden = true
            if let phone = _userDefault.object(forKey: kUserPhoneKey) as? String{
                txtfldPhone.text = phone
            }
        }
        if SignupConfigModel.shared.arrCountryList.count > 0{
            countryArray = SignupConfigModel.shared.arrCountryList
            self.btnGetCountry.isUserInteractionEnabled = false
            self.setupCountryCode()
            txtfldPhone.becomeFirstResponder()
        }
        else{
            getCountryList()
        }
//        getCountryList()
//        lblKycId.alpha = 0.0
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        if ((_userDefault.object(forKey: kApplicationPinKey)) != nil)
        {
            txtfld1.becomeFirstResponder()
        }
        else{
//            txtfldPhone.becomeFirstResponder()
        }
    }
    
    
     // MARK: - Custom Methods
    
    
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
    
    func changeTextToStar(stringToChange:String) -> String{
        var hashPassword = String()
        
        for index in 0..<stringToChange.count {
            
            let indexStart = stringToChange.index(stringToChange.startIndex, offsetBy: index)
            let indexEnd = stringToChange.index(stringToChange.startIndex, offsetBy: index+1)
            
            let newString = String(stringToChange[indexStart..<indexEnd])
            
            if index < 3 || index > 13 || newString == "-"{
                
                hashPassword += newString
            }
            else{
                hashPassword += "*"
            }
            
            
        }
        
        return hashPassword
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
    
//    func shakeView(viewToShake:UIView)  {
//        let animation = CABasicAnimation(keyPath: "position")
//        animation.duration = 0.07
//        animation.repeatCount = 4
//        animation.autoreverses = true
//        animation.fromValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x - 5, y: viewToShake.center.y))
//        animation.toValue = NSValue(cgPoint: CGPoint(x: viewToShake.center.x + 5, y: viewToShake.center.y))
//        
//        viewToShake.layer.add(animation, forKey: "position")
//    }
    
    // MARK: - Validation

    
    func checkValidation() -> Bool {
        if selectedCountry == nil{
            getCountryList()
            return false;
        }
        else if txtfldPhone.text!.isEmpty{
            txtfldPhone.animatePlaceholderColor()
//            GlobalMethods.shared.showAlert(alertTitle: StringConstants.Error, alertText:StringConstants.PhoneEmpty)
            txtfldPhone.becomeFirstResponder()
            return false;
        }
        else if txtfldPhone.text!.count < selectedCountry!.phoneFormat.count {
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PhoneInvalid)
            return false;
        }
        else if getPIN().count < 6{
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: StringConstants.PinEmpty)
            self.clearPin()
            self.vwPinHolder.shakeView()
            self.txtfld1.becomeFirstResponder()
            return false;
        }
        else{
            return true
        }
    }
    
    func checkPin() {
        

        let pin = Util.shared.convertToMD5(string: getPIN())
        let mobile = txtfldPhone.text?.components(separatedBy: CharacterSet.init(charactersIn: "1234567890").inverted).joined()

        loginAPI(mobile!, pin)

    }
    
    // MARK: - Process Response

    
    func processResponse(data:Data,errorMsg:String) {
        do {
            if let jsonDict = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? Dictionary<String,Any> {
                let errorCode = RawdataConverter.optionalString(jsonDict["error_code"])
            
                if errorCode == ErrorCode.INCORRECT_EKYCID.rawValue{
                   self.txtfldPhone.text = ""
                    self.clearPin()
//                    self.shakeView(viewToShake: self.txtfldKYCId)
                     self.txtfldPhone.becomeFirstResponder()
                }
                else if errorCode == ErrorCode.INCORRECT_PIN.rawValue{
                    self.clearPin()
                    self.vwPinHolder.shakeView()
                    self.txtfld1.becomeFirstResponder()
                }
                else{
                   Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg)
                }
            }
            else{
            
            }
        }
        catch let error as NSError {
            print(error)
            
        }
    }
    
    
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
    
    
    
 // MARK: - Actions
    
    @IBAction func actionFetchCountry(_ sender: Any) {
        getCountryList()
    }
    
    @IBAction func actionLogin(_ sender: Any) {
        
        if checkValidation() {
            self.view.endEditing(true)
            checkPin()
        }
    }
    
    @IBAction func actionGeneratePin(_ sender: Any) {
        let generateObj = self.storyboard?.instantiateViewController(withIdentifier: "GenerateOtpVC") as! GenerateOtpVC
//        generateObj.kycID = kycIdText
        Util.shared.pushVC(generateObj)
        
    }

    @IBAction func actionBack(_ sender: Any) {
        Util.shared.popVC()
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
        else{
            if textfield.text!.count < 1 {
                let previousTag = textfield.tag - 1
                if previousTag > 6{
                    let previousResponder = self.view?.viewWithTag(previousTag) as! BackSpaceTextfield
                    previousResponder.text = ""
                    previousResponder.becomeFirstResponder()
                }
            }
        }
        
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool
    {
        // Try to find next responder
        if let nextField = self.view.viewWithTag(textField.tag + 1) as? UITextField {
            nextField.becomeFirstResponder()
        } else {
            // Not found, so remove keyboard.
            txtfld1.becomeFirstResponder()
        }
        // Do not add a line break
        return false
    }
    


    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        if textField.tag == 0 {
            
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
                    if txtfldPhone.text!.count == (formatText?.count)!{
                        txtfld1.becomeFirstResponder()
                    }
                }
            }
            else{
                txtfldPhone.text = changeTextFormatting(newString: string)
            }
        
            
            return false
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
                if checkValidation(){
                    // Call API
                   
                    checkPin()
                }
            }
            else{
                nextResponder?.becomeFirstResponder()
                let textfldNext = nextResponder as! UITextField
                textfldNext.text = ""
                
            }
            
            
            return false
        }
        else if textField.text!.count > 0  && string.count > 0 {
            return false
        }
        return true
        
    }
    
     //MARK: - Webservice
    
    func loginAPI(_ mobile:String, _ pinHash:String) {
        
        var param = ["mobile":mobile,"isd_code":selectedCountry?.phoneCode,"pin":pinHash,"vendor_uuid":Util.shared.getUniqueIdForDevice()] as [String : Any]
//        param.updateValue("25794606-8288-4C41-B1E9-79619C86914C", forKey: "vendor_uuid")
        
        NetworkManager.shared.loginAPI(params: param, success: { (responseJson) in

          Util.shared.loginUser(details: responseJson, pin: pinHash)
        }) { (errorMsg,response) in
            
            _userDefault.removeObject(forKey: kApplicationKycIdKey)
            self.processResponse(data: response!, errorMsg: errorMsg!)
        }
    }
    
    func getCountryList() {
        NetworkManager.shared.countryListAPI(success: { (response) in
            self.processCountryResponse(responseJson: response)
        }) { (errorMsg) in
            DispatchQueue.main.async {
               self.btnGetCountry.isUserInteractionEnabled = true
            }
            
            Util.shared.showAlert(alertTitle: StringConstants.Error, alertText: errorMsg!)
        }
    }
    
//    func getKycId()  {
//        //GlobalMethods.shared.getUniqueIdForDevice()
//        NetworkManager.shared.getKycIdAPI(params: ["vendor_uuid":GlobalMethods.shared.getUniqueIdForDevice()], success: { (responseJSON) in
//            DispatchQueue.main.async {
//                self.processKYCId(responseJSON: responseJSON)
//            }
//        }) { (errorMsg, data) in
//
//        }
//    }
}
