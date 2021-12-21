/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

class Sticker extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  renderIconBefore = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name={this.props.icon || 'check-circle'}
        style={[titleStyle, styles.icon]}
      />
    );
  };

  get containerStyle() {
    return [
      styles.container,
      {
        backgroundColor: this.theme.color.overlay60,
      },
    ];
  }

  get titleStyle() {
    return {
      color: this.theme.color.onOverlay,
    };
  }

  render() {
    if (this.props.active) {
      if (this.props.component) {
        return this.props.component;
      } else {
        return (
          <View style={this.containerStyle}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM}
              style={[styles.sticker_title, this.titleStyle]}
              renderIconBefore={this.renderIconBefore}>
              {this.props.message}
            </Typography>
          </View>
        );
      }
    } else {
      return null;
    }
  }
}

Sticker.propTypes = {
  message: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  component: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '69%',
    minHeight: 100,
    left: appConfig.device.width / 2 - appConfig.device.width * 0.345,
    top: appConfig.device.height / 2 - 60 - NAV_HEIGHT,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sticker_title: {
    marginTop: 8,
    fontWeight: '600',
  },
  icon: {
    fontSize: 32,
  },
});

export default Sticker;
