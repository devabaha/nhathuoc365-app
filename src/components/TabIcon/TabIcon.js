import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appConfig from 'app-config';
import store from 'app-store';
import {NotiBadge} from '../Badges';
import {BUNDLE_ICON_SETS, BUNDLE_ICON_SETS_NAME} from 'src/constants';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Typography} from '../base';
import {TypographyType} from '../base/Typography/constants';
import FoodHubCartButton from '../FoodHubCartButton';
import {mergeStyles} from 'src/Themes/helper';
import Icon from '../base/Icon';

class TabIcon extends Component {
  static contextType = ThemeContext;

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

  get theme() {
    return getTheme(this);
  }

  renderLabel() {
    return (
      <Typography
        type={TypographyType.LABEL_TINY}
        numberOfLines={1}
        style={[
          styles.labelDefault,
          {
            color: this.props.focused
              ? this.theme.color.primaryHighlight
              : this.theme.color.iconInactive,
          },
        ]}>
        {this.props.iconLabel}
      </Typography>
    );
  }

  renderIcon() {
    const SVGIcon = this.props.iconSVG;
    const SVGIconSize = this.props.iconSVGSize || 18;

    // const Icon = BUNDLE_ICON_SETS[this.props.iconBundle];

    const iconColor = this.props.focused
      ? this.theme.color.primaryHighlight
      : this.theme.color.iconInactive;

    const iconStyle = {color: iconColor};

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
            fill={iconColor}
          />
        ) : (
          <Icon
            bundle={this.props.iconBundle}
            style={iconStyle}
            name={this.props.iconName}
            size={this.props.iconSize}
          />
        )}
      </View>
    );
  }

  renderNotifyCount() {
    const notifyCount = store.notify[this.props.notifyKey];
    return (
      <NotiBadge
        containerStyle={styles.notifyWrapper}
        labelStyle={styles.notifyLabel}
        label={notifyCount}
        show={!!notifyCount}
        animation={!!notifyCount}
      />
    );
  }

  render() {
    const tabIconStyle = mergeStyles(styles.tabIcon, {
      backgroundColor: this.theme.color.surface,
      borderColor: this.theme.color.border,
    });
    return (
      <View style={tabIconStyle}>
        {this.props.storeIcon ? (
          <FoodHubCartButton />
        ) : (
          <>
            {this.renderIcon()}
            {this.renderLabel()}
            {this.renderNotifyCount()}
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    borderTopWidth: appConfig.device.pixel,
    width: appConfig.device.width / 5 + 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: appConfig.device.bottomSpace,
  },
  labelSelected: {
    color: appConfig.colors.primary,
  },
  label: {
    color: '#7f7f7f',
  },
  labelDefault: {
    // fontSize: 10,
    marginTop: 2,
    fontWeight: '400',
    width: '90%',
    textAlign: 'center',
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
