import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class Actions extends PureComponent {
  state = {};

  renderActions() {
    const LIST_ACTION = [
      {
        icon: 'filetext1',
        title: 'Hóa đơn',
        onPress: this.props.onBillPress
      },
      {
        icon: 'mail',
        title: 'Phản ánh',
        onPress: this.props.onRequestPress,
        style: styles.middle
      },
      {
        icon: 'message1',
        title: 'Chat BQL',
        onPress: this.props.onChatPress
      }
    ];

    return LIST_ACTION.map((action, index) => (
      <TouchableHighlight
        key={index}
        underlayColor="#eee"
        onPress={action.onPress}
        style={[styles.action, action.style]}
      >
        <>
          <Icon name={action.icon} style={styles.icon} />
          <Text style={styles.actionTitle}>{action.title}</Text>
        </>
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
  actionTitle: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500'
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
  }
});

export default Actions;
