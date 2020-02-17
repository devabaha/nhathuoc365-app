import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import CreditCardTabButton from './CreditCardTabButton';
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

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.focused !== this.props.focused ||
      nextProps.label !== this.props.label ||
      nextProps.iconLabel !== this.props.iconLabel ||
      nextProps.notifyKey !== this.props.notifyKey ||
      nextProps.iconSize !== this.props.iconSize
    ) {
      return true;
    }

    return false;
  }

  renderLabel() {
    return (
      <View style={this.props.special && styles.specialLabel}>
        <Text
          style={[
            this.props.focused ? styles.labelSelected : styles.label,
            styles.labelDefault
          ]}
        >
          {this.props.iconLabel}
        </Text>
      </View>
    );
  }

  renderSpecialIcon() {
    const focused = store.selectedTab === this.props.navigation.state.key;
    return (
      this.props.special && (
        <CreditCardTabButton focused={focused}>
          {this.renderNotifyCount(true)}
        </CreditCardTabButton>
      )
    );
  }

  renderIcon() {
    return (
      <View
        style={[
          styles.iconBox,
          appConfig.device.isIOS ? { paddingTop: 3 } : null,
          { opacity: this.props.special ? 0 : 1 }
        ]}
      >
        <Icon
          style={this.props.focused ? styles.labelSelected : styles.label}
          name={this.props.iconName}
          size={this.props.iconSize}
        />
        {this.renderNotifyCount()}
      </View>
    );
  }

  renderNotifyCount(isSpecial = false) {
    const notifyCount = store.notify[this.props.notifyKey];

    if (notifyCount) {
      return (
        <View style={[styles.notifyWrapper, isSpecial && styles.specialNotify]}>
          <Text style={styles.notifyText}>{notifyCount}</Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.tabIcon}>
        {this.renderSpecialIcon()}
        {this.renderIcon()}
        {this.renderLabel()}
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
    zIndex: 1,
    minWidth: 17,
    paddingHorizontal: 2,
    height: 17,
    backgroundColor: 'red',
    top: 0,
    right: -7,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 9
  },
  specialNotify: {
    right: -5
  },
  notifyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },
  specialLabel: {}
});

export default observer(TabIcon);
