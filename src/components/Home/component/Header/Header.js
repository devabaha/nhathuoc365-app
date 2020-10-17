import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import store from 'app-store';

class Header extends Component {
  render() {
    const { t, ...props } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.userNameWrapper}>
          <TouchableOpacity onPress={props.goToSearch}>
            <View pointerEvents="none" style={styles.searchWrapper}>
              <Ionicons
                size={20}
                color="#ccc"
                style={styles.searchIcon}
                name="ios-search"
              />
              <TextInput
                style={styles.searchInput}
                placeholder={
                  t('stores:search.placeholder.prefix') +
                  ' ' +
                  // (store.store_data ? store.store_data.name : '') +
                  (store.isHomeLoaded
                    ? store.store_data
                      ? store.store_data.name || APP_NAME_SHOW
                      : APP_NAME_SHOW
                    : '') +
                  '...'
                }
                placeholderTextColor="#ccc"
                numberOfLines={1}
              />
            </View>
          </TouchableOpacity>
        </View>

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

        {/* DEMO SCHEDULE FUNCTION */}
        {/* <Button
        containerStyle={{ position: 'absolute', right: 70, top: 40 }}
        onPress={() => Actions.push(appConfig.routes.schedule)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}> Đặt lịch</Text>
      </Button> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    paddingTop: appConfig.device.isIphoneX ? 35 : 25,
    alignItems: 'center'
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
    // marginTop: 16,
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
  },
  searchWrapper: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...ifIphoneX(
      {
        marginTop: 4,
        marginBottom: 8
      },
      {
        marginVertical: appConfig.device.isIOS === 'ios' ? 6 : 8
      }
    )
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: appConfig.colors.white
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

export default withTranslation(['home', 'stores'])(observer(Header));
