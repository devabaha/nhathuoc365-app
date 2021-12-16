import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {View, Image} from 'react-native';
// 3-party libs
import HTML from 'react-native-render-html';
import Barcode from 'react-native-barcode-builder';
import {Accordion, Panel} from '@tickid/react-native-accordion';
import LoadingComponent from '@tickid/tickid-rn-loading';
import {Tabs, Tab} from '@tickid/react-native-tabs';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  ScreenWrapper,
  Typography,
  RefreshControl,
  ScrollView,
} from 'src/components/base';
import Button from 'src/components/Button';

import CampaignEntity from '../../entity/CampaignEntity';
import SiteEntity from '../../entity/SiteEntity';
import AddressItem from '../AddressItem';
import styles from './styles';
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';

const defaultListener = () => {};

const BARCODE_FORMAT = 'CODE128';

class VoucherDetail extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onRefresh: PropTypes.func,
    onGetVoucher: PropTypes.func,
    onUseVoucher: PropTypes.func,
    onRemoveVoucherOnline: PropTypes.func,
    onPressAddressPhoneNumber: PropTypes.func,
    onPressAddressLocation: PropTypes.func,
    onPressCampaignProvider: PropTypes.func,
    onBuyCampaign: PropTypes.func,
    canBuyCampaign: PropTypes.bool,
    refreshing: PropTypes.bool,
    canUseNow: PropTypes.bool,
    showLoading: PropTypes.bool,
    isUseOnlineMode: PropTypes.bool,
    campaignPoint: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    campaign: PropTypes.instanceOf(CampaignEntity),
    site: PropTypes.instanceOf(SiteEntity),
    addresses: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    onRefresh: defaultListener,
    onGetVoucher: defaultListener,
    onUseVoucher: defaultListener,
    onRemoveVoucherOnline: defaultListener,
    onPressAddressPhoneNumber: defaultListener,
    onPressAddressLocation: defaultListener,
    onPressCampaignProvider: defaultListener,
    onBuyCampaign: defaultListener,
    canBuyCampaign: false,
    refreshing: false,
    canUseNow: false,
    showLoading: false,
    isUseOnlineMode: false,
    campaignPoint: 0,
    campaign: undefined,
    addresses: undefined,
    site: undefined,
  };

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get totalPlaces() {
    let totalPlaces = 0;
    const addresses = Object.values(this.props.addresses);
    if (addresses.length > 0) {
      addresses.forEach((places) => (totalPlaces += places.length));
    }
    return totalPlaces;
  }

  get hasAddress() {
    const addresses = Object.values(this.props.addresses);
    return addresses.length > 0;
  }

  get canBuyCampaign() {
    return this.props.canBuyCampaign;
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

  renderAddresses() {
    return (
      <Accordion
        showChevron
        expandMultiple
        containerStyle={styles.addressAccordion}
        iconColor={this.theme.color.iconInactive}>
        {Object.keys(this.props.addresses).map((provinceName) => {
          const places = this.props.addresses[provinceName];
          return (
            <Panel
              title={
                <Typography type={TypographyType.LABEL_MEDIUM}>
                  {`${provinceName} (${places.length})`}
                </Typography>
              }
              key={provinceName}>
              {places.map((place, index) => (
                <AddressItem
                  isLast={index === places.length - 1}
                  key={place.data.id}
                  title={place.data.name}
                  address={place.data.address}
                  phoneNumber={place.data.tel}
                  latitude={place.data.latitude}
                  longitude={place.data.longitude}
                  onPressPhoneNumber={() =>
                    this.props.onPressAddressPhoneNumber(place.data.tel)
                  }
                  onPressLocation={() =>
                    this.props.onPressAddressLocation({
                      latitude: place.data.latitude,
                      longitude: place.data.longitude,
                    })
                  }
                />
              ))}
            </Panel>
          );
        })}
      </Accordion>
    );
  }

  renderSubmitButtons = () => {
    const {t} = this.props;
    if (this.props.isUseOnlineMode) {
      return (
        <Button onPress={this.props.onRemoveVoucherOnline}>
          {t('detail.useLater')}
        </Button>
      );
    } else {
      return (
        <Button
          onPress={() => {
            if (this.props.canUseNow) {
              this.props.onUseVoucher(this.props.campaign);
            } else if (this.canBuyCampaign) {
              this.props.onBuyCampaign(this.props.campaign);
            } else {
              this.props.onGetVoucher(this.props.campaign);
            }
          }}>
          {this.props.canUseNow
            ? t('detail.useNow')
            : this.canBuyCampaign
            ? t('detail.redeem')
            : t('detail.getVoucher')}
        </Button>
      );
    }
  };

  get expireBoxStyle() {
    return mergeStyles(styles.expireBox, {
      backgroundColor: this.theme.color.accent1,
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get expireStyle() {
    return mergeStyles(styles.expire, {color: this.theme.color.white});
  }

  get htmlTextStyle() {
    return this.theme.typography[TypographyType.LABEL_MEDIUM];
  }

  get avatarContainerStyle() {
    return {
      backgroundColor: this.theme.color.contentBackground,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  get tabColorStyle() {
    return {color: this.theme.color.onSurface};
  }

  get tabTitleStyle() {
    return {color: this.theme.color.textInactive};
  }
  get tabContainerStyle() {
    return {
      backgroundColor: this.theme.color.surface,
    };
  }

  render() {
    const {t} = this.props;
    const campaign = this.props.campaign || {data: {}};

    const colorLineActive = this.theme.color.onSurface;

    const tabs = [];

    if (campaign.data.content) {
      tabs.push(
        <Tab
          key={1}
          heading={t('detail.tabs.information.title')}
          containerStyle={{
            paddingBottom: 12,
          }}>
          <HTML
            baseFontStyle={this.htmlTextStyle}
            html={campaign.data.content || '<span></span>'}
            computeEmbeddedMaxWidth={(availableWidth) => availableWidth - 32}
          />
        </Tab>,
      );
    }

    if (this.hasAddress) {
      tabs.push(
        <Tab key={2} heading={t('detail.tabs.place.title')}>
          <View style={styles.addressWrapper}>
            <Typography type={TypographyType.LABEL_MEDIUM}>
              {t('detail.tabs.place.address')}
            </Typography>
            <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
              {this.totalPlaces} {t('detail.tabs.place.shop')}
            </Typography>
          </View>

          {this.renderAddresses()}
        </Tab>,
      );
    }

    return (
      <Fragment>
        {this.props.showLoading && <LoadingComponent loading />}
        <ScrollView
          style={styles.scrollViewWrapper}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
            />
          }>
          <ScreenWrapper>
            <View style={styles.topImageWrapper}>
              <Image
                style={styles.topImage}
                resizeMode="cover"
                source={{uri: campaign.data.image_url}}
              />
              <View style={[styles.avatarContainer, this.avatarContainerStyle]}>
                <Image
                  source={{uri: campaign.data.shop_logo_url}}
                  style={styles.avatar}
                />
              </View>
            </View>
            <Container
              style={[styles.row, styles.headerWrapper, styles.contentWrapper]}>
              <Typography
                type={TypographyType.TITLE_HUGE}
                style={styles.heading}>
                {campaign.data.title}
              </Typography>

              <View
                style={[
                  styles.expireWrapper,
                  this.canBuyCampaign && styles.canBuyCampaign,
                ]}>
                {this.canBuyCampaign ? (
                  <Fragment>
                    <View style={styles.voucherField}>
                      <Typography
                        type={TypographyType.LABEL_MEDIUM}
                        style={styles.voucherFieldLabel}>
                        {t('detail.redeemPoint')}
                      </Typography>
                      <Typography
                        type={TypographyType.LABEL_MEDIUM}
                        style={styles.voucherFieldValue}>
                        <Typography
                          type={TypographyType.LABEL_MEDIUM}
                          style={[
                            styles.fieldPoint,
                            {color: this.theme.color.accent1},
                          ]}>
                          {this.props.campaignPoint}
                        </Typography>
                        {` ${this.props.campaignCurrency}`}
                      </Typography>
                    </View>
                    {!!campaign.data.expire_date && (
                      <View style={[styles.voucherField, styles.rightField]}>
                        <Typography
                          type={TypographyType.LABEL_MEDIUM}
                          style={styles.voucherFieldLabel}>
                          {t('detail.useTo')}
                        </Typography>
                        <Typography
                          type={TypographyType.LABEL_MEDIUM}
                          style={styles.voucherFieldValue}>
                          {campaign.data.expire_date}
                        </Typography>
                      </View>
                    )}
                  </Fragment>
                ) : (
                  !!campaign.data.expire_date && (
                    <View style={this.expireBoxStyle}>
                      <Typography
                        type={TypographyType.LABEL_MEDIUM}
                        style={this.expireStyle}>
                        {`${t('detail.useTo')} ${campaign.data.expire_date}`}
                      </Typography>
                    </View>
                  )
                )}
              </View>
            </Container>
            {!!campaign?.data?.code && (
              <Container
                style={[styles.barcodeContainer, styles.contentWrapper]}>
                <Barcode
                  background={this.theme.color.surface}
                  lineColor={this.theme.color.onSurface}
                  width={2}
                  height={60}
                  value={campaign.data.code}
                  format={BARCODE_FORMAT}
                />
                <Container noBackground style={styles.containerCodeNumber}>
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={styles.codeNumber}>
                    {campaign.data.code}
                  </Typography>
                </Container>
              </Container>
            )}
            <Container style={styles.contentWrapper}>
              {!!tabs.length && (
                <Tabs
                  activeTabTitleStyle={this.tabColorStyle}
                  tabTitleStyle={this.tabTitleStyle}
                  tabContainerStyle={this.tabContainerStyle}
                  activeLineColor={colorLineActive}
                  tabBodyStyle={this.tabColorStyle}>
                  {tabs}
                </Tabs>
              )}
            </Container>
          </ScreenWrapper>
        </ScrollView>

        <Container safeLayout style={styles.getVoucherWrapper}>
          {this.renderSubmitButtons()}
        </Container>
      </Fragment>
    );
  }
}

export default withTranslation('voucher')(VoucherDetail);
