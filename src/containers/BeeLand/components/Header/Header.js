import React from 'react';
import { View, StyleSheet } from 'react-native';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  mask: {
    height: '60%',
    width: '100%',
    position: 'absolute',
    backgroundColor: appConfig.colors.primary
  }
});

const Header = ({ children }) => {
  return (
    <View>
      <View style={styles.mask} />
      {children}
    </View>
  );
};

export default Header;
