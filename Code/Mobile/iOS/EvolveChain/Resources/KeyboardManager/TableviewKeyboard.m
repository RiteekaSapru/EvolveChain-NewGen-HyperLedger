//
//  ScrollingTextField.m
//  Test
//
//  Created by Abhay Shankar on 24/10/17.
//  Copyright © 2017 Abhay Shankar. All rights reserved.
//

#import "TableviewKeyboard.h"
#import "UIScrollView+KeyboardPresentation.h"

@implementation TableviewKeyboard
{
    
    bool isKeyboardVisible;
    CGSize keyboardSize;
    UIView *activeTextField;
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

-(id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        [self setup];
        return self;
    }
  return nil;
}

-(id)initWithFrame:(CGRect)frame style:(UITableViewStyle)style
{
    if ((self = [super initWithFrame:frame style:style])) {
        [self setup];
        return self;
    }
    return nil;
}

-(void)awakeFromNib
{
    [super awakeFromNib];
    [self setup];
}

-(void)dealloc
{
    activeTextField = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
-(void)setup
{    
    if (![self.delegate isKindOfClass:[UITableViewController class]])
    {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(scrollToActiveTextField:) name:UITextViewTextDidBeginEditingNotification object:nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(scrollToActiveTextField:) name:UITextFieldTextDidBeginEditingNotification object:nil];
        
        UITapGestureRecognizer *singleTapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleTap:)];
        singleTapGestureRecognizer.numberOfTapsRequired = 1;
        singleTapGestureRecognizer.enabled = YES;
        singleTapGestureRecognizer.cancelsTouchesInView = NO;
        [self addGestureRecognizer:singleTapGestureRecognizer];
    }
    
}


#pragma mark - Observers

- (void)singleTap:(UITapGestureRecognizer *)gesture {
    //handle taps
    NSLog(@"tapped");
    [self.superview endEditing:YES];
}

-(void)keyboardWillShow:(NSNotification*)notification
{
        NSDictionary* userInfo = [notification userInfo];
    if (isKeyboardVisible && CGSizeEqualToSize(keyboardSize, [[userInfo objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size)) {
        return;
    }

    isKeyboardVisible = YES;

    // get the size of the keyboard
    keyboardSize = [[userInfo objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue].size;
    
    [self shouldScrollViewUp:YES andKeyboardHeight:keyboardSize.height andTextField:activeTextField];
    
}

-(void)keyboardWillHide:(NSNotification*)notification
{
    if (!isKeyboardVisible) {
        return;
    }
   isKeyboardVisible = NO;
    
    [self shouldScrollViewUp:NO andKeyboardHeight:keyboardSize.height andTextField:activeTextField];
    
}

-(void)scrollToActiveTextField:(NSNotification*)notification
{
    if ([notification.object isKindOfClass:[UITextField class]] || [notification.object isKindOfClass:[UITextView class]]) {
        
        activeTextField = notification.object;

        [self scrollToTextField:activeTextField];
       
    }
    else
        return;
}


@end
