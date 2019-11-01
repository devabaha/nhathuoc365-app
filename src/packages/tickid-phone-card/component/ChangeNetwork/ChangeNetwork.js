import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import config from '../../config';
import ModalOverlay from '../ModalOverlay';
import checkImage from '../../assets/images/check.png';
import { NETWORKS, VIETTEL_TYPE } from '../../constants';

class ChangeNetwork extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onNetworkChange: PropTypes.func,
    networkType: PropTypes.oneOf(
      Object.values(NETWORKS).map(network => network.type)
    )
  };

  static defaultProps = {
    visible: false,
    onNetworkChange: () => {},
    networkType: VIETTEL_TYPE
  };

  get currentNetworkType() {
    return NETWORKS[this.props.networkType];
  }

  renderNetworks() {
    return Object.values(NETWORKS).map(network => {
      const isActive = this.currentNetworkType.type === network.type;
      return (
        <Button
          key={network.type}
          onPress={() => this.props.onNetworkChange(network)}
          containerStyle={[
            styles.networkBtn,
            isActive && styles.networkBtnActive
          ]}
        >
          <Image style={styles.networkImage} source={network.image} />
          <View style={styles.networkInfoWrapper}>
            <Text style={styles.networkName}>{network.name}</Text>
            <Text style={styles.networkDescription}>{network.description}</Text>
          </View>
          {isActive && <Image style={styles.checkImage} source={checkImage} />}
        </Button>
      );
    });
  }

  render() {
    return (
      <ModalOverlay
        transparent
        visible={this.props.visible}
        heading="Thay đổi nhà mạng"
        onClose={this.props.onClose}
      >
        <View style={styles.body}>
          <Text style={styles.message}>
            Lưu ý chỉ thay đổi nhà mạng khi bạn đã đăng ký chuyển mạng giữ số
            điện thoại
          </Text>

          {this.renderNetworks()}
        </View>
      </ModalOverlay>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  overlayBtn: {
    flex: 1
  },
  content: {
    backgroundColor: config.colors.white,
    minHeight: 40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: config.device.bottomSpace
  },
  body: {
    padding: 16
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginBottom: 20
  },
  submitButton: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14
  },
  submitButtonTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  },
  networkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  networkBtnActive: {
    backgroundColor: '#f1f6f9'
  },
  networkImage: {
    width: 48,
    height: 48,
    borderRadius: 8
  },
  networkInfoWrapper: {
    flex: 1,
    marginLeft: 12
  },
  networkName: {
    fontSize: 16,
    color: config.colors.black,
    fontWeight: '400'
  },
  networkDescription: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
    marginTop: 2
  },
  checkImage: {
    width: 20,
    height: 20
  }
});

export default ChangeNetwork;
