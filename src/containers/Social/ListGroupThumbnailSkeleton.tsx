import React from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {
  CONTENT_SKELETON_COLOR,
  SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 15
  },
  wrapper: {
    height: 130,
    paddingBottom: 0,
    marginBottom: 0
  },
  container: {
    width: appConfig.device.width,
    height: 133,
  },
  contentContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingLeft: 15,
  },

  itemContainer: {
    backgroundColor: SKELETON_COLOR,
    width: 90,
    height: 90,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    justifyContent: 'flex-end'
  },

  block: {
    backgroundColor: CONTENT_SKELETON_COLOR,
  },

  content: {
    marginTop: 12,
    height: 4,
    width: 30,
    left: 7,
    bottom: 15,
    borderRadius: 2,
  },
});

const ITEM_LENGTH = 6;

const ListGroupThumbnailSkeleton = () => {
  const renderItem = (item, index) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <View style={[styles.block, styles.content]} />
      </View>
    );
  };

  return (
    <Shimmer style={styles.shimmer}>
      <Text style={styles.wrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          style={styles.container}>
          {Array.from({length: ITEM_LENGTH}).map(renderItem)}
        </ScrollView>
      </Text>
    </Shimmer>
  );
};

export default React.memo(ListGroupThumbnailSkeleton);
