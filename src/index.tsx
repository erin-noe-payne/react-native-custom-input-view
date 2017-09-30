import * as React from 'react';
import {
  AppRegistry,
  NativeModules,
  requireNativeComponent,
  TextInputProperties,
} from 'react-native';

const { insertText, deleteBackward } = NativeModules.CustomKeyboardInputController;
const NativeCustomTextField = requireNativeComponent('CustomKeyboardTextField', null);

export type CustomKeyboardTextInputProps = TextInputProperties & {
  customKeyboardName: string;
};
export const CustomKeyboardTextInput = NativeCustomTextField as React.ComponentClass<
  CustomKeyboardTextInputProps
>;

export interface CustomKeyboardProps {
  insertText: (text: string) => void;
  backspace: () => void;
}

export type CustomKeyboardClass = React.ComponentClass<CustomKeyboardProps>;

const keyboardRegistry: { [name: string]: CustomKeyboardClass } = {};

export function registerKeyboard(name: string, component: CustomKeyboardClass) {
  keyboardRegistry[name] = component;
}

interface CustomKeyboardRendererProps {
  inputId: number;
  keyboardName: string;
}

class CustomKeyboardRenderer extends React.PureComponent<CustomKeyboardRendererProps> {
  insertText = (text: string) => {
    insertText(text, this.props.keyboardId);
  };

  backspace = () => {
    deleteBackward(this.props.keyboardId);
  };

  render() {
    const { keyboardType } = this.props;
    const Keyboard = keyboardRegistry[keyboardType];
    if (Keyboard == null) {
      throw new Error(
        `Failed to render keyboard component "${keyboardType}". Ensure that you have defined and registerd ` +
          `a keyboard with this name before referencing it in your CustomKeyboardTextInput components.`
      );
    }

    return <Keyboard insertText={this.insertText} backspace={this.backspace} />;
  }
}

AppRegistry.registerComponent('CustomKeyboard', () => CustomKeyboardRenderer);
