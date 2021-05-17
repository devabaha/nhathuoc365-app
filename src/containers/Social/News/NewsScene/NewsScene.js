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
import {Observer} from 'mobx-react';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

import store from 'app-store';
import appConfig from 'app-config';

import NewsSceneSkeleton from './NewsSceneSkeleton';
import NoResult from 'src/components/NoResult';

import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import {APIRequest} from 'src/network/Entity';
import {share} from 'src/helper/share';

const styles = StyleSheet.create({
  feedsContainer: {
    marginBottom: 15,
  },
  feedsContentContainer: {
    paddingTop: 15,
  },
});

const getLikeFlag = (feeds) => {
  let likeFlag = store.socialNews[feeds.id]?.like_flag;
  likeFlag === undefined && (likeFlag = feeds.like_flag);
  return likeFlag;
};

const getLikeCount = (feeds) => {
  let likeCount = store.socialNews[feeds.id]?.like_count_friendly;
  likeCount === undefined && (likeCount = feeds.like_count);
  return likeCount;
};

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

  const setStoreSocialNews = (news) => {
    const storeNews = {};
    news.forEach(
      (n) =>
        (storeNews[n.id] = {
          like_count: n.like_count,
          like_count_friendly: n.like_flag
            ? n.like_count - 1 >= 0
              ? n.like_count - 1
              : 0
            : n.like_count,
          share_count: n.share_count,
          like_flag: n.like_flag,
          comment_count: n.comment_count,
        }),
    );
    store.setSocialNews(storeNews);
  };

  const getData = useCallback(async () => {
    try {
      const response = await APIHandler.user_news_list('', id);
      console.log(response);
      if (response && response.status == STATUS_SUCCESS) {
        setStoreSocialNews(response.data);
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
      status: getLikeFlag(feeds),
    };

    likeRequest.data = APIHandler.social_likes(data);
    likeRequest.promise();
    // .then((res) => console.log(res))
    // .catch((err) => console.log('like_news', err));
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
    switch (type) {
      case SOCIAL_BUTTON_TYPES.LIKE:
        store.updateSocialNews(feeds.id, {
          like_flag: getLikeFlag(feeds) ? 0 : 1,
        });
        likeNews(feeds);
        break;
      case SOCIAL_BUTTON_TYPES.COMMENT:
        Actions.push(appConfig.routes.modalComment, {
          // title: 'Bình luận',
          title: feeds.title,
          object: feeds?.object || 'news',
          object_id: feeds?.object_id || feeds?.id,
          site_id: feeds.site_id,
        });
        break;
      case SOCIAL_BUTTON_TYPES.SHARE:
        share(feeds.url, feeds.title);
        break;
    }
  }, []);

  const renderFeeds = ({item: feeds, index}) => {
    return (
      <Observer>
        {() => {
          return (
            <Feeds
              commentsCount={feeds.comments_count}
              likeCount={getLikeCount(feeds)}
              isLiked={getLikeFlag(feeds)}
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
        }}
      </Observer>
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

export default React.memo(observer((props) => <NewsScene {...props} />));
