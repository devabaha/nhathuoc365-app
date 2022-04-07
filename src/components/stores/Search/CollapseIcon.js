import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {BundleIconSetName, IconButton} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';

const styles = StyleSheet.create({
  collapseIcon: {
    fontSize: 20,
  },
});

const CollapseIcon = (props) => {
  const iconStyle = useMemo(() => {
    return mergeStyles(styles.collapseIcon, props.style);
  }, [props.styles]);

  return (
    <IconButton
      iconProps={{reanimated: true}}
      bundle={BundleIconSetName.FONT_AWESOME}
      hitSlop={HIT_SLOP}
      activeOpacity={0.6}
      onPress={props.onPress}
      name="caret-up"
      neutral
      iconStyle={iconStyle}
    />
  );
};

export default memo(CollapseIcon);
