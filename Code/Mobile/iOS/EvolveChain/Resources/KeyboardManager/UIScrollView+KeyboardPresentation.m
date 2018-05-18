//
//  UIScrollView+KeyboardPresentation.m
//  Test
//
//  Created by Abhay Shankar on 22/11/17.
//  Copyright © 2017 Abhay Shankar. All rights reserved.
//

#import "UIScrollView+KeyboardPresentation.h"

@implementation UIScrollView (KeyboardPresentation)

-(void)scrollToTextField:(UIView*)textField
{
    CGRect thePosition = [textField.superview convertRect:textField.frame toView:self];
    thePosition.origin.y = thePosition.origin.y + textField.frame.size.height;
    [self scrollRectToVisible:thePosition animated:YES];
    
}

-(void)shouldScrollViewUp:(BOOL)keyboardBecameVisible andKeyboardHeight:(CGFloat)keyboardHeight andTextField:(UIView*)textField
{
    if (keyboardBecameVisible)
    {
        // resize the content inset from bottom
        
        [self setContentInset: UIEdgeInsetsMake(0, 0, keyboardHeight, 0)];
        
        // scroll the content to active textfield
        
        [self scrollToTextField:textField];
    }
    else
    {
        // resize the content inset from bottom
        self.contentInset = UIEdgeInsetsMake(0, 0, 0, 0);
    }
}
@end
