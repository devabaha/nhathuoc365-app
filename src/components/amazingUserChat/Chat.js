import React, {Component} from 'react';
import {View} from 'react-native';
// configs
import store from 'app-store/Store';
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {servicesHandler} from 'app-helper/servicesHandler';
import EventTracker from 'app-helper/EventTracker';
// routing
import {pop, push, refresh, replace} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import TickidChat from 'app-packages/tickid-chat/container/TickidChat';
import RightButtonCall from '../RightButtonCall';
import {Container} from 'src/components/base';

const DELAY_GET_CONVERSATION = 2000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';

class Chat extends Component {
  static contextType = ThemeContext;

  static propTypes = {};
  static defaultProps = {
    phoneNumber: null,
  };

  state = {
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
    user_id: store.user_info ? store.user_info.id : '',
    phoneNumber: '',
    guestName: '',
  };

  _lastID = 0;
  limit = 20;
  offset = 0;
  loadMore = false;
  unmounted = false;
  refListMessages = null;
  refGiftedChat = null;
  refTickidChat = null;
  source = null;
  isLoadFirstTime = true;
  giftedChatExtraProps = {};

  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  get uploadURL() {
    return APIHandler.url_user_upload_image(this.state.site?.id);
  }

  get giftedChatProps() {
    this.giftedChatExtraProps.user = {_id: this.state.user_id};
    return this.giftedChatExtraProps;
  }

