import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// types
import {FloatingIconsProps, Icon as IconType} from '.';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base/Icon/constants';
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Icon, Typography} from 'src/components/base';

const ICON_DIMENSIONS = 22;
const ICON_OVERFLOW_SPACE_DIMENSIONS = 4;

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    width: ICON_DIMENSIONS,
    height: ICON_DIMENSIONS,
    borderRadius: ICON_DIMENSIONS / 2,
    overflow: 'hidden',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixTitle: {
    marginRight: 3,
  },
  icon: {
    fontSize: 10,
  },
});

const FloatingIcons = ({
  icons,
  prefixTitle,
  wrapperStyle,
  style,
  iconContainerStyle,
  iconStyle,
}: FloatingIconsProps) => {
  const {theme} = useTheme();

  const renderIcons = () => {
    if (Array.isArray(icons)) {
      return icons.map(renderIcon);
    } else {
      return renderIcon(icons);
    }
  };

  const renderIcon = (icon: IconType | string, index = 0) => {
    const extraStyle = Array.isArray(icons) && {
      left: index > 0 ? -ICON_OVERFLOW_SPACE_DIMENSIONS : 0,
      zIndex: icons.length - index,
    };

    const iconBundle =
      typeof icon == 'object'
        ? icon.bundle || BundleIconSetName.ANT_DESIGN
        : BundleIconSetName.ANT_DESIGN;
    let iconName = '';
    let iconExtraStyle = {};
    let iconExtraContainerStyle = {};

    if (typeof icon == 'object') {
      iconName = icon.name;
      iconExtraStyle = icon.style;
      iconExtraContainerStyle = icon.containerStyle;
    } else {
      iconName = icon;
    }

    return (
      <Container
        key={index}
        style={[
          iconBaseContainerStyle,
          extraStyle,
          iconExtraContainerStyle,
          iconContainerStyle,
          style,
        ]}>
        <Icon
          bundle={iconBundle}
          name={iconName}
          style={[iconBaseStyle, iconExtraStyle, iconStyle]}
        />
      </Container>
    );
  };

  const iconBaseContainerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderColor: theme.color.surface,
      backgroundColor: theme.color.persistPrimary,
    });
  }, [theme]);

  const iconBaseStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.onPersistPrimary,
    });
  }, [theme]);

  const extraWrapperStyle = Array.isArray(icons) && {
    width:
      ICON_DIMENSIONS * icons.length -
      ICON_OVERFLOW_SPACE_DIMENSIONS * (icons.length - 1),
  };

  return (
    <Container row style={[styles.wrapper, extraWrapperStyle, wrapperStyle]}>
      {!!prefixTitle && (
        <Typography
          type={TypographyType.DESCRIPTION_SMALL}
          style={[styles.prefixTitle]}>
          {prefixTitle}
        </Typography>
      )}
      {renderIcons()}
    </Container>
  );
};

export default React.memo(FloatingIcons);
