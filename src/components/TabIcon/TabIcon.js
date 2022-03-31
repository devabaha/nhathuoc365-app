import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import CreditCardTabButton from './CreditCardTabButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appConfig from 'app-config';
import store from 'app-store';
import {NotiBadge} from '../Badges';
import {BUNDLE_ICON_SETS, BUNDLE_ICON_SETS_NAME} from 'src/constants';

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
          numberOfLines={1}
          style={[
            this.props.focused ? styles.labelSelected : styles.label,
            styles.labelDefault,
          ]}>
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
    const SVGIcon = this.props.iconSVG;
    const SVGIconSize = this.props.iconSVGSize || 18;

    const Icon = BUNDLE_ICON_SETS[this.props.iconBundle];
    return (
      <View
        style={[
          styles.iconBox,
          appConfig.device.isIOS ? {paddingTop: 3} : null,
          {opacity: this.props.special ? 0 : 1},
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

  renderNotifyCount(isSpecial = false) {
    const notifyCount = store.notify[this.props.notifyKey];
    return (
      <NotiBadge
        containerStyle={[
          styles.notifyWrapper,
          isSpecial && styles.specialNotify,
        ]}
        labelStyle={styles.notifyLabel}
        label={notifyCount}
        show={!!notifyCount}
        animation={!!notifyCount}
      />
    );
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

  notifyWrapper: {
    right: 0,
    top: 4,
    minWidth: 16,
    height: 16,
  },
  specialNotify: {
    right: -5,
  },
  notifyLabel: {
    fontSize: 12,
  },
  specialLabel: {},
});

export default observer(TabIcon);
