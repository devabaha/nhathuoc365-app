import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import BubbleBottom from '../BubbleBottom';
import {Bubble, MessageText} from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';

import appConfig from 'app-config';
import store from 'app-store';

import {ActionBtn} from '../BubbleBottom';
import {IMAGE_COMMENT_HEIGHT} from 'src/constants/social/comments';

const BG_COLOR = '#f0f1f4';
const BG_HIGHLIGHT_COLOR = '#c9cbd0';

const MAX_LENGTH_TEXT = 50;
const LINE_HEIGHT = 25;
const MAX_COLLAPSED_HEIGHT = LINE_HEIGHT * 2.1;

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
    flex: 0,
  },
  imageContainer: {
    borderRadius: 15,
  },
  btnShowFullMessage: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    paddingRight: 15,
  },
  labelShowFulMessage: {
    color: '#777',
    paddingLeft: 10,
  },
  maskShowFullMessage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  messageTextContainer: {
    marginTop: -5,
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
    fontSize: 16,
    color: appConfig.colors.primary,
  },
  maskMention: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.28),
    width: '110%',
    height: '110%',
    left: '-5%',
    top: '-5%',
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
  };
  unMounted = false;
  animatedHighlight = new Animated.Value(0);

  state = {
    isShowFullMessage:
      this.props?.currentMessage?.content?.length <= MAX_LENGTH_TEXT,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.forceRender !== undefined){
      return nextProps.forceRender;
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
    return moment(
      this.props.currentMessage.created,
      'YYYY-MM-DD HH:mm:ss',
    ).fromNow();
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
    props.textStyle = {
      lineHeight: LINE_HEIGHT,
    };

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
          <Text>{props.currentMessage.content}</Text>
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
          },
        ]}>
        <MessageText {...props} />

        {!this.state.isShowFullMessage && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.btnShowFullMessage}
            onPress={this.openFullMessage}>
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
        )}
      </View>
    );
  };

  renderImages = (props, image) => {
    if (!image) return null;
    const imageStyle = {
      borderWidth: 0.5,
      borderColor: '#ddd',
      height: IMAGE_COMMENT_HEIGHT,
      width:
        IMAGE_COMMENT_HEIGHT *
        ((props.currentMessage?.image_info?.width || 0) /
          (props.currentMessage?.image_info?.height || 1)),
    };
    return (
      <ImageMessageChat
        containerStyle={[styles.imageContainer, imageStyle]}
        uploadURL={props.uploadUrl}
        isUploadData={props.currentMessage.isUploadData}
        image={props.currentMessage.rawImage}
        lowQualityUri={image}
        onUploadedSuccess={(response, isReUp) => {
          if (!isReUp) {
            this.handleSend({image: response.data.name});
          }
        }}
        onUploadedFail={(err) => {
          console.log(err);
        }}
      />
    );
  };

  renderBubbleBottom = (props) => {
    return (
      <BubbleBottom
        created={this.formattedCreated}
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

    const hasText = props.currentMessage.text;
    const bgColor = hasText
      ? isHighlight
        ? BG_HIGHLIGHT_COLOR
        : BG_COLOR
      : 'transparent';
    console.log(props.currentMessage.id)

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
