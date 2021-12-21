import React, {memo, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// types
import {Style} from 'src/Themes/interface';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {
  getNavBarTheme,
  checkIsNextSceneNavBarSurfaceMode,
} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from '../Icon';
// custom components
import Container from '../Container';
import NavBarWrapper from './NavBarWrapper';
import {IconButton} from '../Button';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
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
  backIcon: {
    fontSize: appConfig.device.isAndroid ? 24 : 32,
  },
});

const NavBar = ({
  renderLeft,
  renderRight,
  renderTitle,
  navigation,
  back = true,

  renderHeader,
  renderBack,
  ...props
}) => {
  const {theme} = useTheme();

  const navBarTheme = useMemo(() => {
    return getNavBarTheme(
      theme,
      checkIsNextSceneNavBarSurfaceMode(navigation.title),
    );
  }, [theme, navigation.title]);

  const handleBack = useCallback(() => {
    pop();
  }, []);

  const renderBaseBack = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.IONICONS}
        name={appConfig.device.isAndroid ? 'md-arrow-back' : 'ios-chevron-back'}
        iconStyle={[styles.backIcon, navBarTheme.iconStyle]}
        onPress={handleBack}
      />
    );
  };

  const containerStyle: Style = useMemo(() => {
    return mergeStyles(
      [navBarTheme.headerStyle as Style, styles.container],
      props.containerStyle,
    );
  }, [theme, navBarTheme, props.containerStyle]);

  return (
    <NavBarWrapper {...props} containerStyle={containerStyle}>
      {renderHeader ? (
        renderHeader()
      ) : (
        <Container noBackground flex row>
          <Container noBackground row style={styles.leftContainer}>
            {back && (renderBack ? renderBack() : renderBaseBack())}
            {renderLeft && renderLeft()}
          </Container>

          <Container noBackground center flex style={styles.titleWrapper}>
            <Container row noBackground style={styles.titleContainer}>
              {renderTitle
                ? renderTitle()
                : navBarTheme.renderTitle(navigation)}
            </Container>
          </Container>

          <View style={styles.rightContainer}>
            {renderRight && renderRight()}
          </View>
        </Container>
      )}
    </NavBarWrapper>
  );
};

export default memo(NavBar);
