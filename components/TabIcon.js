'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
    const { isHighlightTab } = this.props;
    const normalIconStyle = this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title;
    return(
      <View style={[styles.tabIcon, isHighlightTab ? { bottom: 16 } : null]}>
        <View style={[isHighlightTab ? styles.iconBoxHighlight : styles.iconBox, Platform.OS === 'ios' ? { paddingTop: 3 } : null]}>
          {isHighlightTab ? <MaterialCommunityIcons style={[{ color: 'white' }]} name={this.props.iconName} size={this.props.size} />
          : <Icon style={[normalIconStyle]} name={this.props.iconName} size={this.props.size} />}
        </View>
        <Text style={[this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title, styles.titleDefault]}>{this.props.iconTitle}</Text>
        {notifyCount > 0 && <View style={styles.stores_info_action_notify}><Text style={styles.stores_info_action_notify_value}>{notifyCount}</Text></View>}
      </View>
    );
  }
}

TabIcon.propTypes = {
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
    paddingTop: 4,
    width: 28,
    height: 28,
  },
  iconBoxHighlight: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    backgroundColor: DEFAULT_COLOR,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'white',
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
