import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import appConfig from 'app-config';

function ButtonTag({text, onPress, checked}) {

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.containerStyleTag,
        {
          backgroundColor: checked ? appConfig.colors.primary : appConfig.colors.sceneBackground,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[styles.title, {color: checked ? '#fff' : '#333'}]}
        numberOfLines={2}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyleTag: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 4,
  },
  title: {
    textAlign: 'center',
  },
});

const areEquals = (prev, next) => {
  return prev.text === next.text && prev.checked === next.checked;
};

export default React.memo(ButtonTag, areEquals);
