import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import cleanImage from './assets/images/backspace.png';
import { KEYBOARD_DEFINITION } from './constants';

Keyboard.propTypes = {
  onPress: PropTypes.func,
  onClear: PropTypes.func
};

Keyboard.defaultProps = {
  onPress: () => {},
  onClear: () => {}
};

function Keyboard(props) {
  const renderButtons = () => {
    return KEYBOARD_DEFINITION.map((button, index) => {
      switch (button.type) {
        case 'button':
          return (
            <View style={styles.buttonWrapper} key={index}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.onPress(button.value)}
              >
                <Text style={styles.value}>{button.value}</Text>
                {!!button.text && (
                  <Text style={styles.text}>{button.text}</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        case null:
          return (
            <View style={styles.buttonWrapper} key={index}>
              <View style={[styles.button, styles.buttonEmpty]} />
            </View>
          );
        case 'clean':
          return (
            <View style={styles.buttonWrapper} key={index}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClear]}
                onPress={() => props.onClear()}
              >
                <Image style={styles.cleanIcon} source={cleanImage} />
              </TouchableOpacity>
            </View>
          );
      }
    });
  };

  return <View style={styles.container}>{renderButtons()}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f1f1f1'
  },
  buttonWrapper: {
    borderColor: '#ccc',
    width: '33.33333333%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth
  },
  button: {
    width: '100%',
    minHeight: 58,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 7
  },
  buttonClear: {
    justifyContent: 'center',
    backgroundColor: '#ccc'
  },
  buttonEmpty: {
    backgroundColor: '#ccc'
  },
  value: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000'
  },
  text: {
    fontSize: 12,
    fontWeight: '300',
    color: '#000'
  },
  cleanIcon: {
    width: 22,
    height: 22
  }
});

export default Keyboard;
