import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from 'src/components/Layout/Container';

import appConfig from 'app-config';
import {FloatingIconsProps, Icon} from '.';
import {BUNDLE_ICON_SETS} from 'src/constants';

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
    borderColor: '#fff',
    backgroundColor: appConfig.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixTitle: {
    fontSize: 12,
    color: '#666',
    marginRight: 3
  },
  icon: {
    color: '#fff',
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
  const renderIcons = () => {
    if (Array.isArray(icons)) {
      return icons.map(renderIcon);
    } else {
      return renderIcon(icons);
    }
  };

  const renderIcon = (icon: Icon | string, index = 0) => {
    const extraStyle = Array.isArray(icons) && {
      left: index > 0 ? -ICON_OVERFLOW_SPACE_DIMENSIONS : 0,
      zIndex: icons.length - index,
    };

    const IconBundle =
      typeof icon == 'object'
        ? BUNDLE_ICON_SETS[icon.bundle] || AntDesignIcon
        : AntDesignIcon;
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
          styles.container,
          extraStyle,
          iconExtraContainerStyle,
          iconContainerStyle,
          style,
        ]}>
        <IconBundle
          name={iconName}
          style={[styles.icon, iconExtraStyle, iconStyle]}
        />
      </Container>
    );
  };

  const extraWrapperStyle = Array.isArray(icons) && {
    width:
      ICON_DIMENSIONS * icons.length -
      ICON_OVERFLOW_SPACE_DIMENSIONS * (icons.length - 1),
  };

  return (
    <Container row style={[styles.wrapper, extraWrapperStyle, wrapperStyle]}>
      {prefixTitle && <Text style={[styles.prefixTitle]}>{prefixTitle}</Text>}
      {renderIcons()}
    </Container>
  );
};

export default React.memo(FloatingIcons);
