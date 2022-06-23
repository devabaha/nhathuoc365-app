import React from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {isConfigActive} from 'app-helper/configKeyHandler';
// constants
import {CONFIG_KEY} from 'app-helper/configKeyHandler';
// custom components
import {Container} from 'src/components/base';
import ActionBar from './ActionBar';
import ActionInfo from './ActionInfo';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
});

const ActionContainer = ({
  isLiked,
  likeCount,
  commentsCount,
  style,
  commentTitle,
  totalCommentsTitle,
  disableComment,
  hasInfoExtraBottom,
  disableShare,
  renderActionBar,
  safeLayout,
  shadow,
  onActionBarPress = () => {},
  onPressTotalComments = () => {},
}) => {
  if (isConfigActive(CONFIG_KEY.DISABLE_REACTION_BAR_KEY)) {
    return null;
  }

  return (
    <Container
      safeLayout={safeLayout}
      shadow={shadow}
      style={[styles.container, style]}>
      <ActionInfo
        isLiked={isLiked}
        totalReaction={likeCount}
        totalComments={commentsCount}
        totalCommentsTitle={totalCommentsTitle}
        onPressTotalComments={onPressTotalComments}
        disableComment={disableComment}
        hasInfoExtraBottom={hasInfoExtraBottom}
      />
      {renderActionBar ? (
        renderActionBar()
      ) : (
        <ActionBar
          isLiked={isLiked}
          commentTitle={commentTitle}
          disableComment={disableComment}
          disableShare={disableShare}
          onActionBarPress={onActionBarPress}
        />
      )}
    </Container>
  );
};

export default React.memo(ActionContainer);
