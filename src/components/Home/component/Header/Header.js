import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';

function Header(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.userNameWrapper}>
        <Text style={styles.userName}>Xin chào</Text>
        <Text style={[styles.userName, styles.userNameBold]}>
          {props.name ? `, ${props.name}` : ''}
        </Text>
      </Text>

      <View style={styles.notificationWrapper}>
        <Button
          containerStyle={styles.notificationBtn}
          onPress={props.onPressNoti}
        >
          <Icon
            style={styles.iconNotication}
            name="bell"
            size={24}
            color="#fff"
            solid
          />
          {props.notify.notify_chat > 0 && (
            <View style={styles.notifyWrapper}>
              <Text style={styles.notify}>{props.notify.notify_chat}</Text>
            </View>
          )}
        </Button>
      </View>

      {/** TEST FLOW FOR SERVICE ORDERS */}
      <Button
        containerStyle={{ position: 'absolute', top: 45, left: 250 }}
        onPress={() => Actions.push(appConfig.routes.serviceOrders)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đơn dịch vụ</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    paddingTop: appConfig.device.isIphoneX ? 35 : 25
  },
  notificationWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    fontWeight: 'bold'
  },
  notificationBtn: {
    paddingTop: 12,
    paddingLeft: 8,
    paddingBottom: 8,
    position: 'relative'
  },
  iconNotication: {},
  userNameWrapper: {
    marginTop: 16,
    flex: 1
  },
  userName: {
    fontWeight: '500',
    fontSize: 16,
    color: '#FAFAFA'
  },
  userNameBold: {
    fontWeight: 'bold'
  },
  notifyWrapper: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: -8,
    right: -8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  notify: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});

Header.propTypes = {
  name: PropTypes.string,
  notify: PropTypes.object
};

Header.defaultProps = {
  name: '',
  notify: {}
};

export default Header;
