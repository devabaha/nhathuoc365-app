import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import appConfig from 'app-config';

const Button = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.renderBefore}
      <TouchableOpacity
        style={[
          styles.btn,
          props.shadow && styles.shadow,
          props.btnContainerStyle
        ]}
        onPress={props.onPress}
      >
        {props.iconLeft}
        <Text style={[styles.text, props.titleStyle]}>{props.title}</Text>
        {props.iconRight}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 8,
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
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  text: {
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  }
});

export default Button;
