import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from 'src/components/Button';
import SVGPhone from 'src/images/phone.svg';
import SVGChat from 'src/images/chat.svg';

class ComboButton extends Component {
  state = {};
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Button
          onPress={this.props.onCall}
          title="Gọi trực tiếp"
          containerStyle={styles.btnContainer}
          btnContainerStyle={[styles.btnContent, styles.btnCall]}
          titleStyle={styles.btnTitle}
          iconLeft={
            <SVGPhone style={styles.icon} width={20} height={20} fill="#fff" />
          }
        />
        <Button
          onPress={this.props.onChat}
          title="Chat kết nối"
          containerStyle={styles.btnContainer}
          btnContainerStyle={[styles.btnContent]}
          titleStyle={styles.btnTitle}
          iconLeft={
            <SVGChat style={styles.icon} width={20} height={20} fill="#fff" />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  btnContainer: {
    width: null,
    flex: 1
  },
  btnContent: {
    paddingVertical: 12
  },
  btnCall: {
    backgroundColor: '#03ac12'
  },
  icon: {
    marginRight: 7
  },
  btnTitle: {
    fontSize: 14
  }
});

export default ComboButton;
