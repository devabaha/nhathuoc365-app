import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import appConfig from 'app-config';

const Button = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        {props.iconLeft}
        <Text style={styles.text}>{props.title}</Text>
        {props.iconRight}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end'
  },
  btn: {
    width: '100%',
    backgroundColor: appConfig.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  }
});

export default Button;
