/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

// librarys
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';

Animatable.initializeRegistryWithDefinitions({
  slideInDown: {
    from: {
      bottom: 0
    },
    to: {
      bottom: 2
    },
  }
});

export default class TabTutorial extends Component {
  render() {

    var {title, left, onPress} = this.props;

    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: hexToRgbA("#000000", 0.8),
      }}>
        <View style={{
          position: 'absolute',
          bottom: 30,
          left: 15,
          maxWidth: Util.size.width * 0.66,
          padding: 8,
          backgroundColor: DEFAULT_COLOR,
          borderRadius: 5
        }}>
          <Text style={{
            color: "#ffffff"
          }}>{title}</Text>
        </View>

        <View style={{
          position: 'absolute',
          right: 15,
          bottom: 36,
        }}>
          <TouchableHighlight
            style={{
              backgroundColor: hexToRgbA(DEFAULT_COLOR, 0.8),
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 3
            }}
            underlayColor={hexToRgbA(DEFAULT_COLOR, 0.6)}
            onPress={() => {
              if (onPress) {
                onPress();
              }
            }}>
            <Text style={{
              color: "#ffffff",
              fontSize: 14
            }}>ĐÃ HIỂU</Text>
          </TouchableHighlight>
        </View>

        <Animatable.View
          animation="slideInDown"
          iterationCount="infinite"
          direction="alternate"
          duration={300}
          style={{
            position: 'absolute',
            bottom: 0,
            left: left || Util.size.width / 4 / 2
          }}>
          <Icon name="caret-down" size={30} color={DEFAULT_COLOR} />
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
