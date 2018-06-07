

import UIKit

class CustomPickerView: UIView, UIPickerViewDelegate, UIPickerViewDataSource {
   
    
    
   
    @IBOutlet var mainView: UIView!
    @IBOutlet var backButton: UIButton!
    
    @IBOutlet weak var customPicker: UIPickerView!
    
    @IBOutlet weak var bottomLayout: NSLayoutConstraint!
    
    var countryList : [Country] = []
    var selectedCountry : Country?
    var selectedIndex : Int = 0
    var customArray : [String] = []
    var IsCustom : Bool = false
    var completionCountry: ((Country) -> Void) = {_ in }
    var completionCustom: ((Int) -> Void) = {_ in }

    class func instanceFromNib() -> CustomPickerView {
        return UINib(nibName: "CustomPickerView", bundle: nil).instantiate(withOwner: nil, options: nil)[0] as! CustomPickerView
    }
    
    func setUpView(custom:Bool,customList:[String],arrCountry:[Country])
    {
        IsCustom = custom
        customArray = customList
        countryList = arrCountry
        if countryList.count > 0{
            selectedCountry = countryList[0]
        }
        
        customPicker.delegate = self
        customPicker.dataSource = self
    }
    
    func showView()
    {
        self.bottomLayout.constant = 0.0
        UIView.animate(withDuration: 0.5) {
            self.backButton.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.5)
            self.mainView.layoutIfNeeded()
        }
    }
    
    func hideView()
    {
        self.bottomLayout.constant = -300.0
        UIView.animate(withDuration: 0.5, animations: {
            self.backButton.backgroundColor = UIColor(red: 0, green: 0, blue: 0, alpha: 0.0)
            self.mainView.layoutIfNeeded()
        }, completion: {
            (finished: Bool) in
            self.removeFromSuperview()
        })
    }
    
    func updateSelectionCountry(country:Country) -> Void {
        selectedCountry = country;
    }
    
    func updateSelectionCustom(index:Int) -> Void {
        selectedIndex = index;
    }
   //MARK:- Picker Actions
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
       return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        if IsCustom{
            return customArray.count
        }
        return countryList.count
    }
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String?{
        if IsCustom{
            return customArray[row]
        }
        return countryList[row].name
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        if IsCustom{
             updateSelectionCustom(index: row)
        }
        else{
             updateSelectionCountry(country: countryList[row])
        }
       
    }
    //MARK:- Button Actions
    @IBAction func backButtonAction(_ sender: Any) {
        hideView()
    }
    
    @IBAction func crossButtonAction(_ sender: Any) {
        hideView()
    }
    
    @IBAction func actionSave(_ sender: Any) {
        
        if IsCustom{
            completionCustom(selectedIndex)
        }
        else{
           completionCountry(selectedCountry!)
        }
        
        hideView()
    }
    
    
}
