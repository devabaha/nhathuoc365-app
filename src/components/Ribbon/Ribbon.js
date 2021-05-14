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
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  beforeView: {
    position: 'absolute',
    borderStyle: 'solid',
    borderTopWidth: 7,
    borderLeftWidth: 7,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: hexToRgbA(appConfig.colors.ribbon, 0.8),
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    left: 0,
    bottom: -7,
  },
});

export default Ribbon;
