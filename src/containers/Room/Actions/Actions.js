import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import { NotiBadge } from '../../../components/Badges';

class Actions extends PureComponent {
  state = {};

  renderActions() {
    const LIST_ACTION = [
      {
        icon: 'file-text',
        title: 'Hóa đơn',
        onPress: this.props.onBillPress
      },
      {
        icon: 'mail',
        title: 'Phản ánh',
        onPress: this.props.onRequestPress,
        style: styles.middle,
        notify: this.props.requestNoti
      },
      {
        icon: 'users',
        title: 'Thành viên',
        onPress: this.props.onMemberPress,
        style: styles.right
      },
      {
        icon: 'message-circle',
        title: 'Chat BQL',
        onPress: this.props.onChatPress,
        notify: this.props.chatNoti
      }
    ];

    return LIST_ACTION.map((action, index) => (
      <TouchableHighlight
        key={index}
        underlayColor="#eee"
        onPress={action.onPress}
        style={[styles.action, action.style]}
      >
        <View style={styles.actionWrapper}>
          <Icon name={action.icon} style={styles.icon} />
          <Text style={styles.actionTitle}>{action.title}</Text>
          <NotiBadge label={action.notify} show={!!action.notify} animation/>
        </View>
      </TouchableHighlight>
    ));
  }

  render() {
    return (
      <View
        onLayout={this.props.onLayout}
        style={[styles.container, this.props.style]}
      >
        {this.renderActions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  action: {
    flex: 1,
    padding: 5,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionTitle: {
    fontSize: 15,
    color: '#555',
    fontWeight: appConfig.device.isIOS ? '500' : '400',
    textAlign: 'center'
  },
  icon: {
    fontSize: 26,
    color: '#555',
    marginBottom: 5
  },
  middle: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#ddd'
  },
  right: {
    borderRightWidth: 0.5,
    borderColor: '#ddd'
  }
});

export default Actions;
