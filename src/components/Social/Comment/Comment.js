import React, {Component} from 'react';
import {
  findNodeHandle,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FoundationIcon from 'react-native-vector-icons/Foundation';

import TickidChat from 'app-packages/tickid-chat';

import Loading from 'src/components/Loading';
import {APIRequest} from 'src/network/Entity';

import store from 'app-store';
import appConfig from 'app-config';

import {languages} from 'src/i18n/constants';
import {Avatar} from 'react-native-gifted-chat';
import moment from 'moment';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import {COMPONENT_TYPE, config} from 'app-packages/tickid-chat/constants';
import CustomMessage from './CustomMessage';
import CustomInputToolbar from './CustomInputToolbar';
import {
  PREVIEW_IMAGES_BAR_HEIGHT,
  REPLYING_BAR_HEIGHT,
} from 'src/constants/social/comments';
import {EmptyChat} from 'app-packages/tickid-chat/container/TickidChat/TickidChat';
import Image from 'src/components/Image';

moment.relativeTimeThreshold('ss', 10);
moment.relativeTimeThreshold('d', 7);
moment.relativeTimeThreshold('w', 4);
const DELAY_GET_CONVERSATION = 2000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';
const MESSAGE_TYPE_MIXED = 'mixed';
const UPLOAD_URL = APIHandler.url_user_upload_image();

const styles = StyleSheet.create({
  composerAction: {
    width: 35,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    left: 5,
  },
  sendContainer: {
    marginRight: 10,
  },
  emptyIcon: {
    fontSize: 80,
    color: '#909090',
  },
  userName: {
    paddingHorizontal: 10,
    paddingTop: 5,
    color: '#333',
    fontWeight: '700',
    fontSize: 12,
  },
});

class Comment extends Component {
  static defaultProps = {
    user_id: '24511',
    site_id: '1938',
  };
  state = {
    messages: null,
    user: this.user,
    user_id: '',
    isKeyboardShowing: false,
  };

  _lastID = 0;
  limit = 20;
  offset = 0;
  loadMore = false;
  unmounted = false;
  refListMessages = null;
  refGiftedChat = null;
  refTickidChat = null;
  isLoadFirstTime = true;
  giftedChatExtraProps = {};
  currentReplyingComment = {};
  isPressingReply = false;
  messagesPositionMap = {};

  refMessages = {};
  refContentMessages = {};

  getMessagesAPI = new APIRequest();
  getCommentsAPI = new APIRequest();
  postCommentAPI = new APIRequest();
  requests = [this.getCommentsAPI, this.postCommentAPI];

  handleKeyboardDidShow = () => {
    if (!this.state.isKeyboardShowing) {
      this.setState({isKeyboardShowing: true});
    }
    if (this.isPressingReply) {
      this.listChatScrollToItemById(this.currentReplyingComment);
    }
  };

  handleKeyboardDidHide = () => {
    this.setState({isKeyboardShowing: false});
  };

  keyboardDidShowListener = Keyboard.addListener(
    'keyboardDidShow',
    this.handleKeyboardDidShow,
  );
  keyboardDidHideListener = Keyboard.addListener(
    'keyboardDidHide',
    this.handleKeyboardDidHide,
  );

  get giftedChatProps() {
    this.giftedChatExtraProps.user = {_id: '-1'};
    this.giftedChatExtraProps.locale =
      languages[this.props.i18n.language].locale;
    this.giftedChatExtraProps.renderAvatarOnTop = true;
    this.giftedChatExtraProps.showAvatarForEveryMessage = true;
    this.giftedChatExtraProps.renderCustomView = this.renderUserName;
    this.giftedChatExtraProps.scrollToBottom = false;
    this.giftedChatExtraProps.maxComposerHeight = 60;

    return this.giftedChatExtraProps;
  }

  get user() {
    //specify for tick/quan_ly_cua_hang
    // _id = this.props.site_id;
    //specify for tick/tickid
    const id = this.props.user_id || store.user_info?.id;
    const name = this.props.user_name || store.user_info?.name;
    const avatar = this.props.user_avatar || store.user_info?.img;

    return {
      _id: id,
      id,
      name,
      avatar,
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
    moment.updateLocale(this.props.i18n.language, {
      relativeTime: {
        future: this.props.t('time.relative.future') || undefined,
        past: this.props.t('time.relative.past') || undefined,
        s: this.props.t('time.relative.s') || undefined,
        ss: this.props.t('time.relative.s') || undefined,
        m: this.props.t('time.relative.m') || undefined,
        mm: this.props.t('time.relative.mm') || undefined,
        h: this.props.t('time.relative.h') || undefined,
        hh: this.props.t('time.relative.hh') || undefined,
        d: this.props.t('time.relative.d') || undefined,
        dd: this.props.t('time.relative.dd') || undefined,
        w: this.props.t('time.relative.w') || undefined,
        ww: this.props.t('time.relative.ww') || undefined,
        M: this.props.t('time.relative.M') || undefined,
        MM: this.props.t('time.relative.MM') || undefined,
        y: this.props.t('time.relative.y') || undefined,
        yy: this.props.t('time.relative.yy') || undefined,
      },
    });

    this._getMessages();
    store.setReplyingUser(this.user);
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.timerGetChat);
    cancelRequests(this.requests);
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  _getMessages = async () => {
    let {site_id, object, object_id} = this.props;

    //specify for tick/quan_ly_cua_hang
    // const main_user = site_id;
    //specify for tick/tickid
    // const main_user = user_id;
    // user_id = 0;
    const data = {
      site_id,
      object,
      object_id,
    };
    try {
      this.getCommentsAPI.data = APIHandler.social_site_comments(data);

      const response = await this.getCommentsAPI.promise();
      if (response && response.status == STATUS_SUCCESS && response.data) {
        console.log(response);
        if (response.data.list) {
          response.data.list = this.formatMessages(response.data.list);
          // response.data.list = this.formatMessages(response.data.list);
          // response.data.list = response.data.list
          //   .concat(response.data.list)
          //   .concat(response.data.list)
          //   .concat(response.data.list)
          //   .concat(response.data.list);
          // response.data.list = response.data.list.map((t, index) => ({
          //   ...t,
          //   // _id: index,
          //   // id: index,
          //   text: index ? CONTENT[index].content : '',
          // }));
          response.data.list = this.formatIndexMessages(response.data.list);
          // console.log(response.data.list);
          if (this.state.messages) {
            this._appendMessages(response.data.list);
          } else {
            this.setState({
              messages: response.data.list,
              // user_id: main_user,
            });
          }
          this._calculatorLastID(response.data.list);
        }
      } else if (this.isLoadFirstTime) {
        this.setState({
          messages: [],
          // user_id: main_user,
        });
      }
      //   this.timerGetChat = setTimeout(
      //     () => this._getMessages(),
      //     DELAY_GET_CONVERSATION,
      //   );
    } catch (e) {
      console.warn(e + ' site_load_chat');
    } finally {
      this.isLoadFirstTime = false;
    }
  };

  formatIndexMessages(messages) {
    return messages.map((message, index) => ({...message, index}));
  }

  formatMessage(message, level = 0, parent_id = null) {
    console.log
    return {
      parent_id,
      ...message,
      avatar: message.image,
      createdAt: message.created,
      _id: message.id,
      text: message.content,
      level,
    };
  }

  formatMessages(messages, level = 0, temp = [], parent_id) {
    messages.map((message) => {
      if (message.children) {
        temp = temp.concat(
          this.formatMessages(message.children, level + 1, [], message.id),
        );
      }
      temp.push(this.formatMessage(message, level, parent_id));
    });

    return temp;
  }

  _appendMessages(messages, callBack = () => {}, isAppendDirectly = false) {
    let newMessages = [...this.state.messages];
    if (!store.replyingComment?.id) {
      messages.forEach((message) => {
        if (message.user._id !== this.state.user_id || isAppendDirectly) {
          newMessages.unshift(message);
        }
      });
    } else {
      messages.forEach((m) => {
        const index = newMessages.findIndex((mess) => {
          return m.parent_id === mess.parent_id || m.parent_id === mess.id;
        });
        if (index !== -1) {
          newMessages.splice(index, 0, m);
        }
      });
    }
    newMessages = this.formatIndexMessages(newMessages);
    this.setState(
      {
        messages: newMessages,
      },
      () => {
        setTimeout(() => this.listChatScrollToItemById(messages[0]));
        callBack();
      },
    );
  }

  _calculatorLastID = (messages) => {
    if (messages && messages.length) {
      const lastObject = messages[0];
      this._lastID = lastObject._id;
    }
  };

  handleAddImageToComposer = (images) => {
    const formattedImages = images.map((image) => {
      return {
        ...image,
        uri: `data:${image.mime};base64,` + image.data,
      };
    });
    store.setPreviewImages(formattedImages);
  };

  handleMixSend = (data) => {
    const message = this.getFormattedMessage(MESSAGE_TYPE_MIXED, data);
    message[0].rawImage = data.images[0];
    this._appendMessages(message, () => {}, true);

    store.setPreviewImages();
    store.setReplyingComment();

    this._onSend(message[0]);
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

    store.setPreviewImages();
    store.setReplyingComment();
  };

  handleSendText = (message) => {
    message && (message = message.trim());
    const formattedMessage = this.getFormattedMessage(
      MESSAGE_TYPE_TEXT,
      message,
    );
    this._appendMessages(formattedMessage, () => {}, true);

    store.setPreviewImages();
    store.setReplyingComment();

    this._onSend(formattedMessage[0]);
  };

  getFormattedMessage(type, message) {
    const formattedMessage = {
      _id: String(new Date().getTime()),
      id: String(new Date().getTime()),
      created: moment().format('YYYY-MM-DD HH:mm:ss'),
      level: store.replyingComment?.id ? 1 : 0,
      parent_id: store.replyingComment?.parent_id || store.replyingComment?.id,
      reply_id: store.replyingComment?.id,
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
      case MESSAGE_TYPE_MIXED:
        formattedMessage.text = message.text;
        formattedMessage.image = message.images[0].path;
        formattedMessage.isUploadData = true;
        break;
    }

    if (store.replyingMention?.name) {
      formattedMessage.text =
        store.replyingMention?.name + ' ' + formattedMessage.text;
      formattedMessage.parent_id =
        store.replyingComment?.parent_id || store.replyingComment?.id;
    }

    return [formattedMessage];
  }

  _onSend = async (message) => {
    let {site_id, object_id, object} = this.props;

    const data = {
      object,
      object_id,
      site_id,
      content: message.text || '',
      image: message.image || '',
      parent_id: message.parent_id || '',
      reply_id: message.reply_id || ''
    };

    try {
      this.postCommentAPI.data = APIHandler.social_site_comment(data);
      const response = await this.postCommentAPI.promise();
      console.log(response, message, data);

      if (response) {
        if (response.status == STATUS_SUCCESS) {
          if (response.data?.list) {
            const messages = this.formatIndexMessages(
              this.formatMessages(response.data.list),
            );
            this.setState({messages});
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message:
              response.message || this.props.t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: this.props.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('social_site_comment', e);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
    }
  };

  handleMomentumScrollEnd = () => {
    if (
      this.isPressingReply &&
      this.refContentMessages[this.currentReplyingComment?.id]
    ) {
      this.refContentMessages[
        this.currentReplyingComment.id
      ].animateHighlight();
      this.isPressingReply = false;
    }
  };

  listChatScrollToItemById(comment) {
    if (this.refListMessages) {
      if (!this.refMessages[comment.id]) return;

      const extraOffset =
        (!!store.replyingComment?.id ? -REPLYING_BAR_HEIGHT : 0) +
        (!!store.previewImages?.length ? -PREVIEW_IMAGES_BAR_HEIGHT : 0);

      this.refMessages[comment.id].measureLayout(
        findNodeHandle(this.refListMessages),
        (offsetX, offsetY) => {
          this.refListMessages.scrollToOffset({
            offset: offsetY + extraOffset,
          });
        },
      );
    }
  }

  handlePressGallery = () => {
    if (this.refTickidChat) {
      this.refTickidChat.handlePressComposerButton(COMPONENT_TYPE.GALLERY);
    }
  };

  handlePressSend = () => {
    if (this.refTickidChat) {
      this.refTickidChat.handleSendMessage();
    }
  };

  handlePressBottomBubble = (type, comment) => {
    switch (type) {
      case SOCIAL_BUTTON_TYPES.LIKE:
        break;
      case SOCIAL_BUTTON_TYPES.REPLY:
        this.isPressingReply = true;
        this.currentReplyingComment = comment;
        store.setReplyingComment(comment);

        if (this.refTickidChat) {
          if (!this.state.isKeyboardShowing) {
            this.refTickidChat.handlePressComposerButton(COMPONENT_TYPE.EMOJI);
          } else {
            this.listChatScrollToItemById(comment);
          }
        }
        break;
    }
  };

  handleCancelPreviewImage = (image) => {
    const images = [...store.previewImages];
    images.splice(image.index, 1);
    store.setPreviewImages(images);
  };

  handleKeyPress = (e) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !store.isReplyingYourSelf &&
      !this.refTickidChat?.state?.text
    ) {
      store.setReplyingMention();
    }
  };

  renderInputToolbar = (props) => {
    return (
      <CustomInputToolbar
        {...props}
        previewImages={store.previewImages}
        replyingName={store.replyingComment?.user?.name}
        onCancelReplying={store.setReplyingComment}
        onCancelPreviewImage={this.handleCancelPreviewImage}
      />
    );
  };

  renderAvatar = (props) => {
    return <Avatar {...props} />;
  };

  renderMessage = (props) => {
    return (
      <CustomMessage
        refMessage={(inst) => {
          this.refMessages[props.currentMessage.id] = inst;
        }}
        refContentMessage={(inst) => {
          this.refContentMessages[props.currentMessage.id] = inst;
        }}
        {...props}
        onPressBubbleBottom={this.handlePressBottomBubble}
        onSendImage={this._onSend}
        uploadUrl={UPLOAD_URL}
      />
    );
  };

  renderUserName = (props) => {
    return (
      <Text style={styles.userName}>{props.currentMessage?.user?.name}</Text>
    );
  };

  renderAvatar = (props) => {
    props.containerStyle = {
      left: {
        marginRight: 0,
        marginLeft: 10,
      },
    };
    props.imageStyle = {
      left: {
        width:
          props.currentMessage.level > 0
            ? 40 * (props.currentMessage.level * 0.75)
            : 40,
        height:
          props.currentMessage.level > 0
            ? 40 * (props.currentMessage.level * 0.75)
            : 40,
        borderRadius: 22,
      },
    };
    return (
      <View style={props.containerStyle.left}>
        <Image
          style={props.imageStyle.left}
          source={{uri: props.currentMessage?.user?.avatar || "any"}}
        />
      </View>
    );
    // <Avatar {...props} />);
  };

  renderMessageImage = () => {
    return null;
  };

  renderActions = (props) => {
    const disabled = !!store.previewImages?.length;
    return (
      <TouchableOpacity
        style={styles.composerAction}
        onPress={disabled ? () => {} : this.handlePressGallery}>
        <AntDesignIcon
          size={25}
          name="picture"
          color={disabled ? '#eee' : config.blurColor}
        />
      </TouchableOpacity>
    );
  };

  renderSend = () => {
    let disabled = false;
    if (this.refTickidChat) {
      disabled = !this.refTickidChat.state.text && !store.previewImages?.length;
    }
    return (
      <TouchableOpacity
        style={[styles.composerAction, styles.sendContainer]}
        onPress={disabled ? () => {} : this.handlePressSend}>
        <FontAwesomeIcon
          size={22}
          name="paper-plane"
          color={disabled ? '#eee' : config.focusColor}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const paddingTop =
      (store.replyingComment?.id ? REPLYING_BAR_HEIGHT : 0) +
      (store.previewImages?.length ? PREVIEW_IMAGES_BAR_HEIGHT : 0);

    return this.state.messages !== null ? (
      <TickidChat
        isMultipleImagePicker={false}
        extraData={paddingTop}
        alwaysShowInput
        mixSend={this.handleMixSend}
        handlePickedImages={this.handleAddImageToComposer}
        onKeyPress={this.handleKeyPress}
        renderEmpty={
          <EmptyChat
            icon={<FoundationIcon name="comments" style={styles.emptyIcon} />}
            message="Chưa có bình luận!"
          />
        }
        // Root props
        setHeader={this.props.setHeader}
        defaultStatusBarColor={appConfig.colors.primary}
        // Refs
        ref={(inst) => (this.refTickidChat = inst)}
        refGiftedChat={(inst) => (this.refGiftedChat = inst)}
        refListMessages={(inst) => (this.refListMessages = inst)}
        // GiftedChat props
        giftedChatProps={this.giftedChatProps}
        listChatProps={{
          onMomentumScrollEnd: this.handleMomentumScrollEnd,
          contentContainerStyle: {
            paddingTop,
            paddingBottom: 30,
          },
        }}
        messages={this.state.messages}
        onSendText={this.handleSendText}
        // Gallery props
        // galleryVisible={appConfig.device.isIOS}
        galleryVisible={false}
        useModalGallery
        uploadURL={UPLOAD_URL}
        onSendImage={this.handleSendImage}
        onUploadedImage={(response) =>
          this._onSend({image: response.data.name})
        }
        renderMessage={this.renderMessage}
        renderAvatar={this.renderAvatar}
        renderMessageImage={this.renderMessageImage}
        renderInputToolbar={this.renderInputToolbar}
        renderDay={() => null}
        renderTime={() => null}
        renderActions={this.renderActions}
        renderSend={this.renderSend}
      />
    ) : (
      <Loading center />
    );
  }
}

export default withTranslation()(observer(Comment));

const TEST_DATA = [
  {
    id: 1,
    object_id: 1,
    user_id: 1,
    object: 'news',
    site_id: 2148,
    content: 'I like it',
    image: 'https://abaha.vn/images/app/weeatclean.png',
    modified: '2021-05-04 15:23:52',
    created: '2021-03-17 15:19:25',
    user: {
      id: '42530',
      name: 'Alex',
      avatar: 'https://www.w3schools.com/howto/img_avatar.png',
    },
    children: [
      {
        id: 2,
        object_id: 1,
        object: 'news',
        site_id: 2148,
        content: 'So detsu ka',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png',
        modified: '2021-05-04 15:23:52',
        created: '2021-05-07 11:58:00',
        user: {
          id: '42530',
          name: 'Shakira',
          avatar: 'https://www.w3schools.com/howto/img_avatar2.png',
        },
      },
      {
        id: 3,
        object_id: 1,
        object: 'news',
        site_id: 2148,
        content: "It's so helpful",
        image: 'https://www.w3schools.com/w3css/img_lights.jpg',
        modified: '2021-05-04 15:23:52',
        created: '2021-05-07 08:19:25',
        user: {
          id: '42530',
          name: 'Benedict',
          avatar: 'https://www.w3schools.com/w3images/avatar2.png',
        },
      },
      {
        id: 4,
        object_id: 1,
        object: 'news',
        site_id: 2148,
        content: '1 vote',
        // image: 'https://www.w3schools.com/howto/img_forest.jpg',
        modified: '2021-05-04 15:23:52',
        created: '2021-05-01 15:19:25',
        user: {
          id: '42530',
          name: 'Lynn',
          avatar: 'https://www.w3schools.com/w3images/avatar6.png',
        },
      },
    ],
  },
  {
    id: 5,
    object_id: 1,
    object: 'news',
    site_id: 2148,
    content: 'So peaceful',
    image:
      'https://neilpatel.com/wp-content/uploads/2017/09/image-editing-tools.jpg',
    modified: '2021-05-04 15:23:52',
    created: '2021-04-19',
    user: {
      id: '42530',
      name: 'Anna',
      avatar: 'https://www.w3schools.com/w3images/avatar5.png',
    },
    children: [
      {
        id: 6,
        object_id: 1,
        object: 'news',
        site_id: 2148,
        content: 'Very good',
        image:
          'https://image.shutterstock.com/image-photo/sunset-coast-lake-nature-landscape-600w-1960131820.jpg',
        modified: '2021-05-04 15:23:52',
        created: '2021-05-07 12:01:00',
        user: {
          id: '42530',
          name: 'Anna',
          avatar: 'https://www.w3schools.com/w3images/avatar5.png',
        },
      },
    ],
  },
];

const CONTENT = [
  {
    content:
      'fermentum metus. Aenean sed pede nec ante blandit viverra. Donec tempus, lorem fringilla ornare placerat, orci lacus vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a',
  },
  {
    content:
      'adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam,',
  },
  {
    content:
      'Nam tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida',
  },
  {
    content:
      'et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat',
  },
  {content: 'vel turpis. Aliquam adipiscing lobortis risus. In mi pede,'},
  {
    content:
      'a nunc. In at pede. Cras vulputate velit eu sem. Pellentesque ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis',
  },
  {
    content:
      'Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna justo faucibus',
  },
  {
    content:
      'amet risus. Donec egestas. Aliquam nec enim. Nunc ut erat. Sed nunc est, mollis non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget odio. Aliquam vulputate ullamcorper magna. Sed',
  },
  {
    content:
      'nec orci. Donec nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec egestas.',
  },
  {
    content:
      'Integer aliquam adipiscing lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce',
  },
  {
    content:
      'sagittis augue, eu tempor erat neque non quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas',
  },
  {
    content:
      'Donec porttitor tellus non magna. Nam ligula elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent',
  },
  {
    content:
      'nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh sit amet orci. Ut sagittis lobortis mauris. Suspendisse aliquet molestie tellus. Aenean egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est ac',
  },
  {
    content:
      'scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed congue, elit sed consequat auctor, nunc nulla vulputate dui, nec tempus mauris erat eget ipsum. Suspendisse sagittis.',
  },
  {content: 'lacus. Ut nec urna et'},
  {content: 'condimentum. Donec at arcu. Vestibulum ante ipsum primis'},
  {
    content:
      'luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim,',
  },
  {
    content:
      'auctor non, feugiat nec, diam. Duis mi enim, condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc',
  },
  {
    content:
      'tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec tempus, lorem fringilla ornare placerat,',
  },
  {
    content:
      'Cras sed leo. Cras vehicula aliquet libero. Integer in magna. Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut odio vel est',
  },
  {content: 'sit amet luctus vulputate, nisi sem semper erat, in'},
  {content: 'mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam'},
  {
    content:
      'at augue id ante dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis.',
  },
  {
    content:
      'Donec nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec enim. Nunc ut erat. Sed nunc est, mollis non, cursus non, egestas a,',
  },
  {
    content:
      'semper. Nam tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec',
  },
  {
    content:
      'magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna tellus faucibus leo, in lobortis tellus justo sit amet nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna',
  },
  {
    content:
      'ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget varius ultrices, mauris ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis,',
  },
  {
    content:
      'sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel',
  },
  {
    content:
      'tortor, dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit',
  },
  {
    content:
      'ac orci. Ut semper pretium neque. Morbi quis urna. Nunc quis arcu vel quam dignissim pharetra. Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec tincidunt. Donec vitae erat vel pede blandit',
  },
  {
    content:
      'nibh. Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec',
  },
  {
    content:
      'consectetuer rhoncus. Nullam velit dui, semper et, lacinia vitae, sodales at, velit. Pellentesque ultricies dignissim lacus. Aliquam rutrum lorem ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor quis,',
  },
  {
    content:
      'orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a',
  },
  {content: 'Nullam'},
  {content: 'eu lacus.'},
  {
    content:
      'fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus',
  },
  {
    content:
      'ac risus. Morbi metus. Vivamus euismod urna. Nullam lobortis quam a felis ullamcorper viverra. Maecenas iaculis aliquet diam. Sed diam lorem, auctor quis, tristique ac, eleifend vitae, erat. Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla',
  },
  {content: 'Morbi neque'},
  {
    content:
      'Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis',
  },
  {content: 'tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem'},
  {
    content:
      'enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris',
  },
  {
    content:
      'sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce aliquet magna a neque. Nullam ut nisi a odio semper cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non',
  },
  {
    content:
      'tellus non magna. Nam ligula elit, pretium et, rutrum non, hendrerit id, ante. Nunc mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna.',
  },
  {
    content:
      'dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem,',
  },
  {
    content:
      'nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient',
  },
  {
    content:
      'a neque. Nullam ut nisi a odio semper cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis odio. Nam interdum enim non nisi. Aenean eget metus. In nec orci. Donec nibh. Quisque nonummy ipsum non arcu. Vivamus',
  },
  {
    content:
      'laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut odio vel est tempor bibendum. Donec felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus.',
  },
  {
    content:
      'dolor. Donec fringilla. Donec feugiat metus sit amet ante. Vivamus non lorem vitae odio sagittis semper. Nam tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus luctus, ipsum',
  },
  {
    content:
      'Phasellus at augue id ante dictum cursus. Nunc mauris elit, dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum. Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel turpis.',
  },
  {
    content:
      'enim. Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies ligula. Nullam enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum, justo.',
  },
  {
    content:
      'odio a purus. Duis elementum, dui quis accumsan convallis, ante lectus convallis est, vitae sodales nisi magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie tortor nibh',
  },
  {content: 'Quisque nonummy ipsum non arcu. Vivamus sit amet risus.'},
  {
    content:
      'tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus. Etiam bibendum fermentum metus. Aenean sed pede nec ante blandit viverra. Donec tempus, lorem',
  },
  {
    content:
      'lacus. Ut nec urna et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac urna. Ut tincidunt vehicula',
  },
  {
    content:
      'dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit. Quisque varius. Nam porttitor scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas, urna',
  },
  {content: 'primis in faucibus'},
  {
    content:
      'et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh.',
  },
  {
    content:
      'urna. Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit. Quisque varius. Nam',
  },
  {
    content:
      'Etiam ligula tortor, dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae',
  },
  {
    content:
      'convallis dolor. Quisque tincidunt pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam, elementum at, egestas a, scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris,',
  },
  {
    content:
      'Duis cursus, diam at pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui.',
  },
  {
    content:
      'velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue. Sed molestie. Sed',
  },
  {
    content:
      'ipsum. Curabitur consequat, lectus sit amet luctus vulputate, nisi sem semper erat,',
  },
  {content: 'pharetra, felis eget'},
  {
    content:
      'diam. Proin dolor. Nulla semper tellus id nunc interdum feugiat. Sed',
  },
  {
    content:
      'ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate,',
  },
  {content: 'arcu. Vestibulum ante'},
  {content: 'elit pede, malesuada vel, venenatis'},
  {
    content:
      'enim mi tempor lorem, eget mollis lectus pede et risus. Quisque libero lacus, varius et, euismod et, commodo at,',
  },
  {
    content:
      'ipsum porta elit, a feugiat tellus lorem eu metus. In lorem. Donec elementum, lorem ut aliquam iaculis, lacus pede sagittis augue, eu',
  },
  {content: 'a, scelerisque sed, sapien. Nunc pulvinar'},
  {
    content:
      'turpis egestas. Aliquam fringilla cursus purus. Nullam scelerisque neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat',
  },
  {
    content:
      'Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem',
  },
  {
    content:
      'nulla. Donec non justo. Proin non massa non ante bibendum ullamcorper. Duis cursus, diam at pretium aliquet, metus urna convallis',
  },
  {
    content:
      'Donec tempor, est ac mattis semper, dui lectus rutrum urna, nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh enim, gravida sit amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis',
  },
  {
    content:
      'felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus. Duis elementum, dui quis accumsan convallis, ante lectus convallis est, vitae',
  },
  {
    content:
      'aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim',
  },
  {
    content:
      'blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
  },
  {
    content:
      'erat, in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec',
  },
  {
    content:
      'vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus',
  },
  {
    content:
      'sem mollis dui, in sodales elit erat vitae risus. Duis a mi fringilla mi lacinia mattis. Integer eu lacus. Quisque',
  },
  {
    content:
      'fermentum fermentum arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus ornare. Fusce mollis. Duis sit amet diam eu dolor egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget, dictum placerat, augue.',
  },
  {
    content:
      'eget, dictum placerat, augue. Sed molestie. Sed id risus quis diam luctus lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Mauris',
  },
  {
    content:
      'enim. Mauris quis turpis vitae purus gravida sagittis. Duis gravida. Praesent eu nulla at sem molestie sodales. Mauris blandit enim consequat purus. Maecenas libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus at augue id ante',
  },
  {content: 'Nulla'},
  {
    content:
      'amet, dapibus id, blandit at, nisi. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu nibh vulputate',
  },
  {
    content:
      'Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros',
  },
  {
    content:
      'conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh. Aliquam ornare, libero at auctor ullamcorper, nisl',
  },
  {
    content:
      'dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris, rhoncus id, mollis nec,',
  },
  {content: 'dui, nec tempus mauris erat eget ipsum.'},
  {
    content:
      'pretium aliquet, metus urna convallis erat, eget tincidunt dui augue eu',
  },
  {content: 'accumsan neque'},
  {
    content:
      'est. Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci, in consequat enim diam vel arcu. Curabitur ut',
  },
  {content: 'neque. Nullam ut nisi a odio'},
  {
    content:
      'massa rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac urna. Ut tincidunt vehicula risus. Nulla eget metus eu erat semper rutrum. Fusce dolor quam, elementum',
  },
  {content: 'a nunc. In'},
  {
    content:
      'eleifend non, dapibus rutrum, justo. Praesent luctus. Curabitur egestas nunc sed libero. Proin sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut eros non enim commodo',
  },
  {
    content:
      'arcu. Curabitur ut odio vel est tempor bibendum. Donec felis orci, adipiscing non, luctus sit amet, faucibus ut, nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor odio a purus. Duis elementum, dui quis accumsan convallis, ante lectus convallis est, vitae sodales nisi',
  },
  {content: 'nulla magna, malesuada vel,'},
  {
    content:
      'nec quam. Curabitur vel lectus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam',
  },
];
