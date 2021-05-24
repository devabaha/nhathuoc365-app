import React from 'react';
import {StyleSheet} from 'react-native';

import Post from './Post';
import Container from 'src/components/Layout/Container';
import ActionContainer from '../../ActionContainer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

const Feeds = ({
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
  onActionBarPress,
  onPressTotalComments,
}) => {
  // console.log('render feeds');

  return (
    <Container
      centerVertical={false}
      style={[styles.container, containerStyle]}>
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
        onActionBarPress={onActionBarPress}
        onPressTotalComments={onPressTotalComments}
      />
    </Container>
  );
};

export default React.memo(Feeds);
