//
//  RNKeyboard.h
//  RNKeyboard
//
//  Created by Erin Noe-Payne on 9/30/17.
//


#import <React/RCTBridgeModule.h>

@interface RNKeyboard: NSObject <RCTBridgeModule>

- (void) install:(nonnull NSNumber*)inputId keyboard:(NSString*)keyboardName;
- (void) uninstall:(nonnull NSNumber*)inputId;
- (void) insertText:(nonnull NSNumber*)inputId text:(NSString*)text;
- (void) deleteBackward:(nonnull NSNumber*)inputId;

@end

