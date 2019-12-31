import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
// librarys
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import APIHandler from '../../network/APIHandler';
import TickidChat from '../../packages/tickid-chat/container/TickidChat/TickidChat';
import RightButtonCall from '../RightButtonCall';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DELAY_GET_CONVERSATION = 2000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';

const MESSAGE_TYPES = {
  TEXT: MESSAGE_TYPE_TEXT,
  IMAGE: MESSAGE_TYPE_IMAGE
};

@observer
export default class Chat extends Component {
  static propTypes = {};
  static defaultProps = {
    phoneNumber: null
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: null,
      showImageGallery: false,
      editable: false,
      showImageBtn: true,
      showSendBtn: false,
      showBackBtn: false,
      selectedImages: [],
      uploadImages: [],
      user: this.user,
      phoneNumber: '',
      guestName: ''
    };

    this._lastID = 0;
    this.limit = 20;
    this.offset = 0;
    this.loadMore = false;
    this.unmounted = false;
    this.refListMessages = null;
    this.refGiftedChat = null;
    this.refTickidChat = null;
    this.source = null;
    this.isLoadFirstTime = true;
  }

  get user() {
    let _id = store.store_id;

    //specify for tick/tickid
    _id = store.user_info.id;

    return {
      _id,
      name: store.store_data.name,
      avatar: store.store_data.logo_url
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        right: this.renderRight.bind(this),
        left: () => (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={this.onBack.bind(this)}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10
              }}
            >
              <Icon name="ios-arrow-back" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        )
      });
    }, 100);

    this._getData();
  }

  renderRight() {
    return (
      <View style={{ flexDirection: 'row', marginRight: 5 }}>
        <RightButtonCall
          userName={this.state.guestName}
          tel={this.state.phoneNumber}
        />
      </View>
    );
  }

  onBack() {
    setTimeout(() => {
      Actions.pop();
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.source) {
      this.source.cancel();
    }
    clearTimeout(this.timerGetChat);
  }

  _getData = async (delay = 0) => {
    if (!this.unmounted) {
      this._loaded = false;
      let { site_id, user_id } = this.props;

      // specify for tick/tickid
      const main_user = user_id;
      user_id = 0;
      // end specification

      try {
        const [source, callable] = APIHandler.site_load_conversation(
          site_id,
          user_id,
          this._lastID
        );
        this.source = source;
        const response = await callable();

        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS && response.data) {
            if (response.data.receiver) {
              this.setState({
                phoneNumber: response.data.receiver.phone,
                guestName: response.data.receiver.name
              });
              Actions.refresh({
                right: this.renderRight.bind(this)
              });
            }
            if (response.data.list) {
              if (this.state.messages) {
                this._appendMessages(
                  response.data.list,
                  this._calculatorLastID
                );
              } else {
                this.setState(
                  {
                    messages: response.data.list,
                    user_id: main_user
                  },
                  this._calculatorLastID
                );
              }
            }
          } else if (this.isLoadFirstTime) {
            this.setState({
              messages: [],
              user_id: main_user
            });
          }
          this.timerGetChat = setTimeout(
            () => this._getData(),
            DELAY_GET_CONVERSATION
          );
        }
      } catch (e) {
        console.warn(e + ' site_load_chat');

        store.addApiQueue('site_load_chat', this._getData);
      } finally {
        this.isLoadFirstTime = false;
        this._loaded = true;
      }
    }
  };

  _appendMessages(messages, callback, isAppendDirectly = false) {
    const newMessages = [...this.state.messages];
    messages.forEach(message => {
      if (message.user._id !== this.state.user_id || isAppendDirectly) {
        newMessages.unshift(message);
      }
    });
    if (newMessages !== this.state.messages) {
      this.setState(
        {
          messages: newMessages
        },
        () => {
          callback();
        }
      );
    }
  }

  _calculatorLastID = () => {
    const { messages } = this.state;

    if (messages && messages.length) {
      const lastObject = messages[0];
      this._lastID = lastObject._id;
    }
  };

  // handleSendImage(response) {
  //   if (this.refTickidChat) {
  //     this.refTickidChat.clearSelectedPhotos();
  //   }
  //   if (response.status === STATUS_SUCCESS && response.data) {
  //     this._appendMessages(
  //       this.getFormattedMessage(MESSAGE_TYPE_IMAGE, response.data.url),
  //       () => {},
  //       true
  //     );
  //     this._onSend({ image: response.data.name });
  //   }
  // }

  handleSendImage(images) {
    if (Array.isArray(images) && images.length !== 0) {
      const message = this.getFormattedMessage(
        MESSAGE_TYPE_IMAGE,
        images[0].path
      );
      message[0].rawImage = images[0];
      this._appendMessages(
        message,
        () => {
          const restImages = images.slice(1);
          if (Array.isArray(restImages) && restImages.length !== 0) {
            this.handleSendImage(restImages);
          }
        },
        true
      );
    }
  }

  handleSendText(message) {
    this._appendMessages(
      this.getFormattedMessage(MESSAGE_TYPE_TEXT, message),
      () => {},
      true
    );
    this._onSend({ message });
  }

  getFormattedMessage(type, message) {
    const formattedMessage = {
      _id: String(new Date().getTime()),
      createdAt: new Date(),
      user: { ...this.state.user }
    };
    switch (type) {
      case MESSAGE_TYPE_TEXT:
        formattedMessage.text = message;
        break;
      case MESSAGE_TYPE_IMAGE:
        formattedMessage.image = message;
        formattedMessage.isUploadData = true;
        break;
    }
    return [formattedMessage];
  }

  async _onSend(message) {
    let { site_id, user_id } = this.props;

    // specify for tick/tickid
    user_id = '';

    try {
      const response = await APIHandler.site_send_message(site_id, user_id, {
        ...message
      });
      if (response && response.status == STATUS_SUCCESS) {
      }
    } catch (e) {
      console.warn(e + ' site_send_chat');

      store.addApiQueue('site_send_chat', this._onSend.bind(this, messages));
    } finally {
    }
  }

  render() {
    const { messages, user_id } = this.state;

    return messages !== null ? (
      <TickidChat
        setHeader={this.props.setHeader}
        ref={inst => (this.refTickidChat = inst)}
        refGiftedChat={inst => (this.refGiftedChat = inst)}
        refListMessages={inst => (this.refListMessages = inst)}
        uploadURL={APIHandler.url_user_upload_image()}
        messages={this.state.messages}
        defaultStatusBarColor={appConfig.colors.primary}
        onSendText={this.handleSendText.bind(this)}
        onSendImage={this.handleSendImage.bind(this)}
        onUploadedImage={response =>
          this._onSend({ image: response.data.name })
        }
        // expandedGallery={() => Actions.refresh({ hideNavBar: true })}
        // collapsedGallery={() => Actions.refresh({ hideNavBar: false })}
        // onScrollOffsetTop={this.handleLoadEarlierMessages.bind(this)} -- error, still bug because of scrollToBottom GiftedChat
        defaultStatusBarColor={appConfig.colors.primary}
        giftedChatProps={{
          user: {
            _id: user_id
          }
        }}
      />
    ) : (
      <View style={styles.container}>
        <Indicator size="small" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
