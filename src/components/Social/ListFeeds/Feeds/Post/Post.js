import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
// helpers
import {getNewsFeedSize} from 'app-helper/image';
import {isShowFullContent, renderGridImages} from 'app-helper/social';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {LINE_HEIGHT_OF_CONTENT} from 'src/constants/social/post';
import {BundleIconSetName} from 'src/components/base/Icon/constants';
// custom components
import {
  BaseButton,
  Container,
  Icon,
  IconButton,
  Typography,
  TypographyType,
} from 'src/components/base';
import SeeMoreBtn from 'src/components/Social/SeeMoreBtn';
import TextPressable from 'src/components/TextPressable';
import Image from 'src/components/Image';
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
  userNameContainer: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    flex: 1,
  },
  description: {
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
  },
  category: {
    fontWeight: '500',
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  title: {
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  content: {
    alignSelf: 'flex-start',
    lineHeight: LINE_HEIGHT_OF_CONTENT,
  },

  imagesContainer: {
    marginTop: 10,
  },

  groupNameDirectionIcon: {
    fontSize: 10,
  },

  seeMoreContainer: {
    bottom: 0.5,
    marginRight: 0,
    right: 0,
  },
  seeMore: {
    top: (appConfig.device.pixel * 16) / 2,
  },

  moreContainer: {
    marginLeft: 30,
  },
  moreIcon: {
    fontSize: 18,
  },
});

const Post = ({
  useSurfaceStyleForTitle,
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
  const {theme} = useTheme();

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

  const groupNameDirectionIconStyle = useMemo(
    () =>
      mergeStyles(styles.groupNameDirectionIcon, {
        color: theme.color.iconInactive,
      }),
    [theme],
  );

  const renderGroupName = () => {
    return !!group?.name ? (
      <>
        {' '}
        <Icon
          bundle={BundleIconSetName.ANT_DESIGN}
          name="caretright"
          style={groupNameDirectionIconStyle}
        />
        {'  '}
        <TextPressable onPress={onPressGroup}>{group.name}</TextPressable>
      </>
    ) : (
      ''
    );
  };

  const renderMoreButton = () => {
    return (
      showMoreActionsButton && (
        <IconButton
          bundle={BundleIconSetName.IONICONS}
          name="ios-ellipsis-horizontal"
          hitSlop={HIT_SLOP}
          style={styles.moreContainer}
          iconStyle={styles.moreIcon}
          onPress={onPressMoreActions}
        />
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

  const titleStyle = useMemo(() => {
    return mergeStyles(styles.title, {
      color: theme.color.onContentBackground,
    });
  }, [theme]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container style={styles.container}>
        <Container row centerVertical style={styles.block}>
          <BaseButton
            useTouchableHighlight
            onPress={onPressAvatar}
            style={styles.avatarContainer}>
            <Image
              source={{uri: avatarUrl}}
              style={styles.avatar}
              resizeMode="cover"
            />
          </BaseButton>
          <Container style={styles.userNameContainer}>
            <Container row centerVertical>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.userName}>
                <TextPressable onPress={onPressUserName}>
                  {userName}
                </TextPressable>

                {renderGroupName()}
              </Typography>

              {renderMoreButton()}
            </Container>
            {!!description && (
              <Typography
                type={TypographyType.DESCRIPTION_SMALL}
                style={styles.description}>
                {description}
              </Typography>
            )}
          </Container>
        </Container>

        <Container>
          {!!content && (
            <Container style={styles.contentContainer}>
              <TouchableWithoutFeedback
                onLongPress={() => {}}
                onPress={handleToggleExpandMessage}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  selectable
                  style={styles.content}>
                  {isShowFullMessage ? content : truncatedContent.current}{' '}
                  {canShowFullMessage.current && !isShowFullMessage && (
                    <SeeMoreBtn
                      containerStyle={styles.seeMoreContainer}
                      lineHeight={LINE_HEIGHT_OF_CONTENT}
                      titleStyle={styles.seeMore}
                      onPress={handleShowFullMessage}
                    />
                  )}
                </Typography>
              </TouchableWithoutFeedback>

              {/* {canShowFullMessage.current && !isShowFullMessage && (
                <SeeMoreBtn
                  containerStyle={styles.seeMoreContainer}
                  onPress={handleShowFullMessage}
                />
              )} */}
            </Container>
          )}

          {renderImages()}
        </Container>

        <Container>
          {!!thumbnailUrl && (
            <Image
              source={{uri: thumbnailUrl}}
              style={styles.thumbnailContainer}
            />
          )}
          {!!title && (
            <Container
              content={useSurfaceStyleForTitle}
              style={styles.titleContainer}>
              {!!category && (
                <Typography
                  type={TypographyType.LABEL_MEDIUM_PRIMARY}
                  style={[styles.category]}>
                  {category}
                </Typography>
              )}
              <Typography type={TypographyType.LABEL_LARGE} style={titleStyle}>
                {title}
              </Typography>
            </Container>
          )}
        </Container>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(Post);
