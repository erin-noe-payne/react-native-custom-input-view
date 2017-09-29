//
//  CustomKeyboardInputController.h
//  fcmMobileUI
//
//  Created by Erin Noe-Payne on 9/28/17.
//
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTRootViewDelegate.h>

@interface CustomKeyboardInputController : UIViewController <RCTBridgeModule, RCTRootViewDelegate>

@property (nonatomic, weak) id<UIKeyInput> delegate;

- (instancetype)initWithBridge:(RCTBridge *)bridge forKeyboard:(NSString *)keyboardName;

@end

