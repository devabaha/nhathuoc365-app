import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appConfig from '../../config';
import store from '../../store';
import {RightButtonNavBarProps} from '.';
import {RIGHT_BUTTON_TYPE} from './constants';
import {NotiBadge} from '../Badges';
import {autorun} from 'mobx';
import {CONFIG_KEY, isConfigActive} from '../../helper/configKeyHandler';
import {saveImage} from '../../helper/image';

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
    let Icon = Ionicons,
      name = '',
      extraStyle = {};
    switch (this.props.type) {
      case RIGHT_BUTTON_TYPE.SHOPPING_CART:
        name = 'ios-cart';
        break;
      case RIGHT_BUTTON_TYPE.CHAT:
        name = 'ios-chatbubles';
        break;
      case RIGHT_BUTTON_TYPE.SHARE:
        name = 'ios-share-social';
        break;
      case RIGHT_BUTTON_TYPE.DOWNLOAD_IMAGE:
        name = 'ios-download-outline';
    }

    return (
      <Icon
        name={name}
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
    }
  }

  handlePressCart() {
    if (store.cart_data && store.cart_products) {
      if (store.cart_data.address_id != 0) {
        Actions.push(appConfig.routes.paymentConfirm, {
          goConfirm: true,
        });
      } else if (isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)){
        Actions.push(appConfig.routes.myAddress, {
          redirect: 'confirm',
          goBack: true,
          isVisibleStoreAddress: true,
  
        })
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
    try {
      const message = this.props.shareTitle;
      const url = this.props.shareURL;
      const shareContent = url
        ? {url, message: `Xem ${message} tại ${url}`}
        : {message};

      const result = await Share.share(shareContent, {
        dialogTitle: message,
        tintColor: appConfig.colors.primary,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('%cerror_sharing', 'color: red', error);
      //@ts-ignore
      flashShowMessage({
        type: 'danger',
        message: 'Chia sẻ không thành công! Bạn vui lòng thử lại sau!',
      });
    }
  }

  handlePressDownloadImage() {
    saveImage(this.props?.imageUrl || '')
  }

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
export default observer(RightButtonNavBar);