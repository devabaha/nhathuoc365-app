import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import appConfig from 'app-config';
import store from 'app-store';

class TabIcon extends Component {
  static propTypes = {
    focused: PropTypes.bool,
    label: PropTypes.string,
    iconLabel: PropTypes.string,
    notifyKey: PropTypes.string,
    iconSize: PropTypes.number
  };

  static defaultProps = {
    focused: false,
    label: '',
    iconLabel: '',
    notifyKey: '',
    iconSize: 24
  };

  renderLabel() {
    return (
      <Text
        style={[
          this.props.focused ? styles.labelSelected : styles.label,
          styles.labelDefault
        ]}
      >
        {this.props.iconLabel}
      </Text>
    );
  }

  renderIcon() {
    return (
      <View
        style={[
          styles.iconBox,
          appConfig.device.isIOS ? { paddingTop: 3 } : null
        ]}
      >
        <Icon
          style={this.props.focused ? styles.labelSelected : styles.label}
          name={this.props.iconName}
          size={this.props.iconSize}
        />
      </View>
    );
  }

  renderNotifyCount() {
    const notifyCount = store.notify[this.props.notifyKey];
    if (notifyCount) {
      return (
        <View style={styles.notifyWrapper}>
          <Text style={styles.notifyText}>{notifyCount}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.tabIcon}>
        {this.renderIcon()}
        {this.renderLabel()}
        {this.renderNotifyCount()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  labelSelected: {
    color: appConfig.colors.primary
  },
  label: {
    color: '#7f7f7f'
  },
  labelDefault: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400'
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    width: 28,
    height: 28
  },
  notifyWrapper: {
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
  notifyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});

export default observer(TabIcon);
