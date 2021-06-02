import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Animated, Text} from 'react-native';

import Post from './Post';
import Container from 'src/components/Layout/Container';
import ActionContainer from '../../ActionContainer';
import ProgressBar from 'src/components/ProgressBar';

import appConfig from 'app-config';
import Loading from 'src/components/Loading';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  postingProgressContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  postingLoading: {
    position: 'relative',
    marginRight: 10,
  },
  postingProgressBarContainer: {
    width: '100%',
    flex: 1,
  },

  error: {
    opacity: 0.6,
  },

  postingMask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,.4)',
  },

  errorText: {
    color: appConfig.colors.status.danger,
  },
  actionBarText: {
    padding: 15,
    textAlign: 'center',
    color: '#333',
  },
});

const Feeds = ({
  error,
  isPosting,
  postingProgress,
  onPostingProgressComplete,
  onPostingProgressChange = () => {},
  onAnimatedPostedEnd = () => {},
  category,
  group,
  commentsCount,
  likeCount,
  isLiked,
  content,
  images,
  title,
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  containerStyle,
  disableComment,
  disableShare,
  onPressPost,
  onPressGroup,
  renderActionBar,
  onActionBarPress,
  onPressTotalComments,
}) => {
  // console.log('render feeds');
  const {t} = useTranslation('social');

  const isPostingCurrentValue = useRef(isPosting);

  const [animatedPosted] = useState(new Animated.Value(0));
  const animatedPostedStyle = {
    transform: [
      {
        translateY: animatedPosted.interpolate({
          inputRange: [0, 0.25, 0.75, 1],
          outputRange: [0, 5, -5, 0],
        }),
      },
    ],
  };

  useEffect(() => {
    if (!!isPostingCurrentValue.current && !isPosting) {
      hapticFeedBack();
      Animated.spring(animatedPosted, {
        toValue: 1,
        damping: 20,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          animatedPosted.setValue(0);
          onAnimatedPostedEnd();
        }
      });
    }
    isPostingCurrentValue.current = isPosting;
  }, [isPosting]);

  const renderErrorText = () => {
    return <ActionBarText title={t('errorPosting')} style={styles.errorText} />;
  };

  return (
    <Container
      pointerEvents={!!isPosting ? 'none' : 'auto'}
      centerVertical={false}
      style={[
        styles.container,
        error && styles.error,
        animatedPostedStyle,
        containerStyle,
      ]}>
      {!!isPosting && (
        <Container
          row
          paddingVertical={10}
          paddingHorizontal={15}
          style={styles.postingProgressContainer}>
          <Loading wrapperStyle={styles.postingLoading} size="small" />
          <ProgressBar
            containerStyle={styles.postingProgressBarContainer}
            progress={postingProgress}
            height={5}
            foregroundColor={appConfig.colors.sceneBackground}
            backgroundColor={appConfig.colors.primary}
            onProgressChange={onPostingProgressChange}
            onCompletion={onPostingProgressComplete}
            onAnimatedChange
          />
        </Container>
      )}

      <Container centerVertical={false}>
        <Post
          group={group}
          category={category}
          avatarUrl={avatarUrl}
          userName={userName}
          description={description}
          content={content}
          images={images}
          title={title}
          thumbnailUrl={thumbnailUrl}
          onPress={onPressPost}
          onPressGroup={onPressGroup}
        />

        <ActionContainer
          isLiked={isLiked}
          likeCount={likeCount}
          commentsCount={commentsCount}
          disableComment={disableComment}
          disableShare={disableShare}
          renderActionBar={error ? renderErrorText : renderActionBar}
          onActionBarPress={onActionBarPress}
          onPressTotalComments={onPressTotalComments}
        />

        {!!isPosting && <Container style={styles.postingMask} />}
      </Container>
    </Container>
  );
};

export default React.memo(Feeds);

export const ActionBarText = React.memo(({title, style}) => {
  return <Text style={[styles.actionBarText, style]}>{title}</Text>;
});
