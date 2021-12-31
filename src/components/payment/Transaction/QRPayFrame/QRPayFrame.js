import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const WIDTH = 15;
const HEIGHT = 3;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
  },
  frameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: HEIGHT,
    overflow: 'hidden',
  },
  title: {
    position: 'absolute',
    top: -15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  frame: {
    position: 'absolute',
  },
  frameTopLeftHorizontal: {
    top: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameTopLeftVertical: {
    top: 0,
    left: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameTopRightHorizontal: {
    top: 0,
    right: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameTopRightVertical: {
    top: 0,
    right: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameBottomLeftHorizontal: {
    bottom: 0,
    left: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameBottomLeftVertical: {
    bottom: 0,
    left: 0,
    width: HEIGHT,
    height: WIDTH,
  },
  frameBottomRightHorizontal: {
    bottom: 0,
    right: 0,
    width: WIDTH,
    height: HEIGHT,
  },
  frameBottomRightVertical: {
    bottom: 0,
    right: 0,
    width: HEIGHT,
    height: WIDTH,
  },
});

const QRPayFrame = ({children, style}) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const frameStyle = useMemo(() => {
    return mergeStyles(styles.frame, {
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  return (
    <View style={[styles.container, style]}>
      {children}
      <Typography
        type={TypographyType.TITLE_LARGE_PRIMARY}
        style={styles.title}>
        {t('qrPayLabel')}
      </Typography>
      <View style={styles.frameContainer}>
        <View style={[frameStyle, styles.frameTopLeftHorizontal]} />
        <View style={[frameStyle, styles.frameTopLeftVertical]} />

        <View style={[frameStyle, styles.frameTopRightHorizontal]} />
        <View style={[frameStyle, styles.frameTopRightVertical]} />

        <View style={[frameStyle, styles.frameBottomLeftHorizontal]} />
        <View style={[frameStyle, styles.frameBottomLeftVertical]} />

        <View style={[frameStyle, styles.frameBottomRightHorizontal]} />
        <View style={[frameStyle, styles.frameBottomRightVertical]} />
      </View>
    </View>
  );
};

export default QRPayFrame;
