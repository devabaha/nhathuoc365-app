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

const screenWidth = Dimensions.get('screen').width;

const defaultListener = () => {};

class Voucher extends Component {
  static propTypes = {
    onPressVoucher: PropTypes.func,
    onPressMyVoucher: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool
  };

  static defaultProps = {
    onPressVoucher: defaultListener,
    onPressMyVoucher: defaultListener,
    onRefresh: defaultListener,
    refreshing: false
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  renderVouchers() {
    return (
      <FlatList
        data={[{}, {}, {}, {}]}
        keyExtractor={(item, key) => `${key}`}
        renderItem={this.renderVoucher}
      />
    );
  }

  renderVoucher = ({ item: voucher, index }) => {
    return (
      <VoucherItem
        image="https://ipos.vn/wp-content/uploads/2017/04/banner-02.png"
        title="[Loyal Tea] Giảm 30% menu toàn bộ đồ uống tại cơ sở số 2 Phạm Ngọc Thạch"
        onPress={() => this.props.onPressVoucher(voucher)}
        last={3 === index}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerBackground} />
        <Image style={styles.voucherX2Backgound} source={vouchersX2Image} />

        <ScrollView
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

            <Button>
              <View style={styles.placeNameWrapper}>
                <Text style={styles.placeName}>Hồ Chí Minh</Text>
                <Icon
                  name="chevron-down"
                  size={16}
                  color={config.colors.white}
                />
              </View>
            </Button>
          </View>

          <Button onPress={this.props.onPressMyVoucher}>
            <View style={styles.myVoucherWrapper}>
              <Image source={iconVoucher} style={styles.myVoucherIcon} />
              <View style={styles.myVoucherTitleWrapper}>
                <Text style={styles.myVoucherTitle}>Voucher của tôi</Text>
                <Text style={styles.myVoucherInfo}>
                  <Text style={styles.myVoucherCount}>5 </Text>
                  mã chưa sử dụng
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </View>
          </Button>

          {this.renderVouchers()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    position: 'relative'
  },
  headerBackground: {
    backgroundColor: config.colors.primary,
    width: 1000,
    height: 1000,
    borderRadius: 480,
    position: 'absolute',
    top: -860,
    left: screenWidth / 2 - 500
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

  myVoucherWrapper: {
    marginTop: 16,
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
