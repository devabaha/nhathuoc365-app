import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {FilledButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import FilledButton from './FilledButton';
import {ButtonRoundedType} from './constants';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      // backgroundColor: theme.color.persistPrimary,
      paddingVertical: 15,
      // borderRadius: 10,
      // justifyContent: 'center',
      // alignItems: 'center',
      // flexDirection: 'row',
    },
    // disabled: {
    //   backgroundColor: theme.color.disabled,
    // },
    // shadow: {
    //   shadowColor: theme.color.shadow,
    //   ...theme.layout.shadow,
    // },
    text: {
      // color: theme.color.onPersistPrimary,
      textTransform: 'uppercase',
      fontWeight: '600',
      fontSize: 16,
    },
  });

  return styles;
};

const AppPrimaryButton = forwardRef(
  (
    {
      titleStyle,
      style,

      ...props
    }: FilledButtonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const buttonStyles = useMemo(() => {
      return mergeStyles([styles.container], style);
    }, [styles, style]);

    const titleStyles = mergeStyles(styles.text, titleStyle);

    return (
      <FilledButton
        secondary
        rounded={ButtonRoundedType.MEDIUM}
        {...props}
        ref={ref}
        style={buttonStyles}
        titleStyle={titleStyles}
      />
    );
  },
);

export default memo(AppPrimaryButton);
