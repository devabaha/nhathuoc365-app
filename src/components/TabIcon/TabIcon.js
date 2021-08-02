import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appConfig from 'app-config';
import store from 'app-store';
import { NotiBadge } from '../Badges';
import { BUNDLE_ICON_SETS, BUNDLE_ICON_SETS_NAME } from 'src/constants';

class TabIcon extends Component {
  static propTypes = {
    iconBundle: PropTypes.string,
    focused: PropTypes.bool,
    label: PropTypes.string,
    iconLabel: PropTypes.string,
    notifyKey: PropTypes.string,
    iconSize: PropTypes.number,
  };

  static defaultProps = {
    iconBundle: BUNDLE_ICON_SETS_NAME.MaterialCommunityIcons,
    focused: false,
    label: '',
    iconLabel: '',
    notifyKey: '',
    iconSize: 24,
  };

  renderLabel() {
    return (
      <Text
        numberOfLines={1}
        style={[
          this.props.focused ? styles.labelSelected : styles.label,
          styles.labelDefault,
        ]}>
        {this.props.iconLabel}
      </Text>
    );
  }

  renderIcon() {
    const SVGIcon = this.props.iconSVG;
    const SVGIconSize = this.props.iconSVGSize || 18;

    const Icon = BUNDLE_ICON_SETS[this.props.iconBundle];
    return (
      <View
        style={[
          styles.iconBox,
          appConfig.device.isIOS ? {paddingTop: 3} : null,
        ]}>
        {!!SVGIcon ? (
          <SVGIcon
            width={SVGIconSize}
            height={SVGIconSize}
            // stroke="#888"
            // strokeWidth={this.props.strokeWidth || 2}
            fill={this.props.focused ? appConfig.colors.primary : '#888'}
          />
        ) : (
          <Icon
            style={this.props.focused ? styles.labelSelected : styles.label}
            name={this.props.iconName}
            size={this.props.iconSize}
          />
        )}
      </View>
    );
  }

  renderNotifyCount() {
    const notifyCount = store.notify[this.props.notifyKey];
    // if (notifyCount) {
      return (
        <NotiBadge
        containerStyle={styles.notifyWrapper}
        labelStyle={styles.notifyLabel}
        label={notifyCount}
        show={notifyCount}
        alert
        animation
      />
        // <View style={styles.notifyWrapper}>
        //   <Text style={styles.notifyText}>{notifyCount}</Text>
        // </View>
      );
    // }
    // return null;
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
    position: 'relative',
  },
  labelSelected: {
    color: appConfig.colors.primary,
  },
  label: {
    color: '#7f7f7f',
  },
  labelDefault: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400',
    width: '90%',
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    width: 28,
    height: 28,
  },
  // notifyWrapper: {
  //   position: 'absolute',
  //   minWidth: 16,
  //   paddingHorizontal: 2,
  //   height: 16,
  //   backgroundColor: 'red',
  //   top: 4,
  //   right: 0,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   overflow: 'hidden',
  //   borderRadius: 8,
  // },
  // notifyText: {
  //   fontSize: 10,
  //   color: '#ffffff',
  //   fontWeight: '600',
  // },

  notifyWrapper: {
    right: 0,
    top: 4,
    minWidth: 16,
    height: 16,
  },
  notifyLabel: {
    fontSize: 12,
  },
});

export default observer(TabIcon);
