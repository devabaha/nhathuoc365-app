import React, {
  useCallback,
  useEffect,
  useState,
  useReducer,
  useRef,
} from 'react';
import {StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';

import {ListFeeds} from 'src/components/Social';
import Feeds from 'src/components/Social/ListFeeds/Feeds';
import {reaction} from 'mobx';

import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

import store from 'app-store';
import appConfig from 'app-config';

import NewsSceneSkeleton from './NewsSceneSkeleton';
import NoResult from 'src/components/NoResult';

import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import {APIRequest} from 'src/network/Entity';

const styles = StyleSheet.create({
  feedsContainer: {
    marginBottom: 15,
  },
  feedsContentContainer: {
    paddingTop: 15,
  },
});

const NewsScene = ({id, isFetching = false}) => {
  const {t} = useTranslation(['news', 'common']);

  const reactionDisposer = useRef(() => {});
  const currentId = useRef(id);

  const [likeRequest] = useState(new APIRequest());

  const [{data, loading, refreshing}, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {},
    () => {
      return {
        data: [],

        loading: true,
        refreshing: false,
      };
    },
  );

  useEffect(() => {
    return () => {
      reactionDisposer.current();
    };
  }, []);

  useEffect(() => {
    reactionDisposer.current = reaction(
      () => store.refresh_news,
      () => {
        if (!!data?.length) {
          getData();
        }
      },
    );
    return () => {
      reactionDisposer.current();
      cancelRequests([likeRequest]);
    };
  }, [id, data]);

  useEffect(() => {
    const isChangingId = currentId.current !== id;
    currentId.current = id;

    // fetching data when (news existed and id changing)
    // or (ísFetching and news is empty)
    if ((isChangingId && !!data?.length) || (isFetching && !data?.length)) {
      getData();
    }
  }, [id, isFetching]);

  const getData = useCallback(async () => {
    try {
      const response = await APIHandler.user_news_list('', id);
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        store.updateSocialNews(response.data);
        
        // direction to news_detail if detecting deep link data.
        if (store.deep_link_data) {
          const news = response.data.find(
            (newsItem) => newsItem.id === store.deep_link_data.id,
          );
          if (news) {
            Actions.notify_item({
              title: news.title,
              data: news,
            });
          } else {
            flashShowMessage({
              type: 'danger',
              message: t('getNews.error.message'),
            });
          }
        }

        setState({data: response.data || []});
      }
    } catch (e) {
      console.log(e + ' user_news_list');
    } finally {
      // reset deep link data
      store.setDeepLinkData(null);
      setState({
        loading: false,
        refreshing: false,
      });
    }
  }, [id]);

  const likeNews = useCallback((feeds) => {
    const data = {
      object: feeds.object,
      object_id: feeds.object_id,
      site_id: feeds.site_id,
      status: store.socialNews[feeds.id]?.like_flag ? 0 : 1,
    };

    likeRequest.data = APIHandler.social_likes(data);
    likeRequest
      .promise()
      .then((res) => console.log(res))
      .catch((err) => console.log('like_news', err));
  }, []);

  const handleRefresh = useCallback(() => {
    setState({refreshing: true});
    getData();
  });

  const handlePostPress = useCallback((feeds) => {
    servicesHandler({
      type: SERVICES_TYPE.NEWS_DETAIL,
      news: feeds,
      title: feeds.title,
    });
  }, []);

  const handleActionBarPress = useCallback((type, feeds) => {
    console.log(feeds);
    switch (type) {
      case SOCIAL_BUTTON_TYPES.LIKE:
        likeNews(feeds);
        break;
      case SOCIAL_BUTTON_TYPES.COMMENT:
        Actions.push(appConfig.routes.modalComment, {
          title: 'Bình luận',
          object: feeds?.object || 'news',
          object_id: feeds?.object_id || feeds?.id,
          site_id: feeds.site_id,
        });
        break;
    }
  }, []);

  const renderFeeds = ({item: feeds, index}) => {
    return (
      <Feeds
        commentsCount={feeds.comments_count}
        likeCount={feeds.like_count}
        isLiked={Number(feeds.like_flag)}
        title={feeds.title}
        userName={feeds.shop_name}
        description={feeds.created}
        thumbnailUrl={feeds.image_url}
        avatarUrl={feeds.shop_logo_url}
        containerStyle={styles.feedsContainer}
        onPostPress={() => handlePostPress(feeds)}
        onActionBarPress={(type) => handleActionBarPress(type, feeds)}
      />
    );
  };

  return loading ? (
    <NewsSceneSkeleton />
  ) : (
    <ListFeeds
      data={data || []}
      renderFeeds={renderFeeds}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={styles.feedsContentContainer}
      ListEmptyComponent={
        !loading && (
          <NoResult
            iconName="newspaper-variant-multiple-outline"
            message={t('noNews')}
          />
        )
      }
    />
  );
};

export default React.memo(NewsScene);
