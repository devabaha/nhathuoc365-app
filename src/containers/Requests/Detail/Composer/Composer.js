import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';

const Composer = ({ onPressSend, disabled, style, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput multiline style={[styles.input, props.style]} {...props} />
      <TouchableOpacity
        style={styles.btn}
        onPress={onPressSend}
        disabled={disabled}
      >
        <Icon name="send" style={[styles.icon, disabled && iconDisabled]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
    flexDirection: 'row',
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    padding: 10
  },
  input: {
    minHeight: 24,
    textAlignVertical: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#555',
    flex: 1
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: appConfig.colors.primary
  },
  iconDisabled: {
    color: '#999'
  }
});

export default Composer;
