import React from 'react';
import {StyleSheet} from 'react-native';
import {AppPrimaryButton} from './base/Button';
import {Children, Container, TypographyType} from './base';
import {FilledButtonProps} from 'src/components/base/Button';
import {useTheme} from 'src/Themes/Theme.context';
import {Style} from 'src/Themes/interface';

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
  const {theme} = useTheme();
  const defaultTitleStyle = [styles.text, titleStyle];
  return (
    <Container
      safeLayout={safeLayout}
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
