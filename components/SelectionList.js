/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../store/Store';

@observer
export default class SelectionList extends Component {
  render() {
    var {data, containerStyle} = this.props;

    return (
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        data={data}
        style={[styles.profile_list_opt, containerStyle]}
        renderItem={({item, index}) => {
          var notifyCount = 0;
          if (item.notify) {
            notifyCount = parseInt(store.notify[item.notify]);
          }

          return(
            <TouchableHighlight
              underlayColor="transparent"
              onPress={item.onPress}>

              <View style={[styles.profile_list_opt_btn, {
                marginTop: item.marginTop ? 8 : 0,
                borderTopWidth: item.marginTop ? Util.pixel : 0,
                borderColor: "#dddddd"
              }]}>

                <View style={[styles.profile_list_icon_box, ...item.boxIconStyle]}>
                  <Icon name={item.icon} size={16} color={item.iconColor || "#999999"} />
                </View>

                <View>
                  <Text style={styles.profile_list_label}>{item.label}</Text>
                  <Text style={styles.profile_list_small_label}>{item.desc}</Text>
                </View>

                {!item.hideAngle && (
                  <View style={[styles.profile_list_icon_box, styles.profile_list_icon_box_angle]}>
                    <Icon name="angle-right" size={16} color="#999999" />
                  </View>
                )}

                {notifyCount > 0 && <View style={styles.stores_info_action_notify}><Text style={styles.stores_info_action_notify_value}>{notifyCount}</Text></View>}
              </View>

            </TouchableHighlight>
          );
        }}
      />
    );
  }
}

SelectionList.PropTypes = {
  data: PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  profile_list_opt: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4
  },
  profile_list_icon_box_angle: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%'
  },
  profile_list_label: {
    fontSize: 16,
    color: "#000000",
    fontWeight: '400'
  },
  profile_list_small_label: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    left: 30,
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
});