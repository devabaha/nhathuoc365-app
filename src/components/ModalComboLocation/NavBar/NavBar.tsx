import React, {useEffect, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
import {NavBarProps} from './index';
// 3-party libs
import Animated, {Easing, useValue, interpolate} from 'react-native-reanimated';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BACK_NAV_ICON_NAME} from 'src/constants';
import {COMBO_LOCATION_TYPE} from '../constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Container, Icon, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
    padding: 15,
    paddingLeft: 10,
  },
  iconClose: {
    position: 'absolute',
  },
  navTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
    paddingHorizontal: 50,
  },
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: 1,
  },
  descriptionContainer: {
    paddingVertical: 10,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 5,
    letterSpacing: 0.2,
  },
});

const NavBar = ({title, description, type, onPressBack}: NavBarProps) => {
  const {theme} = useTheme();

  const animatedOpacity = useValue(
    type === COMBO_LOCATION_TYPE.PROVINCE ? 0 : 1,
  );

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: type === COMBO_LOCATION_TYPE.PROVINCE ? 0 : 1,
      duration: 300,
      easing: Easing.quad,
    }).start();
  }, [type]);

  const containerStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    };
  }, [theme]);

  const descriptionContainerStyle = useMemo(() => {
    return mergeStyles(styles.descriptionContainer, {
      backgroundColor: theme.color.underlay,
    });
  }, [theme]);

  const iconBackAnimatedStyle: Style = useMemo(() => {
    return {
      opacity: animatedOpacity.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 1, 1],
      }),
      transform: [
        {
          translateX: interpolate(animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
      ],
    };
  }, []);

  const iconCloseAnimatedStyle: Style = useMemo(() => {
    return {
      opacity: animatedOpacity.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [1, 0, 0],
      }),
      transform: [
        {
          translateX: interpolate(animatedOpacity, {
            inputRange: [0, 1],
            outputRange: [0, -10],
          }),
        },
      ],
    };
  }, []);

  return (
    <>
      <Container row style={containerStyle}>
        <BaseButton onPress={onPressBack}>
          <Icon
            bundle={BundleIconSetName.IONICONS}
            reanimated
            name={BACK_NAV_ICON_NAME}
            style={[styles.icon, iconBackAnimatedStyle]}
          />
          <Icon
            bundle={BundleIconSetName.IONICONS}
            reanimated
            name="close"
            style={[styles.icon, styles.iconClose, iconCloseAnimatedStyle]}
          />
        </BaseButton>

        <Container style={styles.navTextContainer}>
          <Typography type={TypographyType.TITLE_MEDIUM} style={styles.title}>
            {title}
          </Typography>
        </Container>
      </Container>

      {!!description && (
        <Container style={descriptionContainerStyle}>
          <Typography
            type={TypographyType.LABEL_SMALL_PRIMARY}
            numberOfLines={2}
            style={styles.description}>
            {description}
          </Typography>
        </Container>
      )}
    </>
  );
};

export default React.memo(NavBar);
