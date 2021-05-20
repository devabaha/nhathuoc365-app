import store from 'app-store';
import {Actions} from 'react-native-router-flux';
import {SOCIAL_BUTTON_TYPES, SOCIAL_RELATIVE_TIME_FORMAT_DATE} from 'src/constants/social';
import {share} from '../share';

import appConfig from 'app-config';
import moment from 'moment';

export const calculateLikeCountFriendly = (feeds) => {
  return feeds.like_flag
    ? feeds.like_count - 1 >= 0
      ? feeds.like_count - 1
      : 0
    : feeds.like_count;
};

export const getSocialNewsLikeFlag = (feeds) => {
  let likeFlag = store.socialNews.get(feeds.id)?.like_flag;
  likeFlag === undefined && (likeFlag = feeds.like_flag);
  return likeFlag;
};

export const getSocialNewsLikeCount = (feeds) => {
  let likeCount = store.socialNews.get(feeds.id)?.like_count_friendly;
  likeCount === undefined && (likeCount = feeds.like_count);
  return likeCount;
};

export const getSocialNewsCommentsCount = (feeds) => {
  let commentsCount = store.socialNews.get(feeds.id)?.comment_count;
  commentsCount === undefined && (commentsCount = feeds.comment_count);
  return commentsCount;
};

export const likeNews = (feeds) => {
  const oldLikeFlag = getSocialNewsLikeFlag(feeds);
  const newLikeFlag = oldLikeFlag ? 0 : 1;
  store.updateSocialNews(feeds.id, {
    like_flag: newLikeFlag,
  });

  const data = {
    object: feeds.object,
    object_id: feeds.object_id,
    site_id: feeds.site_id,
    status: newLikeFlag,
  };

  APIHandler.social_likes(data)
    .promise()
    .then((res) => {
      if (res.status !== STATUS_SUCCESS) {
        store.updateSocialNews(feeds.id, {
          like_flag: oldLikeFlag,
        });
      }
      console.log('like_news_response', res);
    })
    .catch((err) => {
      console.log('like_news_error', err);
      store.updateSocialNews(feeds.id, {
        like_flag: oldLikeFlag,
      });
    });
};

export const handleSocialNewsActionBarPress = (
  type,
  feeds,
  isCommentInputAutoFocus = true,
) => {
  switch (type) {
    case SOCIAL_BUTTON_TYPES.LIKE:
      likeNews(feeds);
      break;
    case SOCIAL_BUTTON_TYPES.COMMENT:
      Actions.push(appConfig.routes.modalComment, {
        // title: 'Bình luận',
        title: feeds.title,
        object: feeds?.object || 'news',
        object_id: feeds?.object_id || feeds?.id,
        site_id: feeds.site_id,
        autoFocus: isCommentInputAutoFocus,
      });
      break;
    case SOCIAL_BUTTON_TYPES.SHARE:
      share(feeds.url, feeds.title);
      break;
  }
};

export const getRelativeTime = (time, format = SOCIAL_RELATIVE_TIME_FORMAT_DATE) => {
  return moment(time, format).fromNow();
};
