import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import CenterIcon from './CenterIcon';

const styles = StyleSheet.create({
  icon: {
    fontSize: 28,
  },
});

const IconCameraPicker = () => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.onSurface,
    });
  }, [theme]);

  return (
    <CenterIcon
      bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
      name="camera"
      style={iconStyle}
    />
  );
};

export default memo(IconCameraPicker);
