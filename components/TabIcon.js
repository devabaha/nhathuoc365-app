'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
    iconActive: PropTypes.string
};

@observer
export default class TabIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var notifyCount = 0;
    if (this.props.notify) {
      notifyCount = parseInt(this.props.store.notify[this.props.notify]);
    }

    return(
      <View style={styles.tabIcon}>
        <View style={styles.iconBox}>
          <Icon style={[styles.iconTabbar, this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title]} name={this.props.iconName} size={this.props.size} color="#333333" />
        </View>
      {//<Text style={[this.props.selected || this.props.iconActive ? styles.titleSelected : styles.title, styles.titleDefault]}>{this.props.iconTitle}</Text>
    }

        {notifyCount > 0 && <View style={styles.notifyCountBox}><Text style={styles.notifyCount}>{notifyCount}</Text></View>}
      </View>
    );
  }
}

TabIcon.PropTypes = propTypes;

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
    fontSize: 14,
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
  notifyCountBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    top: 4,
    right: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    overflow: 'hidden'
  },
  notifyCount: {
    color: '#ffffff',
    fontSize: 12
  }
});
