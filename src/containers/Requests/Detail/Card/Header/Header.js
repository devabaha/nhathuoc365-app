import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import appConfig from 'app-config';

const Header = ({ title, subTitle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {!!subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20
  },
  title: {
    textAlign: 'center',
    color: appConfig.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subTitle: {
    textAlign: 'center',
    color: '#666'
  }
});

export default Header;
