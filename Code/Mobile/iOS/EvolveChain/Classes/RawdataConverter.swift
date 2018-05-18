//
//  RawdataConverter.swift
//  GreenCoinX
//
//  Created by Yudiz Solutions Pvt. Ltd. on 28/09/17.
//  Copyright © 2017 Yudiz Solutions Pvt. Ltd. All rights reserved.
//

import UIKit

class RawdataConverter: NSObject {
    
    class func date(_ timestamp: Any?) -> Date {
        if let any = timestamp {
            if let str = any as? String {
                return Date(timeIntervalSince1970: RawdataConverter.double(str))
            } else if let str = any as? NSNumber {
                return Date(timeIntervalSince1970: str.doubleValue)
            }
        }
        return Date()
    }
    
    class func optionalDate(_ anything: Any?) -> Date? {
        if let any = anything {
            if let str = any as? String, !str.isEmpty {
                if str.contains("-") || str.contains(":") {
                    return Date.dateFromFormatted1_String(str)
                }else{
                    return Date(timeIntervalSince1970: RawdataConverter.double(str))
                }
            } else if let str = any as? NSNumber {
                return Date(timeIntervalSince1970: str.doubleValue)
            }
        }
        return nil
    }
    
    class func integer(_ anything: Any?) -> Int {
        
        if let any = anything {
            if let num = any as? NSNumber {
                return num.intValue
            } else if let str = any as? NSString {
                return str.integerValue
            }
        }
        return 0
    }
    
    class func optionalInteger(_ anything: Any?) -> Int? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.intValue
            } else if let str = any as? NSString {
                return str.integerValue
            }
        }
        return nil
    }
    
    class func int32(_ anything: Any?) -> Int32 {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.int32Value
            } else if let str = any as? NSString {
                return str.intValue
            }
        }
        return 0
    }
    
    class func optionalInt32(_ anything: Any?) -> Int32? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.int32Value
            } else if let str = any as? NSString {
                return str.intValue
            }
        }
        return nil
    }
    
    class func int64(_ anything: Any?) -> Int64 {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.int64Value
            } else if let str = any as? NSString {
                return Int64(str.intValue)
            }
        }
        return 0
    }
    
    class func optionalInt64(_ anything: Any?) -> Int64? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.int64Value
            } else if let str = any as? NSString {
                return Int64(str.intValue)
            }
        }
        return nil
    }
    
    class func double(_ anything: Any?) -> Double {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.doubleValue
            } else if let str = any as? NSString {
                return str.doubleValue
            }
        }
        return 0
    }
    
    class func optionalDouble(_ anything: Any?) -> Double? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.doubleValue
            } else if let str = any as? NSString {
                return str.doubleValue
            }
        }
        return nil
    }
    
    class func float(_ anything: Any?) -> Float {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.floatValue
            } else if let str = any as? NSString {
                return str.floatValue
            }
        }
        return 0
    }
    
    class func optionalFloat(_ anything: Any?) -> Float? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.floatValue
            } else if let str = any as? NSString {
                return str.floatValue
            }
        }
        return nil
    }
    
    class func string(_ anything: Any?) -> String {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.stringValue
            } else if let str = any as? String {
                return str
            }
        }
        return ""
    }
    
    class func optionalString(_ anything: Any?) -> String? {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.stringValue
            } else if let str = any as? String {
                return str
            }
        }
        return nil
    }
    
    class func boolean(_ anything: Any?) -> Bool {
        if let any = anything {
            if let num = any as? NSNumber {
                return num.boolValue
            } else if let str = any as? NSString {
                return str.boolValue
            }
        }
        return false
    }
    
    class func dictionary(_ anything: Any?) -> [String:Any]? {
        if let any = anything {
            if let dict = any as? [String:Any] {
                return dict.count > 0 ? dict : nil
            }
        }
        return nil
    }
    
    class func array(_ anything: Any?) -> [Any]? {
        if let any = anything {
            if let arr = any as? [Any] {
                return arr.count > 0 ? arr : nil
            }
        }
        return nil
    }
}

