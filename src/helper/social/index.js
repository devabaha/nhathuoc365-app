import store from 'app-store';
import {Actions} from 'react-native-router-flux';
import {
  SOCIAL_BUTTON_TYPES,
  SOCIAL_DATA_TYPES,
  SOCIAL_RELATIVE_TIME_FORMAT_DATE,
} from 'src/constants/social';
import {share} from '../share';

import appConfig from 'app-config';
import moment from 'moment';

import {getPostGridImagesType, renderGridImages} from './post';

export {getPostGridImagesType, renderGridImages};

export const calculateLikeCountFriendly = (feeds) => {
  return feeds.like_flag
    ? feeds.like_count - 1 >= 0
      ? feeds.like_count - 1
      : 0
    : feeds.like_count;
};

export const getSocialLikeFlag = (type, feeds) => {
  let likeFlag = 0;
  switch (type) {
    case SOCIAL_DATA_TYPES.NEWS:
      likeFlag = store.socialNews.get(feeds.id)?.like_flag;
      break;
    case SOCIAL_DATA_TYPES.POST:
      likeFlag = store.socialPosts.get(feeds.id)?.like_flag;
      break;
  }

  likeFlag === undefined && (likeFlag = feeds.like_flag);
  return likeFlag;
};

export const getSocialLikeCount = (type, feeds) => {
  let likeCount = 0;
  switch (type) {
    case SOCIAL_DATA_TYPES.NEWS:
      likeCount = store.socialNews.get(feeds.id)?.like_count_friendly;
      break;
    case SOCIAL_DATA_TYPES.POST:
      likeCount = store.socialPosts.get(feeds.id)?.like_count_friendly;
      break;
  }

  likeCount === undefined && (likeCount = feeds.like_count);
  return likeCount;
};

export const getSocialCommentsCount = (type, feeds) => {
  let commentsCount = 0;
  switch (type) {
    case SOCIAL_DATA_TYPES.NEWS:
      commentsCount = store.socialNews.get(feeds.id)?.comment_count;
      break;
    case SOCIAL_DATA_TYPES.POST:
      commentsCount = store.socialPosts.get(feeds.id)?.comment_count;
      break;
  }

  commentsCount === undefined && (commentsCount = feeds.comment_count);
  return commentsCount;
};

export const likeSocial = (type, feeds) => {
  const oldLikeFlag = getSocialLikeFlag(type, feeds);
  const newLikeFlag = oldLikeFlag ? 0 : 1;
  let updateFunction = () => {};

  switch (type) {
    case SOCIAL_DATA_TYPES.NEWS:
      updateFunction = store.updateSocialNews;
      break;
    case SOCIAL_DATA_TYPES.POST:
      updateFunction = store.updateSocialPost;
      break;
  }

  updateFunction(feeds.id, {
    like_flag: newLikeFlag,
  });
  console.log(type, feeds);

  const data = {
    object: feeds.object,
    object_id: feeds.object_id,
    site_id: feeds.site_id,
    status: newLikeFlag,
  };

  console.log(data)

  APIHandler.social_likes(data)
    .promise()
    .then((res) => {
      if (res.status !== STATUS_SUCCESS) {
        updateFunction(feeds.id, {
          like_flag: oldLikeFlag,
        });
      }
      console.log('like_news_response', res);
    })
    .catch((err) => {
      console.log('like_social_error', err);
      setTimeout(() => {
        updateFunction(feeds.id, {
          like_flag: oldLikeFlag,
        });
      });
    });
};

export const handleSocialActionBarPress = (
  dataType,
  actionType,
  feeds,
  isCommentInputAutoFocus = true,
) => {
  switch (actionType) {
    case SOCIAL_BUTTON_TYPES.LIKE:
      likeSocial(dataType, feeds);
      break;
    case SOCIAL_BUTTON_TYPES.COMMENT:
      Actions.push(appConfig.routes.modalComment, {
        // title: 'Bình luận',
        title: feeds.title,
        object: feeds?.object,
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

export const getRelativeTime = (
  time,
  format = SOCIAL_RELATIVE_TIME_FORMAT_DATE,
) => {
  return moment(time, format).fromNow();
};

export const formatPostStoreData = (post) => {
  return {
    like_count: post.like_count || 0,
    like_count_friendly: calculateLikeCountFriendly(post) || 0,
    share_count: post.share_count || 0,
    like_flag: post.like_flag || 0,
    comment_count: post.comment_count || 0,
  };
};