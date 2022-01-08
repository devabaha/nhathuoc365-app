import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography} from 'src/components/base';
import Image from 'src/components/Image';

class Location extends PureComponent {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  get shortName() {
    return !!this.props.name
      ? this.props.name
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase())
          .join('')
      : '';
  }

  renderAvatar() {
    if (this.props.image) {
      return (
        <Image
          resizeMode="cover"
          source={{uri: this.props.image}}
          style={styles.image}
        />
      );
    } else {
      const shortName = this.shortName;
      return (
        <Typography type={TypographyType.DISPLAY_LARGE} style={styles.shortName}>
          {shortName}
        </Typography>
      );
    }
  }
  get containerStyle() {
    return {
      ...this.theme.layout.shadow,
      shadowColor: this.theme.color.shadow,
    };
  }
  render() {
    return (
      <Container flex style={[this.containerStyle, styles.container]}>
        <View style={styles.wrapper}>
          <BaseButton
            useTouchableHighlight
            style={styles.fullCenter}
            onPress={this.props.onPress}>
            {this.renderAvatar()}
          </BaseButton>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  wrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullCenter: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  shortName: {
    fontWeight: 'bold',
  },
});

export default Location;
