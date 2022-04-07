import React, {Component} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {IconButton} from 'src/components/base';

const styles = StyleSheet.create({
  backBtn: {
    zIndex: 999,
    position: 'absolute',
    left: 15,
    top: 15,
  },
  icon: {
    fontSize: 24,
  },
  imageContainer: {
    width: '100%',
    height: appConfig.device.width / 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

class Header extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  renderBack() {
    const iconName = appConfig.device.isIOS ? 'left' : 'arrowleft';
    return (
      <IconButton
        hitSlop={HIT_SLOP}
        onPress={pop}
        style={styles.backBtn}
        bundle={BundleIconSetName.ANT_DESIGN}
        name={iconName}
        iconStyle={this.iconStyle}
      />
    );
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {color: this.theme.color.onPersistPrimary});
  }

  render() {
    return (
      <View>
        {/* {this.renderBack()} */}
        <ImageBackground
          source={{uri: this.props.image}}
          style={styles.imageContainer}
        />
      </View>
    );
  }
}

export default Header;
