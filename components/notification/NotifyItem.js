/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class NotifyItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.notify_container}>
          <View style={styles.notify_image_box}>
            <Image style={styles.notify_image} source={{uri: "http://cosp.com.vn/images/stores/2017/01/05/shop-thuc-pham-sach-co-tam-dienbien2.jpg"}} />
          </View>

          <View style={styles.notify_content}>
            <Text style={styles.notify_heading}>TOP GREEN Tưng Bừng Khuyến Mại - Tri Ân Khách Hàng
  Mừng Sinh Nhật 3 tuổi - 12/10/2016</Text>

            <View style={styles.notify_time_box}>
              <Icon name="newspaper-o" size={14} color="#666666" />
              <Text style={styles.notify_time}>Cửa hàng anh Thực | 08:30 14/08/2017</Text>
            </View>

            <View style={styles.notify_sort_content_box}>
              <Text style={styles.notify_sort_content}>Nhân dịp kỷ niệm sinh nhật 3 tuổi, Nhằm tri ân Quý khách hàng đã luôn tin dùng sản phẩm và dịch vụ của hệ thống Thực phẩm sạch OGreen.</Text>
            </View>

            <View style={styles.notify_sort_content_box}>
              <Text style={styles.notify_full_content}>1. Giảm giá toàn bộ hóa đơn lên tới 5% trong 03 ngày 12-13-14/10/2016
    2. Tặng rau hữu cơ Đại Ngàn cho 50 khách hàng đầu tiên trong ngày 12-13-14/10/2016
    3. Thưởng thức, dùng thử các sản phẩm tại cửa hàng:
    Nhóm sản phẩm Trái cây: Nho Ninh Thuận, Bưởi Quế Dương, Cam xoàn, Dưa các loại...
    Nhóm Thịt sạch: Thịt lợn hữu cơ Giang Nam, Thịt gà đồi Ba Vì...
    Nhóm Thực phẩm chế biến: Bánh chưng Phì Điền Bắc Giang, các sản phẩm chế biến làm từ thịt lợn Giang Nam: pate, xúc xích, giò, chả… Sữa chua dê Ba Vì, Thạch an Cao Bằng,...
    Cùng nhiều quà tặng hấp dẫn khác...</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    backgroundColor: "#ffffff"
  },
  notify_container: {
    paddingBottom: 8,
    marginBottom: 8
  },
  notify_content: {
    paddingHorizontal: 15,
  },

  notify_heading: {
    fontSize: 16,
    color: "#000000",
    fontWeight: '500',
    lineHeight: 24,
    marginTop: 20,
  },

  notify_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  notify_time: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666666"
  },
  notify_sort_content_box: {
    marginTop: 20
  },
  notify_sort_content: {
    color: "#000000",
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '500'
  },
  notify_full_content: {
    color: "#404040",
    lineHeight: 24,
    fontSize: 14
  },
  notify_image_box: {
    width: '100%',
    height: Util.size.height / 3,
    backgroundColor: "#cccccc"
  },
  notify_image: {
    flex: 1,
    resizeMode: 'cover'
  }
});
