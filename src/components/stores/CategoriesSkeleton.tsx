import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from '../../config';
// custom components
import {Skeleton} from '../base';

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
    paddingHorizontal: 7,
    paddingTop: 4,
    height: 40,
  },
  itemContainer: {
    paddingHorizontal: 12,
    height: 12,
    flex: 1,
  },
  item: {
    borderRadius: 4,
    flex: 1,
  },
});

const CategoriesSkeleton = () => {
  const renderItem = (item, index) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <Skeleton content style={styles.item} />
      </View>
    );
  };

  return (
    <Shimmer>
      <Text>
        <Skeleton row center container style={styles.container}>
          {[1, 2, 3, 4].map(renderItem)}
        </Skeleton>
      </Text>
    </Shimmer>
  );
};

export default CategoriesSkeleton;
