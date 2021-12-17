import React, {Component} from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import LoadingComponent from '@tickid/tickid-rn-loading';
// configs
import config from '../../config';
// helpers
import getImageRatio from '../../helper/getImageRatio';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, Card, TypographyType} from 'src/components/base';
// images
import vouchersX2Image from '../../assets/images/vouchers-x2.png';
import iconVoucher from '../../assets/images/icon_voucher.png';
// custom components
import {
  BaseButton,
  Container,
  ScreenWrapper,
  TextButton,
  Typography,
  Icon,
  FlatList,
  ScrollView,
} from 'src/components/base';
import VoucherItem from './VoucherItem';
import NoResult from '../NoResult';
import Image from 'src/components/Image';

const defaultListener = () => {};

class Voucher extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onPressVoucher: PropTypes.func,
    onPressMyVoucher: PropTypes.func,
    onPressSelectProvince: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    apiFetching: PropTypes.bool,
    provinceSelected: PropTypes.string,
    campaigns: PropTypes.array,
    newVoucherNum: PropTypes.number,
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onPressMyVoucher: defaultListener,
    onPressSelectProvince: defaultListener,
    onRefresh: defaultListener,
    refreshing: false,
    apiFetching: false,
    provinceSelected: '',
    campaigns: [],
    newVoucherNum: PropTypes.number,
  };

  state = {
    hideVoucherX2: false,
  };

  updateNavBarDisposer = () => {};

  dropDownTypoProps = {
    type: TypographyType.TITLE_LARGE,
    onPrimary: true,
    renderIconBefore: (titleStyle) => this.renderIconDropDown(titleStyle),
  };

  get theme() {
    return getTheme(this);
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

  get totalCampaigns() {
    return this.props.campaigns.length;
  }

  get hasCampaigns() {
    return this.totalCampaigns > 0;
  }

  renderVoucher = ({item: campaign, index}) => {
    return (
      <VoucherItem
        title={campaign.data.title}
        image={campaign.data.image_url}
        logoImage={campaign.data.shop_logo_url}
        discount={campaign.data.discount}
        point={campaign.data.point}
        pointCurrency={campaign.data.point_currency}
        expireDate={campaign.data.expire_date}
        onPress={() => this.props.onPressVoucher(campaign)}
        last={this.totalCampaigns - 1 === index}
      />
    );
  };

  renderIconDropDown = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME_5}
        name="chevron-down"
        style={[titleStyle, styles.placeDropDownIcon]}
      />
    );
  };

  handleScrollTop = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 190) {
      if (!this.state.hideVoucherX2) {
        this.setState({hideVoucherX2: true});
      }
    } else {
      if (this.state.hideVoucherX2) {
        this.setState({hideVoucherX2: false});
      }
    }
  };

  renderHeaderComponent = () => {
    const {t} = this.props;

    return (
      <>
        <View style={styles.placeWrapper}>
          <Typography
            onPrimary
            type={TypographyType.LABEL_LARGE}
            style={styles.placeLabel}>
            {t('locationTitle')}
          </Typography>

          <TextButton
            typoProps={this.dropDownTypoProps}
            style={styles.placeNameWrapper}
            titleStyle={styles.placeName}
            onPress={this.props.onPressSelectProvince}>
            {this.props.provinceSelected}
          </TextButton>
        </View>

        <BaseButton
          onPress={this.props.onPressMyVoucher}
          style={styles.myVoucherBtn}>
          <Card shadow style={styles.myVoucherWrapper}>
            <Image source={iconVoucher} style={this.myVoucherIconStyle} />
            <View style={styles.myVoucherTitleWrapper}>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.myVoucherTitle}>
                {t('header.title')}
              </Typography>

              <Typography
                type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
                style={styles.myVoucherInfo}>
                {this.props.newVoucherNum > 0 ? (
                  <>
                    <Typography
                      type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
                      style={
                        this.myVoucherCountStyle
                      }>{`${this.props.newVoucherNum} `}</Typography>
                    {t('header.unusedCode')}
                  </>
                ) : (
                  t('header.noCode')
                )}
              </Typography>
            </View>
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME_5}
              name="chevron-right"
              style={this.iconBtnStyle}
            />
          </Card>
        </BaseButton>
      </>
    );
  };

  renderEmptyComponent = () => {
    const {t} = this.props;

    return (
      !this.props.apiFetching && (
        <NoResult title={t('noResult.title')} text={t('noResult.message')} />
      )
    );
  };

  get headerBackgroundStyle() {
    return mergeStyles(styles.headerBackground, {
      backgroundColor: this.theme.color.primary,
    });
  }

  get placeLabelStyle() {
    return mergeStyles(styles.placeLabel);
  }

  get placeNameStyle() {
    return mergeStyles(styles.placeName, {color: this.theme.color.white});
  }

  get myVoucherCountStyle() {
    return mergeStyles(styles.myVoucherCount, {color: this.theme.color.danger});
  }

  get myVoucherIconStyle() {
    return mergeStyles(styles.myVoucherIcon, {
      backgroundColor: this.theme.color.persistPrimary,
    });
  }

  get iconBtnStyle() {
    return mergeStyles(styles.iconBtn, {color: this.theme.color.iconInactive});
  }

  render() {
    return (
      <ScreenWrapper safeLayout>
        {this.props.apiFetching && <LoadingComponent loading />}

        <View style={this.headerBackgroundStyle} />
        {!this.state.hideVoucherX2 && (
          <Image style={styles.voucherX2Backgound} source={vouchersX2Image} />
        )}

        <FlatList
          safeLayout
          data={this.props.campaigns || []}
          renderItem={this.renderVoucher}
          onScroll={this.handleScrollTop}
          scrollEventThrottle={16}
          keyExtractor={(item) => `${item.data.id}`}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
              colors={[config.colors.white]}
              tintColor={config.colors.white}
            />
          }
          ListHeaderComponent={this.renderHeaderComponent}
          ListEmptyComponent={this.renderEmptyComponent}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  headerBackground: {
    width: config.device.width * 3,
    height: config.device.width * 3,
    borderRadius: config.device.width * 3 * 0.48,
    position: 'absolute',
    top:
      -(config.device.width * 3) +
      (config.device.height -
        (config.device.isIphoneX ? config.device.statusBarHeight : 0)) /
        5.2,
    left: config.device.width / 2 - config.device.width * 1.5,
  },
  voucherX2Backgound: {
    ...getImageRatio(350, 255, 160),
    position: 'absolute',
    right: 8,
    top: 0,
  },
  placeWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  placeLabel: {
    fontWeight: '400',
  },
  placeNameWrapper: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  placeName: {
    marginRight: 12,
    fontWeight: 'bold',
  },
  placeDropDownIcon: {
    fontSize: 16,
    marginTop: 4,
  },

  myVoucherBtn: {
    marginTop: 16,
  },
  myVoucherWrapper: {
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myVoucherIcon: {
    ...getImageRatio(152, 136, undefined, 35),
  },
  myVoucherTitleWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  myVoucherTitle: {
    fontWeight: '500',
  },
  myVoucherInfo: {},
  myVoucherCount: {
    fontWeight: '500',
  },
  iconBtn: {
    fontSize: 16,
  },
});

export default Voucher;
