import React from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {
  CONTENT_SKELETON_COLOR,
  SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';
import appConfig from 'app-config';
import Container from 'src/components/Layout/Container';
import {getNewsFeedSize} from 'app-helper/image';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 15,
  },
  wrapper: {
    backgroundColor: '#fff',
  },
  container: {
    width: appConfig.device.width,
    height: 128,
  },
  contentContainer: {
    paddingTop: 20,
    paddingLeft: 15,
  },

  block: {
    backgroundColor: SKELETON_COLOR,
  },

  bannerContainer: {
    ...getNewsFeedSize(),
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: SKELETON_COLOR,
    justifyContent: 'flex-end',
  },
  groupInfoContainer: {
    padding: 15,
    backgroundColor: '#fff',
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
      <Text style={styles.wrapper}>
        <View>
          <View style={styles.bannerContainer} />
          <View style={styles.groupInfoContainer}>
            <View style={[styles.block, styles.content, styles.title]} />
            <View style={[styles.block, styles.content, styles.description]} />
            <View style={[styles.block, styles.content, styles.description2]} />
          </View>
        </View>
      </Text>
    </Shimmer>
  );
};

export default React.memo(GroupHeaderSkeleton);
