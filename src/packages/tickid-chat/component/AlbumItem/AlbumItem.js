import React, {Component} from 'react';
import {StyleSheet, ViewPropTypes, Text, View} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
import {isIos, WIDTH} from 'app-packages/tickid-chat/constants';
// custom components
import {BaseButton, Typography} from 'src/components/base';
import Image from 'src/components/Image';

const defaultListener = () => {};

class AlbumItem extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    leftStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    title: PropTypes.string,
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rightComponent: PropTypes.node,
    coverSource: PropTypes.any.isRequired,
  };

  static defaultProps = {
    leftStyle: {},
    onPress: defaultListener,
    title: '',
    subTitle: '',
    rightComponent: <Text>\/</Text>,
  };

  state = {};

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (
      nextProps.leftStyle !== this.props.leftStyle ||
      nextProps.title !== this.props.title ||
      nextProps.subTitle !== this.props.subTitle ||
      nextProps.rightComponent !== this.props.rightComponent
    ) {
      return true;
    }

    return false;
  }

  get containerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderBottomColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <BaseButton
        style={[styles.container, this.containerStyle]}
        onPress={() => this.props.onPress()}>
        <View style={[styles.wrapper]}>
          <View style={[styles.leftWrapper, this.props.leftStyle]}>
            <Image
              useNative={isIos}
              style={styles.leftContent}
              source={this.props.coverSource}
            />
          </View>
          <View style={[styles.centerWrapper]}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              numberOfLines={1}
              style={[styles.title]}>
              {this.props.title}
            </Typography>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              numberOfLines={1}
              style={[styles.subTitle]}>
              {this.props.subTitle}
            </Typography>
          </View>
          <View style={[styles.rightWrapper]}>{this.props.rightComponent}</View>
        </View>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftWrapper: {
    flex: 0.2,
  },
  leftContent: {
    height: '95%',
    width: '95%',
    left: 0,
    resizeMode: 'cover',
    top: 0,
  },
  centerWrapper: {
    flex: 0.8,
    paddingLeft: 10,
    flexDirection: 'column',
  },
  rightWrapper: {
    position: 'absolute',
    right: 15,
    flexDirection: 'column',
  },
  title: {
    fontWeight: 'bold',
  },
  subTitle: {},
});

export default AlbumItem;
