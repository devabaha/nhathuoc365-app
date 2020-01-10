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

const DELAY_GET_CONVERSATION = 2000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';
const UPLOAD_URL = APIHandler.url_user_upload_image();

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
    this.source = null;
    this.isLoadFirstTime = true;
    this.giftedChatExtraProps = {};
  }

  get giftedChatProps() {
    this.giftedChatExtraProps.user = { _id: this.state.user_id };
    return this.giftedChatExtraProps;
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
        onBack: this.onBack.bind(this)
      });
    });

    this._getMessages();
    this._getPinList();
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
    if (this.props.fromSearchScene) {
      Actions.replace('list_amazing_chat_1');
    } else {
      Actions.pop();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.source) {
      this.source.cancel();
    }
    clearTimeout(this.timerGetChat);
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
    if (!this.unmounted) {
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
            if (response.data.pin_notify) {
              this.setState({
                pinNotify: response.data.pin_notify
              });
            }
            if (response.data.pin_list_notify) {
              const condition =
                Object.keys(response.data.pin_list_notify).length !==
                Object.keys(this.state.pinListNotify).length;

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
        }
      } catch (e) {
        console.warn(e + ' site_load_chat');

        store.addApiQueue('site_load_chat', this._getMessages);
      } finally {
        this.isLoadFirstTime = false;
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
    switch (pin.type) {
      case 'ACCUMULATE_POINTS_TYPE':
        Actions.push(appConfig.routes.qrBarCode, {
          title: 'Mã tài khoản'
        });
        break;
      case 'MY_VOUCHER_TYPE':
      case 'my_voucher':
        Actions.push(appConfig.routes.myVoucher, {
          title: 'Voucher của tôi',
          from: 'home'
        });
        break;
      case 'TRANSACTION_TYPE':
        Actions.vnd_wallet({
          title: store.user_info.default_wallet.name,
          wallet: store.user_info.default_wallet
        });
        break;
      case 'ORDERS_TYPE':
        Actions.push(appConfig.routes.storeOrders, {
          store_id: this.state.site.id,
          title: this.state.site.name,
          tel: this.state.site.tel
        });
        break;
      case 'QRCODE_SCAN_TYPE':
      case 'qrscan':
        Actions.push(appConfig.routes.qrBarCode, {
          index: 1,
          title: 'Quét QR Code',
          wallet: store.user_info.default_wallet
        });
        break;
      case 'up_to_phone':
        Actions.push(appConfig.routes.upToPhone, {
          service_type: pin.type,
          service_id: pin.id,
          indexTab: pin.tab,
          title: pin.name,
          serviceId: pin.serviceId ? pin.serviceId : 100
        });
        break;
      case 'list_voucher':
        Actions.push(appConfig.routes.mainVoucher, {
          from: 'home'
        });
        break;
      case 'rada_service':
        Actions.push('tickidRada', {
          service_type: pin.type,
          service_id: pin.id,
          title: 'Dịch vụ Rada',
          onPressItem: item => {
            this.handleCategoryPress(item);
          }
        });
        break;
      case '30day_service':
        Alert.alert(
          'Thông báo',
          'Chức năng đặt lịch giữ chỗ 30DAY tới các cửa hàng đang được phát triển.',
          [{ text: 'Đồng ý' }]
        );
        break;
      case 'my_address':
        Actions.push(appConfig.routes.myAddress, {
          from_page: 'account'
        });
        break;
      case 'news':
        Actions.jump(appConfig.routes.newsTab);
        break;
      case 'orders':
        Actions.jump(appConfig.routes.ordersTab);
        break;
      case 'list_chat':
        Actions.list_amazing_chat({
          titleStyle: { width: 220 }
        });
        break;
      case 'open_shop':
        if (this.shopOpening) return;
        this.setState({
          showLoading: true
        });
        APIHandler.site_info(pin.siteId)
          .then(response => {
            if (
              response &&
              response.status == STATUS_SUCCESS &&
              !this.unmounted
            ) {
              action(() => {
                store.setStoreData(response.data);
                Actions.push(appConfig.routes.store, {
                  title: pin.name || response.data.name,
                  categoryId: pin.categoryId || 0
                });
              })();
            }
          })
          .finally(() => {
            this.shopOpening = false;
            this.setState({
              showLoading: false
            });
          });
        break;
      case 'call':
        Communications.phonecall(pin.tel, true);
        break;
      case 'news_category':
        Actions.push(appConfig.routes.notifies, {
          title: pin.title,
          news_type: `/${pin.categoryId}`
        });
        break;
      default:
        Alert.alert('Thông báo', 'Chức năng đặt đang được phát triển.', [
          { text: 'Đồng ý' }
        ]);
        break;
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
        uploadURL={UPLOAD_URL}
        onSendImage={this.handleSendImage}
        onUploadedImage={response =>
          this._onSend({ image: response.data.name })
        }
        // Pin props
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
