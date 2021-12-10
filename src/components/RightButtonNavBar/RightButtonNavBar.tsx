import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
// 3-party libs
import {autorun} from 'mobx';
import {Actions} from 'react-native-router-flux';
import {IWrappedComponent} from 'mobx-react';
// types
import {RightButtonNavBarProps} from '.';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {share} from 'app-helper/share';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {saveImage} from 'app-helper/image';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {RIGHT_BUTTON_TYPE} from './constants';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {BundleIconSetName} from 'src/components/base';
// custom components
import {NotiBadge} from '../Badges';
import {BaseButton, Icon} from 'src/components/base';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingVertical: 1,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: appConfig.device.isAndroid ? 4 : 0,
  },
  icon: {
    fontSize: 26,
  },
  notiContainer: {
    right: -4,
    top: appConfig.device.isAndroid ? -2 : -4,
    height: 16,
    minWidth: 16,
  },
});

class RightButtonNavBar extends Component<RightButtonNavBarProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    iconBundle: BundleIconSetName.IONICONS,
  };

  state = {
    noti: 0,
  };
  autoUpdateDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.updateNoti();
  }

  componentWillUnmount() {
    this.autoUpdateDisposer();
  }

  get icon() {
    if (this.props.icon) return this.props.icon;
    let iconName = this.props.iconName || '',
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
        bundle={this.props.iconBundle}
        name={iconName}
        style={[this.iconStyle, extraStyle, this.props.iconStyle]}
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
        push(
          appConfig.routes.paymentConfirm,
          {
            goConfirm: true,
          },
          this.theme,
        );
      } else if (isConfigActive(CONFIG_KEY.PICK_UP_AT_THE_STORE_KEY)) {
        push(
          appConfig.routes.myAddress,
          {
            redirect: 'confirm',
            goBack: true,
            isVisibleStoreAddress: true,
          },
          this.theme,
        );
      } else {
        servicesHandler({
          type: SERVICES_TYPE.CREATE_ADDRESS,
          theme: this.theme,
          redirect: 'confirm',
        });
      }
    } else {
      push(appConfig.routes.ordersTab, {}, this.theme);
    }
  }

  handlePressChat() {
    const store_data = store.store_data || {};
    const user_info = store.user_info || {};
    const site_id = this.props.siteId || store_data.id;

    push(
      appConfig.routes.amazingChat,
      {
        titleStyle: {width: 220},
        phoneNumber: store_data.tel,
        title: store_data.name,
        site_id: site_id,
        user_id: user_info.id,
      },
      this.theme,
    );
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

  get notiContainerStyle() {
    return mergeStyles(styles.notiContainer, {
      borderColor: this.theme.color.onPrimary,
      borderWidth: this.theme.layout.borderWidthSmall,
    });
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {
      color: this.theme.color.onPrimary,
    });
  }

  render() {
    if (this.props.type === RIGHT_BUTTON_TYPE.SHARE && !this.props.shareURL) {
      return null;
    }

    return (
      <BaseButton
        useTouchableHighlight={this.props.touchableHighlight}
        onPress={this.handlePressIcon.bind(this)}>
        <View style={[styles.right_btn_add_store, this.props.containerStyle]}>
          {this.icon}
          <NotiBadge
            animation
            show={this.state.noti}
            label={this.state.noti}
            containerStyle={this.notiContainerStyle}
          />
        </View>
      </BaseButton>
    );
  }
}

//@ts-ignore
export default observer(RightButtonNavBar) as typeof RightButtonNavBar &
  IWrappedComponent<RightButtonNavBarProps>;
