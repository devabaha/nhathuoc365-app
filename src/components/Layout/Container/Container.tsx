import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';
import Reanimated from 'react-native-reanimated';
import {ContainerProps} from '.';
import Item from './Item';

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
  },
  centerVertical: {
    alignItems: 'center',
  },
  centerHorizontal: {
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});

class Container extends Component<ContainerProps> {
  static Item = Item;
  static defaultProps = {
    center: false,
    centerHorizontal: false,
    centerVertical: true,
    reanimated: false
  };
  state = {};

  get containerStyle() {
    let containerStyle = {};
    if (this.props.row) {
      containerStyle = this.updateStyle(containerStyle, styles.row);
    }

    if (this.props.center) {
      containerStyle = this.updateStyle(
        containerStyle,
        styles.centerHorizontal,
        styles.centerVertical,
      );
    }

    if (this.props.centerHorizontal) {
      containerStyle = this.updateStyle(
        containerStyle,
        styles.centerHorizontal,
      );
    }

    if (this.props.centerVertical) {
      containerStyle = this.updateStyle(containerStyle, styles.centerVertical);
    }

    if (this.props.flex) {
      containerStyle = this.updateStyle(containerStyle, styles.flex);
    }

    if (this.props.padding) {
      containerStyle = this.updateStyle(containerStyle, {
        padding: this.props.padding,
      });
    }

    if (this.props.paddingHorizontal) {
      containerStyle = this.updateStyle(containerStyle, {
        paddingHorizontal: this.props.paddingHorizontal,
      });
    }

    if (this.props.paddingVertical) {
      containerStyle = this.updateStyle(containerStyle, {
        paddingVertical: this.props.paddingVertical,
      });
    }

    return containerStyle;
  }

  updateStyle(rootStyle, ...args) {
    let tempStyle = {...rootStyle};
    args.forEach((updateStyle) => {
      tempStyle = {
        ...tempStyle,
        ...updateStyle,
      };
    });
    return tempStyle;
  }

  render() {
    const {style, reanimated, ...props} = this.props;
    const extraStyle = this.containerStyle;
    const Wrapper = reanimated ? Reanimated : Animated;
    
    return (
      <Wrapper.View {...props} style={[styles.container, extraStyle, style]}>
        {this.props.children}
      </Wrapper.View>
    );
  }
}

export default Container;
