import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { Actions } from 'react-native-router-flux';
import appConfig from '../../config';
import store from '../../store';

class Launch extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.handleAuthorization();
  }

  handleAuthorization = async () => {
    try {
      const response = await APIHandler.user_login({
        fb_access_token: ''
      });
      this.handleAuthWithResponse(response);
    } catch (error) {
      console.log(error);
    }
  };

  handleAuthWithResponse = response => {
    switch (response.status) {
      case STATUS_SUCCESS:
        store.setUserInfo(response.data);
        Actions.replace(appConfig.routes.primaryTabbar);
        break;
      case STATUS_FILL_INFO_USER:
        store.setUserInfo(response.data);
        Actions.op_register({
          title: 'Đăng ký thông tin',
          name_props: response.data.name
        });
        break;
      case STATUS_UNDEFINE_USER:
        store.setUserInfo(response.data);
        Actions.login();
        break;
      default:
        showMessage({
          message: response.message || 'Kết nối với máy chủ thất bại',
          type: 'danger'
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Đang kết nối...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: appConfig.device.bottomSpace,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '400'
  }
});

export default Launch;
