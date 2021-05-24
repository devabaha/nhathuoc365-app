import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, TouchableOpacity} from 'react-native';

import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import BubbleBottom from '../BubbleBottom';
import {Bubble, MessageText} from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';

import appConfig from 'app-config';
import store from 'app-store';

import {ActionBtn} from '../BubbleBottom';
import {IMAGE_COMMENT_HEIGHT} from 'src/constants/social/comments';
import {getRelativeTime} from 'app-helper/social';

const BG_COLOR = '#f0f1f4';
const BG_HIGHLIGHT_COLOR = '#c9cbd0';

const CHARACTER_PER_LINE = 40;
const LINE_HEIGHT = 21;
const MAX_LINE = 8;
const MAX_NUM_OF_BREAK_LINE = 5;
const MAX_LENGTH_TEXT = CHARACTER_PER_LINE * MAX_LINE;
const MAX_COLLAPSED_HEIGHT =
  LINE_HEIGHT * MAX_LINE + (appConfig.device.isIOS ? LINE_HEIGHT : 10);

const SHOW_FULL_MESSAGE_TOP_SPACING =
  MAX_COLLAPSED_HEIGHT -
  LINE_HEIGHT -
  (appConfig.device.isIOS ? LINE_HEIGHT : 10) +
  5.5;

const MIN_WIDTH_MESSAGE = 120;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingBottom: 10,
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
    position: 'absolute',
    minWidth: MIN_WIDTH_MESSAGE,
    width: '100%',
    alignItems: 'flex-end',
    top: SHOW_FULL_MESSAGE_TOP_SPACING,
    zIndex: 1,
  },
  btnShowFullMessage: {
    right: 0,
    borderBottomRightRadius: 15,
  },
  text: {
    lineHeight: LINE_HEIGHT,
    color: '#242424',
    fontSize: 15,
  },
  labelShowFulMessage: {
    color: '#777',
    paddingLeft: 20,
    paddingRight: 15,
    lineHeight: LINE_HEIGHT,
  },
  maskShowFullMessage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  messageTextContainer: {
    marginTop: -3,
    overflow: 'hidden',
  },

  containerMention: {
    marginRight: 0,
  },
  contentMention: {
    flex: 0,
    bottom: -3,
    marginRight: 7,
  },
  titleMention: {
    fontWeight: '500',
    fontSize: 15,
    color: appConfig.colors.primary,
  },
  maskMention: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.28),
    width: '110%',
    height: '110%',
    left: '-5%',
    top: '-5%',
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
  };
  unMounted = false;
  animatedHighlight = new Animated.Value(0);

  state = {
    isShowFullMessage: this.isShowFullMessage,
  };

  get isShowFullMessage() {
    const currentMessage = this.props?.currentMessage?.content;
    if (currentMessage) {
      const numOfBreakIos = currentMessage.split('\r')?.length;
      const numOfBreakAndroid = currentMessage.split('\n')?.length;

      return (
        currentMessage.length <= MAX_LENGTH_TEXT &&
        numOfBreakIos <= MAX_NUM_OF_BREAK_LINE &&
        numOfBreakAndroid <= MAX_NUM_OF_BREAK_LINE
      );
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

    if (!this.isReplyingYourSelf(props) && props.currentMessage?.reply?.name) {
      props.currentMessage.text = (
        <>
          <Text>
            <ActionBtn
              title={props.currentMessage.reply.name}
              style={styles.containerMention}
              contentStyle={styles.contentMention}
              titleStyle={styles.titleMention}
              maskStyle={styles.maskMention}
              onPress={() => {}}
            />
          </Text>
          <Text style={styles.text}>{props.currentMessage.content}</Text>
        </>
      );
    }

    return (
      <View
        style={[
          styles.messageTextContainer,
          {
            maxHeight: this.state.isShowFullMessage
              ? undefined
              : MAX_COLLAPSED_HEIGHT,
            minWidth: this.state.isShowFullMessage
              ? undefined
              : MIN_WIDTH_MESSAGE,
          },
        ]}>
        {!this.state.isShowFullMessage && (
          <View style={styles.btnShowFullMessageContainer}>
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              activeOpacity={0.9}
              onPress={this.openFullMessage}
              style={styles.btnShowFullMessage}>
              <LinearGradient
                style={styles.maskShowFullMessage}
                colors={[hexToRgbA(bgColor, 1), hexToRgbA(bgColor, 0)]}
                locations={[0.75, 1]}
                angle={-90}
                useAngle
              />
              <Text style={styles.labelShowFulMessage}>
                ... {this.props.seeMoreTitle}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <MessageText {...props} />

        {appConfig.device.isAndroid && (
          <View
            style={[
              styles.maskMessageAndroid,
              {
                backgroundColor: bgColor,
              },
            ]}
          />
        )}
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
    console.log('%crender bubble', 'color:yellow', props.currentMessage.id);

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

    return (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.container, this.animatedStyle]}>
          <Bubble
            {...props}
            renderMessageText={(props) =>
              this.renderMessageText(props, bgColor)
            }
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
