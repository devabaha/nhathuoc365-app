import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// skeleton
import HomeCardListSkeleton from '../HomeCardList/HomeCardListSkeleton';

const styles = StyleSheet.create({
  itemContainer: {
    width: 130,
  },
  main: {
    height: 116,
  },
});
class ListProductSkeleton extends Component {
  state = {};

  render() {
    return (
      <HomeCardListSkeleton
        itemContainerStyle={styles.itemContainer}
        mainStyle={styles.main}
      />
    );
  }
}

export default ListProductSkeleton;
