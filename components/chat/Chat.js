/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  TextInput,
  Keyboard,
  ScrollView
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { FormInput } from '../../lib/react-native-elements';
import store from '../../store/Store';
import {reaction} from 'mobx';

@observer
export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bottom: 0,
      content: '',
      store_id: props.store_id,
      data: null,
      loading: true
    }

    reaction(() => 1, () => {

    });

    this.last_item_id = '';

    this._getData = this._getData.bind(this);
    this._scrollToEnd = this._scrollToEnd.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide.bind(this));

    Actions.refresh({
      onBack: () => {
        Keyboard.dismiss();

        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();

        Actions.pop();
      }
    })
  }

  _keyboardWillShow(e) {
    if (e) {
      this.setState({
        bottom: e.endCoordinates.height
      }, this._scrollToEnd);
    }
  }

  _keyboardWillHide(e) {
    if (e) {
      this.setState({
        bottom: 0
      }, this._scrollToEnd);
    }
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      var response = await APIHandler.site_load_chat(this.state.store_id, this.last_item_id);

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          var data = response.data.reverse();

          this.setState({
            data: this.state.data != null ? [...this.state.data, ...data] : data,
            loading: false
          }, this._scrollToEnd);
        } else {
          this.setState({
            data: [],
            loading: false
          }, this._scrollToEnd);
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _scrollToEnd() {
    clearTimeout(this._scrollDelay);

    this._scrollDelay = setTimeout(() => {
      if (this.refs_chat) {
        this.refs_chat.scrollToEnd({
          animated: true
        });
      }
    }, 300);
  }

  async _onSubmit() {
    if (!this.state.content) {
      return;
    }

    try {
      var response = await APIHandler.site_send_chat(this.state.store_id, {
        content: this.state.content
      });

      if (response && response.status == STATUS_SUCCESS) {
        this._getData();

        this.setState({
          content: ''
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  render() {
    var {data, loading} = this.state;

    if (loading) {
      return <Indicator />
    }

    this.last_admin_id = undefined;

    return (
      <View style={styles.container}>

        <View style={styles.chat_wrapper}>

          {data != null && <FlatList
            ref={ref => this.refs_chat = ref}
            style={{
              marginBottom: 42 + this.state.bottom
            }}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            data={data}
            extraData={this.state}
            renderItem={({item, index}) => {

              // show avatar logic
              let just_user = item.admin_id === this.last_admin_id;
              if (!just_user) {
                this.last_admin_id = item.admin_id;
              }

              // fixed
              just_user = false;

              // marginTop for last item
              let last_item = this.state.data.length - 1 == index;

              this.last_item_id = item.id;

              if (item.admin_id == 0) {
                return (
                  <View style={styles.chat_parent_right}>
                    <View style={[styles.chat_box_item, styles.chat_box_item_right, {
                      // marginTop: !just_user ? 12 : 6
                    }]}>
                      <View style={styles.chat_box_avatar}>
                        {!just_user && (
                          <Image style={styles.chat_avatar} source={{uri: item.user_logo}} />
                        )}
                      </View>

                      <View style={[styles.chat_content, styles.chat_content_right]}>
                        <Text style={styles.chat_content_text}>{item.content}</Text>
                      </View>
                    </View>

                    {last_item && (
                      <View style={{
                        height: 8,
                        width: '100%'
                      }} />
                    )}
                  </View>
                );
              } else {
                return (
                  <View style={styles.chat_parent_left}>
                    <View style={[styles.chat_box_item, styles.chat_box_item_left, {
                      // marginTop: !just_user ? 12 : 6
                    }]}>
                      <View style={styles.chat_box_avatar}>
                        {!just_user && (
                          <Image style={styles.chat_avatar} source={{uri: item.site_logo}} />
                        )}
                      </View>

                      <View style={[styles.chat_content, styles.chat_content_left]}>
                        <Text style={styles.chat_content_text}>{item.content}</Text>
                      </View>
                    </View>

                    {last_item && (
                      <View style={{
                        height: 8,
                        width: '100%'
                      }} />
                    )}
                  </View>
                );
              }
            }}
            keyExtractor={item => item.id}
          />}

        </View>

      <View style={[styles.chat_input_box, {
        bottom: this.state.bottom
      }]}>
        <FormInput
          inputStyle={styles.chat_input}
          containerStyle={styles.chat_input_container}
          maxLength={300}
          value={this.state.content}
          onChangeText={(content) => this.setState({content})}
          placeholder="Nhập tin nhắn"
          />

          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._onSubmit.bind(this)}
            style={styles.chat_input_submit}>
            <Icon  name="send" size={24} color={this.state.content ? DEFAULT_COLOR : "#cccccc"} />
          </TouchableHighlight>
      </View>
      </View>
    );
  }
}

Chat.PropTypes = {
  store_id: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },

  chat_parent_left: {
    width: '100%',
    alignItems: 'flex-start'
  },
  chat_parent_right: {
    width: '100%',
    alignItems: 'flex-end'
  },
  chat_box_item: {
    width: '80%',
    flexDirection: 'row',
    paddingLeft: 15,
    marginTop: 4,
  },
  chat_box_item_right: {
    flexDirection: 'row-reverse'
  },
  chat_box_avatar: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  chat_avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 15
  },
  chat_content: {
    borderRadius: 5,
    overflow: 'hidden'
  },
  chat_content_left: {
    backgroundColor: "#ffffff",
    marginLeft: 8
  },
  chat_content_right: {
    marginRight: 8,
    backgroundColor: hexToRgbA(DEFAULT_COLOR, 0.5)
  },
  chat_content_text: {
    fontSize: 14,
    color: "#000000",
    paddingVertical: 8,
    paddingHorizontal: 8,
    lineHeight: 18
  },

  chat_input_box: {
    backgroundColor: "#ffffff",
    position: 'absolute',
    right: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: "#ebebeb"
  },
  chat_input: {
    width: '100%',
    borderColor: '#606060',
    fontSize: 14
  },
  chat_input_container: {
    borderBottomWidth: 0,
    height: 42,
    justifyContent: "center",
    width: Util.size.width - 68
  },
  chat_input_submit: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
