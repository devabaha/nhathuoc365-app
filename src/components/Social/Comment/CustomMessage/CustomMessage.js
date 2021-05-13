import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Message} from 'react-native-gifted-chat';

const styles = StyleSheet.create({
  messageContainer: {
    marginRight: 10,
    marginBottom: 2,
  },
  error: {
    opacity: .6
  }
});

const CustomMessage = ({
  refMessage,
  refContentMessage,
  isError,
  onLayout = () => {},
  ...props
}) => {

  props.containerStyle = {
    left: {
      ...styles.messageContainer,
      marginLeft: props.currentMessage.level * 45,
    },
  };

  return (
    <View ref={refMessage} onLayout={onLayout} style={isError && styles.error}>
      <Message {...props} />
    </View>
  );
};

export default React.memo(CustomMessage);
