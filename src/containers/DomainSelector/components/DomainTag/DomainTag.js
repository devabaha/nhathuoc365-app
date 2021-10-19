import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  label: {
    color: appConfig.colors.white,
    fontSize: 10,
  },
});

const DomainTag = ({label, containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default React.memo(DomainTag);
