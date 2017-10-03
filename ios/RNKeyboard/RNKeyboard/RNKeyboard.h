//
//  RNKeyboard.h
//  RNKeyboard
//
//  Created by Erin Noe-Payne on 9/30/17.
//


#import <React/RCTBridgeModule.h>

@interface RNKeyboard: NSObject <RCTBridgeModule>

- (void) disableNativeKeyboard:(nonnull NSNumber*) inputId;
- (void) playInputClick;

@end

