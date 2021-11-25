import React from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {
  CONTENT_SKELETON_COLOR,
  SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';
import appConfig from 'app-config';
import Container from 'src/components/base/Container';
import Skeleton from 'src/components/base/Skeleton';

const styles = StyleSheet.create({
  shimmer: {},
  container: {},
  contentContainer: {
    width: appConfig.device.width,
  },

  itemContainer: {
    width: '100%',
    padding: 15,
  },

  block: {
    // backgroundColor: CONTENT_SKELETON_COLOR,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 15,
  },
  title: {
    width: '50%',
    height: 10,
    borderRadius: 5,
  },
  subTitle: {
    marginTop: 5,
    marginBottom: 8,
    width: '30%',
    height: 4,
    borderRadius: 2,
  },
  description: {
    marginTop: 2,
    width: '70%',
    height: 6,
    borderRadius: 3,
  },
});

const MainNotifySkeleton = ({length = 10, useList = true}) => {
  const renderItem = (item, index) => {
    return (
      <Container row key={index} style={styles.itemContainer}>
        <Skeleton content style={[styles.block, styles.image]} />
        <Container flex>
          <Skeleton content style={[styles.block, styles.title]} />
          <Skeleton content style={[styles.block, styles.subTitle]} />
          <Skeleton content style={[styles.block, styles.description]} />
        </Container>
      </Container>
    );
  };

  return (
    <Shimmer style={[useList && styles.shimmer]}>
      <Text style={styles.container}>
        {useList ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}>
            {Array.from({length}).map(renderItem)}
          </ScrollView>
        ) : (
          Array.from({length}).map(renderItem)
        )}
      </Text>
    </Shimmer>
  );
};

export default React.memo(MainNotifySkeleton);
