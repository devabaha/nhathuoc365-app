import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';

import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import BubbleBottom from '../BubbleBottom';
import {Bubble, MessageText} from 'react-native-gifted-chat';

import appConfig from 'app-config';

import {IMAGE_COMMENT_HEIGHT} from 'src/constants/social/comments';
import {
  LINE_HEIGHT_OF_CONTENT,
  MAX_LINE_OF_CONTENT,
} from 'src/constants/social/post';
import {getRelativeTime, isShowFullContent} from 'app-helper/social';

import SeeMoreBtn from '../../SeeMoreBtn';
import BubbleEditing from './BubbleEditing';
import TextPressable from 'src/components/TextPressable';

const BG_COLOR = '#f0f1f4';
const BG_HIGHLIGHT_COLOR = '#c9cbd0';

const MAX_COLLAPSED_HEIGHT =
  LINE_HEIGHT_OF_CONTENT * MAX_LINE_OF_CONTENT +
  (appConfig.device.isIOS ? LINE_HEIGHT_OF_CONTENT : 10);

const SHOW_FULL_MESSAGE_TOP_SPACING =
  MAX_COLLAPSED_HEIGHT -
  LINE_HEIGHT_OF_CONTENT -
  (appConfig.device.isIOS
    ? LINE_HEIGHT_OF_CONTENT
    : 10) +
  5.5;

const MIN_WIDTH_MESSAGE = 120;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 15,
  },
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  bubbleWrapper: {
    marginRight: 0,
    overflow: 'hidden',
    paddingVertical: 3,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  bubbleContainer: {
    // flex: 0,
  },
  imageContainer: {
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#ddd',
    flex: 1,
    maxHeight: IMAGE_COMMENT_HEIGHT,
    width: '100%',
    height: undefined,
  },
  btnShowFullMessageContainer: {
    // top: SHOW_FULL_MESSAGE_TOP_SPACING,
    bottom: LINE_HEIGHT_OF_CONTENT-15,
    zIndex: 1,
  },
  btnShowFullMessageTitle: {
    paddingRight: 12,
  },
  text: {
    lineHeight: LINE_HEIGHT_OF_CONTENT,
    color: '#242424',
    fontSize: 15,
  },
  labelShowFulMessage: {
    color: '#777',
    paddingLeft: 20,
    paddingRight: 15,
    lineHeight: LINE_HEIGHT_OF_CONTENT,
  },
  maskShowFullMessage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  messageTextContainer: {
    minWidth: MIN_WIDTH_MESSAGE,
    marginTop: -3,
    overflow: 'hidden',
  },

  titleMention: {
    fontWeight: '500',
    color: appConfig.colors.primary,
  },

  maskMessageAndroid: {
    width: '100%',
    height: 3,
    bottom: 0,
    position: 'absolute',
  },
});

const bubbleWrapperStyle = {
  left: styles.bubbleWrapper,
};

const bubbleContainerStyle = {
  left: styles.bubbleContainer,
};

class CustomBubble extends Component {
  static defaultProps = {
    seeMoreTitle: 'Xem thêm',
    isUpdate: true,
    onCustomBubbleLongPress: () => {},
  };
  unMounted = false;
  animatedHighlight = new Animated.Value(0);
  content = this.props.currentMessage?.content;
  truncatedContent = '';

