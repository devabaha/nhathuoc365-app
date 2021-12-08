import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import useIsMounted from 'react-is-mounted-hook';
import {Actions} from 'react-native-router-flux';
import equal from 'deep-equal';
import {Observer} from 'mobx-react';
import {debounce} from 'lodash';
import {reaction, toJS} from 'mobx';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {isConfigActive} from 'app-helper/configKeyHandler';
import {servicesHandler} from 'app-helper/servicesHandler';
import {
  formatStoreSocialPosts,
  getRelativeTime,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'app-helper/social';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SOCIAL_BUTTON_TYPES, SOCIAL_DATA_TYPES} from 'src/constants/social';
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import NoResult from 'src/components/NoResult';
import Loading from 'src/components/Loading';
import Feeds from 'src/components/Social/ListFeeds/Feeds';
import ActionBarText from 'src/components/Social/ListFeeds/Feeds/ActionBarText';
import {FlatList, RefreshControl} from 'src/components/base';
// skeleton
import PostsSkeleton from './PostsSkeleton';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  loadMore: {
    position: 'relative',
    paddingVertical: 10,
  },
  feedsContainer: {
    marginBottom: 10,
  },
});

const Posts = ({
  safeLayout,
  groupId,
  posts: postsProp,
  siteId = store.store_data?.id,
  disableLoadMore = false,
  disablePostUpdating = false,
  refreshControl,
  limit: limitProp = 10,
  onScroll = () => {},
  onRefresh: onRefreshProp = () => {},
  ListHeaderComponent,
}) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();
  const {t} = useTranslation(['common', 'social']);
  const moreActionOptions = [t('edit'), t('delete'), t('cancel')];

  const limit = useRef(limitProp);
  const page = useRef(1);
  const canLoadMore = useRef(true);

  const [isLoading, setLoading] = useState(!postsProp);
  const [isLoadMore, setLoadMore] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const [getPostsRequest] = useState(new APIRequest());
  const [deletePostRequest] = useState(new APIRequest());
  const [requests] = useState([getPostsRequest, deletePostRequest]);

  const [posts, setPosts] = useState(postsProp || []);

  const postReactionDisposers = useRef(new Map());

  const postsAlternative = useRef(posts || []);

  useEffect(() => {
    setPosts(postsProp);
    setStoreSocialPosts(postsProp || []);
  }, [postsProp]);

  useEffect(() => {
    postsAlternative.current = posts || [];
  }, [posts]);

  useEffect(() => {
    if (!postsProp) {
      getPosts();
    }

    return () => {
      cancelRequests(requests);
      postReactionDisposers.current.forEach((disposer) => {
        disposer();
      });
      postReactionDisposers.current.clear();
    };
  }, []);

  const getPostReactionDisposer = (feedsId) => {
    const disposer = postReactionDisposers.current.get(feedsId);
    if (disposer) {
      disposer();
    }

    return reaction(
      () => store.socialPosts.get(feedsId),
      (socialPost) => {
        const newPosts = [...postsAlternative.current];
        const feedsIndex = newPosts.findIndex((post) => post.id === feedsId);
        if (feedsIndex === -1) return;

        if (!socialPost) {
          newPosts.splice(feedsIndex, 1);
        } else {
          const socialPostInJSFormat = toJS(socialPost);
          Object.keys(newPosts[feedsIndex]).forEach((key) => {
            if (
              socialPost[key] !== undefined &&
              !equal(newPosts[feedsIndex][key], socialPostInJSFormat[key])
            ) {
              newPosts[feedsIndex][key] = socialPostInJSFormat[key];
            }
          });
        }

        setPosts(newPosts);
      },
    );
  };

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
    let disposer = () => {};
    if (disablePostUpdating) {
      disposer();
      return;
    }
    disposer = reaction(
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
  }, [addPostingData, disablePostUpdating]);

  const setStoreSocialPosts = (posts) => {
    store.setSocialPosts(
      formatStoreSocialPosts(posts, (post) => {
        if (!postReactionDisposers.current.get(post.id)) {
          postReactionDisposers.current.set(
            post.id,
            getPostReactionDisposer(post.id),
          );
        }
      }),
    );
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

                if (!isRefresh && !!posts?.length) {
                  listPost = [...posts].concat(listPost);
                }

                setStoreSocialPosts(listPost);
                setPosts(listPost);
              }
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
    user.id = user.user_id;
    servicesHandler({
      type: SERVICES_TYPE.PERSONAL_PROFILE,
      isMainUser: user.user_id == store.user_info?.id,
      userInfo: user,
    });
  }, []);

  const onRefresh = useCallback(() => {
    onRefreshProp();
    setRefreshing(true);
    page.current = 1;
    getPosts(page.current, limit.current, true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (disableLoadMore || !canLoadMore.current || !posts?.length || isLoadMore)
      return;

    setLoadMore(true);
    page.current++;
    getPosts(page.current);
  }, [posts, isLoadMore]);

  const handleScrollEnd = useCallback(
    (e) => {
      const {
        contentOffset: {y},
        contentSize: {height},
      } = e.nativeEvent;

      if (!canLoadMore.current && !isLoadMore && y / height <= 0.6) {
        canLoadMore.current = true;
      }
    },
    [isLoadMore],
  );

  const handleActionBarPress = useCallback((type, feeds) => {
    handleSocialActionBarPress(SOCIAL_DATA_TYPES.POST, type, feeds);
  }, []);

  const handlePostingComplete = useCallback(() => {
    if (
      store.socialPostingData.progress === 100 ||
      store.socialPostingData.error
    ) {
      setTimeout(() => {
        store.setSocialPostingData();
        page.current = 1;
        getPosts(page.current, limit.current, true);
      }, 500);
    }
  }, []);

  const deletePost = useCallback(
    async (feedsId) => {
      deletePostRequest.data = APIHandler.social_posts_delete(feedsId);
      try {
        const response = await deletePostRequest.promise();
        if (response?.status === STATUS_SUCCESS) {
          store.socialPosts.delete(feedsId);
        }
        flashShowMessage({
          type: response?.status === STATUS_SUCCESS ? 'success' : 'danger',
          message:
            response?.status === STATUS_SUCCESS
              ? response?.message || ''
              : t('api.error.message'),
        });
      } catch (error) {
        console.log('delete_post', error);
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    },
    [posts],
  );

  const handlePressMoreActionOption = useCallback(
    debounce((index, feeds) => {
      if (!isMounted()) return;
      switch (index) {
        case 0:
          servicesHandler({
            type: SERVICES_TYPE.SOCIAL_CREATE_POST,
            title: t('screen.createPost.editTitle'),
            editMode: true,
            site_id: feeds.site_id,
            group_id: feeds.group_id,
            post_id: feeds.id,
            content: feeds.content,
            images: feeds.images,
          });
          break;
        case 1:
          Actions.push(appConfig.routes.modalConfirm, {
            message: t('social:postDeleteConfirmMessage'),
            yesTitle: t('delete'),
            noTitle: t('cancel'),
            yesConfirm: () => deletePost(feeds.id),
          });
          break;
      }
    }, 300),
    [deletePost],
  );

  const handlePressMoreActions = useCallback(
    (feeds) => {
      Actions.push(appConfig.routes.modalActionSheet, {
        options: moreActionOptions,
        destructiveButtonIndex: 1,
        onPress: (index) => handlePressMoreActionOption(index, feeds),
      });
    },
    [handlePressMoreActionOption],
  );

  const renderStatusText = (feeds) => (
    <ActionBarText
      title={feeds.accept_status || t('social:posting')}
      style={
        feeds.is_accepted !== undefined &&
        !feeds.is_accepted && {
          color: theme.color.warning,
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
              showMoreActionsButton={user.user_id == store.user_info?.id}
              onPressGroup={() => handlePressGroup(group)}
              onPressUserName={() => handlePressUserName(user)}
              onPressAvatar={() => handlePressUserName(user)}
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
              onPressMoreActions={() => handlePressMoreActions(feeds)}
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
      safeLayout={safeLayout}
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
