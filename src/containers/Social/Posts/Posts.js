import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';
import Feeds from 'src/components/Social/ListFeeds/Feeds';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {
  formatPostStoreData,
  getRelativeTime,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'app-helper/social';
import {SOCIAL_BUTTON_TYPES, SOCIAL_DATA_TYPES} from 'src/constants/social';
import {Observer} from 'mobx-react';
import NoResult from 'src/components/NoResult';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import Loading from 'src/components/Loading';

import appConfig from 'app-config';
import {reaction} from 'mobx';
import {ActionBarText} from 'src/components/Social/ListFeeds/Feeds/Feeds';
import PostsSkeleton from './PostsSkeleton';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  loadMore: {
    position: 'relative',
    paddingVertical: 10,
  },
  statusText: {
    padding: 15,
    textAlign: 'center',
    color: '#333',
    fontStyle: 'italic',
  },

  feedsContainer: {
    marginBottom: 10,
  },
});

const Posts = ({
  groupId,
  posts: postsProp,
  siteId = store.store_data?.id,
  disableLoadMore = false,
  refreshControl,
  limit: limitProp = 10,
  onScroll = () => {},
  onRefresh: onRefreshProp = () => {},
  ListHeaderComponent,
}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation(['common', 'social']);

  const limit = useRef(limitProp);
  const page = useRef(1);
  const canLoadMore = useRef(true);

  const [isLoading, setLoading] = useState(true);
  const [isLoadMore, setLoadMore] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const [getPostsRequest] = useState(new APIRequest());

  const [posts, setPosts] = useState(postsProp || []);

  useEffect(() => {
    if (!postsProp) {
      getPosts();
    }

    return () => {
      cancelRequests([getPostsRequest]);
      store.resetSocialPosts();
    };
  }, []);

  const addPostingData = useCallback(
    (postingData, postsData = posts) => {
      if (
        !!postingData?.group_id &&
        (groupId === undefined || groupId == postingData.group_id)
      ) {
        let tempPosts = [...postsData];
        tempPosts.unshift(postingData);
        return tempPosts;
      }

      return postsData;
    },
    [posts],
  );

  useEffect(() => {
    const disposer = reaction(
      () => store.socialPostingData,
      (postingData) => {
        if (postingData?.id) {
          let listPost = [...posts];
          const index = listPost.findIndex((p) => p.id === postingData.id);
          if (index === -1) {
            listPost = addPostingData(postingData);
            setPosts(listPost);
          } else if (postingData?.error) {
            listPost[index].error = postingData?.error;
            setPosts(listPost);
          }
        }
      },
    );
    return () => {
      disposer();
    };
  }, [addPostingData]);

  const setStoreSocialPosts = (posts) => {
    const storePosts = {};
    posts.forEach((post) => (storePosts[post.id] = formatPostStoreData(post)));
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
        // console.log('abc', response, data);
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
          setRefreshing(false);
          setTimeout(() => {
            if (isMounted()) {
              setLoadMore(false);
            }
          }, 500);
        }
      }
    },
    [siteId, groupId, posts, limitProp],
  );

  const handlePressGroup = useCallback((group) => {
    servicesHandler({
      type: SERVICES_TYPE.SOCIAL_GROUP,
      id: group.id,
      name: group.name,
    });
  }, []);

  const handlePressUserName = useCallback((user) => {
    // user.id = user.user_id;

    // servicesHandler({
    //   type: SERVICES_TYPE.PERSONAL_PROFILE,
    //   isMainUser: user.user_id == store.user_info?.id,
    //   userInfo: user
    // });
  }, []);

  const onRefresh = () => {
    onRefreshProp();
    setRefreshing(true);
    getPosts(1, page.current * limit.current, true);
  };

  const handleLoadMore = () => {
    if (disableLoadMore || !canLoadMore.current || !posts?.length || isLoadMore)
      return;

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
      canLoadMore.current = true;
    }
  };

  const handleActionBarPress = useCallback((type, feeds) => {
    handleSocialActionBarPress(SOCIAL_DATA_TYPES.POST, type, feeds);
  }, []);

  const handlePostingComplete = () => {
    if (
      store.socialPostingData.progress === 100 ||
      store.socialPostingData.error
    ) {
      setTimeout(() => {
        store.setSocialPostingData();
        getPosts(1, page.current * limit.current, true);
      }, 500);
    }
  };

  const renderStatusText = (feeds) => (
    <ActionBarText
      title={feeds.accept_status || t('social:posting')}
      style={
        feeds.is_accepted !== undefined &&
        !feeds.is_accepted && {
          color: appConfig.colors.status.warning,
        }
      }
    />
  );

  const renderPost = ({item: feeds, index}) => {
    const group = feeds.group_id != groupId ? feeds.group : undefined;
    const user = feeds?.user;

    return (
      <Observer>
        {() => {
          let progress = feeds.progress;
          let error = feeds.error;
          if (feeds.id === store.socialPostingData?.id) {
            progress = store.socialPostingData.progress;
            error = store.socialPostingData?.error;
          }

          return (
            <Feeds
              error={error}
              isPosting={feeds.id === store.socialPostingData?.id}
              postingProgress={progress}
              onPostingProgressComplete={handlePostingComplete}
              group={group}
              commentsCount={feeds.comment_count}
              likeCount={getSocialLikeCount(SOCIAL_DATA_TYPES.POST, feeds)}
              isLiked={getSocialLikeFlag(SOCIAL_DATA_TYPES.POST, feeds)}
              userName={feeds.user?.name}
              description={getRelativeTime(feeds.created)}
              content={feeds.content}
              images={feeds.images}
              avatarUrl={feeds.user?.image}
              containerStyle={styles.feedsContainer}
              disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
              disableShare
              onPressGroup={() => handlePressGroup(group)}
              onPressUserName={() => handlePressUserName(user)}
              renderActionBar={
                !!feeds.accept_status || progress !== undefined
                  ? () => renderStatusText(feeds)
                  : undefined
              }
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
          );
        }}
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
      contentContainerStyle={styles.contentContainer}
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item, index) =>
        item.id ? String(item.id) : index.toString()
      }
      refreshControl={
        refreshControl || (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        )
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={!isLoading && renderEmpty()}
      ListFooterComponent={
        isLoading ? <PostsSkeleton /> : isLoadMore && renderFooter()
      }
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
