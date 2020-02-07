import React, { Component } from 'react';
import {
  View,
  TextInput,
  Animated,
  ViewPropTypes,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';
import { formatMoney } from './helper';

const defaultListener = () => {};

class Input extends Component {
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
    maxLength: PropTypes.number
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
    maxLength: 12
  };

  state = {
    value: '',
    error: '',
    focus: undefined,
    animatedOpacity: new Animated.Value(0),
    animatedHeight: new Animated.Value(0)
  };
  input = React.createRef();

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
          useNativeDriver: true
        }).start();
      } else if (!nextState.value && this.state.value) {
        Animated.timing(this.state.animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();
      }
    }
    if (nextProps.errorMess !== this.props.errorMess) {
      if (nextProps.errorMess && nextProps.errorMess !== nextState.error) {
        this.setState({ error: nextProps.errorMess }, () =>
          Animated.timing(this.state.animatedHeight, {
            toValue: 18,
            duration: 200
          }).start()
        );
      } else if (
        !nextProps.errorMess &&
        nextProps.errorMess !== nextState.error
      ) {
        Animated.timing(this.state.animatedHeight, {
          toValue: 0,
          duration: 200
        }).start(() => this.setState({ error: '' }));
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
        this.setState({ value: nextProps.value });
      }

      return true;
    }

    return false;
  }

  onChange = e => {
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
        value_view
      });
      this.props.onChange(e, value);
    }
  };

  onFocus = e => {
    this.setState({ focus: true });
    this.props.onFocus(e);
  };

  onBlur = e => {
    this.setState({ focus: false });
    this.props.onBlur(e);
  };

  onClear = () => {
    this.setState({ value: '', value_view: '' });
    this.props.onClear();
    this.input.current && this.input.current.focus();
  };

  render() {
    const inputStyle = {
      ...styles.moneyInput,
      borderBottomColor: this.state.error
        ? 'red'
        : this.state.focus
        ? appConfig.colors.primary
        : '#d9d9d9'
    };

    const titleStyle = {
      opacity: this.state.animatedOpacity,
      color: this.state.focus ? appConfig.colors.primary : '#404040'
    };

    const errorStyle = {
      height: this.state.animatedHeight
    };

    return (
      <View style={[styles.paymentInput, this.props.containerStyle]}>
        <Animated.Text style={titleStyle}>{this.props.title}</Animated.Text>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextInput
            ref={this.input}
            onChange={this.onChange}
            keyboardType={this.props.keyboardType}
            placeholder={this.props.placeholder}
            placeholderTextColor={appConfig.colors.placeholder}
            style={[inputStyle, this.props.inputStyle]}
            multiline={this.props.multiline}
            value={this.state.value_view}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            maxLength={this.props.maxLength}
            underlineColorAndroid="transparent"
          />
          {!!this.state.value && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={this.onClear}
              hitSlop={{ right: 10, bottom: 10, left: 10, top: 10 }}
            >
              <Icon
                name="closesquareo"
                size={22}
                color={appConfig.colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>
        <Animated.Text style={[errorStyle, styles.errorMess]}>
          {this.state.error}
        </Animated.Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paymentInput: {
    width: '90%',
    alignSelf: 'center',
    marginTop: -20,
    marginBottom: 30
  },
  moneyInput: {
    paddingHorizontal: 0,
    paddingRight: 28,
    paddingVertical: 10,
    fontSize: 18,
    borderBottomWidth: 2,
    zIndex: 0
  },
  errorMess: {
    marginTop: 5,
    color: 'red',
    fontSize: 12,
    zIndex: -1
  },
  clearBtn: {
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  }
});

export default Input;
