import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Modal, StyleSheet } from 'react-native';
import closeImage from '../../assets/images/close_lint.png';
import Button from 'react-native-button';
import config from '../../config';

const defaultListener = () => {};

class ModalAllowPermisson extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    transparent: PropTypes.bool,
    onClose: PropTypes.func,
    onAllowAccessContacts: PropTypes.func
  };

  static defaultProps = {
    visible: false,
    transparent: true,
    onClose: defaultListener,
    onAllowAccessContacts: defaultListener
  };

  render() {
    return (
      <Modal
        animationType="fade"
        visible={this.props.visible}
        transparent={this.props.transparent}
        onRequestClose={this.props.onClose}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.heading}>Cho phép truy cập Danh bạ</Text>
            <Text style={styles.text}>
              {`Vui lòng cho phép ${config.appName} truy cập Danh bạ để chọn số điện thoại nhanh hơn.`}
            </Text>
            <Text style={styles.text}>
              Nhấn "Cho phép truy cập" và Đồng ý / OK
            </Text>
            <Text style={[styles.text, styles.or]}>Hoặc:</Text>
            <Text style={styles.text}>1. Vào mục Cài đặt / Settings</Text>
            <Text
              style={styles.text}
            >{`2. Tìm chọn icon ${config.appName}`}</Text>
            <Text style={styles.text}>
              3. Bật quyền truy cập Danh bạ / Contacts
            </Text>
            <Button
              style={styles.allowBtnText}
              containerStyle={styles.allowBtn}
              onPress={this.props.onAllowAccessContacts}
            >
              Cho phép truy cập
            </Button>

            <Button
              containerStyle={styles.closeBtn}
              onPress={this.props.onClose}
            >
              <Image source={closeImage} style={styles.closeImg} />
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  content: {
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    position: 'relative'
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  text: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
    marginTop: 6
  },
  or: {
    fontWeight: 'bold',
    marginTop: 16
  },
  allowBtnText: {
    color: config.colors.white,
    fontSize: 15,
    fontWeight: 'bold'
  },
  allowBtn: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 24
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10
  },
  closeImg: {
    width: 14,
    height: 14
  }
});

export default ModalAllowPermisson;
