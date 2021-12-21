import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {
  getNavBarTheme,
  checkIsNextSceneNavBarSurfaceMode,
} from 'src/Themes/helper/updateNavBarTheme';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import Container from '../Container';
import NavBarWrapper from './NavBarWrapper';

const styles = StyleSheet.create({
  leftContainer: {
    marginRight: 'auto',
  },
  titleWrapper: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    justifyContent: 'center',
  },
  titleContainer: {
    maxWidth: '70%',
  },
  rightContainer: {
    marginLeft: 'auto',
  },
});

const NavBar = ({
  renderLeft,
  renderRight,
  renderTitle,
  navigation,
  ...props
}) => {
  const {theme} = useTheme();

  const navBarTheme = useMemo(() => {
    return getNavBarTheme(
      theme,
      checkIsNextSceneNavBarSurfaceMode(navigation.title),
    );
  }, [theme, navigation.title]);

  const containerStyle: Style = useMemo(() => {
    return mergeStyles(navBarTheme.headerStyle as Style, props.containerStyle);
  }, [theme, navBarTheme, props.containerStyle]);

  return (
    <NavBarWrapper {...props} containerStyle={containerStyle}>
      <Container noBackground flex row>
        <View style={styles.leftContainer}>{renderLeft && renderLeft()}</View>

        <Container noBackground center flex style={styles.titleWrapper}>
          <Container row noBackground style={styles.titleContainer}>
            {renderTitle ? renderTitle() : navBarTheme.renderTitle(navigation)}
          </Container>
        </Container>

        <View style={styles.rightContainer}>
          {renderRight && renderRight()}
        </View>
      </Container>
    </NavBarWrapper>
  );
};

export default memo(NavBar);
