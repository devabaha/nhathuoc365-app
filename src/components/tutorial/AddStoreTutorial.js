/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

// librarys
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class AddStoreTutorial extends Component {
  UNSAFE_componentWillMount() {
    Animatable.initializeRegistryWithDefinitions({
      slideInDown: {
        from: {
          top: 0
        },
        to: {
          top: 2
        }
      }
    });
  }

  render() {
    var { title, right, onPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <Animatable.View
          animation="slideInDown"
          iterationCount="infinite"
          direction="alternate"
          duration={300}
          style={[
            styles.aniTab,
            {
              right: right || Util.size.width / 4 / 2
            }
          ]}
        >
          <Icon name="caret-up" size={30} color={DEFAULT_COLOR} />
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 243,
    left: 0,
    width: Util.size.width,
    height: 100
  },
  content: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    maxWidth: Util.size.width * 0.66,
    padding: 8,
    backgroundColor: DEFAULT_COLOR,
    borderRadius: 5
  },
  title: {
    color: '#ffffff'
  },
  btnBox: {
    position: 'absolute',
    right: 15,
    bottom: 36
  },
  btn: {
    backgroundColor: hexToRgba(DEFAULT_COLOR, 0.8),
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 3
  },
  btnTitle: {
    color: '#ffffff',
    fontSize: 14
  },
  aniTab: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent'
  }
});
