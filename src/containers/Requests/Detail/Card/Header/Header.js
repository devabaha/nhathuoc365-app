import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import appConfig from 'app-config';
import { DiscountBadge } from '../../../../../components/Badges';

const Header = ({ title, subTitle, type }) => {
  return (
    <View style={styles.header}>
      {!!type && (
        <DiscountBadge
          containerStyle={styles.badge}
          tailSpace={4}
          label={type}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {!!subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15
  },
  badge: {
    position: 'absolute',
    top: -2
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
    color: '#666',
    fontSize: 12
  }
});

export default Header;
