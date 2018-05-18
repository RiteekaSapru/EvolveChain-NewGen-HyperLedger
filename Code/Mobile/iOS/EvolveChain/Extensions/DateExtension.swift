//
//  DateExtension.swift
//  GreenCoinX
//
//  Created by Yudiz Solutions Pvt. Ltd. on 28/09/17.
//  Copyright © 2017 Yudiz Solutions Pvt. Ltd. All rights reserved.
//

import Foundation
import UIKit

extension Foundation.Date
{
    fileprivate struct Date {
        static let formatter1: DateFormatter = {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en")
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
            return formatter
        }()
        static let formatter2 :DateFormatter = {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en")
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "yyyy-MM-dd HH:mm:ssZZZZZ"
            return formatter
        }()
        
        static let formatter3 :DateFormatter = {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en")
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "yyyy-MM-dd" // ex : 2012-08-20
            return formatter

        }()
        
        static let formatter4 :DateFormatter = {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en")
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "HH:mm:ss"
            return formatter
        }()
        
        
    }
    
    var formatted1: String {
        return Date.formatter1.string(from: self)
    }
    
    var formatted2: String {
        return Date.formatter2.string(from: self)
    }
    
    var formatted3: String {
        return Date.formatter3.string(from: self)
    }
    
    var formatted4: String {
        return Date.formatter4.string(from: self)
    }
    
    
    
    static func dateFromFormatted1_String (_ dateString: String) -> Foundation.Date? {
        let dateFromString = Date.formatter1.date(from: dateString)
        return dateFromString
    }
    static func dateFromFormatted2_String (_ dateString: String) -> Foundation.Date? {
        let dateFromString = Date.formatter2.date(from: dateString)
        return dateFromString
    }
    static func dateFromFormatted3_String (_ dateString: String) -> Foundation.Date? {
        let dateFromString = Date.formatter3.date(from: dateString)
        return dateFromString
    }
    static func dateFromFormatted4_String (_ dateString: String) -> Foundation.Date? {
        let dateFromString = Date.formatter4.date(from: dateString)
        return dateFromString
    }
    
    
    func calculateAge () -> Int {
        return (Calendar.current as NSCalendar).components(NSCalendar.Unit.year, from: self, to: Foundation.Date(), options: []).year!
    }
    func dateWithStringFormat(_ format: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.locale = Locale(identifier: "en")
        return formatter.string(from: self)
    }
    func localDateWithStringFormat(_ format: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        formatter.locale = Locale(identifier: "en")
        formatter.timeZone = TimeZone.current
        
        return formatter.string(from: self)
    }
    func localDateWithServerTimeZoneFormat(_ format: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.locale = Locale(identifier: "en")
        return formatter.string(from: self)
    }
    func stringWithDateFormat(_ format: String, fromDate date: String) -> Foundation.Date {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        return formatter.date(from: date)!
    }
    
    func getOnlyIntervalSinceDate(_ date: String) -> Foundation.Date{
        let timeinterval : TimeInterval = (date as NSString).doubleValue // convert it in to NSTimeInteral
        let dateFromServer = Foundation.Date(timeIntervalSince1970:timeinterval)
        
        return dateFromServer
    }
    func changeDateFormateWithGivenDate(_ format: String, format1: String, fromDate date: String) -> String {
        if date.isEmpty{
            return ""
        }
        let formatter1 = DateFormatter()
        formatter1.dateFormat = format
        formatter1.timeZone = TimeZone(secondsFromGMT: 0)
        
        let formatter2 = DateFormatter()
        formatter2.dateFormat = format1
        formatter2.locale = Locale(identifier: "en")
        formatter2.timeZone = TimeZone.current
        
        return formatter2.string(from: formatter1.date(from: date)!)
    }
    func separateDayMonthYear(_ block : (_ day: String,_ month: String, _ year: String) -> () ){
        let day =  self.localDateWithStringFormat("dd") //"dd"
        let month =  self.localDateWithStringFormat("MM") //"MM"
        let year =  self.localDateWithStringFormat("yyyy") //"yyyy"
        block(day, month, year)
    }
    func befor18YearDate() -> Foundation.Date{
        let date = (Calendar.current as NSCalendar).date(
            byAdding: NSCalendar.Unit.year,
            value: -18,
            to: self,
            options: NSCalendar.Options.searchBackwards)
        return date!
    }
    func getAfter5SecDate() -> Foundation.Date{
        let date = (Calendar.current as NSCalendar).date(
            byAdding: NSCalendar.Unit.second,
            value: 5,
            to: self,
            options: NSCalendar.Options.matchNextTime)
        return date!
    }
    
    func getNextMinuteDate(_ min : Int = 5) -> Foundation.Date{
        let date = (Calendar.current as NSCalendar).date(
            byAdding: NSCalendar.Unit.minute,
            value: min,
            to: self,
            options: NSCalendar.Options.matchNextTime)
        return date!
    }
}
