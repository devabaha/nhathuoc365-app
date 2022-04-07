import React from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {DiscountBadge} from 'src/components/Badges';
import RequestTagTitle from 'src/containers/Requests/Request/RequestTagTitle';
import {Typography} from 'src/components/base';

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
      <Typography type={TypographyType.TITLE_SEMI_LARGE_PRIMARY} style={styles.title}>
        {title}
      </Typography>
      {!!subTitle && (
        <Typography
          type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
          style={styles.subTitle}>
          {subTitle}
        </Typography>
      )}
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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTitle: {
    textAlign: 'center',
  },
  tagContainer: {
    marginBottom: 15,
  },
});

export default Header;
