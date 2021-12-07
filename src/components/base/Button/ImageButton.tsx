import React, {forwardRef, memo, useCallback, useMemo} from 'react';
import {StyleSheet} from 'react-native';

import {ImageButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';

import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';

import Image from 'src/components/Image';
import Button from './Button';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    image: {},
  });

  return styles;
};

const ImageButton = forwardRef(
  (
    {
      imageStyle,
      style,

      source,

      imageProps,

      ...props
    }: ImageButtonProps,
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

    const imageStyles = useMemo(() => {
      return mergeStyles([styles.image], imageStyle);
    }, [imageStyle]);

    const renderImageComponent = () => {
      // @ts-ignore
      return <Image source={source} style={imageStyles} {...imageProps} />;
    };

    return (
      <Button
        activeOpacity={0.3}
        {...props}
        ref={ref}
        style={buttonStyles}
        children={props.children || renderImageComponent()}
      />
    );
  },
);

export default memo(ImageButton);
