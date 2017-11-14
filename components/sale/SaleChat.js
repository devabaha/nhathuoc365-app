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
import store from '../../store/Store';

@observer
export default class SaleChat extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      messages: null,
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getData = async (delay = 0) => {
    var {site_id, user_id} = store.cart_admin_data;

    try {
      var response = await ADMIN_APIHandler.site_load_chat(site_id, user_id);

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          messages: response.data.data,
          user_id: response.data.user_id
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  async _onSend(messages = []) {
    const {site_id, user_id} = store.cart_admin_data;

    const content = messages[0].text;

    try {
      var response = await ADMIN_APIHandler.site_send_chat(site_id, user_id, {
        content
      });

      if (response && response.status == STATUS_SUCCESS) {
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }));
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  render() {
    var { messages, user_id } = this.state;

    return (
      <View style={styles.container}>
        {messages ? (
          <GiftedChat
            messages={messages}
            placeholder="Nhập nội dung chat..."
            onSend={(msg) => this._onSend(msg)}
            user={{
              _id: user_id,
            }}
          />
        ) : (
          <Indicator size="small" />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
