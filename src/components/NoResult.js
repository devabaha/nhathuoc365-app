import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Icon, Typography} from 'src/components/base';

const NoResult = ({
  icon = null,
  iconBundle = BundleIconSetName.MATERIAL_COMMUNITY_ICONS,
  iconName = 'file-remove',
  iconSize = 72,
  message = '',
  description = '',
  contentContainerStyle = {},
  containerStyle = {},
  textStyle = {},

  renderIcon = undefined,
  renderFooterComponent = () => null,
}) => {
  const {theme} = useTheme();

  const textColorStyle = useMemo(() => {
    return {
      color: theme.color.iconInactive,
    };
  }, [theme]);

  const iconStyle = useMemo(() => {
    return {
      ...textColorStyle,
      fontSize: iconSize,
    };
  }, [textColorStyle, iconSize]);

  const titleStyle = useMemo(() => {
    return mergeStyles([styles.text, textColorStyle], textStyle);
  }, [theme, textColorStyle, textStyle]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {renderIcon
          ? renderIcon(iconStyle)
          : icon || (
              <Icon bundle={iconBundle} name={iconName} style={iconStyle} />
            )}
        <Typography type={TypographyType.TITLE_LARGE} style={titleStyle}>
          {message}
        </Typography>
        {!!description && (
          <Typography type={TypographyType.LABEL_MEDIUM} style={titleStyle}>
            {description}
          </Typography>
        )}
        {renderFooterComponent && renderFooterComponent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '20%',
    paddingBottom: '35%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingTop: 15,
    fontWeight: '500',
    textAlign: 'center'
  },
});

export default NoResult;
