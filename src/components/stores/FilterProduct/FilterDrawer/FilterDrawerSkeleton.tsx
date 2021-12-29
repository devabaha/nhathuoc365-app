import React, {useState, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Skeleton, ScrollView, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    paddingTop: 15,
    flexGrow: 1,
  },

  itemContainer: {
    marginBottom: 15,
  },
  tagsContainer: {
    width: '100%',
  },
  tagComboContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 10,
    width: '20%',
    height: 10,
    borderRadius: 5,
  },
  tag: {
    marginBottom: 10,
    flex: 1,
    height: 35,
  },
});

const ITEM_LENGTH = 6;

const FilterDrawerSkeleton = () => {
  const {theme} = useTheme();

  const [containerWidth, setContainerWidth] = useState(0);

  const renderTags = () => {
    return (
      <View style={styles.tagComboContainer}>
        {Array.from({length: 2}).map((item, index) => {
          const extraStyle = !!index && {marginLeft: 10};
          return (
            <Skeleton container key={index} style={[tagStyle, extraStyle]} />
          );
        })}
      </View>
    );
  };

  const renderItem = (item, index) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <Skeleton container style={styles.title} />
        <View style={styles.tagsContainer}>
          {renderTags()}
          {renderTags()}
        </View>
      </View>
    );
  };

  const tagStyle = useMemo(() => {
    return mergeStyles(styles.tag, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  return (
    <Shimmer>
      <Typography onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {!!containerWidth && (
          <ScrollView
            contentContainerStyle={[
              styles.contentContainer,
              {width: containerWidth},
            ]}
            style={styles.container}>
            {Array.from({length: ITEM_LENGTH}).map(renderItem)}
          </ScrollView>
        )}
      </Typography>
    </Shimmer>
  );
};

export default React.memo(FilterDrawerSkeleton);
