/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class NotifyItemComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 150,
      duration: 3000
    }).start();
  }

  _goNoticeDetail(item) {

    switch (item.page) {
      case 'orders_item':

        Actions.orders_item({
          title: '#...',
          passProps: {
            notice_data: item
          }
        });
        break;
    }
  }

  render() {
    var {item} = this.props;

    const interpolateColor = this.animatedValue.interpolate({
      inputRange: [0, 150],
      outputRange: [hexToRgbA(DEFAULT_COLOR, 0.6), 'rgb(255, 255, 255)']
    });

    const animatedStyle = {
      backgroundColor: interpolateColor
    }

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goNoticeDetail.bind(this, item)}>

        <Animated.View
          style={[
            styles.store_result_item,
            item.read_flag == 0 ? styles.store_result_item_active : null,
            item.read_flag == 0 ? animatedStyle : null
          ]}>

          <View style={styles.store_result_item_image_box}>
            <CachedImage mutable style={styles.store_result_item_image} source={{uri: item.image_url}} />
          </View>

          <View style={styles.store_result_item_content}>
            <View style={styles.store_result_item_content_box}>
              <Text style={styles.store_result_item_title}>{item.title}</Text>
              <Text style={styles.store_result_item_create}>
                <Icon name="map-marker" size={10} color="#666666" />
                {' ' + item.shop_name + '    '}
                <Icon name="clock-o" size={10} color="#666666" />
                {' ' + item.created}
              </Text>
              <Text style={styles.store_result_item_desc}>{item.content}</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  stores_result_box: {
    // marginTop: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 104,
  },
  store_result_item_active: {
    backgroundColor: "#f1f1f1"
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
    resizeMode: 'cover'
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
    fontWeight: '500',
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  store_result_item_create: {
    color: "#666666",
    fontSize: 10,
    marginTop: 2
  },
  store_result_item_desc: {
    marginTop: 6,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18
  },
  store_result_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
});
