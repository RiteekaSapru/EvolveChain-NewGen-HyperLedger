//
//  UIScrollView+KeyboardPresentation.h
//  Test
//
//  Created by Abhay Shankar on 22/11/17.
//  Copyright © 2017 Abhay Shankar. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIScrollView (KeyboardPresentation)
-(void)scrollToTextField:(UIView*)textField;
-(void)shouldScrollViewUp:(BOOL)keyboardBecameVisible andKeyboardHeight:(CGFloat)keyboardHeight andTextField:(UIView*)textField;

@end
