/* @flow */

import React, { Component } from 'react';
import { View, Alert, StyleSheet, TouchableHighlight } from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../store/Store';
import Communications from 'react-native-communications';

const DEFAULT_USER_NAME = 'Người dùng';

@observer
export default class RightButtonCall extends Component {
  static defaultProps = {
    userName: '',
    tel: ''
  };
  handleCall() {
    let userName = DEFAULT_USER_NAME;
    if (this.props.userName) {
      userName += ' ' + this.props.userName.trim();
    }

    if (this.props.tel && this.props.tel != '') {
      Communications.phonecall(this.props.tel, true);
    } else {
      Alert.alert(
        'Không thể liên lạc',
        userName + ' chưa đăng ký số điện thoại',
        [{ text: 'Đã hiểu' }]
      );
    }
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this.handleCall.bind(this)}
      >
        <View style={styles.right_btn_add_store}>
          <Icon name="phone" size={22} color="#ffffff" />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 8 : 4
  },
  right_btn_box: {
    flexDirection: 'row'
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 2
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});
