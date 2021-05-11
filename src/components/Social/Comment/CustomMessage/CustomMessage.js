import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Message} from 'react-native-gifted-chat';
import CustomBubble from '../CustomBubble';

const styles = StyleSheet.create({
  messageContainer: {
    marginRight: 10,
    marginBottom: 2,
  },
});

const CustomMessage = ({
  refMessage,
  refContentMessage,
  onLayout = () => {},
  ...props
}) => {
  const {t} = useTranslation('social');
  props.renderBubble = () => (
    <CustomBubble t={t} ref={refContentMessage} {...props} />
  );
  props.containerStyle = {
    left: {
      ...styles.messageContainer,
      marginLeft: props.currentMessage.level * 45,
    },
  };
  return (
    <View ref={refMessage} onLayout={onLayout}>
      <Message {...props} />
    </View>
  );
};

export default React.memo(CustomMessage, () => true);