  get user() {
    let user_info = store.user_info || {};
    let _id = user_info.id;

    return {
      _id,
      name: user_info.name,
      avatar: user_info.img,
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
      refresh({
        right: () => this.renderRight(this.props.phoneNumber),
        onBack: this.onBack.bind(this),
      });
    });
    this._getMessages();
    // this._getPinList();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.source) {
      this.source.cancel();
    }
    clearTimeout(this.timerGetChat);
    this.eventTracker.clearTracking();
  }

  renderRight = (tel = this.state.phoneNumber) => {
    if (!tel) return null;
    return (
      <View style={{flexDirection: 'row', marginRight: 5}}>
        <RightButtonCall userName={this.state.guestName} tel={tel} />
      </View>
    );
  };

  onBack() {
    if (this.props.fromSearchScene) {
      replace(`${appConfig.routes.listUserChat}_1`);
    } else {
      pop();
    }
  }

  _getPinList = async (delay = 0) => {
    if (!this.unmounted) {
      let {site_id, user_id} = this.props;

      try {
        const response = await APIHandler.site_pin_list(site_id);
        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS && response.data) {
            this.setState((prevState) => ({
              pinList: response.data.pin_list
                ? response.data.pin_list
                : prevState.pinList,
              site: response.data.site ? response.data.site : prevState.site,
            }));
          }
        }
      } catch (e) {
        console.warn(e + ' site_pin_list');
      }
    }
  };

  _getMessages = async (delay = 0) => {
    if (!this.unmounted) {
      let {user_id} = this.state;
      let {conversation_id} = this.props;

      const main_user = user_id;

      try {
        const [source, callable] = APIHandler.user_list_chat_conversation(
          conversation_id,
          this._lastID,
        );

        this.source = source;
        const response = await callable();
        if (!this.unmounted) {
          if (response && response.status == STATUS_SUCCESS && response.data) {
            if (response.data.receiver) {
              if (this.state.phoneNumber !== response.data.receiver.phone) {
                refresh({
                  right: this.renderRight(response.data.receiver.phone),
                });
              }
              this.setState({
                phoneNumber: response.data.receiver.phone,
                guestName: response.data.receiver.name,
              });
            }
            if (response.data.list) {
              if (this.state.messages) {
                this._appendMessages(response.data.list);
              } else {
                this.setState({
                  messages: response.data.list,
                  user_id: main_user,
                });
              }
              this._calculatorLastID(response.data.list);
            }
            // if (response.data.pin_notify) {
            //   this.setState({
            //     pinNotify: response.data.pin_notify
            //   });
            // }
            // if (response.data.pin_list_notify) {
            //   const condition =
            //     JSON.stringify(response.data.pin_list_notify) !==
            //     JSON.stringify(this.state.pinListNotify);

            //   if (condition) {
            //     this.setState({
            //       pinListNotify: response.data.pin_list_notify
            //     });
            //   }
            // }
          } else if (this.isLoadFirstTime) {
            this.setState({
              messages: [],
              user_id: main_user,
            });
          }
          this.timerGetChat = setTimeout(
            () => this._getMessages(),
            DELAY_GET_CONVERSATION,
          );
        }
      } catch (e) {
        console.log('user_site_load_chat ' + e);
      } finally {
        this.isLoadFirstTime = false;
      }
    }
  };

  _appendMessages(messages, callBack = () => {}, isAppendDirectly = false) {
    const newMessages = [...this.state.messages];
    messages.forEach((message) => {
      if (message.user._id !== this.state.user_id || isAppendDirectly) {
        newMessages.unshift(message);
      }
    });
    this.setState(
      {
        messages: newMessages,
      },
      () => callBack(),
    );
  }

  _calculatorLastID = (messages) => {
    if (messages && messages.length) {
      const lastObject = messages[0];
      this._lastID = lastObject._id;
    }
  };

  handleSendImage = (images) => {
    if (Array.isArray(images) && images.length !== 0) {
      const message = this.getFormattedMessage(
        MESSAGE_TYPE_IMAGE,
        images[0].path,
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
        true,
      );
    }
  };

  handleSendText = (message) => {
    message && (message = message.trim());
    this._appendMessages(
      this.getFormattedMessage(MESSAGE_TYPE_TEXT, message),
      () => {},
      true,
    );
    this._onSend({message});
  };

  getFormattedMessage(type, message) {
    const formattedMessage = {
      _id: String(new Date().getTime()),
      createdAt: new Date(),
      user: {...this.state.user},
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
    let {conversation_id} = this.props;

    try {
      const response = await APIHandler.user_send_message(
        conversation_id,
        message,
      );
      if (response && response.status == STATUS_SUCCESS) {
      }
    } catch (e) {
      console.warn(e + ' user_send_chat');
    } finally {
    }
  }

  handlePinPress = (pin) => {
    const {t} = this.props;
    if (pin.type === 'STORE_ORDERS_TYPE') {
      push(
        appConfig.routes.storeOrders,
        {
          store_id: this.state.site.id,
          title: this.state.site.name,
          tel: this.state.site.tel,
        },
        this.theme,
      );
    } else {
      servicesHandler(pin, t);
    }
  };

  render() {
    const {messages} = this.state;

    return messages !== null ? (
      <TickidChat
        // Root props
        setHeader={this.props.setHeader}
        defaultStatusBarColor={this.theme.color.primaryDark}
        // Refs
        ref={(inst) => (this.refTickidChat = inst)}
        refGiftedChat={(inst) => (this.refGiftedChat = inst)}
        refListMessages={(inst) => (this.refListMessages = inst)}
        // GiftedChat props
        giftedChatProps={this.giftedChatProps}
        messages={this.state.messages}
        onSendText={this.handleSendText}
        // Gallery props
        // galleryVisible={appConfig.device.isIOS}
        galleryVisible={false}
        useModalGallery
        uploadURL={this.uploadURL}
        onSendImage={this.handleSendImage}
        onUploadedImage={(response) =>
          this._onSend({image: response.data.name})
        }
        // Pin props
        pinListVisible={false}
        pinList={this.state.pinList}
        onPinPress={this.handlePinPress}
        pinNotify={this.state.pinNotify}
        pinListNotify={this.state.pinListNotify}
      />
    ) : (
      <Container flex>
        <Indicator size="small" />
      </Container>
    );
  }
}

export default withTranslation()(observer(Chat));
