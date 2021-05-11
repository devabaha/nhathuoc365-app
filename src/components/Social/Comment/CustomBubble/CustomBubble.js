import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, TouchableOpacity} from 'react-native';
import moment from 'moment';

import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import BubbleBottom from '../BubbleBottom';
import {Bubble, MessageText} from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';

import store from 'app-store';

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
    right: 15,
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
});

const bubbleWrapperStyle = {
  left: styles.bubbleWrapper,
};

const bubbleContainerStyle = {
  left: styles.bubbleContainer,
};

class CustomBubble extends Component {
  unMounted = false;
  animatedHighlight = new Animated.Value(0);

  state = {
    isShowFullMessage:
      this.props?.currentMessage?.text?.length <= MAX_LENGTH_TEXT,
  };

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

  renderMessageText = (props, bgColor) => {
    props.textStyle = {
      lineHeight: LINE_HEIGHT,
    };

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
              ... {this.props.t('seeMore')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderImages = (props, image) => {
    if (!image) return null;
    return (
      <ImageMessageChat
        containerStyle={styles.imageContainer}
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
        isLiked={false}
        onActionPress={(type) => this.handlePressBubbleBottom(type)}
      />
    );
  };

  render() {
    const {
      onPressBubbleBottom,
      onSendImage,
      refContentMessage,
      ...props
    } = this.props;
    const highlightStyle =
      store.replyingComment?.id === props.currentMessage.id;
    const hasText = props.currentMessage.text;
    const bgColor = hasText
      ? highlightStyle
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

export default observer(CustomBubble);
