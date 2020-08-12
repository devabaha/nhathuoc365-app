/* @flow */

import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../store/Store';
import { NotiBadge } from './Badges';
import appConfig from 'app-config';

const AnimatedNoti = Animated.createAnimatedComponent(NotiBadge);
@observer
export default class RightButtonOrders extends Component {
  state = {
    noti: store.cart_data ? store.cart_data.count : 0,
    animatedNoti: new Animated.Value(0),
    animatedNotiBounce: new Animated.Value(0)
  };

  updateNoti() {
    if (
      (store.cart_data && store.cart_data.count !== this.state.noti) ||
      (!store.cart_data && this.state.noti)
    ) {
      this.setState({ noti: store.cart_data ? store.cart_data.count : 0 });
      this.activeNotiAnimation();
    }
  }

  activeNotiAnimation() {
    Animated.parallel(
      [
        Animated.sequence([
          Animated.timing(this.state.animatedNoti, {
            toValue: 1,
            duration: 100,
            easing: Easing.quad,
            useNativeDriver: true
          }),
          Animated.delay(200),
          Animated.timing(this.state.animatedNoti, {
            toValue: -1,
            duration: 200,
            easing: Easing.elastic(0.5),
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedNoti, {
            toValue: 1,
            duration: 200,
            easing: Easing.elastic(0.5),
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedNoti, {
            toValue: 0,
            duration: 100,
            easing: Easing.elastic(0.5),
            useNativeDriver: true
          })
        ]),

        Animated.sequence([
          Animated.timing(this.state.animatedNotiBounce, {
            toValue: -1,
            duration: 200,
            easing: Easing.quad,
            useNativeDriver: true
          }),
          Animated.delay(50),
          Animated.timing(this.state.animatedNotiBounce, {
            toValue: 1,
            duration: 200,
            easing: Easing.quad,
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedNotiBounce, {
            toValue: 2,
            duration: 200,
            easing: Easing.elastic(0.5),
            useNativeDriver: true
          }),
          Animated.timing(this.state.animatedNotiBounce, {
            toValue: 0,
            duration: 200,
            easing: Easing.quad,
            useNativeDriver: true
          })
        ])
      ],
      { stopTogether: false }
    ).start(({ finished }) => {
      if (finished) {
        this.state.animatedNoti.setValue(0);
        this.state.animatedNotiBounce.setValue(0);
      }
    });
  }

  goToOrders = () => {
    if (store.cart_data) {
      if (store.cart_data.address_id != 0) {
        if (store.cart_data.length !== 0) {
          Actions.push(appConfig.routes.paymentConfirm, {
            goConfirm: true
          });
        } else {
          Actions.store_orders({
            store_id: this.props.store_id || undefined,
            title: this.props.title || undefined,
            tel: this.props.tel || undefined,
            hideContinue: true
          });
        }
      } else {
        Actions.create_address({
          redirect: 'confirm'
        });
      }
    } else {
      Actions.store_orders({
        store_id: this.props.store_id || undefined,
        title: this.props.title || undefined,
        tel: this.props.tel || undefined,
        hideContinue: true
      });
    }
  };

  animatedNoti() {
    return {
      transform: [
        {
          scaleX: this.state.animatedNoti.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0.8, 1, 1.25]
          })
        },
        {
          translateY: this.state.animatedNotiBounce.interpolate({
            inputRange: [-1, 0, 1, 2],
            outputRange: [2, 0, -3, 2]
          })
        }
      ]
    };
  }

  render() {
    this.updateNoti();

    return (
      <TouchableOpacity underlayColor="transparent" onPress={this.goToOrders}>
        <View style={styles.right_btn_add_store}>
          {this.props.icon || (
            <Icon name="shopping-cart" size={20} color="#ffffff" />
          )}
          {!!this.state.noti && (
            <AnimatedNoti
              label={this.state.noti}
              containerStyle={{ right: -4, top: isAndroid ? -2 : -4 }}
              style={this.animatedNoti()}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingVertical: 1,
    paddingLeft: 8,
    paddingRight: 4,
    paddingTop: 2,
    ...elevationShadowStyle(7)
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
