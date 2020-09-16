import React from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import Communications from 'react-native-communications';
import Icon from 'react-native-vector-icons/AntDesign';

import Button from '../../../../components/Button';
import {
  servicesHandler,
  SERVICES_TYPE
} from '../../../../helper/servicesHandler';

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    ...elevationShadowStyle(7, 0, -2)
  },
  box: {
    flex: 1,
    flexDirection: 'row'
  },
  icon: {
    fontSize: 20
  },
  btnContainer: {
    flex: 1,
    width: undefined,
    paddingHorizontal: 5,
    paddingVertical: 0
  },
  btn: {
    width: undefined,
    backgroundColor: 'transparent',
    flexDirection: 'column'
  },
  btnTitle: {
    fontSize: 10,
    marginTop: 10,
    color: '#333'
  },
  mainIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 7
  },
  mainBtnContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingVertical: 0
  }
});

const WebviewProjectFooter = ({
  submitIconName = 'home',
  phoneTitle = 'Liên hệ',
  chatTitle = 'Chat tư vấn',
  submitTitle = 'Check căn',
  tel,
  siteId,
  name,
  userId,
  onChatPress,
  onPhonePress = () => {},
  onCheckPress = () => {}
}) => {
  function handlePhone() {
    !!tel && Communications.phonecall(tel, true);
    onPhonePress();
  }

  function handleChat() {
    if (!siteId || !userId) {
      return;
    }
    if (onChatPress) {
      onChatPress();
    } else {
      const service = {
        type: SERVICES_TYPE.BEEHOME_ROOM_CHAT,
        user_id: userId,
        site_id: siteId,
        tel,
        site_name: name
      };

      servicesHandler(service);
    }
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Button
            title={phoneTitle}
            iconLeft={<Icon name="phone" style={styles.icon} />}
            containerStyle={styles.btnContainer}
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitle}
            onPress={handlePhone}
          />
          <Button
            title={chatTitle}
            iconLeft={<Icon name="message1" style={styles.icon} />}
            containerStyle={styles.btnContainer}
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitle}
            onPress={handleChat}
          />
        </View>

        <Button
          title={submitTitle}
          iconLeft={<Icon name={submitIconName} style={styles.mainIcon} />}
          containerStyle={styles.mainBtnContainer}
          onPress={onCheckPress}
        />
      </View>
    </SafeAreaView>
  );
};

export default WebviewProjectFooter;
