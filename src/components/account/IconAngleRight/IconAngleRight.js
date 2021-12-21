import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Icon} from 'src/components/base';

const styles = StyleSheet.create({
  icon: {
    fontSize: 26,
  },
});

const IconAngleRight = () => (
  <Icon
    bundle={BundleIconSetName.FONT_AWESOME}
    name="angle-right"
    style={styles.icon}
    neutral
  />
);

export default memo(IconAngleRight);
