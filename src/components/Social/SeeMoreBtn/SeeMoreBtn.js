import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import LinearGradient from 'react-native-linear-gradient';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton, Typography} from 'src/components/base';

const MIN_WIDTH_MESSAGE = 120;

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // minWidth: MIN_WIDTH_MESSAGE,
    // alignItems: 'flex-end',
    // alignSelf: 'flex-end',
    // zIndex: 1,
  },
  btnContainer: {
    right: 0,
    borderBottomRightRadius: 15,
  },
  label: {
    paddingRight: 15,
  },
  mask: {
    height: '100%',
    width: '120%',
    left: '-20%',
    position: 'absolute',
  },
});

const SeeMoreBtn = ({
  title,
  lineHeight,
  containerStyle,
  titleStyle,
  bgColor: bgColorProp,
  onPress = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('social');

  const bgColor = useMemo(() => {
    return bgColorProp || theme.color.surface;
  }, [theme, bgColorProp]);

  const labelStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.label,
        {
          lineHeight,
        },
      ],
      titleStyle,
    );
  }, [theme, titleStyle, lineHeight]);

  const renderTitle = useCallback(() => {
    return (
      <>
        {/* <LinearGradient
          style={styles.mask}
          colors={[hexToRgba(bgColor, 1), hexToRgba(bgColor, 0)]}
          locations={[0.77, 1]}
          angle={-90}
          useAngle
        /> */}
        <Typography type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY} style={labelStyle}>
          {title || t('seeMore')}
        </Typography>
      </>
    );
  }, [bgColor, labelStyle, title]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TextButton
        hitSlop={HIT_SLOP}
        onPress={onPress}
        style={styles.btnContainer}
        renderTitleComponent={renderTitle}
      />
    </View>
  );
};

export default React.memo(SeeMoreBtn);
