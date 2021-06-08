import React from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  topSpacing: {
    marginTop: 8,
  },
});

const SectionContainer = ({style, marginTop, children}) => {
  return (
    <View style={[styles.container, style, marginTop && styles.topSpacing]}>
      {children}
    </View>
  );
};

export default React.memo(SectionContainer);
