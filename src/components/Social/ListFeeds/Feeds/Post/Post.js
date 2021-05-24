import React, {useState, useMemo, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import Container from 'src/components/Layout/Container';

import Image from 'src/components/Image';
import {getNewsFeedSize} from 'app-helper/image';

import appConfig from 'app-config';
import {GRID_IMAGES_LAYOUT_TYPES} from 'src/constants/social';
import {getPostGridImagesType, renderGridImages} from 'app-helper/social';
import SeeMoreBtn from 'src/components/Social/SeeMoreBtn';

const CHARACTER_PER_LINE = 40;
const LINE_HEIGHT = 21;
const MAX_LINE = 5;
const MAX_LENGTH_TEXT = CHARACTER_PER_LINE * MAX_LINE;
const MAX_COLLAPSED_HEIGHT =
  LINE_HEIGHT * MAX_LINE + (appConfig.device.isIOS ? 0 : 10);

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
    letterSpacing: 0.3,
  },
  title: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  content: {
    color: '#333',
  },

  imagesContainer: {
    marginTop: 10,
  },
});

const Post = ({
  title,
  category,
  content,
  images = [],
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  onPress,
}) => {
  const initIsShowFullMessage = () => {
    if (content) {
      const numOfBreakIos = content.split('\r')?.length;
      const numOfBreakAndroid = content.split('\n')?.length;

      return (
        content.length <= MAX_LENGTH_TEXT &&
        numOfBreakIos <= MAX_LINE &&
        numOfBreakAndroid <= MAX_LINE
      );
    }

    return true;
  };

  const [isShowFullMessage, setShowFullMessage] = useState(
    initIsShowFullMessage(),
  );

  const handleShowFullMessage = useCallback(() => {
    setShowFullMessage(true);
  }, []);

  const contentContainerStyle = {
    maxHeight: !isShowFullMessage ? MAX_COLLAPSED_HEIGHT : undefined,
    overflow: 'hidden'
  };

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
          <Container style={[styles.contentContainer, contentContainerStyle]}>
            <Text style={styles.content}>{content}</Text>
            {!isShowFullMessage && (
              <SeeMoreBtn containerStyle={{bottom: 0, marginRight: 0}} onPress={handleShowFullMessage} />
            )}
          </Container>

          {!!images?.length && (
            <Container style={styles.imagesContainer}>
              {renderGridImages(images)}
            </Container>
          )}
        </Container>

        <Container>
          {!!thumbnailUrl && (
            <FastImage
              source={{uri: thumbnailUrl}}
              style={styles.thumbnailContainer}
            />
          )}
          {!!title && (
            <View style={styles.titleContainer}>
              {!!category && <Text style={styles.category}>{category}</Text>}
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
        </Container>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(Post);
