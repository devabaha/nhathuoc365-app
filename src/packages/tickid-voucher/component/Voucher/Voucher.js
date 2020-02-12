import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import getImageRatio from '../../helper/getImageRatio';
import VoucherItem from './VoucherItem';
import config from '../../config';
import iconVoucher from '../../assets/images/icon_voucher.png';
import vouchersX2Image from '../../assets/images/vouchers-x2.png';
import LoadingComponent from '@tickid/tickid-rn-loading';
import NoResult from '../NoResult';

const screenWidth = Dimensions.get('screen').width;

const defaultListener = () => {};

class Voucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func,
    onPressMyVoucher: PropTypes.func,
    onPressSelectProvince: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    apiFetching: PropTypes.bool,
    provinceSelected: PropTypes.string,
    campaigns: PropTypes.array,
    newVoucherNum: PropTypes.number
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
    newVoucherNum: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      hideVoucherX2: false
    };
  }

  get totalCampaigns() {
    return this.props.campaigns.length;
  }

  get hasCampaigns() {
    return this.totalCampaigns > 0;
  }

  renderVouchers() {
    return (
      <FlatList
        data={this.props.campaigns}
        keyExtractor={item => `${item.data.id}`}
        renderItem={this.renderVoucher}
      />
    );
  }

  renderVoucher = ({ item: campaign, index }) => {
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

  handleScrollTop = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 190) {
      if (!this.state.hideVoucherX2) {
        this.setState({ hideVoucherX2: true });
      }
    } else {
      if (this.state.hideVoucherX2) {
        this.setState({ hideVoucherX2: false });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.apiFetching && <LoadingComponent loading />}

        <View style={styles.headerBackground} />
        {!this.state.hideVoucherX2 && (
          <Image style={styles.voucherX2Backgound} source={vouchersX2Image} />
        )}

        <ScrollView
          onScroll={this.handleScrollTop}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.onRefresh}
              colors={[config.colors.white]}
              tintColor={config.colors.white}
            />
          }
        >
          <View style={styles.placeWrapper}>
            <Text style={styles.placeLabel}>Địa điểm</Text>

            <Button onPress={this.props.onPressSelectProvince}>
              <View style={styles.placeNameWrapper}>
                <Text style={styles.placeName}>
                  {this.props.provinceSelected}
                </Text>
                <Icon
                  name="chevron-down"
                  size={16}
                  color={config.colors.white}
                  style={styles.placeDropDownIcon}
                />
              </View>
            </Button>
          </View>

          <Button
            onPress={this.props.onPressMyVoucher}
            containerStyle={styles.myVoucherBtn}
          >
            <View style={styles.myVoucherWrapper}>
              <Image source={iconVoucher} style={styles.myVoucherIcon} />
              <View style={styles.myVoucherTitleWrapper}>
                <Text style={styles.myVoucherTitle}>Voucher của tôi</Text>
                {this.props.newVoucherNum > 0 ? (
                  <Text style={styles.myVoucherInfo}>
                    <Text
                      style={styles.myVoucherCount}
                    >{`${this.props.newVoucherNum} `}</Text>
                    mã chưa sử dụng
                  </Text>
                ) : (
                  <Text style={styles.myVoucherInfo}>
                    Bạn chưa có mã giảm giá
                  </Text>
                )}
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </View>
          </Button>

          {this.hasCampaigns && this.renderVouchers()}

          {!this.props.apiFetching && !this.hasCampaigns && (
            <NoResult
              style={{
                marginTop: config.device.height / 2 - 168
              }}
              title="Địa điểm chưa có ưu đãi"
              text="Chưa có chương trình ưu đãi cho địa điểm này"
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    position: 'relative',
    marginBottom: config.device.bottomSpace
  },
  headerBackground: {
    backgroundColor: config.colors.primary,
    width: '100%',
    height: 1000,
    borderRadius: 500,
    position: 'absolute',
    transform: [
      {
        scaleX: 1.8
      }
    ],
    top: -860
  },
  voucherX2Backgound: {
    ...getImageRatio(350, 255, 160),
    position: 'absolute',
    right: 8,
    top: 0
  },
  placeWrapper: {
    marginHorizontal: 16,
    marginTop: 16
  },
  placeLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: config.colors.white
  },
  placeNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  placeName: {
    marginRight: 12,
    fontSize: 20,
    fontWeight: 'bold',
    color: config.colors.white
  },
  placeDropDownIcon: {
    marginTop: 4
  },

  myVoucherBtn: {
    marginTop: 16
  },
  myVoucherWrapper: {
    marginHorizontal: 16,
    backgroundColor: config.colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      android: {
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E1E1E1'
      }
    })
  },
  myVoucherIcon: {
    ...getImageRatio(152, 136, undefined, 35),
    backgroundColor: config.colors.primary
  },
  myVoucherTitleWrapper: {
    flex: 1,
    marginLeft: 16
  },
  myVoucherTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  myVoucherInfo: {
    fontSize: 13,
    color: '#666'
  },
  myVoucherCount: {
    color: config.colors.red,
    fontWeight: '500',
    fontSize: 13
  }
});

export default Voucher;
