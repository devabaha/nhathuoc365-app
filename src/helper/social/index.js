import store from 'app-store';
import {
  SOCIAL_BUTTON_TYPES,
  SOCIAL_DATA_TYPES,
  SOCIAL_RELATIVE_TIME_FORMAT_DATE,
} from 'src/constants/social';
import {share} from '../share';

import appConfig from 'app-config';
import moment from 'moment';

import {getPostGridImagesType, renderGridImages} from './post';
import {
  MAX_LENGTH_CONTENT,
  MAX_LINE_OF_CONTENT,
} from 'src/constants/social/post';
import {push} from 'app-helper/routing';

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
    case SOCIAL_DATA_TYPES.PRODUCT:
      likeFlag = store.socialProducts.get(feeds.id)?.like_flag;
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
    case SOCIAL_DATA_TYPES.PRODUCT:
      likeCount = store.socialProducts.get(feeds.id)?.like_count_friendly;
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
    case SOCIAL_DATA_TYPES.PRODUCT:
      commentsCount = store.socialProducts.get(feeds.id)?.comment_count;
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
    case SOCIAL_DATA_TYPES.PRODUCT:
      updateFunction = store.updateSocialProducts;
      break;
  }

  updateFunction(feeds.id, {
    like_flag: newLikeFlag,
  });

  const data = {
    object: feeds.object,
    object_id: feeds.object_id,
    site_id: feeds.site_id,
    status: newLikeFlag,
  };

  console.log(data);

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
  extraProps = {},
  theme,
) => {
  switch (actionType) {
    case SOCIAL_BUTTON_TYPES.LIKE:
      likeSocial(dataType, feeds);
      break;
    case SOCIAL_BUTTON_TYPES.COMMENT:
      push(
        appConfig.routes.modalComment,
        {
          title: feeds.title || feeds.name,
          object: feeds?.object,
          object_id: feeds?.object_id || feeds?.id,
          site_id: feeds.site_id,
          autoFocus: isCommentInputAutoFocus,
          ...extraProps,
        },
        theme,
      );
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

export const formatStoreSocialPosts = (posts, callback = () => {}) => {
  const storePosts = {};
  posts.forEach((post) => {
    storePosts[post.id] = formatPostStoreData(post);
    callback(post);
  });
  return storePosts;
};

export const formatPostStoreData = (post = {}) => {
  return {
    ...post,
    like_count: post.like_count || 0,
    like_count_friendly: calculateLikeCountFriendly(post) || 0,
    share_count: post.share_count || 0,
    like_flag: post.like_flag || 0,
    comment_count: post.comment_count || 0,
  };
};

export const isShowFullContent = (
  content,
  callback = () => {},
  maxLength = MAX_LENGTH_CONTENT,
  maxLine = MAX_LINE_OF_CONTENT,
) => {
  const splitter = '\n';
  let truncatedContent = '';
  let numOfBreak = 0;

  if (content) {
    const contentBreakLines = content.split(splitter);
    numOfBreak = contentBreakLines?.length;

    if (content.length > maxLength) {
      truncatedContent = content.slice(0, maxLength);
    } else if (numOfBreak > maxLine) {
      truncatedContent = contentBreakLines.slice(0, maxLine).join(splitter);
    }
    if (!!truncatedContent) {
      truncatedContent += '...';
    }
  }

  callback(truncatedContent || content);

  return !content || (content.length <= maxLength && numOfBreak <= maxLine);
};
