import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';
import phoneBookImage from '../../assets/images/phone-book.png';
import config from '../../config';
import Button from 'react-native-button';

const defaultListener = () => {};

class EnterPhone extends Component {
  static propTypes = {
    data: PropTypes.array,
    hideChangeNetwork: PropTypes.bool,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    onOpenContact: PropTypes.func,
    onPressSelectNetwork: PropTypes.func,
    networkType: PropTypes.string
  };

  static defaultProps = {
    data: [],
    hideChangeNetwork: false,
    contactName: 'Đặng Ngọc Sơn',
    contactPhone: '035 353 8222',
    onOpenContact: defaultListener,
    onPressSelectNetwork: defaultListener,
    networkType: ''
  };

  get currentNetworkType() {
    return this.props.data.find(
      network => network.type === this.props.networkType
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Nạp đến</Text>
        <Text style={styles.contactName}>{this.props.contactName}</Text>

        <View style={styles.enterContact}>
          <View style={styles.inputBtn}>
            <Button
              containerStyle={styles.phoneBtn}
              onPress={this.props.onOpenContact}
            >
              <Text style={styles.input}>{this.props.contactPhone}</Text>
            </Button>
            <Button
              containerStyle={styles.contactBtn}
              onPress={this.props.onOpenContact}
            >
              <Image style={styles.phoneBook} source={phoneBookImage} />
            </Button>
          </View>

          {!this.props.hideChangeNetwork && (
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
        </View>
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
  input: {
    fontSize: 24,
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
