import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MIN_WIDTH_MESSAGE = 120;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    minWidth: MIN_WIDTH_MESSAGE,
    width: '100%',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  btnContainer: {
    right: 0,
    borderBottomRightRadius: 15,
  },
  label: {
    color: '#777',
    paddingLeft: 40,
    paddingRight: 15,
  },
  mask: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
});

const SeeMoreBtn = ({
  title,
  lineHeight,
  containerStyle,
  bgColor = '#fff',
  onPress = () => {},
}) => {
  const {t} = useTranslation('social');

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        activeOpacity={0.9}
        onPress={onPress}
        style={styles.btnContainer}>
        <LinearGradient
          style={styles.mask}
          colors={[hexToRgbA(bgColor, 1), hexToRgbA(bgColor, 0)]}
          locations={[0.8, 1]}
          angle={-90}
          useAngle
        />
        <Text
          style={[
            styles.label,
            {
              lineHeight,
            },
          ]}>
          ... {title || t('seeMore')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(SeeMoreBtn);
