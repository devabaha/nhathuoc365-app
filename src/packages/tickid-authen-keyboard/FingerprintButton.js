import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import fingerprintImage from './assets/images/fingerprint.png';

FingerprintButton.propTypes = {
  label: PropTypes.string,
  onPress: PropTypes.func,
  visible: PropTypes.bool
};

FingerprintButton.defaultProps = {
  label: 'Xác thực vân tay',
  onPress: () => {},
  visible: true
};

function FingerprintButton(props) {
  if (!props.visible) return null;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={props.onPress}>
        <Image style={styles.icon} source={fingerprintImage} />
        <Text style={styles.label}>{props.label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333'
  }
});

export default FingerprintButton;
