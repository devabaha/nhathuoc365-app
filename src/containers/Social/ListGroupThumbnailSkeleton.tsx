import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Typography, ScrollView, Skeleton, Container} from 'src/components/base';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 15,
  },
  wrapper: {
    height: 130,
    paddingBottom: 0,
    marginBottom: 0,
  },
  container: {
    width: appConfig.device.width,
    height: 133,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingLeft: 15,
  },

  itemContainer: {
    width: 90,
    height: 90,
    overflow: 'hidden',
    marginRight: 15,
    justifyContent: 'flex-end',
  },

  block: {},

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
  const {theme} = useTheme();

  const itemContainerStyle = useMemo(() => {
    return mergeStyles(styles.itemContainer, {
      borderRadius: theme.layout.borderRadiusLarge,
    });
  }, [theme]);

  const renderItem = (item, index) => {
    return (
      <Skeleton container key={index} style={itemContainerStyle}>
        <Skeleton content style={[styles.block, styles.content]} />
      </Skeleton>
    );
  };

  return (
    <Shimmer style={styles.shimmer}>
      <Typography style={styles.wrapper}>
        <Container>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            style={styles.container}>
            {Array.from({length: ITEM_LENGTH}).map(renderItem)}
          </ScrollView>
        </Container>
      </Typography>
    </Shimmer>
  );
};

export default React.memo(ListGroupThumbnailSkeleton);
