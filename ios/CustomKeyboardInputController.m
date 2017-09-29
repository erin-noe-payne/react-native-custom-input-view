//
//  CustomKeyboardInputController.m
//  fcmMobileUI
//
//  Created by Erin Noe-Payne on 9/28/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "CustomKeyboardInputController.h"
#import <React/RCTUIManager.h>

static NSMutableDictionary *registry = nil;
static int registryId = 0;

@implementation CustomKeyboardInputController

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(insertText:(NSString *)text keyboardId:(NSString *)keyboardId) {
  CustomKeyboardInputController *ctrl = [self registry][keyboardId];
  [ctrl.delegate insertText:text];
}

RCT_EXPORT_METHOD(deleteBackward:(NSString *)keyboardId) {
  CustomKeyboardInputController *ctrl = [self registry][keyboardId];
  [ctrl.delegate deleteBackward];
}

- (NSMutableDictionary *)registry {
  if(registry == nil) {
    registry = [[NSMutableDictionary alloc] init];
  }
  return registry;
}

- (instancetype) initWithBridge:(RCTBridge *)bridge forKeyboard:(NSString *)keyboardName {
  self = [super init];
  
  NSString *keyboardId = [NSString stringWithFormat:@"%d",registryId++];
  [[self registry] setValue:self forKey:keyboardId];
  
  self.view = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"CustomKeyboard" initialProperties:
                    @{
                      @"keyboardType": keyboardName,
                      @"keyboardId": keyboardId
                      }];
  
  self.view.frame = CGRectMake(0, 0, 0, 200);
  return self;
}

// TODO: this doesn't actually do anything...
- (void)rootViewDidChangeIntrinsicSize:(RCTRootView *)rootView {
  self.view.frame = CGRectMake(0, 0, rootView.intrinsicContentSize.width, rootView.intrinsicContentSize.height);
}


@end
