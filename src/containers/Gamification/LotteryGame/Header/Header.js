import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Actions } from 'react-native-router-flux';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  backBtn: {
    zIndex: 999,
    position: 'absolute',
    left: 15,
    top: 15
  },
  icon: {
    fontSize: 24,
    color: '#fff'
  },
  imageContainer: {
    width: '100%',
    height: appConfig.device.width / 2
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

class Header extends Component {
  state = {};

  renderBack() {
    const iconName = appConfig.device.isIOS ? 'left' : 'arrowleft';
    return (
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        onPress={Actions.pop}
        style={styles.backBtn}
      >
        <Icon name={iconName} style={styles.icon} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View>
        {/* {this.renderBack()} */}
        <ImageBackground
          source={{ uri: this.props.image }}
          style={styles.imageContainer}
        />
      </View>
    );
  }
}

export default Header;
