import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';

const styles = StyleSheet.create({
  notifyContainer: {
    backgroundColor: '#252325',
    opacity: 0.95,
    width: appConfig.device.width / 2.4,
    height: appConfig.device.width / 2.4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: appConfig.device.isAndroid ? -2 : 0,
    paddingVertical: 10,
  },
  notifyMessage: {
    color: '#c1c1c2',
    fontSize: 20,
    fontWeight: '600',
    paddingVertical: 5,
    textAlign: 'center',
  },
});

export function showFlashNotification(message) {
  flashShowMessage({
    message: '',
    position: 'center',
    titleStyle: {
      height: 0,
    },
    style: styles.notifyContainer,
    renderCustomContent: () => <FlashNotification notiMessage={message} />,
  });
}

const FlashNotificationComponent = ({notiMessage}) => {
  return (
    <View style={styles.contentContainer}>
      <Icon name="check" size={appConfig.device.width / 5} color="#c1c1c2" />
      <Text style={styles.notifyMessage}>{notiMessage}</Text>
    </View>
  );
};
const FlashNotification = React.memo(FlashNotificationComponent);
