import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
// types
import {HomeCardListSkeletonProps} from '.';
// custom components
import {Container, FlatList, Skeleton} from 'src/components/base';
import SkeletonLoading from 'src/components/SkeletonLoading';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  contentContainer: {
    paddingBottom: 15,
  },
  content: {
    paddingLeft: 16,
  },
  title: {
    width: '23%',
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
    borderRadius: 8,
    width: '100%',
    height: 120,
  },
  itemSub: {
    marginTop: 15,
    width: '50%',
    height: 10,
    borderRadius: 8,
  },
  skeletonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
});

const SKELETON_LENGTH = 5;

class HomeCardListSkeleton extends PureComponent<HomeCardListSkeletonProps> {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  get highlightColor() {
    return this.theme.color.background as string;
  }

  render() {
    return (
      <Container noBackground style={[styles.container, this.props.containerStyle]}>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <Skeleton container style={styles.title} />
          </View>

          <FlatList
            contentContainerStyle={styles.content}
            horizontal
            data={Array.from({length: SKELETON_LENGTH}, (_, idx) => `${++idx}`)}
            showsHorizontalScrollIndicator={false}
            renderItem={
              this.props.renderItem ||
              (() => {
                return (
                  <View
                    style={[
                      styles.itemContainer,
                      this.props.itemContainerStyle,
                    ]}>
                    <Skeleton
                      container
                      style={[styles.itemMain, this.props.mainStyle]}
                    />
                    <Skeleton container style={styles.itemSub} />
                  </View>
                );
              })
            }
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <SkeletonLoading
          style={styles.skeletonContainer}
          highlightColor={this.highlightColor}
          width="100%"
          height="100%"
        />
      </Container>
    );
  }
}

export default HomeCardListSkeleton;
