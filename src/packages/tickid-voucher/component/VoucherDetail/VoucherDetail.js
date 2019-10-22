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
    refreshing: PropTypes.bool,
    canUseNow: PropTypes.bool,
    showLoading: PropTypes.bool,
    isUseOnlineMode: PropTypes.bool,
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
    refreshing: false,
    canUseNow: false,
    showLoading: false,
    isUseOnlineMode: false,
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

  render() {
    const campaign = this.props.campaign || { data: {} };
    const tabs = [
      <Tab
        key={1}
        heading="Thông tin"
        containerStyle={{
          paddingBottom: 12
        }}
      >
        <HTML
          html={campaign.data.content || '<span></span>'}
          imagesMaxWidth={screenWidth - 32}
        />
      </Tab>
    ];

    if (this.hasAddress) {
      tabs.push(
        <Tab key={2} heading="Điểm áp dụng">
          <View style={styles.addressWrapper}>
            <Text style={styles.infoHeading}>Địa chỉ cửa hàng</Text>
            <Text style={styles.infoSubHeading}>
              {this.totalPlaces} cửa hàng
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
              <Image
                source={{ uri: campaign.data.shop_logo_url }}
                style={styles.avatar}
              />
            </View>

            <View style={[styles.row, styles.headerWrapper]}>
              <Text style={styles.heading}>{campaign.data.title}</Text>

              <View style={styles.exprireWrapper}>
                <View style={styles.exprireBox}>
                  <Text style={styles.exprire}>
                    {campaign.data.expire_date}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.contentWrapper}>
              <Tabs>{tabs}</Tabs>
            </View>

            {this.props.site && (
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
                      <Text style={styles.providerBy}>Cung cấp bởi</Text>
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
            )}
          </View>
        </ScrollView>

        <View style={styles.getVoucherWrapper}>
          {this.props.isUseOnlineMode ? (
            <Button
              containerStyle={[styles.getVoucherBtn, styles.removeVoucherBtn]}
              style={styles.getVoucherTitle}
              onPress={this.props.onRemoveVoucherOnline}
            >
              Dùng sau
            </Button>
          ) : (
            <Button
              containerStyle={styles.getVoucherBtn}
              style={styles.getVoucherTitle}
              onPress={() => {
                if (this.props.canUseNow) {
                  this.props.onUseVoucher(this.props.campaign);
                } else {
                  this.props.onGetVoucher(this.props.campaign);
                }
              }}
            >
              {this.props.canUseNow ? 'Dùng ngay' : 'Nhận mã giảm giá'}
            </Button>
          )}
        </View>
      </Fragment>
    );
  }
}

export default VoucherDetail;
