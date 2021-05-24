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

import NewsSceneSkeleton from './NewsSceneSkeleton';
import NoResult from 'src/components/NoResult';

import {APIRequest} from 'src/network/Entity';
import {
  calculateLikeCountFriendly,
  getSocialLikeCount,
  getSocialLikeFlag,
  handleSocialActionBarPress,
} from 'src/helper/social';
import {SOCIAL_BUTTON_TYPES, SOCIAL_DATA_TYPES} from 'src/constants/social';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';

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

  const setStoreSocialNews = (news) => {
    const storeNews = {};
    news.forEach(
      (n) =>
        (storeNews[n.id] = {
          like_count: n.like_count,
          like_count_friendly: calculateLikeCountFriendly(n),
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
    handleSocialActionBarPress(SOCIAL_DATA_TYPES.NEWS, type, feeds);
  }, []);

  const renderFeeds = ({item: feeds, index}) => {
    return (
      <Observer>
        {() => {
          return (
            <Feeds
              category={feeds.category?.title}
              commentsCount={feeds.comment_count}
              likeCount={getSocialLikeCount(SOCIAL_DATA_TYPES.NEWS, feeds)}
              isLiked={getSocialLikeFlag(SOCIAL_DATA_TYPES.NEWS, feeds)}
              title={feeds.title}
              userName={feeds.shop_name}
              description={feeds.created}
              thumbnailUrl={feeds.image_url}
              avatarUrl={feeds.shop_logo_url}
              containerStyle={styles.feedsContainer}
              disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
              onPressPost={() => handlePostPress(feeds)}
              onActionBarPress={(type) => handleActionBarPress(type, feeds)}
              onPressTotalComments={() =>
                handleSocialActionBarPress(
                  SOCIAL_DATA_TYPES.NEWS,
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
