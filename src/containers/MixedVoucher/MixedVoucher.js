import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {TabBar, TabView} from 'react-native-tab-view';
// configs
import config from 'src/packages/tickid-voucher/config';
import appConfig from 'app-config'
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {USE_ONLINE} from 'src/packages/tickid-voucher/constants';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import BaseContainer from 'src/packages/tickid-voucher/container/BaseContainer';
import MyVoucher from 'src/packages/tickid-voucher/container/MyVoucher';
import StoreVoucher from 'src/packages/tickid-voucher/container/Voucher';
import {ScreenWrapper, BaseButton, Typography, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 0,
  },
  tabBarLabel: {
    minWidth: '100%',
    flex: config.device.isIOS ? undefined : 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
  },
  indicatorStyle: {
    height: 2,
  },
  tabBarItemContainerStyle: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getVoucherWrapper: {
    paddingHorizontal: 7.5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  getVoucherBtn: {
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
});

const defaultFn = () => {};

const MAX_TAB_ITEMS_PER_ROW = 2;

class MixedVoucher extends BaseContainer {
  static contextType = ThemeContext;

  static propTypes = {
    mode: PropTypes.string,
    from: PropTypes.oneOf(['home']),
    siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onUseVoucherOnlineSuccess: PropTypes.func,
    onUseVoucherOnlineFailure: PropTypes.func,
    forceReload: PropTypes.func,
  };

  static defaultProps = {
    mode: '',
    from: undefined,
    siteId: '',
    onUseVoucherOnlineSuccess: defaultFn,
    onUseVoucherOnlineFailure: defaultFn,
    forceReload: defaultFn,
  };

  state = {
    refreshing: false,
    apiFetching: false,
    campaigns: [],

    routes: [
      {
        key: '0',
        title: this.props.t('mixedVoucherTabs.myVoucher'),
      },
      {
        key: '1',
        title: this.props.t('mixedVoucherTabs.storeVoucher'),
      },
    ],
    index: 0,
  };
  eventTracker = new EventTracker();
  refMyVoucher = React.createRef();

  updateNavBarDisposer = () => {};

  initLayout = {width: appConfig.device.width};

  get theme() {
    return getTheme(this);
  }

  get tabBarLabelActiveStyle() {
    return mergeStyles(styles.tabBarLabelActive, {
      color: this.theme.color.primaryHighlight,
    });
  }

  get indicatorStyle() {
    return {
      backgroundColor: this.theme.color.primaryHighlight,
    };
  }

  get tabBarStyle() {
    return {
      backgroundColor: this.theme.color.surface,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  handleOnRefresh = () => {
    if (this.refMyVoucher.current) {
      this.refMyVoucher.current.handleOnRefresh();
    }
  };

  handleIndexChange = (index) => {
    this.setState({index});
  };

  renderTabBarLabel(props) {
    const {
      route: {title, key},
    } = props;
    const focused = key === this.state.index.toString();

    return (
      <Typography
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        numberOfLines={2}
        style={[styles.tabBarLabel, focused && this.tabBarLabelActiveStyle]}>
        {title}
      </Typography>
    );
  }

  renderTabBar(props) {
    const numberOfTabs = this.state.routes.length;
    const tabWidth =
      numberOfTabs <= MAX_TAB_ITEMS_PER_ROW
        ? config.device.width / numberOfTabs
        : config.device.width / MAX_TAB_ITEMS_PER_ROW;
    return (
      <TabBar
        {...props}
        renderTabBarItem={(props) => {
          return (
            <BaseButton
              style={[{width: tabWidth}, styles.tabBarItemContainerStyle]}
              key={props.route.key}
              onPress={() => {
                this.setState({index: Number(props.route.key)});
              }}>
              {this.renderTabBarLabel(props)}
            </BaseButton>
          );
        }}
        indicatorStyle={[this.indicatorStyle, styles.indicatorStyle]}
        style={[this.tabBarStyle, styles.tabBarStyle]}
        tabStyle={{width: tabWidth}}
      />
    );
  }

  renderScene({route: {key, type}}) {
    switch (key) {
      case '0':
        return (
          <MyVoucher
            ref={this.refMyVoucher}
            onUseVoucherOnlineSuccess={this.props.onUseVoucherOnlineSuccess}
            onUseVoucherOnlineFailure={this.props.onUseVoucherOnlineFailure}
            siteId={this.props.siteId}
            orderId={this.props.orderId}
            orderType={this.props.orderType}
            mode={USE_ONLINE}
          />
        );
      case '1':
        return (
          <StoreVoucher
            t={this.props.t}
            isDisableHeader={true}
            onGetVoucherSuccess={this.handleOnRefresh}
            onUseVoucherOnlineSuccess={this.props.onUseVoucherOnlineSuccess}
          />
        );
    }
  }

  renderIconBtnEnterCode = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_ICONS}
        name="text-fields"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  renderIconBtnScanCode = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.IONICONS}
        name="scan"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  render() {
    return (
      <ScreenWrapper>
        <TabView
          navigationState={this.state}
          renderTabBar={this.renderTabBar.bind(this)}
          renderScene={this.renderScene.bind(this)}
          onIndexChange={this.handleIndexChange}
          initialLayout={this.initLayout}
        />
      </ScreenWrapper>
    );
  }
}

export default withTranslation('voucher', 'common')(observer(MixedVoucher));
