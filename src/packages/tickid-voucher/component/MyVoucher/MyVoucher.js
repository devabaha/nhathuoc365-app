import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import LoadingComponent from '@tickid/tickid-rn-loading';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {
  Container,
  FlatList,
  ScreenWrapper,
  Icon,
  RefreshControl,
} from 'src/components/base';
import MyVoucherItem from './MyVoucherItem';
import NoResult from '../NoResult';
import Button from 'src/components/Button';

const defaultListener = () => {};

class MyVoucher extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onPressVoucher: PropTypes.func,
    onPressEnterVoucher: PropTypes.func,
    onPressUseOnline: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    apiFetching: PropTypes.bool,
    isUseOnlineMode: PropTypes.bool,
    campaigns: PropTypes.array,
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onPressEnterVoucher: defaultListener,
    onPressUseOnline: defaultListener,
    onRefresh: defaultListener,
    refreshing: false,
    apiFetching: false,
    isUseOnlineMode: false,
    campaigns: [],
  };

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get totalCampaigns() {
    return this.props.campaigns.length;
  }

  get hasCampaigns() {
    return this.totalCampaigns > 0;
  }

  componentDidMount() {
    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }
  componentWillUnmount() {
    this.updateNavBarDisposer();
  }

  renderMyVouchers() {
    return (
      <FlatList
        data={this.props.campaigns || []}
        keyExtractor={(item) => `${item.data.id}`}
        renderItem={this.renderMyVoucher}
        ListEmptyComponent={
          !this.props.apiFetching && (
            <NoResult
              title={this.props.t('my.noVoucher.title')}
              text={this.props.t('my.noVoucher.description', {
                appName: APP_NAME_SHOW,
              })}
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }

  renderMyVoucher = ({item: voucher, index}) => {
    return (
      <MyVoucherItem
        title={voucher.data.title}
        quantity={voucher.data.quantity}
        remaining={voucher.data.remain_time}
        isUseOnlineMode={this.props.isUseOnlineMode}
        avatar={voucher.data.shop_logo_url}
        onPress={() => this.props.onPressVoucher(voucher)}
        onPressUseOnline={() => this.props.onPressUseOnline(voucher)}
        last={this.totalCampaigns - 1 === index}
      />
    );
  };

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
    const {t} = this.props;
    return (
      <ScreenWrapper>
        {this.props.apiFetching && <LoadingComponent loading />}
        {this.renderMyVouchers()}

        <Container safeLayout style={styles.getVoucherWrapper}>
          <Button
            containerStyle={styles.getVoucherBtn}
            onPress={() => {
              this.props.onPressEnterCode();
            }}
            renderIconLeft={this.renderIconBtnEnterCode}
            // renderTitleComponent={this.renderTitleBtnEnterCode}
          >
            {this.props.t('common:screen.qrBarCode.enterCode')}
          </Button>

          <Button
            containerStyle={styles.getVoucherBtn}
            onPress={() => {
              this.props.onPressEnterVoucher();
            }}
            renderIconLeft={this.renderIconBtnScanCode}>
            {this.props.t('common:screen.qrBarCode.scanCode')}
          </Button>
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
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

export default MyVoucher;
