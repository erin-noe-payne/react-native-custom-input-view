import * as React from 'react';
import {
  AppRegistry,
  findNodeHandle,
  NativeModules,
  TextInput,
  TextInputProperties,
} from 'react-native';
import * as _ from 'lodash';

const native = NativeModules.RNKeyboard;

const disableNativeKeyboard: (inputId: number) => void = native.disableNativeKeyboard;
const playInputClick: () => void = native.playInputClick;

export type CustomKeyboardTextInputProps = TextInputProperties & {
  customKeyboardName: string;
};

export interface CustomKeyboardTextInputState {
  value: string;
  selection: {
    start: number;
    end?: number;
  };
}

export class CustomKeyboardTextInput extends React.PureComponent<
  CustomKeyboardTextInputProps,
  CustomKeyboardTextInputState
> {
  input = null;

  constructor(props) {
    super(props);

    const initialValue = this.props.value == null ? '' : this.props.value;
    const initialSelection =
      this.props.selection == null
        ? { start: initialValue.length, end: initialValue.length }
        : this.props.selection;
    this.state = {
      value: initialValue,
      selection: initialSelection,
    };
  }

  componentDidMount() {
    this.disableNativeKeyboard();
  }

  onRef = input => {
    this.input = input;
    this.disableNativeKeyboard();
  };

  disableNativeKeyboard = () => {
    const inputId = findNodeHandle(this.input);
    if (inputId != null) {
      disableNativeKeyboard(inputId);
    }
  };

  componentWillReceiveProps(nextProps: CustomKeyboardTextInputProps) {
    const changes: any = {};
    if (nextProps.value != this.props.value) {
      changes.value = nextProps.value;
    }
    if (!_.isEqual(this.props.selection, nextProps.selection)) {
      changes.selection = nextProps.selection;
    }

    if (_.size(changes) > 0) {
      this.setState(changes);
    }
  }

  focus = () => {
    this.input.focus();
  };

  blur = () => {
    this.input.blur();
  };

  onFocus = () => {
    const stateManager = stateManagement[this.props.customKeyboardName];
    //TODO: error detection
    stateManager.setFocusedTextInput(this);
    if (!this.props.selectTextOnFocus) {
      const { length } = this.state.value;
      this.onSelectionChange({
        nativeEvent: { selection: { start: length, end: length } },
      });
    }
    if (_.isFunction(this.props.onFocus)) {
      this.props.onFocus();
    }
  };

  onBlur = () => {
    const stateManager = stateManagement[this.props.customKeyboardName];
    // TODO: maybe consider respecting the dismisskeyboard on blur prop?
    if (stateManager.isFocusedTextInput(this)) {
      stateManager.setFocusedTextInput(null);
    }
    if (_.isFunction(this.props.onBlur)) {
      this.props.onBlur();
    }
  };

  onSelectionChange = e => {
    if (_.isFunction(this.props.onSelectionChange)) {
      this.props.onSelectionChange(e);
    } else {
      const { start, end } = e.nativeEvent.selection;
      this.setState({
        selection: { start, end },
      });
    }
  };

  onChangeText = (text: string) => {
    if (_.isFunction(this.props.onChangeText)) {
      this.props.onChangeText(text);
    } else {
      this.setState({
        value: text,
      });
    }
  };

  //TODO: may be unneeded - need to check cross platform
  private getCurrentSelection = () => {
    const { value, selection } = this.state;
    const values = Object.values(selection);
    const start = Math.min(...values);
    const end = Math.max(...values);
    return { start, end };
  };

  //TODO: set selection state also
  insertText = (text: string) => {
    const { value } = this.state;
    const { start, end } = this.getCurrentSelection();
    const nextText = value.slice(0, start) + text + value.slice(end, value.length);
    this.onChangeText(nextText);

    const nextCursorPosition = start + text.length;
    const nextSelection = { start: nextCursorPosition, end: nextCursorPosition };
    this.onSelectionChange({
      nativeEvent: { selection: nextSelection },
    });
  };

  //TODO: set selection state also
  backspace = () => {
    const { value } = this.state;
    const { start, end } = this.getCurrentSelection();
    if (start === end) {
      const nextText = value.slice(0, start - 1) + value.slice(start, value.length);
      this.onChangeText(nextText);

      const nextCursorPosition = start - 1;
      const nextSelection = { start: nextCursorPosition, end: nextCursorPosition };
      this.onSelectionChange({
        nativeEvent: { selection: nextSelection },
      });
    } else {
      const nextText = value.slice(0, start) + value.slice(end, value.length);
      this.onChangeText(nextText);

      const nextCursorPosition = start;
      const nextSelection = { start: nextCursorPosition, end: nextCursorPosition };
      this.onSelectionChange({
        nativeEvent: { selection: nextSelection },
      });
    }
  };

  render() {
    //TODO: control component, onfocus / onblur, etc
    return (
      <TextInput
        {...this.props}
        ref={this.onRef}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        value={this.state.value}
        onChangeText={this.onChangeText}
        onSelectionChange={this.onSelectionChange}
        selection={this.state.selection}
      />
    );
  }
}

