/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';

@observer
export default class Items extends Component {
  render() {
    let {item, index, onPress} = this.props;

    return (
      <TouchableHighlight
        onPress={onPress}
        underlayColor="transparent">
        <View style={[styles.item_box, {borderRightWidth: index%2 == 0 ? 1 : 0}]}>

          <View style={styles.item_image_box}>
            <Image style={styles.item_image} source={{uri: item.name}} />
          </View>

          <View style={styles.item_info_box}>
            <View style={styles.item_info_made}>
              <Icon name="map-marker" size={12} color="#666666" />
              <Text style={styles.item_info_made_title}>Đà Lạt</Text>
              <View style={styles.item_info_weight}>
                <Text style={styles.item_info_made_title}>1 kg</Text>
              </View>
            </View>
            <Text style={styles.item_info_name}>Bưởi năm roi Đà Lạt</Text>
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
  }
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 8
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
