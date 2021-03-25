import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import appConfig from 'app-config';

const Button = ({
  disabled,
  shadow,

  title,

  containerStyle,
  btnContainerStyle,
  titleStyle,

  renderTitleComponent,
  renderBefore,
  onPress,

  iconLeft,
  iconRight,
  children,
}) => {
  const defaultTitleStyle = [styles.text, titleStyle];
  return (
    <View style={[styles.container, containerStyle]}>
      {renderBefore}
      <TouchableOpacity
        style={[
          styles.btn,
          shadow && styles.shadow,
          disabled && styles.btnDisabled,
          btnContainerStyle,
        ]}
        onPress={onPress}
        disabled={disabled}>
        {iconLeft}
        {renderTitleComponent ? (
          renderTitleComponent(defaultTitleStyle)
        ) : (
          <Text style={defaultTitleStyle}>{children || title}</Text>
        )}
        {iconRight}
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
    alignSelf: 'flex-end',
  },
  btn: {
    width: '100%',
    backgroundColor: appConfig.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Button;
