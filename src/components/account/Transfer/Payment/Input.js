import React, {Component} from 'react';
import {View, Animated, ViewPropTypes, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
// helpers
import {formatMoney} from './helper';
import {getTheme, ThemeContet} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {IconButton, Input as BaseInput, Typography} from 'src/components/base';

const defaultListener = () => {};

class Input extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    errorMess: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onClear: PropTypes.func,
    keyboardType: PropTypes.string,
    placeholder: PropTypes.string,
    inputStyle: ViewPropTypes.style,
    multiline: PropTypes.bool,
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    title: '',
    value: '',
    value_view: '',
    errorMess: '',
    onClear: defaultListener,
    onChange: defaultListener,
    onFocus: defaultListener,
    onBlur: defaultListener,
    keyboardType: 'default',
    placeholder: '',
    inputStyle: {},
    multiline: false,
    maxLength: 12,
  };

  state = {
    value: '',
    error: '',
    focus: undefined,
    animatedOpacity: new Animated.Value(0),
    animatedHeight: new Animated.Value(0),
  };
  input = React.createRef();

  get theme() {
    return getTheme(this);
  }

  get inputText() {
    return this.state.value;
  }

  get formattedText() {
    return this.state.value_view || this.state.value;
  }

  blur() {
    this.input.current && this.input.current.blur();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.value !== this.state.value) {
      if (nextState.value && !this.state.value) {
        Animated.timing(this.state.animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (!nextState.value && this.state.value) {
        Animated.timing(this.state.animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    if (nextProps.errorMess !== this.props.errorMess) {
      if (nextProps.errorMess && nextProps.errorMess !== nextState.error) {
        this.setState({error: nextProps.errorMess}, () =>
          Animated.timing(this.state.animatedHeight, {
            toValue: 18,
            duration: 200,
          }).start(),
        );
      } else if (
        !nextProps.errorMess &&
        nextProps.errorMess !== nextState.error
      ) {
        Animated.timing(this.state.animatedHeight, {
          toValue: 0,
          duration: 200,
        }).start(() => this.setState({error: ''}));
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.title !== this.props.title ||
      nextProps.value !== this.props.value ||
      nextProps.errorMess !== this.props.errorMess ||
      nextProps.keyboardType !== this.props.keyboardType ||
      nextProps.inputStyle !== this.props.inputStyle ||
      nextProps.multiline !== this.props.multiline ||
      nextProps.maxLength !== this.props.maxLength
    ) {
      if (
        nextProps.value !== this.props.value &&
        nextProps.value !== nextState.value
      ) {
        this.setState({value: nextProps.value});
      }

      return true;
    }

    return false;
  }

  onChange = (e) => {
    let value = e.nativeEvent.text;

    if (this.props.keyboardType === 'number-pad' && value) {
      value = value.replace(/(?!\d+)\D*/g, '');
    }
    if (value.length <= this.props.maxLength) {
      let value_view = value;

      if (this.props.keyboardType === 'number-pad' && value_view) {
        value_view = formatMoney(value);
      }
      this.setState({
        value,
        value_view,
      });
      this.props.onChange(e, value);
    }
  };

  onFocus = (e) => {
    this.setState({focus: true});
    this.props.onFocus(e);
  };

  onBlur = (e) => {
    this.setState({focus: false});
    this.props.onBlur(e);
  };

  onClear = () => {
    this.setState({value: '', value_view: ''});
    this.props.onClear();
    this.input.current && this.input.current.focus();
  };

  get inputStyle() {
    return {
      ...styles.moneyInput,
      borderBottomWidth: this.theme.layout.borderWidthLarge,
      borderBottomColor: this.state.error
        ? this.theme.color.danger
        : this.state.focus
        ? this.theme.color.primaryHighlight
        : this.theme.color.neutral,
    };
  }

  get errorMessStyle() {
    return {
      color: this.theme.color.danger,
    };
  }

  render() {
    const titleStyle = {
      opacity: this.state.animatedOpacity,
      color: this.state.focus ? appConfig.colors.primary : '#404040',
    };

    const errorStyle = {
      height: this.state.animatedHeight,
    };

    return (
      <View style={[styles.paymentInput, this.props.containerStyle]}>
        <Animated.Text style={titleStyle}>{this.props.title}</Animated.Text>

        <View style={{flex: 1, justifyContent: 'center'}}>
          <BaseInput
            type={TypographyType.LABEL_MEDIUM}
            ref={this.input}
            onChange={this.onChange}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            style={[this.inputStyle, this.props.inputStyle]}
            multiline={this.props.multiline}
            value={this.state.value_view}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            maxLength={this.props.maxLength}
            underlineColorAndroid="transparent"
          />
          {!!this.state.value && (
            <IconButton
              bundle={BundleIconSetName.ANT_DESIGN}
              neutral
              name="closesquareo"
              style={styles.clearBtn}
              iconStyle={styles.clearIcon}
              onPress={this.onClear}
              hitSlop={{right: 10, bottom: 10, left: 10, top: 10}}
            />
          )}
        </View>
        <Typography
          animated
          type={TypographyType.DESCRIPTION_SMALL}
          style={[errorStyle, this.errorMessStyle, styles.errorMess]}>
          {this.state.error}
        </Typography>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paymentInput: {
    width: '90%',
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: 30,
  },
  moneyInput: {
    paddingHorizontal: 0,
    paddingRight: 28,
    paddingVertical: 10,
    fontSize: 18,
    zIndex: 0,
  },
  errorMess: {
    marginTop: 5,
    zIndex: -1,
  },
  clearBtn: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  clearIcon: {
    fontSize: 22,
  },
});

export default Input;
