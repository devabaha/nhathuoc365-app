import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import appConfig from 'app-config';
import {DiscountBadge} from '../../../../../components/Badges';
import RequestTagTitle from 'src/containers/Requests/Request/RequestTagTitle';

const Header = ({title, subTitle, type, tagCode, tagName}) => {
  return (
    <View style={styles.header}>
      {!!type && (
        <DiscountBadge
          containerStyle={styles.badge}
          contentStyle={styles.badgeContent}
          tailSpace={4}
          label={type}
          backgroundColor={appConfig.colors.primary}
        />
      )}
      <RequestTagTitle
        code={tagCode}
        name={tagName}
        containerStyle={styles.tagContainer}
      />
      <Text style={styles.title}>{title}</Text>
      {!!subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 15,
    paddingTop: 25,
  },
  badge: {
    position: 'absolute',
    top: -2,
  },
  badgeContent: {
    fontSize: 12,
  },
  title: {
    textAlign: 'center',
    color: appConfig.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },

  tagContainer: {
    marginBottom: 15,
  },
});

export default Header;
