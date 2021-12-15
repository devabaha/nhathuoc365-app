import React, {useMemo} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
// constants
import {isIos, WIDTH} from 'app-packages/tickid-chat/constants';
// custom components
import {
  BaseButton,
  Container,
  Typography,
  TypographyType,
} from 'src/components/base';
import {useTheme} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLayout: {
    zIndex: 999,
    flex: 1,
    width: WIDTH,
    paddingTop: isIos ? 20 : 0,
    top: 0,
    position: 'absolute',
  },
  btnCloseHeader: {
    position: 'absolute',
    paddingTop: isIos ? 20 : 0,
    left: 15,
  },
  albumHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumTitle: {
    fontWeight: '500',
  },
  iconToggleAlbum: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
});

const HeaderLayout = (props) => {
  const {theme} = useTheme();

  const containerStyle: Style = useMemo(() => {
    return {backgroundColor: theme.color.coreOverlay};
  }, [theme]);

  const albumTitleStyle = useMemo(() => {
    return {color: theme.color.onOverlay};
  }, [theme]);

  return (
    <Container
      animated
      style={[
        containerStyle,
        styles.center,
        styles.headerLayout,
        {
          opacity: props.opacity,
          height: props.headerHeight,
        },
      ]}
      pointerEvents={props.pointerEvents}>
      <BaseButton
        // @ts-ignore
        hitSlop={HIT_SLOP}
        style={[styles.btnCloseHeader, props.btnCloseHeaderStyle]}
        onPress={props.handleCloseModal}>
        {props.btnHeaderClose}
      </BaseButton>
      <BaseButton
        // @ts-ignore
        hitSlop={HIT_SLOP}
        onPress={props.toggleAlbum}>
        <View style={[styles.albumHeader]}>
          <Typography
            type={TypographyType.TITLE_SEMI_LARGE}
            style={[
              styles.center,
              styles.albumTitle,
              albumTitleStyle,
              props.albumTitleStyle,
            ]}>
            {props.chosenAlbumTitle}
          </Typography>
          <Animated.View
            style={[
              styles.center,
              styles.iconToggleAlbum,
              {transform: [{rotate: props.rotate}]},
            ]}>
            {props.iconToggleAlbum}
          </Animated.View>
        </View>
      </BaseButton>
    </Container>
  );
};

export default HeaderLayout;
