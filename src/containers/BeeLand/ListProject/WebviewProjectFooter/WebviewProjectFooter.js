import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../../../components/Button';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 15
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    flex: 1,
    margin: 15,
    borderRadius: 8,
    ...elevationShadowStyle(7)
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
  onPhonePress = () => {},
  onChatPress = () => {},
  onCheckPress = () => {}
}) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Button
            title="Liên hệ"
            iconLeft={<Icon name="phone" style={styles.icon} />}
            containerStyle={styles.btnContainer}
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitle}
            onPress={onPhonePress}
          />
          <Button
            title="Chat tư vấn"
            iconLeft={<Icon name="message1" style={styles.icon} />}
            containerStyle={styles.btnContainer}
            btnContainerStyle={styles.btn}
            titleStyle={styles.btnTitle}
            onPress={onChatPress}
          />
        </View>

        <Button
          title="Check căn"
          iconLeft={<Icon name="home" style={styles.mainIcon} />}
          containerStyle={styles.mainBtnContainer}
          onPress={onCheckPress}
        />
      </View>
    </SafeAreaView>
  );
};

export default WebviewProjectFooter;
