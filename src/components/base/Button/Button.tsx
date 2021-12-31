import React, {forwardRef, Fragment, memo, useMemo} from 'react';
import {
  StyleSheet,
  TouchableHighlight as RNTouchableHighlight,
  TouchableOpacity as RNTouchableOpacity,
  View,
} from 'react-native';

import {
  TouchableHighlight as GestureTouchableHighlight,
  TouchableOpacity as GestureTouchableOpacity,
} from 'react-native-gesture-handler';

import {Theme} from 'src/Themes/interface';
import {BaseButtonProps} from '.';
import {Ref} from '..';

import {mergeStyles} from 'src/Themes/helper';
import {useTheme} from 'src/Themes/Theme.context';

import {TypographyType} from '../Typography/constants';

import Typography from '../Typography';
import {getFontStyle} from '../helpers';

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    text: {
      color: theme.color.textPrimary,
      // textTransform: 'uppercase',
      // fontWeight: '600',
      // fontSize: 16,
    },
  });
  return styles;
};

const Button = forwardRef(
  (
    {
      useGestureHandler,
      useTouchableHighlight,
      useContentContainer,

      typoProps,

      title,

      titleStyle,

      renderIconLeft,
      renderTitleComponent,
      renderIconRight,

      iconLeft,
      iconRight,
      children,

      renderContentContainerComponent,

      ...props
    }: BaseButtonProps,
    ref: Ref,
  ) => {
    const {theme} = useTheme();

    const styles = useMemo(() => {
      const baseStyles: any = createStyles(theme);

      return baseStyles;
    }, [theme]);

    const titleStyles = useMemo(() => {
      return mergeStyles(
        typoProps?.type ? theme.typography[typoProps.type] : styles.text,
        [titleStyle, typoProps?.style],
      );
    }, [styles, titleStyle, typoProps?.type, typoProps?.style]);

    const fontStyle = useMemo(() => {
      return getFontStyle(titleStyles);
    }, [titleStyles]);

    const Wrapper = useMemo(() => {
      return useTouchableHighlight
        ? useGestureHandler
          ? GestureTouchableHighlight
          : RNTouchableHighlight
        : useGestureHandler
        ? GestureTouchableOpacity
        : RNTouchableOpacity;
    }, [useTouchableHighlight, useGestureHandler]);

    const renderContent = () => {
      const ContentContainer = useContentContainer ? View : Fragment;
      return (
        <ContentContainer>
          {iconLeft}
          {!!renderIconLeft && renderIconLeft(titleStyles, {}, fontStyle)}

          {renderTitleComponent ? (
            renderTitleComponent(titleStyles, {}, fontStyle)
          ) : typeof children === 'string' || !!title ? (
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              {...typoProps}
              style={titleStyles}>
              {children || title}
            </Typography>
          ) : (
            children
          )}
          {!!renderIconRight && renderIconRight(titleStyles, {}, fontStyle)}
          {iconRight}
        </ContentContainer>
      );
    };

    return (
      <Wrapper
        underlayColor={theme.color.underlay}
        activeOpacity={0.6}
        {...props}
        ref={ref}>
        {renderContentContainerComponent
          ? renderContentContainerComponent(renderContent())
          : renderContent()}
      </Wrapper>
    );
  },
);

export default memo(Button);
