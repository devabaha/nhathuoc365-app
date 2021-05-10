import React from 'react';
import {StyleSheet, View} from 'react-native';

import Post from './Post';
import ActionBar from './ActionBar';
import ActionInfo from './ActionInfo';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});

const Feeds = ({
  title,
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  containerStyle,
  onPostPress,
  onActionBarPress
}) => {
  // console.log('render feeds');

  return (
    <Container
      centerVertical={false}
      style={[styles.container, containerStyle]}>
      <Post
        avatarUrl={avatarUrl}
        userName={userName}
        description={description}
        title={title}
        thumbnailUrl={thumbnailUrl}
        onPress={onPostPress}
      />

      <Container centerVertical={false} paddingHorizontal={10}>
        <ActionInfo totalReaction={25} totalComments={104} />
        <ActionBar onActionBarPress={onActionBarPress}/>
      </Container>
    </Container>
  );
};

export default React.memo(Feeds);
