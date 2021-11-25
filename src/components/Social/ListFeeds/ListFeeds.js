import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import ScreenWrapper from 'src/components/base/ScreenWrapper';
import RefreshControl from 'src/components/base/RefreshControl';

import Feeds from './Feeds';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  feedsContainer: {
    marginBottom: 15,
  },
});

const ListFeeds = ({
  data,
  extraData,
  onRefresh,
  refreshing,
  ListEmptyComponent,
  renderFeeds: renderFeedsProp,
  contentContainerStyle,
}) => {
  const renderFeeds = ({item: feeds, index}) => {
    if (typeof renderFeedsProp === 'function') {
      return renderFeedsProp({item: feeds, index});
    }
    // return (
    //   <Feeds
    //     title={feeds.title}
    //     userName={feeds.shop_name}
    //     description={feeds.created}
    //     thumbnailUrl={feeds.image_url}
    //     avatarUrl={feeds.shop_image}
    //     containerStyle={styles.feedsContainer}
    //     onPressPost={}
    //   />
    // );
  };

  return (
    <ScreenWrapper>
      <FlatList
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        data={data}
        extraData={extraData}
        renderItem={renderFeeds}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        refreshControl={
          refreshing !== undefined ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : null
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </ScreenWrapper>
  );
};

export default React.memo(ListFeeds);
