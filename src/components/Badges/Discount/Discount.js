import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

class Discount extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    label: '',
    left: true,
    right: false,
    tailSpace: 0,
    containerStyle: {},
    contentContainerStyle: {},
  };
  state = {};

  get theme() {
    return getTheme(this);
  }

  get contentStyle() {
    return mergeStyles(styles.content, {color: this.theme.color.white});
  }

  get backgroundColor() {
    return this.props.backgroundColor || this.theme.color.sale;
  }

  render() {
    const extraStyle = {
      [this.props.right ? 'right' : 'left']: -this.props.tailSpace,
    };
    const extraContainerStyle = {
      backgroundColor: this.backgroundColor,
    };
    const tailStyle = {
      borderTopWidth: this.props.tailSpace,
      [this.props.right ? 'borderRightWidth' : 'borderLeftWidth']: this.props
        .tailSpace,
      borderRightColor: 'transparent',
      bottom: -this.props.tailSpace,
      [this.props.right ? 'right' : 'left']: 0,
      borderTopColor: LightenColor(this.backgroundColor, -30),
    };

    return (
      <View style={[styles.container, extraStyle, this.props.containerStyle]}>
        <View
          style={[
            styles.content_wrapper,
            extraContainerStyle,
            this.props.contentContainerStyle,
          ]}>
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[this.contentStyle, this.props.contentStyle]}>
            {this.props.label}
          </Typography>
        </View>
        <View style={[styles.tail, tailStyle]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 5,
  },
  content: {
    fontWeight: 'bold',
  },
  tail: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
  },
});

export default Discount;
