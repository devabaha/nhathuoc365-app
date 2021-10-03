import React, {useEffect, useReducer, useRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Message} from 'react-native-gifted-chat';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import CustomBubble from '../CustomBubble';

const styles = StyleSheet.create({
  messageContainer: {
    marginRight: 10,
    marginBottom: 2,
  },
  error: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.4,
  },
});

const CustomMessage = ({
  // refMessage,
  // refContentMessage,
  disabled,
  currentMessage,
  onLike,
  onReply,
  onDidMount,
  onLayout = () => {},
  onActiveEditMode = () => {},
  onCustomBubbleLongPress = () => {},
  ...props
}) => {
  const refMessage = useRef();
  const refContentMessage = useRef();
  const [{comment}, setState] = useReducer(
    (state, newState) => {
      return {...state, ...newState};
    },
    {
      comment: currentMessage,
    },
  );

  // console.log('%crender message', 'color:red', comment.like_flag);

  useEffect(() => {
    onDidMount(refMessage.current, comment);
  }, []);

  useEffect(() => {
    setState({comment: currentMessage});
  }, [currentMessage]);

  useEffect(() => {
    if (!!props.isEditing) {
      onActiveEditMode(refMessage.current);
    }
  }, [props.isEditing]);

  const handleLikeComment = () => {
    const currentLikeFlag = comment?.like_flag,
      currentLikeCount = comment?.like_count;

    const updateLikeFlag = currentLikeFlag ? 0 : 1;
    const updateLikeCount = updateLikeFlag
      ? currentLikeCount + 1
      : currentLikeCount - 1;

    const data = {
      object: comment?.like?.object,
      object_id: comment?.like?.object_id,
      site_id: comment.site_id,
      status: updateLikeFlag,
    };
    const updateComment = {
      ...comment,
      like_flag: updateLikeFlag,
      like_count: updateLikeCount,
    };

    setState({
      comment: updateComment,
    });

    onLike(data, () => {
      setState({
        comment: {
          ...comment,
          like_flag: currentLikeFlag,
          like_count: currentLikeCount,
        },
      });
    });
  };

  const handlePressBottomBubble = (type) => {
    switch (type) {
      case SOCIAL_BUTTON_TYPES.LIKE:
        handleLikeComment(comment);
        break;
      case SOCIAL_BUTTON_TYPES.REPLY:
        onReply(refMessage.current, refContentMessage.current, comment);
        break;
    }
  };

  const containerStyle = {
    left: {
      ...styles.messageContainer,
      marginLeft: comment.level * 45,
    },
  };

  const renderBubble = (bubbleProps) => {
    return (
      <CustomBubble
        seeMoreTitle={bubbleProps.seeMoreTitle}
        ref={refContentMessage}
        {...bubbleProps}
        isLoading={bubbleProps.isLoading}
        isHighlight={bubbleProps.isHighlight}
        isLiked={bubbleProps.currentMessage.like_flag}
        totalReaction={bubbleProps.currentMessage.like_count}
        isPending={bubbleProps.isPending}
        pendingMessage={bubbleProps.pendingMessage}
        loadingMessage={bubbleProps.loadingMessage}
        isError={bubbleProps.isError}
        isEditing={bubbleProps.isEditing}
        messageBottomTitleStyle={bubbleProps.messageBottomTitleStyle}
        uploadURL={bubbleProps.uploadURL}
        onPressBubbleBottom={handlePressBottomBubble}
        onSendImage={({image}) =>
          bubbleProps.onImageUploaded({...bubbleProps.currentMessage, image})
        }
        onCustomBubbleLongPress={(context, message) => {
          onCustomBubbleLongPress(
            context,
            message,
            refMessage.current,
            refContentMessage.current,
          );
        }}
      />
    );
  };

  return (
    <View
      ref={refMessage}
      onLayout={onLayout}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        disabled && styles.disabled,
        props.isError && !props.isEditing && styles.error,
      ]}>
      <Message
        {...props}
        currentMessage={comment}
        containerStyle={containerStyle}
        renderBubble={renderBubble}
        shouldUpdateMessage={(prevProps, nextProps) => {
          return (
            prevProps.currentMessage.like_flag !==
              nextProps.currentMessage.like_flag ||
            prevProps.currentMessage.like_count !==
              nextProps.currentMessage.like_count ||
            prevProps.uploadURL !== nextProps.uploadURL ||
            prevProps.isLoading !== nextProps.isLoading ||
            prevProps.seeMoreTitle !== nextProps.seeMoreTitle ||
            prevProps.isHighlight !== nextProps.isHighlight ||
            prevProps.isPending !== nextProps.isPending ||
            prevProps.pendingMessage !== nextProps.pendingMessage ||
            prevProps.isError !== nextProps.isError ||
            prevProps.isEditing !== nextProps.isEditing ||
            prevProps.disabled !== nextProps.disabled ||
            prevProps.loadingMessage !== nextProps.loadingMessage ||
            prevProps.messageBottomTitleStyle !==
              nextProps.messageBottomTitleStyle
          );
        }}
      />
    </View>
  );
};

export default React.memo(CustomMessage);
