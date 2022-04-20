import React from 'react';
import {StyleSheet} from 'react-native';
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
  onActionBarPress = () => {},
  onPressTotalComments = () => {},
}) => {
  return (
    <Container style={[styles.container, style]}>
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
