import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Container from 'src/components/Layout/Container';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import ActionBar from './ActionBar';
import ActionInfo from './ActionInfo';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

const ActionContainer = ({
  isLiked,
  likeCount,
  commentsCount,
  style,
  commentTitle,
  disableComment,
  hasInfoExtraBottom,
  disableShare,
  renderActionBar,
  onActionBarPress = () => {},
  onPressTotalComments = () => {},
}) => {
  return (
    <Container
      style={[styles.container, style]}
      centerVertical={false}
      paddingHorizontal={12}>
      <ActionInfo
        isLiked={isLiked}
        totalReaction={likeCount}
        totalComments={commentsCount}
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
