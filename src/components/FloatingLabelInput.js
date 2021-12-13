import React, {Component} from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Input, Typography} from 'src/components/base';

const defaultFunc = () => {};

class FloatingLabelInput extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    onInputContainerLayout: defaultFunc,
    onChangeText: defaultFunc,
    onBlur: defaultFunc,
    onFocus: defaultFunc,
    inputRef: defaultFunc,
  };
  state = {
    animatedFloating: new Animated.Value(0),
    animatedOpacity: new Animated.Value(0),
    inputContainerHeight: undefined,
  };
  refLabel = React.createRef();
  refInput = null;

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.inputContainerHeight !== this.state.inputContainerHeight) {
      if (nextState.inputContainerHeight && !this.state.inputContainerHeight) {
        this.state.animatedFloating.setValue(nextState.inputContainerHeight);
        Animated.spring(this.state.animatedOpacity, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    }

    if (nextProps.value) {
      this.state.animatedFloating.setValue(0);
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      if (this.refInput && nextProps.value !== this.props.value) {
        if (!this.refInput.isFocused() && !nextProps.value) {
          this.state.animatedFloating.setValue(nextState.inputContainerHeight);
        }
      }
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.state.animatedFloating.addListener(this.floatingListener);
  }

  componentWillUnmount() {
    this.state.animatedFloating.removeListener(this.floatingListener);
  }

  floatingListener = ({value}) => {
    if (this.refLabel.current) {
      if (!this.state.inputContainerHeight) {
        this.refLabel.current.setNativeProps({
          style: {
            color: this.theme.color.placeholder,
          },
        });
        return;
      }

      if (value >= (this.state.inputContainerHeight * 9) / 10) {
        this.refLabel.current.setNativeProps({
          style: {
            color: this.theme.color.placeholder,
          },
        });
      } else {
        this.refLabel.current.setNativeProps({
          style: {
            color: this.theme.color.textTertiary,
          },
        });
      }
    }
  };

  onInputContainerLayout = (e) => {
    this.setState({inputContainerHeight: e.nativeEvent.layout.height});
    this.props.onInputContainerLayout(e);
  };

  onChangeText(text) {
    this.props.onChangeText(text);
  }

  focus = () => {
    if (this.refInput) {
      this.refInput.focus();
    }
  };

  onFocus() {
    if (!this.props.value) {
      Animated.timing(this.state.animatedFloating, {
        toValue: 0,
        ease: Easing.cubic,
        duration: 300,
        useNativeDriver: true,
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
        useNativeDriver: true,
      }).start();
    }
    this.props.onBlur();
  }

  get errorTextStyle() {
    return mergeStyles(
      [styles.error, {color: this.theme.color.danger}],
      this.props.errorStyle,
    );
  }

  get separatorStyle() {
    return {
      height: this.theme.layout.borderWidthSmall,
      color: this.theme.color.border,
    };
  }

  render() {
    const {
      label,
      labelStyle,
      error,
      containerStyle,
      inputContainerStyle,
      inputStyle,
      onFocus,
      onBlur,
      onChangeText,
      last,
      ...textInputProps
    } = this.props;

    const extraLabelStyle = {
      opacity: this.state.animatedOpacity,
      transform: [{translateY: this.state.animatedFloating}],
    };
    const extraInputStyle = !last && {
      borderBottomWidth: 0.5,
      borderBottomColor: '#ddd',
    };

    return (
      <Container style={[styles.container, containerStyle]}>
        <View style={styles.mainContent}>
          <View pointerEvents="none" style={{zIndex: 1}}>
            <Typography
              animated
              type={TypographyType.LABEL_MEDIUM}
              ref={this.refLabel}
              style={[styles.label, extraLabelStyle, labelStyle]}>
              {label}
            </Typography>
          </View>
          <View
            onLayout={this.onInputContainerLayout}
            style={[styles.inputContainer, inputContainerStyle]}>
            <Input
              ref={(inst) => {
                this.refInput = inst;
                this.props.inputRef(inst);
              }}
              type={TypographyType.LABEL_LARGE}
              style={[styles.input, extraInputStyle, inputStyle]}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              {...textInputProps}
            />
          </View>
          {!!this.props.error && (
            <Typography
              type={TypographyType.DESCRIPTION_SMALL}
              style={this.errorTextStyle}>
              {error}
            </Typography>
          )}
        </View>
        {last && <View style={this.separatorStyle} />}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  mainContent: {
    paddingHorizontal: 15,
  },
  label: {
    marginBottom: 10,
    left: 0,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  inputContainer: {
    height: 30,
    justifyContent: 'flex-start',
  },
  input: {
    paddingVertical: 0,
    padding: 0,
    height: '100%',
  },
  error: {
    zIndex: -1,
    marginTop: 4,
  },
});

export default FloatingLabelInput;
