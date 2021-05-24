import React, {useCallback, useEffect, useState} from 'react';
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

const styles = StyleSheet.create({});

const Posts = ({
  groupId,
  siteId = store.store_data?.id,
  refreshControl,
  onRefresh: onRefreshProp = () => {},
  ListHeaderComponent,
}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState(true);
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

  const getPosts = useCallback(async () => {
    const data = {
      site_id: siteId,
    };
    groupId !== undefined && (data.group_id = groupId);
    getPostsRequest.data = APIHandler.social_posts(data);

    try {
      const response = await getPostsRequest.promise();
      console.log(response, data);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setStoreSocialPosts(response.data.list || []);
            setPosts(response.data.list || []);
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
      }
    }
  }, [siteId]);

  const onRefresh = () => {
    onRefreshProp();
    setRefreshing(true);
    getPosts();
  };

  const handleActionBarPress = useCallback((type, feeds) => {
    handleSocialActionBarPress(SOCIAL_DATA_TYPES.POST, type, feeds);
  }, []);

  const renderPost = ({item: feeds}) => {
    return (
      <Observer>
        {() => (
          <Feeds
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
    return <NoResult iconName="post" message="Chưa có bài viết" />
  }

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
    />
  );
};

export default React.memo(Posts);
