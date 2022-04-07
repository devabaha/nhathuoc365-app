import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Container, Typography, Icon} from 'src/components/base';
import Pressable from 'src/components/Pressable';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  animatedWrapper: {
    flex: 1,
  },
  container: {
    padding: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  title: {
    fontWeight: '600',
  },
});

const Button = ({
  title,
  titleStyle,
  iconName,
  iconStyle,
  style,
  containerStyle,
  onPress,
}) => {
  // console.log('render button');
  const {theme} = useTheme();

  const iconBaseStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.icon,
        {
          color: theme.color.textTertiary,
        },
      ],
      iconStyle,
    );
  }, [theme, iconStyle]);

  return (
    <Pressable onPress={onPress} style={[styles.wrapper, containerStyle]}>
      <Container noBackground reanimated row style={[styles.container, style]}>
        <Icon
          bundle={BundleIconSetName.ANT_DESIGN}
          reanimated
          name={iconName}
          style={iconBaseStyle}
        />
        <Typography
          reanimated
          type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
          style={[styles.title, titleStyle]}>
          {title}
        </Typography>
      </Container>
    </Pressable>
  );
};

export default React.memo(Button);
