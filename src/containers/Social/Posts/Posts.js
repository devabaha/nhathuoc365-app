import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';

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
    async function test() {
      const data = {
        site_id: 1938,
        group_id: 19,
        content:
          "What is Lorem Ipsum?\rLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\r\rWhy do we use it?\rIt is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on",
        images: JSON.stringify([
          {
            name: '421492185.png',
            with: 200,
            height: 200,
          },
          {
            name: '421492186.png',
            with: 200,
            height: 200,
          },
          {
            name: '421492187.png',
            with: 200,
            height: 200,
          },
          {
            name: '421492188.png',
            with: 200,
            height: 200,
          },
        ]),
      };

      const response = await APIHandler.social_create_post(data).promise();

      console.log(response);
    }

    test();

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
    return null;
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
