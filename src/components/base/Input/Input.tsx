import React, {memo, forwardRef, useMemo} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import {InputProps} from '.';
import {Ref} from '..';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    primary: {
      color: theme.color.textPrimary,
    },
  });

  return styles;
};

const Input = forwardRef(({style, type, ...props}: InputProps, ref: Ref) => {
  const {theme} = useTheme();

  const styles = useMemo(() => {
    const baseStyles: any = createStyles(theme);

    return mergeStyles(baseStyles.primary, theme.typography[type]);
  }, [theme, type]);

  const componentStyle = useMemo(() => {
    return mergeStyles(styles, style);
  }, [styles, style]);

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={theme.color.placeholder}
      {...props}
      style={componentStyle}
    />
  );
});

export default memo(Input);
