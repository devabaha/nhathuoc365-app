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
import {Actions, ActionConst} from 'react-native-router-flux';
import store from '../../store/Store';

@observer
export default class SaleChat extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      messages: null,
    }

    this._lastID = 0;
  }

  componentDidMount() {
    this._getData();

    this._intervalLoads();

    Actions.refresh({
      onBack: () => {
        clearInterval(this._timerInterval);
        Actions.pop();
      }
    });
  }

  _intervalLoads() {
    this._timerInterval = setInterval(() => {
      if (this._loaded) {
        this._getData();
      }
    }, 3000);
  }

  _getData = async (delay = 0) => {
    this._loaded = false;
    var {site_id, user_id} = store.cart_admin_data;

    try {
      var response = await ADMIN_APIHandler.site_load_chat(site_id, user_id, this._lastID);

      if (response && response.status == STATUS_SUCCESS) {
        if (this.state.messages) {
          this._appendMessages(response.data.data, this._calculatorLastID);
        } else {
          this.setState({
            messages: response.data.data || [],
            user_id: response.data.user_id
          }, this._calculatorLastID);
        }
      }
    } catch (e) {
      console.warn(e + ' site_load_chat');

      store.addApiQueue('site_load_chat', this._getData);
    } finally {
      this._loaded = true;
    }
  }

  _appendMessages(messages, callback) {
    if (messages) {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), callback);
    }
  }

  _calculatorLastID = () => {
    var {messages} = this.state;

    if (messages && messages.length) {
      var lastObject = messages[0];
      this._lastID = lastObject._id;
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
        clearInterval(this._timerInterval);

        this._getData();

        this._intervalLoads();
      }
    } catch (e) {
      console.warn(e + ' site_send_chat');

      store.addApiQueue('site_send_chat', this._onSend.bind(this, messages));
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
