import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';
import Feeds from 'src/components/Social/ListFeeds/Feeds';
import {CONFIG_KEY, isConfigActive} from 'app-helper/configKeyHandler';
import {getRelativeTime} from 'app-helper/social';

const styles = StyleSheet.create({});

const Posts = ({
  siteId = store.store_data?.id,
  refreshControl,
  ListHeaderComponent,
}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const [getPostsRequest] = useState(new APIRequest());

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();

    return () => {
      cancelRequests([getPostsRequest]);
    };
  }, []);

  const getPosts = useCallback(async () => {
    const data = {
      site_id: siteId,
    };
    getPostsRequest.data = APIHandler.social_posts(data);

    try {
      const response = await getPostsRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
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
    setRefreshing(true);
    getPosts();
  };

  const renderPost = ({item: post}) => {
    return (
      <Feeds
        commentsCount={post.comment_count}
        likeCount={post.like_count}
        isLiked={post.like_flag}
        userName={post.user?.name}
        description={getRelativeTime(post.created)}
        // thumbnailUrl={feeds.image_url}
        avatarUrl={post.user?.image}
        containerStyle={{marginBottom: 15}}
        disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
        // onPostPress={() => handlePostPress(feeds)}
        // onActionBarPress={(type) => handleActionBarPress(type, feeds)}
        // onPressTotalComments={() =>
        //   handleSocialNewsActionBarPress(
        //     SOCIAL_BUTTON_TYPES.COMMENT,
        //     feeds,
        //     false,
        //   )
        // }
      />
    );
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
    />
  );
};

export default React.memo(Posts);
