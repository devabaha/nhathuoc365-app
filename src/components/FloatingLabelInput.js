import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Easing
} from 'react-native';

const defaultFunc = () => {};

class FloatingLabelInput extends Component {
  static defaultProps = {
    onInputContainerLayout: defaultFunc,
    onChangeText: defaultFunc,
    onBlur: defaultFunc,
    onFocus: defaultFunc
  };
  state = {
    animatedFloating: new Animated.Value(0),
    animatedOpacity: new Animated.Value(0),
    inputContainerHeight: undefined
  };
  refLabel = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.inputContainerHeight !== this.state.inputContainerHeight) {
      if (nextState.inputContainerHeight && !this.state.inputContainerHeight) {
        this.state.animatedFloating.setValue(nextState.inputContainerHeight);
        Animated.spring(this.state.animatedOpacity, {
          toValue: 1,
          useNativeDriver: true
        }).start();
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.state.animatedFloating.addListener(this.floatingListener.bind(this));
  }

  componentWillUnmount() {
    this.state.animatedFloating.removeListener(
      this.floatingListener.bind(this)
    );
  }

  floatingListener({ value }) {
    if (this.refLabel.current) {
      if (value >= (this.state.inputContainerHeight * 9) / 10) {
        this.refLabel.current.setNativeProps({
          style: {
            color: '#888'
          }
        });
      } else {
        this.refLabel.current.setNativeProps({
          style: {
            color: '#242424'
          }
        });
      }
    }
  }

  onInputContainerLayout = e => {
    this.setState({ inputContainerHeight: e.nativeEvent.layout.height });
    this.props.onInputContainerLayout(e);
  };

  onChangeText(text) {
    this.props.onChangeText(text);
  }

  onFocus() {
    if (!this.props.value) {
      Animated.timing(this.state.animatedFloating, {
        toValue: 0,
        ease: Easing.cubic,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
    this.props.onFocus();
  }

  onBlur() {
    if (!this.props.value) {
      Animated.timing(this.state.animatedFloating, {
        toValue: this.state.inputContainerHeight,
        ease: Easing.cubic,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
    this.props.onBlur();
  }

  render() {
    const {
      label,
      labelStyle,
      error,
      errorStyle,
      containerStyle,
      inputStyle,
      onFocus,
      onBlur,
      onChangeText,
      last,
      ...textInputProps
    } = this.props;

    const extraLabelStyle = {
      opacity: this.state.animatedOpacity,
      transform: [{ translateY: this.state.animatedFloating }]
    };
    const extraInputStyle = !last && {
      borderBottomWidth: 0.5,
      borderBottomColor: '#ddd'
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.mainContent}>
          <View pointerEvents="none" style={{ zIndex: 1 }}>
            <Animated.Text
              ref={this.refLabel}
              style={[styles.label, extraLabelStyle, labelStyle]}
            >
              {label}
            </Animated.Text>
          </View>
          <View
            onLayout={this.onInputContainerLayout}
            style={[styles.inputContainer]}
          >
            <TextInput
              style={[styles.input, extraInputStyle, inputStyle]}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              {...textInputProps}
            />
          </View>
          {!!this.props.error && (
            <Text style={[styles.error, errorStyle]}>{error}</Text>
          )}
        </View>
        {last && <View style={[styles.separator]} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  mainContent: {
    paddingHorizontal: 15
  },
  label: {
    marginBottom: 10,
    left: 0,
    fontWeight: '500',
    letterSpacing: 0.15
  },
  inputContainer: {
    height: 30,
    justifyContent: 'flex-start'
  },
  input: {
    paddingVertical: 0,
    height: '100%',
    fontSize: 16,
    color: '#444'
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ddd'
  },
  error: {
    zIndex: -1,
    color: 'red',
    fontSize: 12,
    marginTop: 4
  }
});

export default FloatingLabelInput;
