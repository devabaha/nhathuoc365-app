import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {IconButton} from 'src/components/base';

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
  },
});

const NavBarButton = ({
  iconName = '',
  containerStyle = {},
  maskStyle = {},
  iconStyle: iconStyleProps = {},
  disabled = false,
  onPress = () => {},
}) => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, iconStyleProps);
  }, [theme, iconStyleProps]);

  return (
    <IconButton
      animated
      disabled={disabled}
      onPress={onPress}
      hitSlop={HIT_SLOP}
      style={[styles.iconContainer, containerStyle]}
      bundle={BundleIconSetName.ANT_DESIGN}
      name={iconName}
      iconStyle={iconStyle}>
      {/* <Animated.View style={[styles.mask, maskStyle]} /> */}
    </IconButton>
  );
};

export default React.memo(NavBarButton);
