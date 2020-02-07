import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import phoneBookImage from '../../assets/images/phone-book.png';
import config from '../../config';
import Button from 'react-native-button';

const defaultListener = () => {};

class EnterPhone extends Component {
  static propTypes = {
    data: PropTypes.array,
    editable: PropTypes.bool,
    showHistory: PropTypes.bool,
    hideChangeNetwork: PropTypes.bool,
    hideContact: PropTypes.bool,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    onOpenContact: PropTypes.func,
    onShowHistory: PropTypes.func,
    onBlur: PropTypes.func,
    onPressSelectNetwork: PropTypes.func,
    onChangeText: PropTypes.func,
    networkType: PropTypes.string,
    keyboardType: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    customRightComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node
    ]),
    inputStyle: PropTypes.object,
    inputContainerStyle: PropTypes.object
  };

  static defaultProps = {
    data: [],
    editable: false,
    showHistory: true,
    hideChangeNetwork: false,
    hideContact: false,
    contactName: '',
    contactPhone: '',
    onOpenContact: defaultListener,
    onShowHistory: defaultListener,
    onBlur: defaultListener,
    onPressSelectNetwork: defaultListener,
    onChangeText: defaultListener,
    networkType: '',
    keyboardType: 'phone-pad',
    errorMessage: '',
    placeholder: 'Nhập số',
    title: 'Nạp đến',
    customRightComponent: null,
    inputStyle: {},
    inputContainerStyle: {}
  };

  get currentNetworkType() {
    return this.props.data.find(
      network => network.type === this.props.networkType
    );
  }

  get hasError() {
    return !!this.props.errorMessage;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Text style={styles.label}>{this.props.title}</Text>

          {this.props.showHistory && (
            <Button onPress={this.props.onShowHistory}>
              <Text style={styles.viewHistoryText}>Xem lịch sử</Text>
            </Button>
          )}
        </View>
        {!!this.props.contactName && (
          <Text style={styles.contactName}>{this.props.contactName}</Text>
        )}

        <View style={styles.enterContact}>
          <View
            style={[
              styles.inputBtn,
              this.hasError && styles.hasError,
              this.props.inputContainerStyle
            ]}
          >
            {this.props.editable ? (
              <View style={styles.phoneBtn}>
                <TextInput
                  style={[styles.input, this.props.inputStyle]}
                  value={this.props.contactPhone}
                  onBlur={this.props.onBlur}
                  onChangeText={this.props.onChangeText}
                  keyboardType={this.props.keyboardType}
                  placeholder={this.props.placeholder}
                  placeholderTextColor="#c7c7cd"
                />
              </View>
            ) : (
              <Button
                containerStyle={[styles.phoneBtn, this.props.inputStyle]}
                onPress={this.props.onOpenContact}
              >
                {this.props.contactPhone ? (
                  <Text style={styles.input}>{this.props.contactPhone}</Text>
                ) : (
                  <Text style={styles.placeholder}>
                    {this.props.placeholder}
                  </Text>
                )}
              </Button>
            )}
            {!this.props.hideContact && (
              <Button
                containerStyle={styles.contactBtn}
                onPress={this.props.onOpenContact}
              >
                <Image style={styles.phoneBook} source={phoneBookImage} />
              </Button>
            )}
          </View>

          {!this.props.hideChangeNetwork && !!!this.props.customRightComponent && (
            <Button
              onPress={this.props.onPressSelectNetwork}
              containerStyle={styles.networkBtn}
            >
              <Image
                style={styles.networkImage}
                source={this.currentNetworkType.localImage}
              />
            </Button>
          )}
          {!!this.props.customRightComponent && this.props.customRightComponent}
        </View>
        {this.hasError && (
          <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16
  },
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewHistoryText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0084ff'
  },
  label: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18
  },
  contactName: {
    fontSize: 10,
    marginTop: 10,
    color: config.colors.black,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  placeholder: {
    fontSize: 18,
    color: '#C7C7CD'
  },
  inputBtn: {
    flex: 1,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  hasError: {
    borderColor: config.colors.red
  },
  errorMessage: {
    fontSize: 16,
    color: config.colors.red,
    fontWeight: '400',
    marginTop: 8
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    textAlign: 'left'
  },
  phoneBtn: {
    flex: 1
  },
  contactBtn: {
    paddingLeft: 32
  },
  phoneBook: {
    width: 28,
    height: 28
  },
  enterContact: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  networkBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16
  },
  networkImage: {
    marginTop: 13,
    width: 46,
    height: 46,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8
  }
});

export default EnterPhone;
