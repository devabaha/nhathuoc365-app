import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';

// librarys
import { GiftedChat } from 'react-native-gifted-chat';

export default class SaleChat extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      messages: [
        {
          _id: 3,
          text: 'This is a system message',
          createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
          system: true,
          // Any additional custom parameters are passed through
        },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t1.0-9/22815235_1302219029924435_8143315674876846694_n.jpg?oh=ee659e31b1cfc0659f5da7e6eadcf91d&oe=5AA4473E',
          },
        },
        {
          _id: 1,
          text: 'Hello developer 2',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://scontent.fhan4-1.fna.fbcdn.net/v/t1.0-9/22815235_1302219029924435_8143315674876846694_n.jpg?oh=ee659e31b1cfc0659f5da7e6eadcf91d&oe=5AA4473E',
          },
        }
      ],
    }
  }

  static onEnter = () => {

  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    var {stores} = this.state;

    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          placeholder="Nhập nội dung chat..."
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
