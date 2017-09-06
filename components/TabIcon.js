'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/MaterialIcons';
import store from '../store/Store';

@observer
export default class TabIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var notifyCount = 0;
    if (this.props.notify) {
      notifyCount = parseInt(store.notify[this.props.notify]);
    }

    return(
      <View style={styles.tabIcon}>
        <View style={styles.iconBox}>
          <Icon style={[styles.iconTabbar, this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title]} name={this.props.iconName} size={this.props.size} color="#333333" />
        </View>
      <Text style={[this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title, styles.titleDefault]}>{this.props.iconTitle}</Text>

        {notifyCount > 0 && <View style={styles.stores_info_action_notify}><Text style={styles.stores_info_action_notify_value}>{notifyCount}</Text></View>}
      </View>
    );
  }
}

TabIcon.PropTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
  iconActive: PropTypes.string
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSelected: {
    color: DEFAULT_COLOR,
  },
  title: {
    color: "#7f7f7f",
  },
  titleDefault: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    paddingTop: 4
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    right: 4,
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
