import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import appConfig from 'app-config';

function Ribbon({text = 'ribbon'}) {
  return (
    <View style={styles.container}>
      <View style={styles.beforeView} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appConfig.colors.ribbon,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    zIndex: 9,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  beforeView: {
    position: 'absolute',
    borderStyle: 'solid',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: hexToRgbA(appConfig.colors.ribbon, 0.8),
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    left: 0,
    bottom: -4,
  },
});

export default Ribbon;
