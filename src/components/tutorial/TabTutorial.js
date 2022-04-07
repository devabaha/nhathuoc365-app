/* @flow */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

// librarys
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TabTutorial extends Component {
  UNSAFE_componentWillMount() {
    Animatable.initializeRegistryWithDefinitions({
      slideInDown: {
        from: {
          bottom: 0
        },
        to: {
          bottom: 2
        }
      }
    });
  }

  render() {
    var { title, left, onPress } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.btnBox}>
          <TouchableHighlight
            style={styles.btn}
            underlayColor={hexToRgba(DEFAULT_COLOR, 0.6)}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}
          >
            <Text style={styles.btnTitle}>ĐÃ HIỂU</Text>
          </TouchableHighlight>
        </View>

        <Animatable.View
          animation="slideInDown"
          iterationCount="infinite"
          direction="alternate"
          duration={300}
          style={[
            styles.aniTab,
            {
              left: left || Util.size.width / 4 / 2
            }
          ]}
        >
          <Icon name="caret-down" size={30} color={DEFAULT_COLOR} />
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: hexToRgba('#000000', 0.8)
  },
  content: {
    position: 'absolute',
    bottom: 30,
    left: 15,
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
    bottom: 0
  }
});
