import React, {useMemo, useCallback} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
//context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Container, Typography, Icon, FilledButton} from 'src/components/base';

const styles = StyleSheet.create({
  permission: {
    paddingHorizontal: 12,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionNoLocationIcon: {
    fontSize: 45,
    marginBottom: 15,
  },
  permissionTitle: {
    marginBottom: 10,
  },
  permissionConfirm: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  permissionSettingIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  permissionConfirmText: {
    fontWeight: '500',
  },
});

function NoResult({
  iconName,
  message,
  btnTitle,
  btnIconName,
  onPress,
  renderTitle,
}) {
  const {theme} = useTheme();

  const inactiveStyle = useMemo(() => {
    return {
      color: theme.color.iconInactive,
    };
  }, [theme]);

  const permissionNoLocationIconStyle = useMemo(() => {
    return mergeStyles(styles.permissionNoLocationIcon, inactiveStyle);
  }, [inactiveStyle]);

  const permissionNoLocationTitleStyle = useMemo(() => {
    return mergeStyles(styles.permissionTitle, inactiveStyle);
  }, [inactiveStyle]);

  const permissionConfirmStyle = useMemo(() => {
    return mergeStyles(styles.permissionConfirm, {
      backgroundColor: theme.color.contentBackgroundWeak,
      borderRadius: theme.layout.borderRadiusHuge,
    });
  }, [theme]);

  const permissionConfirmTitleStyle = useMemo(() => {
    return mergeStyles(styles.permissionConfirmText, inactiveStyle);
  }, [theme]);

  const renderIconLeft = useCallback((titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name={btnIconName}
        style={[styles.permissionSettingIcon, titleStyle]}
      />
    );
  }, []);

  const permissionConfirmTypoProps = useMemo(() => {
    return {
      type: TypographyType.DESCRIPTION_SEMI_MEDIUM,
    };
  }, []);

  return (
    <Container style={styles.permission}>
      {!!iconName && (
        <Icon
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          name={iconName}
          style={permissionNoLocationIconStyle}
        />
      )}
      {typeof renderTitle === 'function' ? (
        renderTitle()
      ) : (
        <Typography
          type={TypographyType.DESCRIPTION_MEDIUM}
          style={permissionNoLocationTitleStyle}>
          {message}
        </Typography>
      )}

      {!!btnTitle && (
        <FilledButton
          hitSlop={HIT_SLOP}
          titleStyle={permissionConfirmTitleStyle}
          style={permissionConfirmStyle}
          typoProps={permissionConfirmTypoProps}
          onPress={onPress}
          renderIconLeft={renderIconLeft}>
          {btnTitle}
        </FilledButton>
      )}
    </Container>
  );
}

export default NoResult;
