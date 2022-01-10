import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {NotiBadge} from 'src/components/Badges';
import {Container, Typography, Icon} from 'src/components/base';
import FoodHubCartButton from '../../FoodHubCartButton';

class TabIcon extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    focused: PropTypes.bool,
    label: PropTypes.string,
    iconLabel: PropTypes.string,
    notifyKey: PropTypes.string,
    iconSize: PropTypes.number,
  };

  static defaultProps = {
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
        style={[styles.label, this.labelStyle]}
        renderIconBefore={this.renderIcon}>
        {this.props.iconLabel}
      </Typography>
    );
  }

  renderIcon = (titleStyle, fontStyle) => {
    const SVGIcon = this.props.iconSVG;
    const SVGIconSize = this.props.iconSVGSize || 18;

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
            fill={fontStyle?.color}
          />
        ) : (
          <Icon
            bundle={
              this.props.iconBundle ||
              BundleIconSetName.MATERIAL_COMMUNITY_ICONS
            }
            style={fontStyle}
            name={this.props.iconName}
            size={this.props.iconSize}
          />
        )}
        {this.renderNotifyCount()}
      </View>
    );
  };

  renderNotifyCount() {
    const notifyCount = normalizeNotify(store.notify[this.props.notifyKey], 20);
    return (
      <NotiBadge
        containerStyle={styles.notifyWrapper}
        label={notifyCount}
        show={!!notifyCount}
        animation={!!notifyCount}
      />
    );
  }

  get labelStyle() {
    return {
      color: this.props.focused
        ? this.theme.color.primaryHighlight
        : this.theme.color.iconInactive,
    };
  }

  render() {
    return (
      <Container noBackground safeLayout style={styles.tabIcon}>
        {this.props.storeIcon ? <FoodHubCartButton /> : this.renderLabel()}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  tabIcon: {
    width: appConfig.device.width / 5 + 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 2,
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

  notifyWrapper: {
    right: '-100%',
    top: 4,
    minWidth: 16,
    height: 16,
  },
});

export default observer(TabIcon);
