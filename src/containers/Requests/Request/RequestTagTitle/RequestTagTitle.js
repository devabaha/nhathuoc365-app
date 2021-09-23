import React from 'react';
import {StyleSheet, Text} from 'react-native';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';

import appConfig from 'app-config';

import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  container: {},
  icon: {
    marginRight: 0,
    color: appConfig.colors.primary,
    fontSize: 10,
  },
  title: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginHorizontal: 5,
  },
});

const RequestTagTitle = ({code, name, containerStyle}) => {
  return (
    (!!code || !!name) && (
      <Container row style={[styles.container, containerStyle]}>
        {!!code && (
          <>
            <FontistoIcon name="hashtag" style={styles.icon} />
            <Text style={styles.title}>{code}</Text>
          </>
        )}

        {!!name && (
          <>
            <OcticonsIcon name="primitive-dot" style={styles.icon} />
            <Text style={styles.title}>{name}</Text>
          </>
        )}
      </Container>
    )
  );
};

export default RequestTagTitle;
