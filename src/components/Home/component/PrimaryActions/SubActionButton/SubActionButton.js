import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  add_store_action_btn: {
    // paddingVertical: 4,
    // paddingHorizontal: 12,
  },
  add_store_action_btn_box: {
    alignItems: 'center',
  },
  add_store_action_label: {
    fontSize: 14,
    color: '#404040',
    marginTop: 4,
    textAlign: 'center',
  },
  icon: {
    fontSize: 28,
    color: appConfig.colors.primary,
    left: 1
  },
});

const SubActionButton = ({
    iconName,
    label,
    
    wrapperStyle = {},
    containerStyle  ={},
    iconStyle = {},
    labelStyle = {},

    onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.add_store_action_btn, wrapperStyle]}>
      <View style={[styles.add_store_action_btn_box, containerStyle]}>
        <Ionicons name={iconName} style={[styles.icon, iconStyle]} />
        {!!label && (
          <Text style={[styles.add_store_action_label, labelStyle]}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(SubActionButton);
