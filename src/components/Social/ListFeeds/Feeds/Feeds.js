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
  commentsCount,
  likeCount,
  isLiked,
  title,
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  containerStyle,
  onPostPress,
  onActionBarPress,
}) => {
  // console.log('render feeds');

  return (
    <Container
      centerVertical={false}
      style={[styles.container, containerStyle]}>
      <Post
        category={category}
        avatarUrl={avatarUrl}
        userName={userName}
        description={description}
        title={title}
        thumbnailUrl={thumbnailUrl}
        onPress={onPostPress}
      />

      <ActionContainer
        isLiked={isLiked}
        likeCount={likeCount}
        commentsCount={commentsCount}
        onActionBarPress={onActionBarPress}
      />
    </Container>
  );
};

export default React.memo(Feeds);
