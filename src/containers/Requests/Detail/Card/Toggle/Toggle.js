import React from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

const Toggle = ({value, animatedIconStyle}) => {
  const renderDirectionIcon = (titleStyle, fontStyle) => {
    return (
      <Icon
        reanimated
        bundle={BundleIconSetName.FONT_AWESOME}
        style={[fontStyle, styles.icon, animatedIconStyle]}
        name="angle-down"
      />
    );
  };

  return (
    <View style={styles.container}>
      <Typography
        type={TypographyType.LABEL_MEDIUM_PRIMARY}
        renderIconAfter={renderDirectionIcon}>
        {value}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Toggle;
