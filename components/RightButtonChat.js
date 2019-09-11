/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../store/Store';

@observer
export default class RightButtonChat extends Component {
  render() {
    var store_id = this.props.store_id || store.store_id;
    var count_chat = parseInt(store.notify_chat[store_id]);

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          Actions.chat({
            store_id: this.props.store_id || undefined,
            title: this.props.title || undefined,
            tel: this.props.tel || undefined
          });
        }}
      >
        <View style={styles.right_btn_add_store}>
          <Icon name="commenting" size={20} color="#ffffff" />
          {count_chat > 0 && (
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>
                {count_chat}
              </Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
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
    minWidth: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 2
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});
