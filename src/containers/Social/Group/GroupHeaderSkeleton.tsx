import React from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// helpers
import {getNewsFeedSize} from 'app-helper/image';
// custom components
import {Typography, Container, Skeleton} from 'src/components/base';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 15,
  },
  wrapper: {},
  container: {
    width: appConfig.device.width,
    height: 128,
  },
  contentContainer: {
    paddingTop: 20,
    paddingLeft: 15,
  },

  block: {},

  bannerContainer: {
    ...getNewsFeedSize(),
    justifyContent: 'flex-end',
  },
  groupInfoContainer: {
    padding: 15,
    width: appConfig.device.width,
  },

  content: {
    borderRadius: 10,
  },
  title: {
    height: 20,
    width: '40%',
    marginBottom: 10,
  },
  description: {
    marginTop: 10,
    height: 5,
    width: '60%',
  },
  description2: {
    marginTop: 10,
    height: 5,
    width: '70%',
  },
});

const GroupHeaderSkeleton = () => {
  return (
    <Shimmer style={styles.shimmer}>
      <Typography>
        <Container>
          <Skeleton container style={styles.bannerContainer} />
          <Container style={styles.groupInfoContainer}>
            <Skeleton
              content
              style={[styles.block, styles.content, styles.title]}
            />
            <Skeleton
              content
              style={[styles.block, styles.content, styles.description]}
            />
            <Skeleton
              content
              style={[styles.block, styles.content, styles.description2]}
            />
          </Container>
        </Container>
      </Typography>
    </Shimmer>
  );
};

export default React.memo(GroupHeaderSkeleton);
