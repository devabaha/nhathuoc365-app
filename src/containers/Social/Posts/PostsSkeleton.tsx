import React from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// custom components
import {Container, Skeleton, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
  },
  contentContainer: {},

  itemContainer: {
    marginBottom: 15,
    padding: 15,
    paddingBottom: 80,
  },

  block: {},

  header: {
    marginBottom: 10,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 15,
  },
  userName: {
    width: 80,
    height: 10,
    borderRadius: 5,
  },
  description: {
    width: 50,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  content: {
    marginTop: 12,
    height: 4,
    borderRadius: 2,
  },
  content1: {
    width: 150,
  },
  content2: {
    width: 180,
  },
  content3: {
    width: 100,
  },
});

const ITEM_LENGTH = 6;

const PostsSkeleton = () => {
  const renderItem = (item, index) => {
    return (
      <Skeleton container key={index} style={styles.itemContainer}>
        <Container noBackground row style={styles.header}>
          <Skeleton content style={[styles.block, styles.avatarContainer]} />

          <Container noBackground centerVertical={false}>
            <Skeleton content style={[styles.block, styles.userName]} />
            <Skeleton content style={[styles.block, styles.description]} />
          </Container>
        </Container>

        <Skeleton
          content
          style={[styles.block, styles.content, styles.content1]}
        />
        <Skeleton
          content
          style={[styles.block, styles.content, styles.content2]}
        />
        <Skeleton
          content
          style={[styles.block, styles.content, styles.content3]}
        />
      </Skeleton>
    );
  };

  return (
    <Shimmer>
      <Typography>
        <View style={styles.container}>
          {Array.from({length: ITEM_LENGTH}).map(renderItem)}
        </View>
      </Typography>
    </Shimmer>
  );
};

export default React.memo(PostsSkeleton);
