import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {getThemes} from '../../themes';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography, Container} from 'src/components/base';

const styles = StyleSheet.create({
  title: {
    fontWeight: '500',
  },
  highlight: {},
});

const Timer = ({
  current,
  total = '',
  containerStyle = {},
  titleStyle: titleStyleProp = {},
  highlightStyle: highlightStyleProp = {},
  onLayout = () => {},
}) => {
  const {theme} = useTheme();

  const themes = useMemo(() => {
    return getThemes(theme);
  }, [theme]);

  const titleStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.title,
        {
          color: themes.colors.secondary,
        },
      ],
      titleStyleProp,
    );
  }, [themes, titleStyleProp]);

  const highlightStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.highlight,
        {
          color: themes.colors.primary,
        },
      ],
      highlightStyleProp,
    );
  }, [themes, highlightStyleProp]);

  return (
    <Container
      noBackground
      onLayout={onLayout}
      row
      reanimated
      style={containerStyle}>
      <Typography type={TypographyType.LABEL_SMALL} style={titleStyle}>
        <Typography type={TypographyType.LABEL_SMALL} style={highlightStyle}>
          {current}
        </Typography>
        {!!total && ` / ${total}`}
      </Typography>
    </Container>
  );
};

export default React.memo(Timer);
