import React, {forwardRef, memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// types
import {ImageButtonProps} from '.';
import {Ref} from '..';
import {Theme} from 'src/Themes/interface';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Image from 'src/components/Image';
import Button from './Button';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {},
    image: {
      width: '100%',
      height: '100%',
    },
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
      return mergeStyles(styles.container, style);
    }, [styles, style]);

    const imageStyles = useMemo(() => {
      return mergeStyles([styles.image], imageStyle);
    }, [imageStyle]);

    const renderImageComponent = () => {
      // @ts-ignore
      return <Image source={source} style={imageStyles} {...imageProps} />;
    };

    const renderImageButtonContentContainer = (children) => {
      return <View>{children}</View>;
    };

    return (
      <Button
        activeOpacity={0.3}
        renderContentContainerComponent={renderImageButtonContentContainer}
        {...props}
        ref={ref}
        style={buttonStyles}>
        {props.children || renderImageComponent()}
      </Button>
    );
  },
);

export default memo(ImageButton);
