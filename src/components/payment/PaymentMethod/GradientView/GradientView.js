import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3 parties
import LinearGradient from 'react-native-linear-gradient';
// helpers
import {hexToRgba} from 'app-helper';
// context
import {useTheme} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  gradient: {
    height: '100%',
    flex: 1,
    width: 30,
    zIndex: 1,
  },
  gradientStart: {
    position: 'absolute',
    left: 0,
  },
  gradientEnd: {
    position: 'absolute',
    right: 0,
  },
});

const GradientView = (props) => {
  const {theme} = useTheme();

  const colorArray = useMemo(() => {
    return [
      hexToRgba(theme.color.surface, 0),
      hexToRgba(theme.color.surface, 0.25),
      hexToRgba(theme.color.surface, 0.5),
    ];
  }, [theme]);

  return (
    <LinearGradient
      colors={colorArray}
      locations={[
        props.start ? 1 : 0,
        props.start ? 0.45 : 0.55,
        props.start ? 0 : 1,
      ]}
      angle={90}
      useAngle
      style={[
        styles.gradient,
        props.start
          ? styles.gradientStart
          : props.end
          ? styles.gradientEnd
          : {},
      ]}
    />
  );
};

export default GradientView;
