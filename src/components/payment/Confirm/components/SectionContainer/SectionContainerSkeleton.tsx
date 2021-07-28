import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Shimmer from 'react-native-shimmer';

import appConfig from 'app-config';
import {
  SKELETON_COLOR,
  CONTENT_SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';
import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 6,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  wrapper: {
    height: 130,
  },
  container: {
    width: appConfig.device.width,
    flex: 1,
  },
  block: {
    marginBottom: 1,
    backgroundColor: SKELETON_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  bodyBlock: {
    paddingBottom: '100%',
  },

  content: {
    backgroundColor: CONTENT_SKELETON_COLOR,
    height: 7,
    width: 70,
    borderRadius: 4,
  },
  description1: {
    marginTop: 5,
    width: 100,
  },
  description2: {
    marginTop: 5,
    width: 150,
  },
});

const SectionContainerSkeleton = () => {
  return (
    <Shimmer style={styles.shimmer}>
      <Text style={styles.wrapper}>
        <Container centerVertical={false} style={styles.container}>
          <Container row style={styles.block}>
            <View style={[styles.content, styles.icon]} />
            <View style={[styles.content]} />
          </Container>
          <Container
            flex
            centerVertical={false}
            style={[styles.block, styles.bodyBlock]}>
            <View style={[styles.content, styles.description1]} />
            <View style={[styles.content, styles.description2]} />
          </Container>
        </Container>
      </Text>
    </Shimmer>
  );
};

export default React.memo(SectionContainerSkeleton);
