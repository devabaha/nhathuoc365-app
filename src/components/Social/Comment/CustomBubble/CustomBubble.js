import React, {Component, useCallback, useMemo} from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import moment from 'moment';

import {ImageMessageChat} from 'app-packages/tickid-chat/component';
import BubbleBottom from '../BubbleBottom';
import {Bubble} from 'react-native-gifted-chat';

import store from 'app-store';

const BG_COLOR = "#f0f1f4";
const BG_HIGHLIGHT_COLOR = "#c9cbd0";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginBottom: 15,
  },
  container: {
    flex: 1,
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

  componentWillUnmount() {
    this.unMounted = true;
  }

  animateHighlight = () => {
    Animated.spring(this.animatedHighlight, {
      toValue: 1,
      speed: 2,
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
          outputRange: [1, 1.03, 1],
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

    const wrapperStyle = {
      left: {
        ...bubbleWrapperStyle.left,
        backgroundColor: hasText
          ? highlightStyle
            ? BG_HIGHLIGHT_COLOR
            : BG_COLOR
          : 'transparent',
      },
    };
    return (
      <View style={styles.wrapper}>
        <Animated.View style={[styles.container, this.animatedStyle]}>
          <Bubble
            {...props}
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
