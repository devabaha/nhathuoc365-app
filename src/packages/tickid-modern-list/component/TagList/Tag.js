import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {isEmpty} from 'lodash';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {AppFilledButton, TypographyType} from 'src/components/base';

const Tag = (props) => {
  const {theme} = useTheme();

  const activeStyle = useMemo(() => {
    return props.active
      ? !isEmpty(props.activeStyle)
        ? props.activeStyle
        : {}
      : {};
  }, [props, theme]);

  const activeTextStyle = useMemo(() => {
    return (
      props.active && !isEmpty(props.activeTextStyle) && props.activeTextStyle
    );
  }, [props.active, props.activeTextStyle, theme]);

  const disabledStyle = useMemo(() => {
    return (
      props.disabled && !isEmpty(props.disabledStyle) && props.disabledStyle
    );
  }, [props.disabled, props.disabledStyle, theme]);

  const disabledTextStyle = useMemo(() => {
    return (
      props.disabled &&
      !isEmpty(props.disabledTextStyle) &&
      props.disabledTextStyle
    );
  }, [props.disabled, props.disabledTextStyle, theme]);

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderRadius: theme.layout.borderRadiusSmall,
    });
  }, [theme]);

  return (
    <AppFilledButton
      useTouchableHighlight
      typoProps={{type: TypographyType.DESCRIPTION_MEDIUM_TERTIARY}}
      disabled={props.disabled}
      primary={props.active}
      secondary={false}
      neutral={!props.active}
      style={[containerStyle, activeStyle, disabledStyle]}
      titleStyle={[activeTextStyle, disabledTextStyle]}
      onPress={props.onPress}>
      {props.item}
    </AppFilledButton>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    margin: 5,
  },
});

export default Tag;
