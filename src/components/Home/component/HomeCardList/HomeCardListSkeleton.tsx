import * as React from 'react';
import {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Container} from 'src/components/base';
//@ts-ignore
import SkeletonLoading from '../../../SkeletonLoading';
import {SKELETON_COLOR} from '../../../SkeletonLoading/constants';

export interface HomeCardListSkeletonProps {
  itemContainerStyle?: StyleProp<ViewStyle>;
  mainStyle?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
    marginTop: 10,
    // paddingBottom: 15
  },
  contentContainer: {
    paddingBottom: 15,
  },
  content: {
    paddingLeft: 16,
  },
  title: {
    width: '23%',
    backgroundColor: SKELETON_COLOR,
    height: 12,
    marginVertical: 15,
    borderRadius: 8,
  },
  itemContainer: {
    width: 210,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  itemMain: {
    backgroundColor: SKELETON_COLOR,
    borderRadius: 8,
    width: '100%',
    height: 120,
  },
  itemSub: {
    marginTop: 15,
    width: '50%',
    height: 10,
    borderRadius: 8,
    backgroundColor: SKELETON_COLOR,
  },
  skeletonContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
  },
});

const SKELETON_LENGTH = 5;

class HomeCardListSkeleton extends PureComponent<HomeCardListSkeletonProps> {
  state = {};
  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <View style={styles.title} />
          </View>

          <FlatList
            contentContainerStyle={styles.content}
            horizontal
            data={Array.from({length: SKELETON_LENGTH}, (_, idx) => `${++idx}`)}
            showsHorizontalScrollIndicator={false}
            renderItem={() => {
              return (
                <View
                  style={[styles.itemContainer, this.props.itemContainerStyle]}>
                  <View style={[styles.itemMain, this.props.mainStyle]} />
                  <View style={styles.itemSub} />
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <SkeletonLoading
          style={styles.skeletonContainer}
          width="100%"
          height="100%"
        />
      </Container>
    );
  }
}

export default HomeCardListSkeleton;
