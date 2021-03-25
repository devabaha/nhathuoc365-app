import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl
} from 'react-native';
import HTML from 'react-native-render-html';
import { Tabs, Tab } from '@tickid/react-native-tabs';
import { Accordion, Panel } from '@tickid/react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LoadingComponent from '@tickid/tickid-rn-loading';
import CampaignEntity from '../../entity/CampaignEntity';
import SiteEntity from '../../entity/SiteEntity';
import Button from 'react-native-button';
import AddressItem from '../AddressItem';
import styles from './styles';

const screenWidth = Dimensions.get('screen').width;

const defaultListener = () => {};

class VoucherDetail extends Component {
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
    campaignPoint: PropTypes.number,
    campaign: PropTypes.instanceOf(CampaignEntity),
    site: PropTypes.instanceOf(SiteEntity),
    addresses: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
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
    site: undefined
  };

  get totalPlaces() {
    let totalPlaces = 0;
    const addresses = Object.values(this.props.addresses);
    if (addresses.length > 0) {
      addresses.forEach(places => (totalPlaces += places.length));
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

  renderAddresses() {
    return (
      <Accordion
        showChevron
        expandMultiple
        containerStyle={styles.addressAccordion}
      >
        {Object.keys(this.props.addresses).map(provinceName => {
          const places = this.props.addresses[provinceName];
          return (
            <Panel
              title={`${provinceName} (${places.length})`}
              key={provinceName}
            >
              {places.map(place => (
                <AddressItem
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
                      longitude: place.data.longitude
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
    const { t } = this.props;
    if (this.props.isUseOnlineMode) {
      return (
        <Button
          containerStyle={[styles.getVoucherBtn, styles.removeVoucherBtn]}
          style={styles.getVoucherTitle}
          onPress={this.props.onRemoveVoucherOnline}
        >
          {t('detail.useLater')}
        </Button>
      );
    } else {
      return (
        <Button
          containerStyle={styles.getVoucherBtn}
          style={styles.getVoucherTitle}
          onPress={() => {
            if (this.props.canUseNow) {
              this.props.onUseVoucher(this.props.campaign);
            } else if (this.canBuyCampaign) {
              this.props.onBuyCampaign(this.props.campaign);
            } else {
              this.props.onGetVoucher(this.props.campaign);
            }
          }}
        >
          {this.props.canUseNow
            ? t('detail.useNow')
            : this.canBuyCampaign
            ? t('detail.redeem')
            : t('detail.getVoucher')}
        </Button>
      );
    }
  };

  render() {
    const { t } = this.props;
    const campaign = this.props.campaign || { data: {} };
    const tabs = [
      <Tab
        key={1}
        heading={t('detail.tabs.information.title')}
        containerStyle={{
          paddingBottom: 12
        }}
      >
        <HTML
          html={campaign.data.content || '<span></span>'}
          computeEmbeddedMaxWidth={(availableWidth) => availableWidth - 32}
        />
      </Tab>
    ];

    if (this.hasAddress) {
      tabs.push(
        <Tab key={2} heading={t('detail.tabs.place.title')}>
          <View style={styles.addressWrapper}>
            <Text style={styles.infoHeading}>
              {t('detail.tabs.place.address')}
            </Text>
            <Text style={styles.infoSubHeading}>
              {this.totalPlaces} {t('detail.tabs.place.shop')}
            </Text>
          </View>

          {this.renderAddresses()}
        </Tab>
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
          }
        >
          <View style={styles.container}>
            <View style={styles.topImageWrapper}>
              <Image
                style={styles.topImage}
                resizeMode="cover"
                source={{ uri: campaign.data.image_url }}
              />
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: campaign.data.shop_logo_url }}
                  style={styles.avatar}
                />
              </View>
            </View>

            <View style={[styles.row, styles.headerWrapper]}>
              <Text style={styles.heading}>{campaign.data.title}</Text>

              <View
                style={[
                  styles.exprireWrapper,
                  this.canBuyCampaign && styles.canBuyCampaign
                ]}
              >
                {this.canBuyCampaign ? (
                  <Fragment>
                    <View style={styles.voucherField}>
                      <Text style={styles.voucherFieldLabel}>
                        {t('detail.redeemPoint')}
                      </Text>
                      <Text style={styles.voucherFieldValue}>
                        <Text style={styles.fieldPoint}>
                          {this.props.campaignPoint}
                        </Text>
                        {` ${this.props.campaignCurrency}`}
                      </Text>
                    </View>
                    <View style={[styles.voucherField, styles.rightField]}>
                      <Text style={styles.voucherFieldLabel}>
                        {t('detail.useTo')}
                      </Text>
                      <Text style={styles.voucherFieldValue}>
                        {campaign.data.expire_date}
                      </Text>
                    </View>
                  </Fragment>
                ) : (
                  <View style={styles.exprireBox}>
                    <Text style={styles.exprire}>
                      {`${t('detail.useTo')} ${campaign.data.expire_date}`}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.contentWrapper}>
              <Tabs>{tabs}</Tabs>
            </View>

            {/* {this.props.site && (
              <View style={styles.providerWrapper}>
                <Button
                  onPress={() =>
                    this.props.onPressCampaignProvider(this.props.site)
                  }
                >
                  <View style={styles.providerBody}>
                    <Image
                      style={styles.providerImage}
                      resizeMode="cover"
                      source={{ uri: this.props.site.data.logo_url }}
                    />

                    <View style={styles.providerInfo}>
                      <Text style={styles.providerBy}>
                        {t('detail.providedBy')}
                      </Text>
                      <Text style={styles.providerName}>
                        {this.props.site.data.name}
                      </Text>
                    </View>

                    <View style={styles.chevronRightWrapper}>
                      <Icon name="chevron-right" size={20} color="#999" />
                    </View>
                  </View>
                </Button>
              </View>
            )} */}
          </View>
        </ScrollView>

        <View style={styles.getVoucherWrapper}>
          {this.renderSubmitButtons()}
        </View>
      </Fragment>
    );
  }
}

export default withTranslation('voucher')(VoucherDetail);
