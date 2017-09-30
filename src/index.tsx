import * as React from 'react';
import {
  AppRegistry,
  findNodeHandle,
  NativeModules,
  TextInput,
  TextInputProperties,
} from 'react-native';

const native = NativeModules.RNKeyboard;

const install: (inputId: number, keyboardName: string) => void = native.install;
const uninstall: (inputId: number) => void = native.uninstall;
const insertText: (inputId: number, text: string) => void = native.insertText;
const deleteBackward: (inputId: number) => void = native.deleteBackward;

export { install, uninstall };

export type CustomKeyboardTextInputProps = TextInputProperties & {
  customKeyboardName: string;
};

export class CustomKeyboardTextInput extends React.PureComponent<
  CustomKeyboardTextInputProps
> {
  // TODO: this probably breaks imperative api like focus /
  input = null;

  componentDidMount() {
    install(findNodeHandle(this.input), this.props.customKeyboardName);
  }

  componentWillUnmount() {
    uninstall(findNodeHandle(this.input));
  }

  ref = input => {
    this.input = input;
  };

  render() {
    return <TextInput {...this.props} ref={this.ref} />;
  }
}

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
    insertText(this.props.inputId, text);
  };

  backspace = () => {
    deleteBackward(this.props.inputId);
  };

  render() {
    const { keyboardName } = this.props;
    const Keyboard = keyboardRegistry[keyboardName];
    if (Keyboard == null) {
      throw new Error(
        `Failed to render keyboard component "${keyboardName}". Ensure that you have defined and registerd ` +
          `a keyboard with this name before referencing it in your CustomKeyboardTextInput components.`
      );
    }

    return <Keyboard insertText={this.insertText} backspace={this.backspace} />;
  }
}

AppRegistry.registerComponent('CustomKeyboard', () => CustomKeyboardRenderer);
