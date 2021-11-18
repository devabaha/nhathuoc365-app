import React, {memo, forwardRef, useMemo, MutableRefObject} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import { mergeStyles } from 'src/Themes/helper';

import {useTheme} from 'src/Themes/Theme.context';

import {InputProps} from '.';

const createStyles = (theme) => {
  const styles = StyleSheet.create({
    primary: {
      color: theme.color.textPrimary,
    },
  });

  return styles;
};

const Input = forwardRef(
  ({style, ...props}: InputProps, ref: MutableRefObject<any>) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles.primary;
    }, [theme]);

    const componentStyle = useMemo(() => {
      return mergeStyles(styles, style);
    }, [styles, style]);

    return <TextInput ref={ref} {...props} style={componentStyle} />;
  },
);

export default memo(Input);
