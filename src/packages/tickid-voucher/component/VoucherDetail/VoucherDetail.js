import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl
} from 'react-native';
import HTML from 'react-native-render-html';
import { Tabs, Tab } from '@tickid/react-native-tabs';
import { Accordion, Panel } from '@tickid/react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CampaignEntity from '../../entity/CampaignEntity';
import SiteEntity from '../../entity/SiteEntity';
import Button from 'react-native-button';
import AddressItem from '../AddressItem';
import config from '../../config';

const screenWidth = Dimensions.get('screen').width;

const defaultListener = () => {};

class VoucherDetail extends Component {
  static propTypes = {
    onRefresh: PropTypes.func,
    onGetVoucher: PropTypes.func,
    onUseVoucher: PropTypes.func,
    onPressAddressPhoneNumber: PropTypes.func,
    onPressAddressLocation: PropTypes.func,
    onPressCampaignProvider: PropTypes.func,
    refreshing: PropTypes.bool,
    canUseNow: PropTypes.bool,
    isFromMyVoucher: PropTypes.bool,
    campaign: PropTypes.instanceOf(CampaignEntity),
    site: PropTypes.instanceOf(SiteEntity),
    addresses: PropTypes.object
  };

  static defaultProps = {
    onRefresh: defaultListener,
    onGetVoucher: defaultListener,
    onUseVoucher: defaultListener,
    onPressAddressPhoneNumber: defaultListener,
    onPressAddressLocation: defaultListener,
    onPressCampaignProvider: defaultListener,
    refreshing: false,
    canUseNow: false,
    isFromMyVoucher: false,
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

  renderAddresses() {
    return (
      <Accordion
        showChevron
        expandMultiple
        containerStyle={styles.addressAccordion}
        panelContainerStyle={styles.addressAccordionPanel}
      >
        {Object.keys(this.props.addresses).map(provinceName => {
          const places = this.props.addresses[provinceName];
          return (
            <Panel title={provinceName} key={provinceName}>
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
    return (
      <Fragment>
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
              <Tabs>
                {/* INFOMATION TAB */}
                <Tab heading="Thông tin">
                  <HTML
                    html={campaign.data.content || '<span></span>'}
                    imagesMaxWidth={screenWidth - 32}
                  />
                </Tab>

                {/* LOCATION TAB */}
                <Tab heading="Điểm áp dụng">
                  <View style={styles.addressWrapper}>
                    <Text style={styles.infoHeading}>Địa chỉ cửa hàng</Text>
                    <Text style={styles.infoSubHeading}>
                      {this.totalPlaces} cửa hàng
                    </Text>
                  </View>

                  {this.renderAddresses()}
                </Tab>
              </Tabs>
            </View>

            {this.props.site && (
              <View style={styles.providerWrapper}>
                <Button onPress={this.props.onPressCampaignProvider}>
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
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: '#f1f1f1'
  },
  container: {
    flex: 1
  },
  row: {
    paddingHorizontal: 16
  },
  topImageWrapper: {
    position: 'relative',
    zIndex: 1
  },
  topImage: {
    height: 180
  },
  avatar: {
    position: 'absolute',
    top: 138,
    left: screenWidth / 2 - 29,
    width: 58,
    height: 58,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: config.colors.white
  },
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingBottom: 18
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 24
  },
  exprireWrapper: {
    alignItems: 'flex-start'
  },
  exprireBox: {
    backgroundColor: '#00bc3c',
    borderRadius: 4,
    marginTop: 14
  },
  exprire: {
    color: config.colors.white,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  contentWrapper: {
    marginTop: 8,
    marginBottom: 8
  },
  getVoucherWrapper: {
    backgroundColor: config.colors.white,
    height: 62,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  getVoucherBtn: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14
  },
  getVoucherTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  },
  providerWrapper: {
    marginBottom: 8
  },
  providerBody: {
    backgroundColor: config.colors.white,
    padding: 16,
    flexDirection: 'row'
  },
  providerImage: {
    width: 50,
    borderRadius: 5
  },
  providerInfo: {
    flex: 1,
    minHeight: 50,
    marginLeft: 16,
    justifyContent: 'center'
  },
  providerBy: {
    fontSize: 14,
    color: '#666'
  },
  providerName: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  chevronRightWrapper: {
    justifyContent: 'center'
  },
  addressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoSubHeading: {
    fontSize: 14,
    color: '#666'
  },
  addressAccordion: {
    marginTop: 12
  },
  addressAccordionPanel: {}
});

export default VoucherDetail;
