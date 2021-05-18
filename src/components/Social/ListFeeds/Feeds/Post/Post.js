import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import Container from 'src/components/Layout/Container';

import Image from 'src/components/Image';
import {getNewsFeedSize} from 'app-helper/imageSize';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {},
  block: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  thumbnailContainer: {
    ...getNewsFeedSize(),
    justifyContent: 'flex-end',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#eee',
  },
  category: {
    color: appConfig.colors.primary,
    fontWeight: '500',
    marginBottom: 7,
    letterSpacing: .3
  },
  title: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const Post = ({
  title,
  category,
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container centerVertical={false} style={styles.container}>
        <Container row style={styles.block}>
          <Container style={styles.avatarContainer}>
            <Image
              source={{uri: avatarUrl}}
              style={styles.avatar}
              resizeMode="cover"
            />
          </Container>
          <Container centerVertical={false}>
            <Text style={styles.userName}>{userName}</Text>
            {!!description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </Container>
        </Container>
        <Container>
          <FastImage
            source={{uri: thumbnailUrl}}
            style={styles.thumbnailContainer}
          />
          <View style={styles.titleContainer}>
            {!!category && <Text style={styles.category}>{category}</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>
        </Container>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(Post);
