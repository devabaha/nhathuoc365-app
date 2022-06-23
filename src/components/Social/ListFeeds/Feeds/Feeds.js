import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Animated} from 'react-native';
// helpers
import {hexToRgba} from 'app-helper';
import {mergeStyles} from 'src/Themes/helper';
import {isConfigActive} from 'app-helper/configKeyHandler';
// context
import {useTheme} from 'src/Themes/Theme.context';
import {BASE_DARK_THEME_ID} from 'src/Themes/Theme.dark';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
// custom components
import Post from './Post';
import {Container} from 'src/components/base';
import ActionContainer from '../../ActionContainer';
import ProgressBar from 'src/components/ProgressBar';
import Loading from 'src/components/Loading';
import ActionBarText from './ActionBarText';

const styles = StyleSheet.create({
  container: {},
  postingProgressContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
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
  },

  errorText: {},
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
  showMoreActionsButton,
  onPressPost,
  onPressGroup,
  onPressUserName,
  onPressAvatar,
  renderActionBar,
  onActionBarPress,
  onPressTotalComments,
  onPressMoreActions,
}) => {
  const {theme} = useTheme();
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

  const postingProgressContainerStyle = useMemo(() => {
    return mergeStyles(styles.postingProgressContainer, {
      borderColor: theme.color.border,
      borderWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  const postingMaskStyle = useMemo(() => {
    return mergeStyles(styles.postingMask, {
      backgroundColor:
        theme.id === BASE_DARK_THEME_ID
          ? theme.color.overlay60
          : hexToRgba(theme.color.white, 0.4),
    });
  }, [theme]);

  const errorTextStyle = useMemo(() => {
    return mergeStyles(styles.errorText, {
      color: theme.color.danger,
    });
  }, [theme]);

  const renderErrorText = () => {
    return <ActionBarText title={t('errorPosting')} style={errorTextStyle} />;
  };

  return (
    <Container
      pointerEvents={!!isPosting ? 'none' : 'auto'}
      animated
      style={[
        styles.container,
        error && styles.error,
        animatedPostedStyle,
        containerStyle,
      ]}>
      {!!isPosting && (
        <Container row centerVertical style={postingProgressContainerStyle}>
          <Loading wrapperStyle={styles.postingLoading} size="small" />
          <ProgressBar
            containerStyle={styles.postingProgressBarContainer}
            progress={postingProgress}
            height={5}
            backgroundColor={theme.color.persistPrimary}
            onProgressChange={onPostingProgressChange}
            onCompletion={onPostingProgressComplete}
            onAnimatedChange
          />
        </Container>
      )}

      <Container>
        <Post
          useSurfaceStyleForTitle={!isConfigActive(
            CONFIG_KEY.DISABLE_REACTION_BAR_KEY,
          )}
          group={group}
          category={category}
          avatarUrl={avatarUrl}
          userName={userName}
          description={description}
          content={content}
          images={images}
          title={title}
          thumbnailUrl={thumbnailUrl}
          showMoreActionsButton={showMoreActionsButton}
          onPress={onPressPost}
          onPressGroup={onPressGroup}
          onPressUserName={onPressUserName}
          onPressAvatar={onPressAvatar}
          onPressMoreActions={onPressMoreActions}
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

        {!!isPosting && <Container style={postingMaskStyle} />}
      </Container>
    </Container>
  );
};

export default React.memo(Feeds);
