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

@interface PlaceholderKeyboardView : UIView <UIInputViewAudioFeedback>
@end

@implementation PlaceholderKeyboardView

- (BOOL) enableInputClicksWhenVisible {
    return YES;
}

- (void) playInputClick {
   [[UIDevice currentDevice] playInputClick];
}

@end

@implementation RNKeyboard {
    PlaceholderKeyboardView _keyboard;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

# pragma mark thread selection

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (PlaceholderKeyboardView) getPlaceholderKeyboard {
    if (_keyboard == nil) {
        _keyboard = [[PlaceholderKeyboardView alloc] init]
    }
    return _keyboard
}

RCT_EXPORT_METHOD(disableNativeKeyboard:(nonnull NSNumber*) inputId) {
    BackedTextView *reactTextView = (BackedTextView *)[_bridge.uiManager viewForReactTag:inputId];
    NativeTextInput *textInput = [reactTextView backedTextInputView];
    textInput.inputView = [self getPlaceholderKeyboard];
}

RCT_EXPORT_METHOD(playInputClick) {
    [[self getPlaceholderKeyboard] playInputClick]
}

@end

