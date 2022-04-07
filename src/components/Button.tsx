import React from 'react';
import {StyleSheet} from 'react-native';
// types
import {FilledButtonProps} from 'src/components/base/Button';
import {Style} from 'src/Themes/interface';
// custom components
import {Children, Container, AppPrimaryButton} from 'src/components/base';

interface ButtonProps extends FilledButtonProps {
  showBackground?: boolean;
  safeLayout?: boolean;

  containerStyle?: Style;
  btnContainerStyle?: Style;
  renderBefore?: Children;
}

const Button = ({
  showBackground = false,

  disabled = false,
  shadow = false,
  safeLayout = false,

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
}: ButtonProps) => {
  const defaultTitleStyle = [styles.text, titleStyle];
  return (
    <Container
      safeLayout={safeLayout}
      style={[
        styles.container,
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
        {...props}>
        {children || title}
      </AppPrimaryButton>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  btn: {
    width: '100%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  hideBackground: {
    backgroundColor: 'transparent',
  },
});

export default Button;
