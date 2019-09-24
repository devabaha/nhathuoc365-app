/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Platform
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

import _drawerIconLocation from '../../images/icon_location.png';

export default class NewItemComponent3 extends Component {
  _goDetail(item) {
    Actions.notify_item({
      title: item.title,
      data: item
    });
  }

  render() {
    var { item } = this.props;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goDetail.bind(this, item)}
      >
        <View
          style={[
            styles.notify_item,
            item.read_flag == 0 ? styles.notify_item_active : null
          ]}
        >
          <View style={styles.notify_item_image_box}>
            <CachedImage
              mutable
              style={styles.notify_item_image}
              source={{ uri: item.image_url }}
            />
          </View>

          <View style={styles.notify_item_content}>
            <View style={styles.notify_item_time_box_icon_loction}>
              <Image
                style={styles.icon_location}
                source={_drawerIconLocation}
              />
            </View>
            <View style={styles.notify_item_content_box_right}>
              <View style={styles.notify_item_content_box}>
                <Text style={styles.notify_item_title}>
                  {sub_string(item.shop_name, 60)}
                </Text>
                <View style={styles.home_box_wallet_info_label_right}>
                  <Text style={styles.notify_item_distance}></Text>
                </View>
              </View>
              <View style={styles.notify_item_content_box}>
                <View style={styles.notify_item_time_box}>
                  <Text style={styles.notify_item_address}>
                    {/*250 Nguyễn Văn Cừ, Long biên*/}
                    {item.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  notify_item: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 16,
    marginVertical: 8,
    marginLeft: MARGIN_HORIZONTAL,
    flexDirection: 'column',
    height: isIOS ? 150 : 164,
    width: 203,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      },
      android: {
        elevation: 2,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1'
      }
    })
  },
  notify_item_active: {
    backgroundColor: '#ebebeb'
  },
  notify_item_image_box: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 96
  },
  notify_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 2
  },
  notify_item_content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    paddingTop: 8
  },
  notify_item_content_box_right: {
    flexDirection: 'column',
    flex: 1
  },
  notify_item_content_box: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 5,
    alignItems: 'center'
  },
  notify_item_title: {
    fontSize: 16,
    color: '#212C3A',
    fontWeight: '500',
    flex: 1
  },
  notify_item_desc: {
    marginTop: 8,
    color: '#404040',
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18
  },
  notify_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notify_item_address: {
    fontSize: 10,
    color: '#212C3A'
  },
  notify_item_distance: {
    fontSize: 12,
    color: '#212C3A'
  },
  home_box_wallet_info_label_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  notify_item_time_box_icon_loction: {
    width: 17,
    height: 17,
    borderRadius: 17 / 2,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_location: {
    width: 9.6,
    height: 14,
    resizeMode: 'cover'
  }
});
