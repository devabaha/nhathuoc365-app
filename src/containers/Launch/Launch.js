import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { config as phoneCardConfig } from '../../packages/tickid-phone-card';
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
      setTimeout(this.handleAuthorization, 1000);
    }
  };

  handleAuthWithResponse = response => {
    const user = response.data;
    // @NOTE: set default name and phone for phone card package
    // phoneCardConfig.defaultContactName = user.name;
    // phoneCardConfig.defaultContactPhone = user.tel;

    switch (response.status) {
      case STATUS_SUCCESS:
        store.setUserInfo(user);
        Actions.replace(appConfig.routes.primaryTabbar);
        break;
      case STATUS_FILL_INFO_USER:
        store.setUserInfo(user);
        Actions.replace('op_register', {
          title: 'Đăng ký thông tin',
          name_props: user.name,
          hideBackImage: true
        });
        break;
      case STATUS_UNDEFINE_USER:
        Actions.replace('login');
        break;
      default:
        setTimeout(this.handleAuthorization, 1000);
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
