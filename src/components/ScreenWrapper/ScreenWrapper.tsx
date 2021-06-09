import React from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {ScreenWrapperProps} from './index';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  wrapperStyle: {
    flex: 1,
    backgroundColor: appConfig.colors.sceneBackground,
  },
  containerStyle: {
    flex: 1,
  },
});

const ScreenWrapper = (props: ScreenWrapperProps) => {
  return (
    <View style={[styles.wrapperStyle, props.containerStyle]}>
      <SafeAreaView style={[styles.containerStyle, props.style]}>
        {props.children}
      </SafeAreaView>
    </View>
  );
};

export default ScreenWrapper;
