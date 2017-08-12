/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';
import Swiper from 'react-native-swiper';

// components
import Items from '../stores/Items';
import ListHeader from '../stores/ListHeader';
import CartFooter from '../cart/CartFooter';

@observer
export default class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
       {id: 1, name: 'https://dl.airtable.com/YaXzYWIcTqSxmTSJFdho_41026-large%402x.jpg'},
       {id: 2, name: 'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg'},
       {id: 3, name: 'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg'}
     ],
     refreshing: false
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton
    });
  }

  _renderRightButton() {
    return(
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {

          }}>
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => Actions.cart({})}>
          <View style={styles.right_btn_add_store}>
            <Icon name="shopping-cart" size={22} color="#ffffff" />
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
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

        <ScrollView>
          <Swiper
            showsButtons={this.state.data.length > 1}
            showsPagination={false}
            paginationStyle={{marginTop: 100}}
            width={Util.size.width}
            height={Util.size.width * 0.6}
            >
            {
              this.state.data.map((item, index) => {
                return(
                  <Image style={styles.swiper_image} source={{uri: item.name}} key={index} />
                );
              })
            }
          </Swiper>

          <View style={styles.item_heading_box}>

            <Text style={styles.item_heading_title}>Combo 3 Quả Dưa Leo Tươi Mát</Text>

            <View style={styles.item_heading_price_box}>
              <Text style={styles.item_heading_safe_off_value}>35,000</Text>
              <Text style={styles.item_heading_price}>30,000</Text>
            </View>

            <Text style={styles.item_heading_qnt}>250g x 2gói</Text>

            <View style={styles.item_actions_box}>
              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={[styles.item_actions_btn, styles.item_actions_btn_chat]}>
                  <Icon name="heart" size={20} color={DEFAULT_COLOR} />
                  <Text style={[styles.item_actions_title, styles.item_actions_title_chat]}>Yêu thích</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={[styles.item_actions_btn, styles.item_actions_btn_add_cart]}>
                  <Icon name="cart-plus" size={24} color="#ffffff" />
                  <Text style={[styles.item_actions_title, styles.item_actions_title_add_cart]}>Chọn mua</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>

          <View style={styles.item_content_box}>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="clock-o" size={16} color="#999999" />
              </View>
              <Text style={styles.item_content_item_title}>GIAO SỚM NHẤT</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={[styles.item_content_item_value, {color: DEFAULT_COLOR}]}>Trong 1 giờ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="user" size={16} color="#999999" />
              </View>
              <Text style={styles.item_content_item_title}>NHÃN HIỆU</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Organica</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="map-marker" size={16} color="#999999" />
              </View>
              <Text style={styles.item_content_item_title}>XUẤT XỨ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Đà Lạt</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="usd" size={16} color="#999999" />
              </View>
              <Text style={styles.item_content_item_title}>GIÁ HIỂN THỊ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Bằng giá cửa hàng</Text>
            </View>

          </View>


          <View style={styles.item_content_text}>
            <Text style={styles.item_content_desc}>Được trồng tại trang trại Organica Đồng Nai. Sản phẩm được chứng nhận hữu cơ tiêu chuẩn EU và USDA/NOP bởi Control Union. {'\n\n'}Ra đời vào năm 2012, Công ty cổ phần cà phê Nam Long là công ty chuyên cung cấp sỉ và lẻ cà phê chất lượng cao. {'\n\n'}Tại Nam Long, nguyên liệu đầu vào và chuỗi sản xuất luôn là vấn đề được chúng tôi tập trung quản trị tối đa nhằm đem lại những sản phẩm có chất lượng tốt nhất.</Text>
          </View>

          {this.state.data != null && <FlatList
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            style={styles.items_box}
            ListHeaderComponent={() => <ListHeader title="CÓ THỂ BẠN THÍCH" />}
            data={this.state.data}
            renderItem={({item, index}) => <Items item={item} index={index} onPress={() => Actions.item({})} />}
            keyExtractor={item => item.id}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />}

          <View style={styles.item_safe_off}>
            <View style={styles.item_safe_off_percent}>
              <Text style={styles.item_safe_off_percent_val}>-23%</Text>
            </View>
          </View>

        </ScrollView>

        <CartFooter />
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
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0
  },
  right_btn_box: {
    flexDirection: 'row'
  },
  stores_info_action_notify: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  wrapper_swiper: {
    alignItems: 'center',
    // height: Util.size.width * 0.6,
  },
  content_swiper: {
    backgroundColor: "#dddddd"
  },
  swiper_image: {
    height: Util.size.width * 0.6,
    resizeMode: 'cover'
  },

  item_heading_box: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: 8
  },
  item_heading_title: {
    fontSize: 20,
    color: "#404040",
    fontWeight: '600'
  },
  item_heading_price_box: {
    flexDirection: 'row',
    marginTop: 4
  },
  item_heading_safe_off_value: {
    fontSize: 20,
    color: "#cccccc",
    textDecorationLine: 'line-through',
    paddingRight: 4
  },
  item_heading_price: {
    fontSize: 20,
    color: DEFAULT_COLOR,
    fontWeight: '600',
    paddingLeft: 4
  },
  item_heading_qnt: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4
  },
  item_actions_box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  item_actions_btn: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  item_actions_btn_chat: {
    marginRight: 8
  },
  item_actions_btn_add_cart: {
    marginLeft: 8,
    backgroundColor: DEFAULT_COLOR
  },
  item_actions_title: {
    color: DEFAULT_COLOR,
    marginLeft: 8
  },
  item_actions_title_add_cart: {
    color: "#ffffff"
  },

  item_safe_off: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_safe_off_percent: {
    backgroundColor: '#fa7f50',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  item_safe_off_percent_val: {
    color: "#ffffff",
    fontSize: 12
  },

  item_content_box: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    borderLeftWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    flexWrap: 'wrap'
  },
  item_content_item: {
    height: 24,
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  item_content_item_left: {
    width: '45%'
  },
  item_content_item_right: {
    width: '55%'
  },
  item_content_icon_box: {
    width: 24,
    alignItems: 'center'
  },
  item_content_item_title: {
    fontSize: 12,
    color: "#999999",
    paddingLeft: 4
  },
  item_content_item_value: {
    fontSize: 14,
    fontWeight: '600',
    color: "#404040",
    marginLeft: 4
  },

  item_content_text: {
    width: '100%',
    padding: 15
  },
  item_content_desc: {
    fontSize: 16,
    color: '#404040',
    lineHeight: 24,
    marginTop: 4
  },

  items_box: {
    marginBottom: 59,
    marginTop: 20,
    backgroundColor: "#f1f1f1"
  }
});
