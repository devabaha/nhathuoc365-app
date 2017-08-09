/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-elements';

@autobind
@observer
export default class Stores extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  renderItems() {
    var items = [
      'https://dl.airtable.com/Qh7rvfKTpixsA8EJY8gN_DF084%20-%202-thumbnail%402x.jpg',
      'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg',
      'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg',
      'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg',
      'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg',
      'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg',
      'https://dl.airtable.com/JNaHnxaoQqyU8wwDyNsV_1.1%20Ba%20roi%20rut%20suong-thumbnail%402x.jpg.jpg',
      'https://dl.airtable.com/wJpDFze3T0mTRXvXiYIb_DF078%20-%202-thumbnail%402x.jpg',
      'https://dl.airtable.com/UKLNZUjeT3u14Odw69OP_9-thumbnail%402x.jpg.jpg',
      'https://dl.airtable.com/Q9spiMmGTWCuYT0s8kNa_CAT0147-thumbnail%402x.jpg.jpg',
    ]

    return items.map((item, key) => {
      return(
        <TouchableHighlight
          onPress={() => 1}
          underlayColor={DEFAULT_COLOR}
          key={key}>
          <View style={[styles.item_box, {borderRightWidth: key%2 == 0 ? Util.pixel : 0}]}>

            <View style={styles.item_image_box}>
              <Image style={styles.item_image} source={{uri: item}} />
            </View>

            <View style={styles.item_info_box}>
              <View style={styles.item_info_made}>
                <Icon name="map-marker" size={12} color="#666666" />
                <Text style={styles.item_info_made_title}>Đà Lạt</Text>

                <View style={styles.item_info_weight}>
                  <Text style={styles.item_info_made_title}>1 kg</Text>
                </View>
              </View>
              <Text style={styles.item_info_name}>Thực phẩm sạch Đà Lạt</Text>
              <Text style={styles.item_info_price}>48.000</Text>
            </View>

            <TouchableHighlight
              style={styles.item_add_cart_btn}
              underlayColor="transparent"
              onPress={() => 1}>

              <View style={styles.item_add_cart_box}>
                <Icon name="shopping-cart" size={24} color={DEFAULT_COLOR} />
                <Text style={styles.item_add_cart_title}>Chọn mua</Text>
              </View>
            </TouchableHighlight>

            <View style={styles.item_safe_off}>
              <View style={styles.item_safe_off_percent}>
                <Text style={styles.item_safe_off_percent_val}>-23%</Text>
              </View>
              <Text style={styles.item_safe_off_price}>26,000</Text>
            </View>

          </View>
        </TouchableHighlight>
      );
    });
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

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>

          <View style={styles.store_heading_box}>
            <Text style={styles.store_heading_title}>— Tất cả sản phẩm —</Text>
          </View>
          <View style={styles.items_container}>
            {this.renderItems()}
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
    marginBottom: 0
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

  items_container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item_box: {
    width: Math.floor(Util.size.width / 2),
    height: Math.floor(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff"
  },
  item_image_box: {
    width: '100%',
    height: '80%'
  },
  item_image: {
    height: '100%',
    resizeMode: 'center'
  },
  item_info_box: {
    width: '100%',
    minHeight: '34%',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  item_info_made: {
    flexDirection: 'row'
  },
  item_info_made_title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    paddingLeft: 4
  },
  item_info_weight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  item_info_name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginTop: 2
  },
  item_info_price: {
    fontSize: 16,
    fontWeight: '600',
    color: DEFAULT_COLOR,
    marginTop: 2
  },

  store_heading_box: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_heading_title: {
    fontSize: 14,
    color: '#333333'
  },
  item_add_cart_btn: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 60,
    height: 40,
    zIndex: 2
  },
  item_add_cart_box: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item_add_cart_title: {
    color: "#404040",
    fontSize: 8
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
  item_safe_off_price: {
    color: "#404040",
    fontSize: 12,
    marginLeft: 4,
    textDecorationLine: 'line-through'
  }
});
