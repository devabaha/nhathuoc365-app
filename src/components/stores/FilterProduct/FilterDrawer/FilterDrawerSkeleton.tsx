import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Text} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {SKELETON_COLOR} from 'src/components/SkeletonLoading/constants';

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    paddingTop: 15,
    flexGrow: 1,
  },

  itemContainer: {
    marginBottom: 15,
  },

  block: {
    //@ts-ignore
    backgroundColor: LightenColor(SKELETON_COLOR, -12),
  },

  tagsContainer: {
    width: '100%',
  },
  tagComboContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    backgroundColor: SKELETON_COLOR,
    marginBottom: 10,
    width: '20%',
    height: 10,
    borderRadius: 5,
  },
  tag: {
    marginBottom: 10,
    flex: 1,
    height: 35,
    backgroundColor: SKELETON_COLOR,
    borderRadius: 4,
  },
});

const ITEM_LENGTH = 6;

const FilterDrawerSkeleton = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  const renderTags = () => {
    return (
      <View style={styles.tagComboContainer}>
        {Array.from({length: 2}).map((item, index) => {
          const extraStyle = !!index && {marginLeft: 10};
          return <View key={index} style={[styles.tag, extraStyle]} />;
        })}
      </View>
    );
  };

  const renderItem = (item, index) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <View style={styles.title} />
        <View style={styles.tagsContainer}>
          {renderTags()}
          {renderTags()}
        </View>
      </View>
    );
  };

  return (
    <Shimmer>
      <Text onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {!!containerWidth && <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            {width: containerWidth},
          ]}
          style={styles.container}>
          {Array.from({length: ITEM_LENGTH}).map(renderItem)}
        </ScrollView>}
      </Text>
    </Shimmer>
  );
};

export default React.memo(FilterDrawerSkeleton);
