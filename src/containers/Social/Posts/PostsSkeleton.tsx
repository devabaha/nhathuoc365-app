import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {SKELETON_COLOR} from 'src/components/SkeletonLoading/constants';
import appConfig from 'app-config';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
  },
  contentContainer: {},

  itemContainer: {
    backgroundColor: SKELETON_COLOR,
    marginBottom: 15,
    padding: 15,
    paddingBottom: 80,
  },

  block: {
    //@ts-ignore
    backgroundColor: LightenColor(SKELETON_COLOR, -12),
  },

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
      <View key={index} style={styles.itemContainer}>
        <Container row style={styles.header}>
          <View style={[styles.block, styles.avatarContainer]} />

          <Container centerVertical={false}>
            <View style={[styles.block, styles.userName]} />
            <View style={[styles.block, styles.description]} />
          </Container>
        </Container>

        <View style={[styles.block, styles.content, styles.content1]} />
        <View style={[styles.block, styles.content, styles.content2]} />
        <View style={[styles.block, styles.content, styles.content3]} />
      </View>
    );
  };

  return (
    <Shimmer>
      <Text>
        <View style={styles.container}>
          {Array.from({length: ITEM_LENGTH}).map(renderItem)}
        </View>
      </Text>
    </Shimmer>
  );
};

export default React.memo(PostsSkeleton);
