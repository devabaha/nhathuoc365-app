import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
// librarys
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';
import TickidChat from '../../packages/tickid-chat/container/TickidChat/TickidChat';
import RightButtonCall from '../RightButtonCall';
import { servicesHandler } from '../../helper/servicesHandler';
import { languages } from '../../i18n/constants';
import { APIRequest } from '../../network/Entity';
import EventTracker from '../../helper/EventTracker';

const DELAY_GET_CONVERSATION = 2000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';
const UPLOAD_URL = APIHandler.url_user_upload_image();

class Chat extends Component {
  static propTypes = {};
  static defaultProps = {
    phoneNumber: null
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: null,
      site: {},
      pinNotify: 0,
      pinListNotify: {},
      pinList: null,
      showImageGallery: false,
      editable: false,
      showImageBtn: true,
      showSendBtn: false,
      showBackBtn: false,
      selectedImages: [],
      uploadImages: [],
      user: this.user,
      user_id: '',
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
    this.isLoadFirstTime = true;
    this.giftedChatExtraProps = {};

    this.getMessagesAPI = new APIRequest();

    this.eventTracker = new EventTracker();
  }

  get giftedChatProps() {
    this.giftedChatExtraProps.user = { _id: this.state.user_id };
    this.giftedChatExtraProps.locale =
      languages[this.props.i18n.language].locale;

    return this.giftedChatExtraProps;
  }

  get user() {
    let _id = store.store_id;

    //specify for tick/quan_ly_cua_hang
    // _id = this.props.site_id;
    //specify for tick/tickid
    _id = this.props.user_id;

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

  i = 0;
  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        right: this.renderRight.bind(this),
        onBack: this.onBack.bind(this)
      });
    });
    // setInterval(() => {
    //   this.i++;
    //   this.setState({
    //     pinNotify: this.i % 2 ===0 ? 1 : 0,
    //     pinListNotify: {
    //       ORDERS_TYPE: this.i % 2 ===0 ? 1 : 0,
    //     }
    //   })
    // }, 3000)
    this._getMessages();
    this._getPinList();
    this.eventTracker.logCurrentView();
  }

  renderRight = (tel = this.state.phoneNumber) => {
    return (
      <View style={{ flexDirection: 'row', marginRight: 5 }}>
        <RightButtonCall userName={this.state.guestName} tel={tel} />
      </View>
    );
  };

  onBack() {
    if (this.props.fromSearchScene) {
      Actions.replace(`${appConfig.routes.listChat}_1`);
    } else {
      Actions.pop();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.getMessagesAPI.cancel();
    clearTimeout(this.timerGetChat);
    this.eventTracker.clearTracking();
  }

  _getPinList = async (delay = 0) => {
    if (!this.unmounted) {
      let { site_id, user_id } = this.props;

      try {
        const response = await APIHandler.site_pin_list(site_id);
        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS && response.data) {
            this.setState(prevState => ({
              pinList: response.data.pin_list
                ? response.data.pin_list
                : prevState.pinList,
              site: response.data.site ? response.data.site : prevState.site
            }));
          }
        }
      } catch (e) {
        console.warn(e + ' site_pin_list');

        store.addApiQueue('site_pin_list', this._getPinList);
      }
    }
  };

  _getMessages = async (delay = 0) => {
    let { site_id, user_id } = this.props;

    //specify for tick/quan_ly_cua_hang
    // const main_user = site_id;
    //specify for tick/tickid
    const main_user = user_id;
    user_id = 0;

    try {
      this.getMessagesAPI.data = APIHandler.site_load_conversation(
        site_id,
        user_id,
        this._lastID
      );

      const response = await this.getMessagesAPI.promise();
      if (response && response.status == STATUS_SUCCESS && response.data) {
        if (response.data.receiver) {
          if (this.state.phoneNumber !== response.data.receiver.phone) {
            Actions.refresh({
              right: this.renderRight(response.data.receiver.phone)
            });
          }
          this.setState({
            phoneNumber: response.data.receiver.phone,
            guestName: response.data.receiver.name
          });
        }
        if (response.data.list) {
          if (this.state.messages) {
            this._appendMessages(response.data.list);
          } else {
            this.setState({
              messages: response.data.list,
              user_id: main_user
            });
          }
          this._calculatorLastID(response.data.list);
        }
        if (response.data.pin_notify) {
          this.setState({
            pinNotify: response.data.pin_notify
          });
        }
        if (response.data.pin_list_notify) {
          const condition =
            JSON.stringify(response.data.pin_list_notify) !==
            JSON.stringify(this.state.pinListNotify);

          if (condition) {
            this.setState({
              pinListNotify: response.data.pin_list_notify
            });
          }
        }
      } else if (this.isLoadFirstTime) {
        this.setState({
          messages: [],
          user_id: main_user
        });
      }
      this.timerGetChat = setTimeout(
        () => this._getMessages(),
        DELAY_GET_CONVERSATION
      );
    } catch (e) {
      console.warn(e + ' site_load_chat');

      store.addApiQueue('site_load_chat', this._getMessages);
    } finally {
      this.isLoadFirstTime = false;
    }
  };

  _appendMessages(messages, callBack = () => {}, isAppendDirectly = false) {
    const newMessages = [...this.state.messages];
    messages.forEach(message => {
      if (message.user._id !== this.state.user_id || isAppendDirectly) {
        newMessages.unshift(message);
      }
    });
    this.setState(
      {
        messages: newMessages
      },
      () => callBack()
    );
  }

  _calculatorLastID = messages => {
    if (messages && messages.length) {
      const lastObject = messages[0];
      this._lastID = lastObject._id;
    }
  };

  handleSendImage = images => {
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
  };

  handleSendText = message => {
    message && (message = message.trim());
    this._appendMessages(
      this.getFormattedMessage(MESSAGE_TYPE_TEXT, message),
      () => {},
      true
    );
    this._onSend({ message });
  };

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

    //specify for tick/quan_ly_cua_hang  -> comment dong user_id = '';
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

  handlePinPress = pin => {
    const { t } = this.props;
    if (pin.type === 'STORE_ORDERS_TYPE') {
      Actions.push(appConfig.routes.storeOrders, {
        store_id: this.state.site.id,
        title: this.state.site.name,
        tel: this.state.site.tel
      });
    } else {
      servicesHandler(pin, t);
    }
  };

  render() {
    const { messages } = this.state;

    return messages !== null ? (
      <TickidChat
        // Root props
        setHeader={this.props.setHeader}
        defaultStatusBarColor={appConfig.colors.primary}
        // Refs
        ref={inst => (this.refTickidChat = inst)}
        refGiftedChat={inst => (this.refGiftedChat = inst)}
        refListMessages={inst => (this.refListMessages = inst)}
        // GiftedChat props
        giftedChatProps={this.giftedChatProps}
        messages={this.state.messages}
        onSendText={this.handleSendText}
        // Gallery props
        galleryVisible={appConfig.device.isIOS}
        uploadURL={UPLOAD_URL}
        onSendImage={this.handleSendImage}
        onUploadedImage={response =>
          this._onSend({ image: response.data.name })
        }
        // Pin props
        pinListVisible={false}
        pinList={this.state.pinList}
        onPinPress={this.handlePinPress}
        pinNotify={this.state.pinNotify}
        pinListNotify={this.state.pinListNotify}
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

export default withTranslation()(observer(Chat));
