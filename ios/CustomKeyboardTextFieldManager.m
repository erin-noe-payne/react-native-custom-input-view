//
//  CustomKeyboard.m
//  fcmMobileUI
//
//  Created by Erin Noe-Payne on 9/27/17.
//

#import "CustomKeyboardTextFieldManager.h"
#import "CustomKeyboardTextField.h"
#import <React/RCTUIManager.h>

@implementation CustomKeyboardTextFieldManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (UIView *)view {
  return [[CustomKeyboardTextField alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(customKeyboardName, NSString)

@end
