import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {isActivePackageOptionConfig} from 'app-helper/packageOptionsHandler';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {PACKAGE_OPTIONS_TYPE} from 'app-helper/packageOptionsHandler';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import History from './History';
import Info from './Info';
import Loading from 'src/components/Loading';
import PointRechargeButton from 'src/components/Home/component/PrimaryActions/PointRechargeButton';
import {
  FlatList,
  Typography,
  Icon,
  ScreenWrapper,
  Container,
  BaseButton,
} from 'src/components/base';

class VndWallet extends Component {
  static contextType = ThemeContext;

  state = {
    historiesData: null,
    wallet: this.props.wallet,
    activeTab: 0,
    loading: true,
  };

  unmounted = false;
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this._getWallet();
    if (this.props.tabIndex) {
      setTimeout(() => this.changeActiveTab(this.props.tabIndex));
    }
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  async _getWallet() {
    // user_coins_wallet
    try {
      const response = await APIHandler.user_wallet_history(
        this.state.wallet.zone_code,
      );
      console.log(response);
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          this.setState({historiesData: response.data.histories});
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
        });
    }
  }

  _goTransfer() {
    push(
      appConfig.routes.transfer,
      {
        wallet: this.state.wallet,
        address: this.state.wallet.address,
      },
      this.theme,
    );
  }

  _goQRCode() {
    const {t} = this.props;

    push(
      appConfig.routes.qrBarCode,
      {
        title: t('common:screen.qrBarCode.walletAddressTitle'),
        wallet: this.state.wallet,
        address: this.state.wallet.address,
      },
      this.theme,
    );
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    pageNum < 0 && (pageNum = 0);
    this.changeActiveTab(pageNum);
  }

  changeActiveTab = (activeTab) => {
    if (activeTab !== this.state.activeTab) {
      if (this.flatlist) {
        this.flatlist.scrollToIndex({index: activeTab, animated: true});
      }
      if (activeTab !== this.state.activeTab) {
        let state = this.state;
        state.activeTab = activeTab;
        this.setState({...state});
      }
    }
  };

  renderWalletAddress = () => (
    <Icon
      bundle={BundleIconSetName.FONT_AWESOME}
      name="qrcode"
      style={styles.iconQRcode}
    />
  );

  renderTopLabelCoin() {
    const {wallet} = this.state;
    const {t} = this.props;

    return (
      <Container row style={this.topLabelContainerStyle}>
        <Container flex row noBackground>
          <Container flex noBackground>
            <BaseButton
              useTouchableHighlight
              onPress={this._goQRCode.bind(this)}
              style={styles.walletAdressContainer}>
              <View
                style={[
                  styles.add_store_action_btn_box,
                  this.tabRightSeparatorStyle,
                ]}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.add_store_action_label}
                  renderIconBefore={this.renderWalletAddress}>
                  {t('common:screen.qrBarCode.walletAddressTitle')}
                </Typography>
              </View>
            </BaseButton>
          </Container>

          {isActivePackageOptionConfig(PACKAGE_OPTIONS_TYPE.TOP_UP) && (
            <Container flex noBackground>
              <PointRechargeButton
                label={t('header.topUp')}
                wrapperStyle={styles.pointRechargeWrapperStyle}
                containerStyle={[
                  styles.pointRechargeContainerStyle,
                  styles.add_store_action_btn_box,
                  this.tabRightSeparatorStyle,
                ]}
              />
            </Container>
          )}
        </Container>

        <BaseButton useTouchableHighlight style={styles.add_store_action_btn}>
          <Container style={styles.balanceContainer} flex noBackground>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.add_store_action_label_balance}
              renderInlineIconBefore={() => (
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME}
                  name="ticket"
                  style={styles.rightIcon}
                />
              )}>
              {'  '}
              {t('header.balance')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_HUGE_PRIMARY}
              style={[
                styles.add_store_action_content,
                {
                  color: wallet.color,
                },
              ]}>
              {wallet.balance_view}
            </Typography>
          </Container>
        </BaseButton>
      </Container>
    );
  }

  get topLabelContainerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  get tabRightSeparatorStyle() {
    return {
      borderRightColor: this.theme.color.border,
      borderRightWidth: this.theme.layout.borderWidth,
    };
  }

  get activeTabStyle() {
    return [
      styles.activeTab,
      {
        borderBottomColor: this.theme.color.primaryHighlight,
      },
    ];
  }

  render() {
    const {wallet, activeTab, historiesData} = this.state;
    const {t} = this.props;
    const data = [
      {
        key: 0,
        title: t('tabs.history.title'),
        component: (
          <History loading={this.state.loading} historyData={historiesData} />
        ),
      },
      // {
      //   key: 1,
      //   title: 'Nạp tiền',
      //   component: <Recharge />
      // },
      // {
      //   key: 2,
      //   title: 'Rút tiền',
      //   component: <Withdraw />
      // },
      {
        key: 1,
        title: t('tabs.information.title'),
        component: (
          <Info loading={this.state.loading} content={wallet?.content} />
        ),
      },
    ];
    const tabHeader = data.map((d, i) => (
      <BaseButton
        useTouchableHighlight
        key={d.key}
        style={[styles.tabStyle, d.key === activeTab && this.activeTabStyle]}
        onPress={() => this.changeActiveTab(d.key)}>
        <View style={i !== data.length - 1 && this.tabRightSeparatorStyle}>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[
              {
                textAlign: 'center',
              },
              d.key === activeTab && {fontWeight: 'bold'},
            ]}>
            {d.title}
          </Typography>
        </View>
      </BaseButton>
    ));
    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        <Container flex noBackground>
          {this.renderTopLabelCoin()}
          <Container row>{tabHeader}</Container>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={(ref) => (this.flatlist = ref)}
            data={data}
            keyExtractor={(item) => item.key.toString()}
            horizontal={true}
            pagingEnabled
            style={styles.contentContainerStyle}
            onMomentumScrollEnd={this._onScrollEnd.bind(this)}
            getItemLayout={(data, index) => {
              return {
                length: appConfig.device.width,
                offset: appConfig.device.width * index,
                index,
              };
            }}
            renderItem={({item, index}) => {
              return item.component;
            }}
          />
        </Container>
        <View />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  add_store_action_btn: {
    flex: 1,
    paddingVertical: 10,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  add_store_action_label: {
    marginTop: 4,
    textAlign: 'center',
  },
  add_store_action_label_balance: {
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'left',
  },
  add_store_action_content: {
    textAlign: 'right',
    marginTop: 5,
    fontWeight: '800',
    flex: 1,
  },
  contentContainerStyle: {
    width: appConfig.device.width,
  },
  tabStyle: {
    flex: 1,
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 4,
  },
  iconQRcode: {
    fontSize: 30,
  },
  rightIcon: {
    fontSize: 16,
  },
  pointRechargeWrapperStyle: {
    flex: 1,
    paddingVertical: 10,
  },
  pointRechargeContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  balanceContainer: {
    paddingHorizontal: 15,
  },
  walletAdressContainer: {
    paddingVertical: 10,
  },
});

export default withTranslation(['vndWallet', 'common'])(observer(VndWallet));
