import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// types
import {AlertItemBtnProps} from '.';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  btnTitle: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

const AlertItemBtn = ({
  title,
  containerStyle,
  titleStyle,
  onPress,
}: AlertItemBtnProps) => {
  const {theme} = useTheme();

  const typoProps = useMemo(() => {
    return {
      type: TypographyType.LABEL_LARGE,
      // numberOfLines: 1
    };
  }, []);

  const containerBaseStyle = useMemo(() => {
    return mergeStyles(styles.container, containerStyle);
  }, [theme, containerStyle]);

  const btnTitleStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.btnTitle,
        {
          color: theme.color.blue600,
        },
      ],
      titleStyle,
    );
  }, [theme, titleStyle]);

  return (
    <TextButton
      useTouchableHighlight
      typoProps={typoProps}
      style={containerBaseStyle}
      titleStyle={btnTitleStyle}
      onPress={onPress}>
      {title}
    </TextButton>
  );
};

export default AlertItemBtn;
