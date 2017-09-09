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
import { Actions, ActionConst } from 'react-native-router-flux';

export default class NewItemComponent extends Component {

  _goDetail(item) {
    Actions.notify_item({
      data: item
    });
  }

  render() {
    var {item} = this.props;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goDetail.bind(this, item)}>

        <View style={[styles.notify_item, item.read_flag == 0 ? styles.notify_item_active : null]}>
          <View style={styles.notify_item_image_box}>
            <Image style={styles.notify_item_image} source={{uri: item.image_url}} />
          </View>

          <View style={styles.notify_item_content}>
            <View style={styles.notify_item_content_box}>
              <Text style={styles.notify_item_title}>{sub_string(item.title, 60)}</Text>
              <View style={styles.notify_item_time_box}>
                <Text style={styles.notify_item_time}>
                  <Icon name="map-marker" size={10} color="#666666" />
                  {' ' + item.shop_name + '    '}
                  <Icon name="clock-o" size={10} color="#666666" />
                  {' ' + item.created}
                </Text>
              </View>
              <Text style={styles.notify_item_desc}>{sub_string(item.short_content, 60)}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  notify_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    height: isIOS ? 116 : 124,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
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
    resizeMode: 'cover',
    borderRadius: 2
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
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  notify_item_desc: {
    marginTop: 8,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18
  },
  notify_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notify_item_time: {
    fontSize: 10,
    color: "#666666"
  }
});
