import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';
import Feeds from 'src/components/Social/ListFeeds/Feeds';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {
  calculateLikeCountFriendly,
  getRelativeTime,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'app-helper/social';
import {SOCIAL_DATA_TYPES} from 'src/constants/social';
import {Observer} from 'mobx-react';
import NoResult from 'src/components/NoResult';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import Loading from 'src/components/Loading';

const styles = StyleSheet.create({
  loadMore: {
    position: 'relative',
    paddingVertical: 10,
  },
});

const Posts = ({
  groupId,
  siteId = store.store_data?.id,
  refreshControl,
  onScroll = () => {},
  onRefresh: onRefreshProp = () => {},
  ListHeaderComponent,
}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation(['common', 'social']);

  const limit = useRef(10);
  const page = useRef(1);
  const canLoadMore = useRef(true);

  const [isLoading, setLoading] = useState(true);
  const [isLoadMore, setLoadMore] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const [getPostsRequest] = useState(new APIRequest());

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();

    return () => {
      cancelRequests([getPostsRequest]);
      store.resetSocialPost();
    };
  }, []);

  const setStoreSocialPosts = (posts) => {
    const storePosts = {};
    posts.forEach(
      (post) =>
        (storePosts[post.id] = {
          like_count: post.like_count,
          like_count_friendly: calculateLikeCountFriendly(post),
          share_count: post.share_count,
          like_flag: post.like_flag || 0,
          comment_count: post.comment_count,
        }),
    );
    store.setSocialPosts(storePosts);
  };

  const getPosts = useCallback(
    async (
      pageProp = page.current,
      limitProp = limit.current,
      isRefresh = false,
    ) => {
      const data = {
        site_id: siteId,
        limit: limitProp,
        page: pageProp,
      };
      groupId !== undefined && (data.group_id = groupId);
      getPostsRequest.data = APIHandler.social_posts(data);

      try {
        const response = await getPostsRequest.promise();
        console.log(response, data);
        if (response) {
          if (response.status === STATUS_SUCCESS) {
            if (response.data) {
              let listPost = response.data.list || [];
              if (!listPost?.length) {
                canLoadMore.current = false;
                page.current = page.current > 1 ? page.current - 1 : 1;
              } else {
                canLoadMore.current = true;
              }

              if (!isRefresh && !!posts?.length) {
                listPost = [...posts].concat(listPost);
              }
              setStoreSocialPosts(listPost);
              setPosts(listPost);
            }
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || t('api.error.message'),
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('api.error.message'),
          });
        }
      } catch (error) {
        console.log('get_posts', error);
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      } finally {
        if (isMounted()) {
          setLoading(false);
          setLoadMore(false);
          setRefreshing(false);
        }
      }
    },
    [siteId, groupId, posts],
  );

  const handlePressGroup = useCallback((group) => {
    servicesHandler({
      type: SERVICES_TYPE.SOCIAL_GROUP,
      id: group.id,
      name: group.name,
    });
  }, []);

  const onRefresh = () => {
    onRefreshProp();
    setRefreshing(true);
    getPosts(1, page.current * limit.current, true);
  };

  const handleLoadMore = () => {
    if (!canLoadMore.current || isLoadMore) return;
    console.log(canLoadMore.current, isLoadMore);
    setLoadMore(true);
    page.current++;
    getPosts(page.current);
  };

  const handleScrollEnd = (e) => {
    const {
      contentOffset: {y},
      contentSize: {height},
    } = e.nativeEvent;

    if (!canLoadMore.current && !isLoadMore && y / height <= 0.6) {
      console.log('a', y, height)
      canLoadMore.current = true;
    }
  };

  const handleActionBarPress = useCallback((type, feeds) => {
    handleSocialActionBarPress(SOCIAL_DATA_TYPES.POST, type, feeds);
  }, []);

  const renderPost = ({item: feeds}) => {
    const group = feeds.group_id != groupId ? feeds.group : undefined;

    return (
      <Observer>
        {() => (
          <Feeds
            group={group}
            commentsCount={feeds.comment_count}
            likeCount={getSocialLikeCount(SOCIAL_DATA_TYPES.POST, feeds)}
            isLiked={getSocialLikeFlag(SOCIAL_DATA_TYPES.POST, feeds)}
            userName={feeds.user?.name}
            description={getRelativeTime(feeds.created)}
            content={feeds.content}
            images={feeds.images}
            // thumbnailUrl={feeds.image_url}
            avatarUrl={feeds.user?.image}
            containerStyle={{marginBottom: 15}}
            disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
            disableShare
            onPressGroup={() => handlePressGroup(group)}
            onActionBarPress={(type) => handleActionBarPress(type, feeds)}
            onPressTotalComments={() =>
              handleSocialActionBarPress(
                SOCIAL_DATA_TYPES.POST,
                SOCIAL_BUTTON_TYPES.COMMENT,
                feeds,
                false,
              )
            }
          />
        )}
      </Observer>
    );
  };

  const renderEmpty = () => {
    return <NoResult iconName="post" message={t('social:noPosts')} />;
  };

  const renderFooter = () => {
    return <Loading wrapperStyle={styles.loadMore} size="small" />;
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item, index) =>
        item?.id ? String(item.id) : index.toString()
      }
      refreshControl={
        refreshControl || (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={!isLoading && renderEmpty()}
      ListFooterComponent={isLoadMore && renderFooter()}
      onEndReachedThreshold={0.4}
      onEndReached={handleLoadMore}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
      onScroll={onScroll}
      scrollEventThrottle={16}
    />
  );
};

export default React.memo(Posts);
