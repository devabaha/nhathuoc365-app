import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import Animated, {Easing, useValue} from 'react-native-reanimated';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {TextButton, Icon} from 'src/components/base';

const CONTAINER_HEIGHT = 15;
const CONTAINER_TOP_SPACING = 5;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    opacity: 0.2,
    maxHeight: CONTAINER_HEIGHT,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  label: {
    letterSpacing: 1,
    textAlign: 'center',
  },
  iconContainer: {
    paddingHorizontal: 10,
    marginRight: -10,
  },
});

const DomainItem = ({
  index = 0,
  totalDomains = 1,
  title,
  visible,
  iconName = 'down',
  onPress,
  containerStyle,
}) => {
  const {theme} = useTheme();

  const animatedTranslate = useValue(visible ? 1 : 0);

  const labelTypoProps = {
    type: TypographyType.LABEL_EXTRA_TINY,
  };

  useEffect(() => {
    Animated.timing(animatedTranslate, {
      toValue: visible ? 1 : 0,
      duration: 200 + index * 30,
      easing: Easing.ease,
    }).start();
  }, [visible, index]);

  const renderIconShowMore = (titleStyle) => {
    return (
      !!onPress && (
        <View style={styles.iconContainer}>
          <Icon
            bundle={BundleIconSetName.ANT_DESIGN}
            name={iconName}
            style={titleStyle}
          />
        </View>
      )
    );
  };

  const containerBaseStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.coreOverlay,
    };
  }, [theme]);

  const labelStyle = useMemo(() => {
    return mergeStyles(styles.label, {
      color: theme.color.onOverlay,
    });
  }, [theme]);

  return (
    <Animated.View
      pointerEvents={onPress ? 'auto' : 'none'}
      style={[
        styles.container,
        containerBaseStyle,
        {
          opacity: animatedTranslate.interpolate({
            inputRange: [index / totalDomains, 1],
            outputRange: [0, 0.1],
          }),
          transform: [
            {
              translateY: animatedTranslate.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  index * (CONTAINER_HEIGHT + CONTAINER_TOP_SPACING),
                ],
              }),
            },
          ],
        },
        containerStyle,
      ]}>
      <TextButton
        hitSlop={HIT_SLOP}
        disabled={!onPress}
        typoProps={labelTypoProps}
        renderIconRight={renderIconShowMore}
        titleStyle={labelStyle}
        style={styles.contentContainer}
        onPress={onPress}>
        {title}
      </TextButton>
    </Animated.View>
  );
};

export default React.memo(DomainItem);
