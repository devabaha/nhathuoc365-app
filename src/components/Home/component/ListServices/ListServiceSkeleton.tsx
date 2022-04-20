import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {MIN_ITEMS_PER_ROW} from '../../constants';
// custom components
import SkeletonLoading from '../../../SkeletonLoading';
import {Container, Skeleton} from 'src/components/base';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: appConfig.device.width - 32,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (appConfig.device.width - 32) / MIN_ITEMS_PER_ROW,
    height: (appConfig.device.width - 32) / MIN_ITEMS_PER_ROW,
  },
  main: {
    borderRadius: 16,
    width: '50%',
    height: '50%',
    minWidth: 60,
    minHeight: 60,
  },
  sub: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
    width: '45%',
  },
  skeletonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
  },
});

class ListServiceSkeleton extends PureComponent {
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
      <Container noBackground style={styles.container}>
        <View style={styles.list}>
          {Array.from(
            {length: MIN_ITEMS_PER_ROW * 2},
            (_, idx) => `${++idx}`,
          ).map((item, index) => {
            return (
              <View key={index} style={styles.itemContainer}>
                <Skeleton container style={styles.main} />
                <Skeleton container style={styles.sub} />
              </View>
            );
          })}
        </View>
        <View style={styles.skeletonContainer}>
          <SkeletonLoading
            style={styles.skeletonContainer}
            highlightColor={this.highlightColor}
            width="100%"
            height="100%"
          />
        </View>
      </Container>
    );
  }
}

export default ListServiceSkeleton;
