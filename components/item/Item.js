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

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';

@autobind
@observer
export default class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
       {id: 1, name: 'http://lamnong.net/wp-content/uploads/2015/08/rau-cai-co-tac-dung-gi3.jpg'},
       {id: 2, name: 'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg'},
       {id: 3, name: 'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg'},
       {id: 4, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
       {id: 5, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
       {id: 6, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'},
       {id: 7, name: 'https://dl.airtable.com/JNaHnxaoQqyU8wwDyNsV_1.1%20Ba%20roi%20rut%20suong-thumbnail%402x.jpg.jpg'},
       {id: 8, name: 'https://dl.airtable.com/wJpDFze3T0mTRXvXiYIb_DF078%20-%202-thumbnail%402x.jpg'},
       {id: 9, name: 'https://dl.airtable.com/UKLNZUjeT3u14Odw69OP_9-thumbnail%402x.jpg.jpg'},
       {id: 10, name: 'https://dl.airtable.com/Q9spiMmGTWCuYT0s8kNa_CAT0147-thumbnail%402x.jpg.jpg'},
     ]
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton
    });
  }

  _renderRightButton() {
    return(
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {

        }}>
        <View style={styles.right_btn_add_store}>
          <Icon name="cart-plus" size={22} color="#ffffff" />
          <View style={styles.stores_info_action_notify}>
            <Text style={styles.stores_info_action_notify_value}>3</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <ScrollView>

          <View style={styles.wrapper_swiper}>
            <Swiper
              showsButtons={this.state.data.length > 1}
              showsPagination={false}
              paginationStyle={{marginTop: 100}}
              style={styles.content_swiper}>
              {
                this.state.data.map((item, index) => {
                  return(
                    <Image style={styles.swiper_image} source={{uri: item.name}} key={index} />
                  );
                })
              }
            </Swiper>

            <View style={styles.item_safe_off}>
              <View style={styles.item_safe_off_percent}>
                <Text style={styles.item_safe_off_percent_val}>-23%</Text>
              </View>
            </View>
          </View>

          <View style={styles.item_heading_box}>

            <Text style={styles.item_heading_title}>CẢI NGỌT HỮU CƠ</Text>

            <View style={styles.item_heading_price_box}>
              <Text style={styles.item_heading_price}>30.000</Text>
              <Text style={styles.item_heading_price_unit}>VND</Text>
            </View>

            <View style={styles.item_heading_safe_off}>
              <Text style={styles.item_heading_safe_off_value}>35.000</Text>
            </View>

          </View>

          <View style={styles.item_content_text}>
            <Text style={styles.item_content_desc}>Được trồng tại trang trại Organica Đồng Nai. Sản phẩm được chứng nhận hữu cơ tiêu chuẩn EU và USDA/NOP bởi Control Union.</Text>
          </View>


          <View style={styles.item_content_box}>
            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="clock-o" size={16} color="#666666" />
              </View>
              <Text style={styles.item_content_item_title}>GIAO SỚM NHẤT</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={[styles.item_content_item_value, {color: DEFAULT_COLOR}]}>Trong 1 giờ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="user" size={16} color="#666666" />
              </View>
              <Text style={styles.item_content_item_title}>NHÃN HIỆU</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Organica</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="map-marker" size={16} color="#666666" />
              </View>
              <Text style={styles.item_content_item_title}>XUẤT XỨ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Đà Lạt</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_left]}>
              <View style={styles.item_content_icon_box}>
                <Icon name="usd" size={16} color="#666666" />
              </View>
              <Text style={styles.item_content_item_title}>GIÁ HIỂN THỊ</Text>
            </View>

            <View style={[styles.item_content_item, styles.item_content_item_right]}>
              <Text style={styles.item_content_item_value}>Rẻ hơn cửa hàng</Text>
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
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },
  stores_info_action_notify: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: -4,
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
    height: Util.size.width * 0.6,
  },
  content_swiper: {
    height: '100%',
    backgroundColor: "#dddddd"
  },
  swiper_image: {
    height: '100%',
    resizeMode: 'cover'
  },

  item_heading_box: {
    width: '100%',
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: DEFAULT_COLOR,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 4
  },
  item_heading_title: {
    fontSize: 18,
    color: "#404040",
    fontWeight: '600'
  },
  item_heading_price_box: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  item_heading_price: {
    fontSize: 18,
    color: DEFAULT_COLOR,
    fontWeight: '600'
  },
  item_heading_price_unit: {
    fontSize: 10,
    color: DEFAULT_COLOR,
    fontWeight: '600'
  },
  item_heading_safe_off: {
    position: 'absolute',
    right: 15,
    top: 10
  },
  item_heading_safe_off_value: {
    fontSize: 12,
    color: "#404040",
    textDecorationLine: 'line-through'
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
    marginTop: 16,
    borderLeftWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    flexWrap: 'wrap'
  },
  item_content_item: {
    height: 28,
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
    width: 20,
    alignItems: 'center'
  },
  item_content_item_title: {
    fontSize: 12,
    color: "#333333",
    paddingLeft: 4
  },
  item_content_item_value: {
    fontSize: 16,
    fontWeight: '600',
    color: "#404040"
  },

  item_content_text: {
    width: '100%',
    paddingHorizontal: 15
  },
  item_content_desc: {
    fontSize: 16,
    color: '#404040',
    lineHeight: 20,
    marginTop: 8
  }
});
