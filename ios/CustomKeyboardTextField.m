//
//  CustomKeyboardTextField.m
//  fcmMobileUI
//
//  Created by Erin Noe-Payne on 9/28/17.
//

#import "CustomKeyboardTextField.h"
#import "CustomKeyboardInputController.h"
#import <RCTTextField.h>

@implementation CustomKeyboardTextField

-(void)setCustomKeyboardName:(NSString *)keyboardName {
  //TODO: dealloc?
  CustomKeyboardInputController *controller = [[CustomKeyboardInputController alloc] initWithBridge:_bridge forKeyboard:keyboardName];
  
  UITextField *textField = (UITextField *)[self backedTextInputView];
  
  controller.delegate = textField;
  textField.inputView = controller.view;
  
  [textField reloadInputViews];
}



@end
