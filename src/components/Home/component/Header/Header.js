import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Button from 'react-native-button';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';

function Header(props) {
  const { t } = useTranslation('home');
  return (
    <View style={styles.container}>
      <Text style={styles.userNameWrapper}>
        <Text style={styles.userName}>{t('welcome.message')}</Text>
        <Text style={[styles.userName, styles.userNameBold]}>
          {props.name ? `, ${props.name}` : ''}
        </Text>
      </Text>

      <View style={styles.notificationWrapper}>
        <Button
          containerStyle={styles.notificationBtn}
          onPress={props.onPressNoti}
        >
          <AntDesignIcon
            style={styles.iconNotication}
            name="message1"
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

      {/* DEMO SCHEDULE FUNCTION */}
      <Button
        containerStyle={{ position: 'absolute', right: 70, top: 40 }}
        onPress={() => Actions.push(appConfig.routes.schedule)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}> Đặt lịch</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    paddingTop: appConfig.device.isIphoneX
      ? 35
      : appConfig.device.isIOS
      ? 25
      : 15
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
    position: 'relative',
    ...elevationShadowStyle(5)
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
