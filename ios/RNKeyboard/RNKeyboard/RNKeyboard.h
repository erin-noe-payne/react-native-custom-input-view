//
//  RNKeyboard.h
//  RNKeyboard
//
//  Created by Erin Noe-Payne on 9/30/17.
//


#import <React/RCTBridgeModule.h>

@interface RNKeyboard: NSObject <RCTBridgeModule>

- (void) install:(NSNumber*)inputId keyboard:(NSString*)keyboardName;
- (void) uninstall:(NSNumber*)inputId;
- (void) insertText:(NSNumber*)inputId text:(NSString*)text;
- (void) deleteBackward:(NSNumber*)inputId;

@end

