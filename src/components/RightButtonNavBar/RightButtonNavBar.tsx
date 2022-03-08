import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from '../../config';
import store from '../../store';
import {RightButtonNavBarProps} from '.';
import {RIGHT_BUTTON_TYPE} from './constants';
import {NotiBadge} from '../Badges';
import {autorun} from 'mobx';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';
import {saveImage} from '../../helper/image';
import {BUNDLE_ICON_SETS} from 'src/constants';
import {IWrappedComponent} from 'mobx-react';
import {share} from 'app-helper/share';

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: appConfig.device.isAndroid ? 4 : 0,
  },
  icon: {
    color: '#fff',
    fontSize: 26,
  },
  notiContainer: {
    right: -4,
    top: appConfig.device.isAndroid ? -2 : -4,
    borderColor: '#fff',
    borderWidth: 0.5,
    height: 16,
    minWidth: 16,
    //@ts-ignore
    // ...elevationShadowStyle(2)
  },
});

class RightButtonNavBar extends Component<RightButtonNavBarProps> {
  state = {
    noti: 0,
  };
  autoUpdateDisposer = () => {};

  componentDidMount() {
    this.updateNoti();
  }

  componentWillUnmount() {
    this.autoUpdateDisposer();
  }

  get icon() {
    if (this.props.icon) return this.props.icon;
    let Icon = this.props.iconBundle
        ? BUNDLE_ICON_SETS[this.props.iconBundle]
        : Ionicons,
      iconName = this.props.iconName || '',
      extraStyle = {};

    if (!iconName) {
      switch (this.props.type) {
        case RIGHT_BUTTON_TYPE.SHOPPING_CART:
          iconName = 'ios-cart';
          break;
        case RIGHT_BUTTON_TYPE.CHAT:
          iconName = 'ios-chatbubble-ellipses-outline';
          break;
        case RIGHT_BUTTON_TYPE.SHARE:
          iconName = 'ios-share-social';
          break;
        case RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE:
          iconName = 'ios-download-outline';
          break;
        case RIGHT_BUTTON_TYPE.MORE:
          iconName = 'ios-ellipsis-vertical';
          break;
      }
    }

    return (
      <Icon
        name={iconName}
        style={[styles.icon, extraStyle, this.props.iconStyle]}
      />
    );
  }

  handlePressIcon() {
    if (typeof this.props.onPress === 'function') {
      this.props.onPress();
      return;
    }
    switch (this.props.type) {
      case RIGHT_BUTTON_TYPE.SHOPPING_CART:
        this.handlePressCart();
        break;
      case RIGHT_BUTTON_TYPE.CHAT:
        this.handlePressChat();
        break;
      case RIGHT_BUTTON_TYPE.SHARE:
        this.handlePressShare();
        break;
      case RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE:
        this.handlePressDownloadImage();
        break;
      case RIGHT_BUTTON_TYPE.MORE:
        this.handlePressMore();
        break;
    }
  }

  handlePressCart() {
    if (store.cart_data && store.cart_products) {
      if (store.cart_data.address_id != 0) {
        Actions.push(appConfig.routes.paymentConfirm, {
          goConfirm: true,
        });
      } else if (isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)) {
        Actions.push(appConfig.routes.myAddress, {
          redirect: 'confirm',
          goBack: true,
          isVisibleStoreAddress: true,
        });
      } else {
        Actions.create_address({
          redirect: 'confirm',
        });
      }
    } else {
      Actions.push(appConfig.routes.ordersTab);
    }
  }

  handlePressChat() {
    const store_data = store.store_data || {};
    const user_info = store.user_info || {};
    const site_id = this.props.siteId || store_data.id;

    Actions.amazing_chat({
      titleStyle: {width: 220},
      phoneNumber: store_data.tel,
      title: store_data.name,
      site_id: site_id,
      user_id: user_info.id,
    });
  }

  async handlePressShare() {
    const message = this.props.shareTitle;
    const url = this.props.shareURL;
    share(undefined, `Xem ${message} tại ${url}`);
  }

  handlePressDownloadImage() {
    saveImage(this.props?.imageUrl);
  }

  handlePressMore = () => {
    Actions.push(appConfig.routes.modalActionSheet, {
      options: this.props.moreOptions,
      onPress: this.props.onPressMoreAction,
      ...this.props.moreActionsProps,
    });
  };

  updateNoti() {
    this.autoUpdateDisposer = autorun(() => {
      switch (this.props.type) {
        case RIGHT_BUTTON_TYPE.SHOPPING_CART:
          if (
            (store.cart_data && store.cart_data.count !== this.state.noti) ||
            (!store.cart_data && this.state.noti)
          ) {
            this.setState({noti: store.cart_data ? store.cart_data.count : 0});
          }
          break;
        case RIGHT_BUTTON_TYPE.CHAT:
          if (
            (store.notify && store.notify.notify_chat !== this.state.noti) ||
            (!store.notify && this.state.noti)
          ) {
            this.setState({noti: store.notify ? store.notify.notify_chat : 0});
          }
          break;
      }
    });
  }

  render() {
    if (this.props.type === RIGHT_BUTTON_TYPE.SHARE && !this.props.shareURL)
      return null;

    const TouchableComponent = this.props.touchableOpacity
      ? TouchableOpacity
      : TouchableHighlight;

    return (
      <TouchableComponent
        underlayColor="transparent"
        onPress={this.handlePressIcon.bind(this)}>
        <View style={[styles.right_btn_add_store, this.props.containerStyle]}>
          {this.icon}
          <NotiBadge
            animation
            show={this.state.noti}
            label={this.state.noti}
            containerStyle={styles.notiContainer}
          />
        </View>
      </TouchableComponent>
    );
  }
}

//@ts-ignore
export default observer(RightButtonNavBar) as typeof RightButtonNavBar &
  IWrappedComponent<RightButtonNavBarProps>;
