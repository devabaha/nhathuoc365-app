import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Container from 'src/components/Layout/Container';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import ActionBar from './ActionBar';
import ActionInfo from './ActionInfo';

const styles = StyleSheet.create({});

const ActionContainer = ({
  isLiked,
  likeCount,
  commentsCount,
  onActionBarPress = () => {},
}) => {
  return (
    <Container centerVertical={false} paddingHorizontal={10}>
      <ActionInfo
        isLiked={isLiked}
        totalReaction={likeCount}
        totalComments={commentsCount}
      />
      <ActionBar isLiked={isLiked} onActionBarPress={onActionBarPress} />
    </Container>
  );
};

export default React.memo(ActionContainer);
