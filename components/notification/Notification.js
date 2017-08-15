/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  RefreshControl,
  FlatList
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {id: 1, image: 'http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg'},
        {id: 2, image: 'http://cosp.com.vn/images/stores/2017/01/05/shop-thuc-pham-sach-co-tam-dienbien2.jpg'},
        {id: 3, image: 'http://cosp.com.vn/images/stores/2016/10/31/shop-thuc-pham-sach-anh-tinh-linh-dam.jpg'},
        {id: 4, image: 'http://cosp.com.vn/images/stores/2016/09/06/thiet-ke-cua-hang-thuc-pham-sach%20(7).jpg'},
        {id: 5, image: 'http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg'},
        {id: 6, image: 'http://cosp.com.vn/images/stores/2017/01/05/shop-thuc-pham-sach-co-tam-dienbien2.jpg'},
        {id: 7, image: 'http://cosp.com.vn/images/stores/2016/10/31/shop-thuc-pham-sach-anh-tinh-linh-dam.jpg'},
        {id: 8, image: 'http://cosp.com.vn/images/stores/2016/09/06/thiet-ke-cua-hang-thuc-pham-sach%20(7).jpg'},
        {id: 9, image: 'http://cosp.com.vn/images/stores/2017/06/27/thiet-ke-shop-thuc-pham-sach.jpg'},
        {id: 10, image: 'http://cosp.com.vn/images/stores/2017/01/05/shop-thuc-pham-sach-co-tam-dienbien2.jpg'},
        {id: 11, image: 'http://cosp.com.vn/images/stores/2016/10/31/shop-thuc-pham-sach-anh-tinh-linh-dam.jpg'},
        {id: 12, image: 'http://cosp.com.vn/images/stores/2016/09/06/thiet-ke-cua-hang-thuc-pham-sach%20(7).jpg'}
      ],
      refreshing: false
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  render() {
    return (
      <View style={styles.container}>

        {this.state.data != null && <FlatList
          data={this.state.data}
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          renderItem={({item, index}) => {

            return(
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  Actions.notify_item({});
                }}>

                <View style={[styles.notify_item, index < 3 ? styles.notify_item_active : null]}>
                  <View style={styles.notify_item_image_box}>
                    <Image style={styles.notify_item_image} source={{uri: item.image}} />
                  </View>

                  <View style={styles.notify_item_content}>
                    <View style={styles.notify_item_content_box}>
                      <Text style={styles.notify_item_title}>Tưng bừng khuyến mãi 30% mọi sản phẩm nhân dịp khai trương.</Text>
                      <Text style={styles.notify_item_desc}>Tất cả sản phẩm sẽ được giảm giá lên tới 30% theo mỗi hoá đơn...</Text>
                      <View style={styles.notify_item_time_box}>
                        <Icon name="newspaper-o" size={14} color="#666666" />
                        <Text style={styles.notify_item_time}>{"O'Green Cầu Giấy"} | 14:29 01/08</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  notify_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  notify_item_active: {
    backgroundColor: "#ebebeb"
  },
  notify_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  notify_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  notify_item_content: {
    flex: 1
  },
  notify_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  notify_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '500',
    lineHeight: isIOS ? 18 : 20
  },
  notify_item_desc: {
    marginTop: 8,
    color: "#404040",
    fontSize: 14,
    lineHeight: isIOS ? 18 : 20
  },
  notify_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notify_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
});