  state = {
    isShowFullMessage: isShowFullContent(
      this.props?.currentMessage?.content,
      (truncatedContent) => (this.truncatedContent = truncatedContent),
    ),
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentMessage?.content !== this.content) {
      this.content = nextProps.currentMessage?.content;
      this.setState({
        isShowFullMessage: isShowFullContent(
          nextProps.currentMessage.content,
          (truncatedContent) => {
            this.truncatedContent = truncatedContent;
          },
        ),
      });
    }
    return true;
  }

  componentWillUnmount() {
    this.unMounted = true;
  }

  animateHighlight = () => {
    Animated.spring(this.animatedHighlight, {
      toValue: 1,
      speed: 1.5,
      useNativeDriver: true,
    }).start(() => {
      !this.unMounted && this.animatedHighlight.setValue(0);
    });
  };

  animatedStyle = {
    transform: [
      {
        scale: this.animatedHighlight.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.05, 1],
        }),
      },
    ],
  };

  get formattedCreated() {
    return getRelativeTime(this.props.currentMessage.created);
  }

  handlePressBubbleBottom = (type) => {
    this.props.onPressBubbleBottom(type, this.props.currentMessage);
  };

  handleSend = (image) => {
    this.props.onSendImage(image);
  };

  openFullMessage = () => {
    this.setState({isShowFullMessage: true});
  };

  isReplyingYourSelf(props) {
    return (
      props.currentMessage?.reply?.id === props.currentMessage?.user?.user_id
    );
  }

  renderMessageText = (props, bgColor) => {
    props.customTextStyle = styles.text;

    let content = !this.state.isShowFullMessage
      ? this.truncatedContent
      : props.currentMessage.content;

    if (!this.state.isShowFullMessage) {
      content = <Text style={styles.text}>{content}</Text>;
    }

    if (!this.isReplyingYourSelf(props) && props.currentMessage?.reply?.name) {
      content = (
        <>
          <TextPressable
            onPress={this.props.onPressRepliedUserName}
            style={styles.titleMention}>
            {props.currentMessage?.reply?.name}
          </TextPressable>{' '}
          <Text style={styles.text}>{content}</Text>
        </>
      );
    }
    props.currentMessage.text = content;

    return (
      <View style={styles.messageTextContainer}>
        {!this.state.isShowFullMessage && (
          <SeeMoreBtn
            title={this.props.seeMoreTitle}
            lineHeight={LINE_HEIGHT_OF_CONTENT}
            bgColor={bgColor}
            onPress={this.openFullMessage}
            containerStyle={styles.btnShowFullMessageContainer}
            titleStyle={styles.btnShowFullMessageTitle}
          />
        )}
        <MessageText {...props} currentMessage={{...props.currentMessage}} />
      </View>
    );
  };

  renderImages = (props, image) => {
    if (!image) return null;

    const aspectRatio =
      (props.currentMessage?.image_info?.width || 1) /
      (props.currentMessage?.image_info?.height || 1);

    const imageStyle = {
      aspectRatio,
    };
    return (
      <ImageMessageChat
        containerStyle={[styles.imageContainer, imageStyle]}
        uploadURL={props.uploadURL}
        isUploadData={props.currentMessage.isUploadData}
        image={props.currentMessage.rawImage}
        lowQualityUri={image}
        onUploadedSuccess={(response, isReUp) => {
          if (!isReUp) {
            this.handleSend({image: response.data?.name});
          }
          if (response.status !== STATUS_SUCCESS) {
            flashShowMessage({
              type: 'danger',
              message: response.message || this.props.t('api.error.message'),
            });
          }
        }}
        onUploadedFail={(err) => {
          console.log(err);
          flashShowMessage({
            type: 'danger',
            message: this.props.t('api.error.message'),
          });
        }}
        onLongPress={() => {
          props.onCustomBubbleLongPress(undefined, props.currentMessage);
        }}
      />
    );
  };

  renderBubbleBottom = (props) => {
    const message = props.isLoading
      ? props.loadingMessage
      : this.formattedCreated;
    return (
      <BubbleBottom
        isError={props.isError}
        isPending={props.isPending}
        pendingMessage={props.pendingMessage}
        bottomMainTitleStyle={props.messageBottomTitleStyle}
        isLoading={props.isLoading}
        message={message}
        isLiked={props.isLiked}
        totalReaction={props.totalReaction}
        onActionPress={(type) => this.handlePressBubbleBottom(type)}
      />
    );
  };

  render() {
    const {
      onPressBubbleBottom,
      onSendImage,
      refContentMessage,
      isHighlight,
      ...props
    } = this.props;
    // console.log('%crender bubble', 'color:yellow', props.currentMessage.id);

    const hasText = props.currentMessage.text;
    const bgColor = hasText
      ? isHighlight
        ? BG_HIGHLIGHT_COLOR
        : BG_COLOR
      : 'transparent';

    const wrapperStyle = {
      left: {
        ...bubbleWrapperStyle.left,
        backgroundColor: bgColor,
      },
    };

    return props.isEditing ? (
      <BubbleEditing
        value={props.currentMessage.content}
        onEdit={props.onEdit}
        onCancel={props.onCancelEdit}
      />
    ) : (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.container, this.animatedStyle]}>
          <Bubble
            {...props}
            renderMessageText={(props) =>
              this.renderMessageText(props, bgColor)
            }
            touchableProps={{
              onPress: () =>
                props.onCustomBubbleLongPress(undefined, props.currentMessage),
            }}
            onLongPress={props.onCustomBubbleLongPress}
            wrapperStyle={wrapperStyle}
            containerStyle={bubbleContainerStyle}
          />
          {this.renderImages(props, props.currentMessage.image)}
        </Animated.View>
        {this.renderBubbleBottom(props)}
      </View>
    );
  }
}

export default CustomBubble;