export interface CustomKeyboardProps {
  insertText: (text: string) => void;
  backspace: () => void;
  isVisible: boolean;
}

export type CustomKeyboardClass = React.ComponentClass;

type VisibilityListener = (isVisible: boolean) => void;
type Unlistener = () => void;

class KeyboardStateManager {
  private focusedTextInput: CustomKeyboardTextInput = null;
  private visibilityListeners: VisibilityListener[] = [];

  isFocusedTextInput = (focusedTextInput: CustomKeyboardTextInput): boolean => {
    return this.focusedTextInput === focusedTextInput;
  };

  setFocusedTextInput = (focusedTextInput: CustomKeyboardTextInput) => {
    this.focusedTextInput = focusedTextInput;
    this.triggerVisibilityListeners(this.isVisible());
  };

  triggerVisibilityListeners = (isVisible: boolean) => {
    this.visibilityListeners.forEach(listener => {
      listener(isVisible);
    });
  };

  addVisibilityListener = (listener: VisibilityListener): Unlistener => {
    this.visibilityListeners.push(listener);
    return () => {
      const i = this.visibilityListeners.indexOf(listener);
      if (i >= 0) {
        this.visibilityListeners.splice(i, 1);
      }
    };
  };

  isVisible = () => this.focusedTextInput != null;

  insertText = (text: string) => {
    if (this.focusedTextInput != null) {
      this.focusedTextInput.insertText(text);
    }
  };

  backspace = () => {
    if (this.focusedTextInput != null) {
      this.focusedTextInput.backspace();
    }
  };
}

const stateManagement: {
  [name: string]: KeyboardStateManager;
} = {};

interface CustomKeyboardState {
  isVisible: boolean;
}

export function registerKeyboard<OwnProps>(
  name: string,
  Component: React.ComponentClass<CustomKeyboardProps>
): React.ComponentClass<OwnProps> {
  let stateManager = stateManagement[name];
  if (stateManager == null) {
    stateManager = new KeyboardStateManager();
    stateManagement[name] = stateManager;
  }

  class CustomKeyboard extends React.PureComponent<OwnProps, CustomKeyboardState> {
    private removeListener: Unlistener;
    state: CustomKeyboardState = {
      isVisible: stateManager.isVisible(),
    };

    componentDidMount() {
      this.removeListener = stateManager.addVisibilityListener(isVisible => {
        if (this.state.isVisible != isVisible) {
          this.setState({ isVisible });
        }
      });
    }

    componentWillUnmount() {
      this.removeListener();
    }

    insertText = (text: string) => {
      stateManager.insertText(text);
      playInputClick();
    };

    backspace = () => {
      stateManager.backspace();
      playInputClick();
    };

    // TODO: may need a dismiss function?

    render() {
      return (
        <Component
          insertText={this.insertText}
          backspace={this.backspace}
          isVisible={this.state.isVisible}
        />
      );
    }
  }

  return CustomKeyboard;

  //TODO: HOC
}
