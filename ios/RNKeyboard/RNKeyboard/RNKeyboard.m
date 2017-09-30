//
//  RNKeyboard.m
//  RNKeyboard
//
//  Created by Erin Noe-Payne on 9/30/17.
//

#import "RNKeyboard.h"
#import <React/RCTUIManager.h>

@interface NativeTextInput : UIControl<UITextInput>

@property (nullable, readwrite, strong) UIView *inputView;

@end

@interface BackedTextView

- (NativeTextInput *) backedTextInputView;

@end

@implementation RNKeyboard

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

# pragma mark thread selection

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(install:(nonnull NSNumber *)inputId keyboard:(NSString*)keyboardName) {
    UIView* keyboard = [[RCTRootView alloc] initWithBridge:_bridge moduleName:@"CustomKeyboard" initialProperties:
                        @{
                          @"inputId": inputId,
                          @"keyboardName": keyboardName
                          }
                        ];
    
//    keyboard.frame = CGRectMake(0, 0, 0, 200);
    
    BackedTextView *reactTextView = (BackedTextView *)[_bridge.uiManager viewForReactTag:inputId];
    NativeTextInput *textInput = [reactTextView backedTextInputView];
    textInput.inputView = keyboard;
}

RCT_EXPORT_METHOD(uninstall:(nonnull NSNumber *)inputId) {
    BackedTextView *reactTextView = (BackedTextView *)[_bridge.uiManager viewForReactTag:inputId];
    NativeTextInput *textInput = [reactTextView backedTextInputView];
    textInput.inputView = nil;
}

RCT_EXPORT_METHOD(insertText:(nonnull NSNumber*)inputId text:(NSString*)text) {
    BackedTextView *reactTextView = (BackedTextView *)[_bridge.uiManager viewForReactTag:inputId];
    NativeTextInput *textInput = [reactTextView backedTextInputView];
    [textInput insertText:text];
}

RCT_EXPORT_METHOD(deleteBackward:(nonnull NSNumber*)inputId) {
    BackedTextView *reactTextView = (BackedTextView *)[_bridge.uiManager viewForReactTag:inputId];
    NativeTextInput *textInput = [reactTextView backedTextInputView];
    [textInput deleteBackward];
}

@end

