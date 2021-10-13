import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import appConfig from 'app-config';
import {LINE_HEIGHT_OF_CONTENT} from 'src/constants/social/post';
import {isShowFullContent, renderGridImages} from 'app-helper/social';
import {getNewsFeedSize} from 'app-helper/image';

import Container from 'src/components/Layout/Container';
import SeeMoreBtn from 'src/components/Social/SeeMoreBtn';
import TextPressable from 'src/components/TextPressable';
import Image from 'src/components/Image';

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
  userNameContainer: {
    flex: 1,
  },
  userName: {
    color: '#333',
    fontWeight: '600',
    flex: 1,
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
    alignSelf: 'flex-start',
    fontSize: 15,
    lineHeight: LINE_HEIGHT_OF_CONTENT,
  },

  imagesContainer: {
    marginTop: 10,
  },

  groupNameDirectionIcon: {
    color: '#666',
    fontSize: 10,
  },

  seeMoreContainer: {
    bottom: 0.5,
    marginRight: 0,
    right: 0,
  },

  moreContainer: {
    marginLeft: 30,
  },
  moreIcon: {
    fontSize: 18,
    color: appConfig.colors.text,
  },
});

const Post = ({
  title,
  category,
  group,
  content,
  images = [],
  thumbnailUrl,
  avatarUrl,
  userName,
  description,
  showMoreActionsButton = false,
  onPress = () => {},
  onPressGroup = () => {},
  onPressUserName = () => {},
  onPressAvatar = () => {},
  onPressMoreActions = () => {},
}) => {
  const truncatedContent = useRef('');
  const canShowFullMessage = useRef(false);
  const isShowFullPostContent = useCallback(() => {
    return !isShowFullContent(
      content,
      (truncated) => (truncatedContent.current = truncated),
    );
  }, [content]);

  const [isShowFullMessage, setShowFullMessage] = useState(
    canShowFullMessage.current,
  );

  useEffect(() => {
    canShowFullMessage.current = isShowFullPostContent();
  }, [content]);

  const handleShowFullMessage = useCallback(() => {
    setShowFullMessage(true);
  }, []);

  const handleToggleExpandMessage = useCallback(() => {
    if (canShowFullMessage.current) {
      setShowFullMessage(!isShowFullMessage);
    }
  }, [isShowFullMessage, content]);

  const renderGroupName = () => {
    return !!group?.name ? (
      <Text>
        {' '}
        <AntDesignIcon
          name="caretright"
          style={styles.groupNameDirectionIcon}
        />
        {'  '}
        <TextPressable onPress={onPressGroup}>{group.name}</TextPressable>
      </Text>
    ) : (
      ''
    );
  };

  const renderMoreButton = () => {
    return (
      showMoreActionsButton && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          style={styles.moreContainer}
          onPress={onPressMoreActions}>
          <Ionicons name="ios-ellipsis-horizontal" style={styles.moreIcon} />
        </TouchableOpacity>
      )
    );
  };

  const renderImages = useCallback(() => {
    return (
      !!images?.length && (
        <Container style={styles.imagesContainer}>
          {renderGridImages(images)}
        </Container>
      )
    );
  }, [images]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container centerVertical={false} style={styles.container}>
        <Container row style={styles.block}>
          <TouchableHighlight
            underlayColor="rgba(0,0,0,.6)"
            onPress={onPressAvatar}
            style={styles.avatarContainer}>
            <Image
              source={{uri: avatarUrl}}
              style={styles.avatar}
              resizeMode="cover"
            />
          </TouchableHighlight>
          <Container centerVertical={false} style={styles.userNameContainer}>
            <Container row>
              <Text style={styles.userName}>
                <TextPressable onPress={onPressUserName}>
                  {userName}
                </TextPressable>

                {renderGroupName()}
              </Text>

              {renderMoreButton()}
            </Container>
            {!!description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </Container>
        </Container>

        <Container centerVertical={false}>
          {!!content && (
            <Container centerVertical={false} style={styles.contentContainer}>
              <TouchableWithoutFeedback onPress={handleToggleExpandMessage}>
                <Text selectable style={styles.content}>
                  {isShowFullMessage ? content : truncatedContent.current}
                </Text>
              </TouchableWithoutFeedback>
              {canShowFullMessage.current && !isShowFullMessage && (
                <SeeMoreBtn
                  containerStyle={styles.seeMoreContainer}
                  onPress={handleShowFullMessage}
                />
              )}
            </Container>
          )}

          {renderImages()}
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
