import React, {memo, useMemo} from 'react';
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
        {renderLeft && renderLeft()}
        {renderTitle ? (
          renderTitle()
        ) : (
          <Container noBackground center flex>
            {navBarTheme.renderTitle(navigation)}
          </Container>
        )}
        {renderRight && renderRight()}
      </Container>
    </NavBarWrapper>
  );
};

export default memo(NavBar);
