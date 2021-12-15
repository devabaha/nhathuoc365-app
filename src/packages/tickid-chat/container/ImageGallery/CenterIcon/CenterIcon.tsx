import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
// types
import {IconProps} from 'src/components/base/Icon';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Icon} from 'src/components/base';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CenterIcon = (props: IconProps) => {
  return (
    <View style={styles.center}>
      <Icon
        {...props}
        bundle={props.bundle || BundleIconSetName.FONT_AWESOME}
      />
    </View>
  );
};

export default memo(CenterIcon);
