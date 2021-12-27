import React from 'react';
import {View, StyleSheet} from 'react-native';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, Icon, BaseButton} from 'src/components/base';

const styles = StyleSheet.create({
  add_store_action_btn: {
    // paddingVertical: 4,
    // paddingHorizontal: 12,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // marginBottom: 2,
  },
  add_store_action_label: {
    marginTop: 4,
    textAlign: 'center',
  },
  icon: {
    fontSize: 30,
    left: 1,
  },
});

const SubActionButton = ({
  iconName,
  label,

  wrapperStyle = {},
  containerStyle = {},
  iconStyle = {},
  labelStyle = {},

  onPress = () => {},
}) => {
  return (
    <BaseButton
      useTouchableHighlight
      onPress={onPress}
      style={[styles.add_store_action_btn, wrapperStyle]}>
      <View style={[styles.add_store_action_btn_box, containerStyle]}>
        <Icon
          primaryHighlight
          bundle={BundleIconSetName.IONICONS}
          name={iconName}
          style={[styles.icon, iconStyle]}
        />
        {!!label && (
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[styles.add_store_action_label, labelStyle]}>
            {label}
          </Typography>
        )}
      </View>
    </BaseButton>
  );
};

export default React.memo(SubActionButton);
