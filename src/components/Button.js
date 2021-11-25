import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import appConfig from 'app-config';
import {
  AppPrimaryButton,
  FilledTonalButton,
  FilledButton,
  AppFilledButton,
  AppFilledTonalButton,
  AppOutlinedButton,
  OutlinedButton,
  BaseButton,
} from './base/Button';
import {Container, TypographyType} from './base';
import {useTheme} from 'src/Themes/Theme.context';

const Button = ({
  showBackground = false,

  disabled = false,
  shadow = false,

  title = '',

  containerStyle = {},
  btnContainerStyle = {},
  titleStyle = {},

  renderTitleComponent = undefined,
  renderBefore = undefined,
  onPress = undefined,

  iconLeft = null,
  iconRight = null,
  children = null,
  ...props
}) => {
  const {theme} = useTheme();
  const defaultTitleStyle = [styles.text, titleStyle];
  return (
    <Container
      style={[
        styles.container,
        {backgroundColor: theme.color.surface},
        !showBackground && styles.hideBackground,
        containerStyle,
      ]}>
      {renderBefore}
      <AppPrimaryButton
        style={[styles.btn, btnContainerStyle]}
        titleStyle={defaultTitleStyle}
        disabled={disabled}
        shadow={shadow}
        iconLeft={iconLeft}
        iconRight={iconRight}
        renderTitleComponent={renderTitleComponent}
        onPress={onPress}
        secondary
        typoProps={{
          type: TypographyType.LABEL_SMALL,
        }}
        {...props}>
        {children || title}
      </AppPrimaryButton>
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'flex-end',
  },
  btn: {
    width: '100%',
    // backgroundColor: appConfig.colors.primary,
    paddingVertical: 15,
    // borderRadius: 10,
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
    // color: '#ffffff',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
  hideBackground: {
    backgroundColor: 'transparent',
  },
});

export default Button;
