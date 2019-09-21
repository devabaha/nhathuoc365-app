import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { Tabs, Tab } from '@tickid/react-native-tabs';
import { Accordion, Panel } from '@tickid/react-native-accordion';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from 'react-native-button';
import AddressItem from '../AddressItem';

const screenWidth = Dimensions.get('screen').width;

const defaultListener = () => {};

class VoucherDetail extends Component {
  static propTypes = {
    image: PropTypes.string
  };

  static defaultProps = {
    image: ''
  };

  render() {
    return (
      <Fragment>
        <ScrollView style={styles.scrollViewWrapper}>
          <View style={styles.container}>
            <View style={styles.topImageWrapper}>
              <Image
                style={styles.topImage}
                resizeMode="cover"
                source={{ uri: this.props.image }}
              />
              <Image source={{ uri: this.props.image }} style={styles.avatar} />
            </View>

            <View style={[styles.row, styles.headerWrapper]}>
              <Text style={styles.heading}>
                [Soya Garden] Đồng giá Cold Brew chỉ 29,000đ
              </Text>

              <View style={styles.exprireWrapper}>
                <View style={styles.exprireBox}>
                  <Text style={styles.exprire}>Dùng đến 30/09/19</Text>
                </View>
              </View>
            </View>

            <View style={styles.contentWrapper}>
              <Tabs>
                {/* INFOMATION TAB */}
                <Tab heading="Thông tin">
                  <Text style={styles.infoHeading}>Cách dùng</Text>
                  <Text style={styles.infoText}>
                    Quét mã QR tại quầy thu ngân hoặc hỏi nhân viên cửa hàng về
                    chương trình ưu đãi trước khi sử dụng dịch vụ.
                  </Text>

                  <Text style={styles.infoHeading}>Thông tin voucher</Text>
                  <Text style={styles.infoText}>
                    [HN] Áp dụng cho menu đồ uống
                  </Text>

                  <Text style={styles.infoHeading}>Điều kiện sử dụng</Text>
                  <Text style={styles.infoText}>
                    Quét mã QR tại quầy thu ngân hoặc hỏi nhân viên cửa hàng về
                    chương trình ưu đãi trước khi sử dụng dịch vụ.
                  </Text>
                </Tab>

                {/* LOCATION TAB */}
                <Tab heading="Điểm áp dụng">
                  <View style={styles.addressWrapper}>
                    <Text style={styles.infoHeading}>Địa chỉ cửa hàng</Text>
                    <Text style={styles.infoSubHeading}>20 cửa hàng</Text>
                  </View>

                  <Accordion
                    showChevron
                    expandMultiple
                    containerStyle={styles.addressAccordion}
                    panelContainerStyle={styles.addressAccordionPanel}
                  >
                    <Panel title="Hà Nội (1)">
                      <AddressItem
                        title="Soya Garden Trần Duy Hưng"
                        address="Số 20 ngõ 80 đường Trần Duy Hưng, Cầu Giấy, Hà Nội"
                        phoneNumber="0987654321"
                        onPressPhoneNumber={() => {}}
                        onPressLocation={() => {}}
                      />
                    </Panel>
                    <Panel title="Hòa Bình (3)">
                      <AddressItem
                        title="Soya Garden Trần Duy Hưng"
                        address="Số 20 ngõ 80 đường Trần Duy Hưng, Cầu Giấy, Hà Nội"
                        phoneNumber="0987654321"
                        onPressPhoneNumber={() => {}}
                        onPressLocation={() => {}}
                      />
                      <AddressItem
                        title="Soya Garden Trần Duy Hưng"
                        address="Số 20 ngõ 80 đường Trần Duy Hưng, Cầu Giấy, Hà Nội"
                        phoneNumber="0987654321"
                        onPressPhoneNumber={() => {}}
                        onPressLocation={() => {}}
                      />
                      <AddressItem
                        title="Soya Garden Trần Duy Hưng"
                        address="Số 20 ngõ 80 đường Trần Duy Hưng, Cầu Giấy, Hà Nội"
                        phoneNumber="0987654321"
                        onPressPhoneNumber={() => {}}
                        onPressLocation={() => {}}
                      />
                    </Panel>
                  </Accordion>
                </Tab>
              </Tabs>
            </View>

            <View style={styles.providerWrapper}>
              <Button>
                <View style={styles.providerBody}>
                  <Image
                    style={styles.providerImage}
                    resizeMode="cover"
                    source={{ uri: this.props.image }}
                  />

                  <View style={styles.providerInfo}>
                    <Text style={styles.providerBy}>Cung cấp bởi</Text>
                    <Text style={styles.providerName}>
                      Điện Máy Xanh HighTech
                    </Text>
                  </View>

                  <View style={styles.chevronRightWrapper}>
                    <Icon name="chevron-right" size={20} color="#999" />
                  </View>
                </View>
              </Button>
            </View>
          </View>
        </ScrollView>

        <View style={styles.getVoucherWrapper}>
          <Button
            containerStyle={styles.getVoucherBtn}
            style={styles.getVoucherTitle}
          >
            Nhận mã giảm giá
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
    borderColor: '#fff'
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  contentWrapper: {
    marginTop: 8,
    marginBottom: 8
  },
  infoHeading: {
    fontWeight: 'bold',
    color: '#404040',
    fontSize: 16
  },
  infoText: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 15
  },
  getVoucherWrapper: {
    backgroundColor: '#fff',
    height: 62,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  getVoucherBtn: {
    backgroundColor: '#812384',
    borderRadius: 8,
    paddingVertical: 14
  },
  getVoucherTitle: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  },
  providerWrapper: {
    marginBottom: 8
  },
  providerBody: {
    backgroundColor: '#fff',
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
