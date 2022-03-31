import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        paddingHorizontal: 10,
        paddingVertical: 7
      },
      android: {
        padding: 15
      }
    })
  },
  title: {
    ...Platform.select({
      ios: {
        left: 10
      },
      android: {
        left: 15
      }
    }),
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    width: '100%',
    color: '#fff',
    textAlign: 'center',
    zIndex: 0
  },
  btnContainer: {
    zIndex: 1
  },
  back: {
    ...Platform.select({
      ios: {
        fontSize: 34
      },
      android: {
        left: 5,
        fontSize: 26
      }
    }),
    color: '#fff',
    alignSelf: 'center',
    zIndex: 1,
    ...elevationShadowStyle(5)
  }
});

class NavBar extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnContainer}
          hitSlop={HIT_SLOP}
          onPress={Actions.pop}
        >
          <Icon
            name={appConfig.device.isIOS ? 'ios-arrow-back' : 'md-arrow-back'}
            style={styles.back}
          />
        </TouchableOpacity>

        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    );
  }
}

export default NavBar;
