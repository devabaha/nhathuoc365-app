/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import PropTypes from 'prop-types';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export class ItemList extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  render() {

    var {item, itemListOnPress} = this.props;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onLongPress={() => 1}
        onPress={() => {
          if (itemListOnPress) {
            itemListOnPress(item);
          }
        }}>

        <View style={[styles.store_result_item, styles.store_result_item_active]}>
          <View style={styles.store_result_item_image_box}>
            <CachedImage mutable style={styles.store_result_item_image} source={{uri: item.logo_url}} />
          </View>

          <View style={styles.store_result_item_content}>
            <View style={styles.store_result_item_content_box}>
              <Text style={styles.store_result_item_title}>{item.name}</Text>
              <Text style={styles.store_result_item_desc}>{item.address}</Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <Text style={styles.storeInfo}>
                <Icon name="list" size={12} color="#666666" />
                {" 8 danh mục"}
              </Text>
              <Text>{"    "}</Text>
              <Text style={styles.storeInfo}>
                <Icon name="product-hunt" size={12} color="#666666" />
                {" 220 sản phẩm"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  stores_result_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingLeft: 15,
    flexDirection: 'row',
    minHeight: 96,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item_active: {
    // backgroundColor: "#ebebeb"
  },
  store_result_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 2
  },
  store_result_item_content: {
    flex: 1
  },
  store_result_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  store_result_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '600',
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18,
    paddingRight: 15
  },

  storeInfo: {
    fontSize: 12
  }
});
