import React, {Component} from 'react';
import {
  Clipboard,
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
import moment from 'moment';
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
  titleError: {
    color: appConfig.colors.status.danger,
  },
});

class Comment extends Component {
  static defaultProps = {
    site_id: store.store_data?.id,
    user_id: store.user_info?.id,
    user_name: store.user_info?.name,
    user_avatar: store.user_info?.img,
  };

  state = {
    messages: [],
    user: this.user,
    user_id: '',
    isKeyboardShowing: false,
    replyingComment: {},
    previewImages: [],
    isUpdateForRendering: false,
    loading: true,
  };

  tempID = 0;
  _lastID = 0;
  limit = 20;
  offset = 0;
  loadMore = false;
  unmounted = false;
  currentScrollPositionY = 0;

  refListMessages = null;
  refGiftedChat = null;
  refTickidChat = null;
  isLoadFirstTime = true;
  giftedChatExtraProps = {};
  isPressingReply = false;
  appendedComment = {};

  refComments = null;
  refContentComments = null;
  refReplyMessage = null;
  refReplyContentMessage = null;

  getMessagesAPI = new APIRequest();
  getCommentsAPI = new APIRequest();
  postCommentAPI = new APIRequest();
  likeRequest = new APIRequest();
  requests = [this.getCommentsAPI, this.postCommentAPI, this.likeRequest];

  handleKeyboardDidShow = () => {
    if (!this.state.isKeyboardShowing) {
      this.setState({isKeyboardShowing: true});
    }
    if (this.isPressingReply) {
      this.listChatScrollToItemById(this.refReplyMessage);
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
    const id = this.props.user_id;
    const name = this.props.user_name;
    const avatar = this.props.user_avatar;

    return {
      _id: id,
      id,
      user_id: id,
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
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.timerGetChat);
    cancelRequests(this.requests);
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  setStater = (data, callback = () => {}) => {
    this.setState(
      (prevState) => ({
        ...data,
        isUpdateForRendering: !prevState.isUpdateForRendering,
      }),
      callback,
    );
  };

  _getMessages = async () => {
    this.setState({loading: true});
    let {site_id, object, object_id} = this.props;

    const data = {
      site_id,
      object,
      object_id,
    };

    try {
      this.getCommentsAPI.data = APIHandler.social_comments(data);

      const response = await this.getCommentsAPI.promise();
      if (this.unmounted) return;

      // console.log(response);
      if (response && response.status == STATUS_SUCCESS && response.data) {
        if (response.data.list) {
          let comments = [...response.data.list];
          comments = this.formatMessages(comments);

          this.setState({
            messages: comments,
            user: response.data.main_user,
          });
        }
      } else if (this.isLoadFirstTime) {
        this.setState({
          messages: [],
          user: response.data.main_user,
        });
      }
    } catch (e) {
      console.log('get_comments', e);
    } finally {
      this.isLoadFirstTime = false;
      if (!this.unmounted) {
        this.setStater({loading: false});
        if (this.props.autoFocus && this.refTickidChat) {
          this.refTickidChat.handlePressComposerButton(COMPONENT_TYPE.EMOJI);
        }
      }
    }
  };

  formatMessage(message, level = 0, parent_id = null, real_parent_id = null) {
    return {
      ...message,
      id: message.id,
      parent_id,
      real_parent_id: real_parent_id || parent_id,
      real_id: message.id,
      like_flag: message?.like?.like_flag,
      user: {
        ...message.user,
        avatar: message.user.image,
      },
      createdAt: message.created,
      _id: message.id,
      text: message.content,
      level,
      error: false,
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
    if (!this.state.replyingComment.id) {
      messages.forEach((message) => {
        if (message.user._id !== this.state.user_id || isAppendDirectly) {
          newMessages.unshift(message);
        }
      });
    } else {
      messages.forEach((m) => {
        const index = newMessages.findIndex((mess) => {
          if (m.parent_id === mess.parent_id || m.parent_id === mess.id) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          newMessages.splice(index, 0, m);
        }
      });
    }

    isAppendDirectly && (this.appendedComment = messages[0]);

    this.setState(
      {
        messages: newMessages,
      },
      () => {
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
    this.setStater({previewImages: formattedImages});
  };

  clearComposer() {
    this.setStater({
      previewImages: [],
      replyingComment: {},
    });
  }

  handleMixSend = (data) => {
    const message = this.getFormattedMessage(MESSAGE_TYPE_MIXED, data);
    message[0].rawImage = data.images[0];
    this._appendMessages(message, () => {}, true);

    this.clearComposer();
  };

  handleSendImage = (images) => {
    if (Array.isArray(images) && images.length !== 0) {
      const message = this.getFormattedMessage(MESSAGE_TYPE_IMAGE, images[0]);
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

    this.clearComposer();
  };

  handleSendText = (message) => {
    message && (message = message.trim());
    const formattedMessage = this.getFormattedMessage(
      MESSAGE_TYPE_TEXT,
      message,
    );
    this._appendMessages(formattedMessage, () => {}, true);

    this.clearComposer();

    this._onSend(formattedMessage[0]);
  };

  getFormattedMessage(type, message) {
    this.tempID--;
    const level = this.state.replyingComment.id ? 1 : 0;
    const parent_id =
      this.state.replyingComment.parent_id || this.state.replyingComment.id;
    const real_parent_id =
      this.state.replyingComment.real_parent_id ||
      this.state.replyingComment.real_id;
    const formattedMessage = this.formatMessage(
      {
        id: String(this.tempID),
        created: moment().format('YYYY-MM-DD HH:mm:ss'),
        like: {
          like_flag: 0,
        },
        reply_id: !this.isReplyingYourSelf()
          ? this.state.replyingComment.real_id
          : '',
        user: {...this.state.user},
      },
      level,
      parent_id,
      real_parent_id,
    );

    switch (type) {
      case MESSAGE_TYPE_TEXT:
        formattedMessage.text = message;
        formattedMessage.content = message;
        break;
      case MESSAGE_TYPE_IMAGE:
        formattedMessage.image = message.path;
        formattedMessage.image_info = {
          width: message.width,
          height: message.height,
        };
        formattedMessage.isUploadData = true;
        break;
      case MESSAGE_TYPE_MIXED:
        formattedMessage.text = message.text;
        formattedMessage.content = message.text;
        formattedMessage.image = message.images[0].path;
        formattedMessage.isUploadData = true;
        formattedMessage.image_info = {
          width: message.images[0].width,
          height: message.images[0].height,
        };
        break;
    }

    return [formattedMessage];
  }

  updateCommentData = (id, comment, error = false) => {
    const messages = [...this.state.messages];
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages[index] = comment;
      messages[index].error = error;
      this.setStater({
        messages,
      });
    }
  };

  _onSend = async (message) => {
    let {site_id, object_id, object} = this.props;

    const data = {
      object,
      object_id,
      site_id,
      content: message.text || '',
      image: message.image || '',
      parent_id: message.real_parent_id || '',
      reply_id: message.reply_id || '',
    };
    if (message.image_info) {
      data.image_width = message.image_info.width;
      data.image_height = message.image_info.height;
    }

    try {
      this.postCommentAPI.data = APIHandler.social_comment(data);
      const response = await this.postCommentAPI.promise();
      console.log(response, message, data);
      let clientComment = message;
      let error = true;

      if (response) {
        if (response.status == STATUS_SUCCESS) {
          if (response.data?.comment) {
            const responseComment = this.formatMessage(
              response.data.comment,
              message.level,
              response.data?.comment?.parent_id,
            );

            clientComment = {
              ...responseComment,
              _id: message._id,
              id: message.id,
              parent_id: message.parent_id,
            };
            error = false;
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

      this.updateCommentData(message.id, clientComment, error);
    } catch (e) {
      console.log('social_comment', e);
      this.updateCommentData(message.id, message, true);

      flashShowMessage({
        type: 'danger',
        message: this.props.t('common:api.error.message'),
      });
    } finally {
    }
  };

  handleTouchStart = () => {
    if (this.isPressingReply) {
      this.isPressingReply = false;
    }
  };

  handleMomentumScrollEnd = () => {
    if (this.isPressingReply && this.refReplyContentMessage) {
      this.refReplyContentMessage.animateHighlight();
      this.isPressingReply = false;
    }
  };

  listChatScrollToItemById(ref) {
    if (this.refListMessages) {
      if (!ref) return;

      ref.measureLayout(
        findNodeHandle(this.refListMessages),
        (offsetX, offsetY) => {
          const extraOffset =
            (!!this.state.replyingComment.id ? REPLYING_BAR_HEIGHT : 0) +
            (!!this.state.previewImages.length ? PREVIEW_IMAGES_BAR_HEIGHT : 0);

          if (offsetY <= extraOffset && this.currentScrollPositionY === 0) {
            setTimeout(() => this.handleMomentumScrollEnd(), 200);
          } else {
            this.refListMessages.scrollToOffset({
              offset: offsetY - extraOffset,
            });
          }
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

  handleLikeComment = (data, errorCallback) => {
    this.likeRequest.data = APIHandler.social_likes(data);
    this.likeRequest
      .promise()
      .then((response) => {
        if (response?.status !== STATUS_SUCCESS) {
          errorCallback();
          flashShowMessage({
            type: 'danger',
            message: response?.message || this.props.t('api.error.message'),
          });
        }
      })
      .catch((err) => {
        errorCallback();
        console.log('like_comment', err);
        flashShowMessage({
          type: 'danger',
          message: response?.message || this.props.t('api.error.message'),
        });
      });
  };

  handleReply = (refComment, refContentComment, comment) => {
    this.isPressingReply = true;
    this.setStater(
      {
        replyingComment: comment,
      },
      () => {
        this.refReplyContentMessage = refContentComment;
        if (this.refTickidChat) {
          let timeout = 0;
          if (!this.state.isKeyboardShowing) {
            this.refReplyMessage = refComment;
            this.refTickidChat.handlePressComposerButton(COMPONENT_TYPE.EMOJI);
            timeout = 100;
          }

          if (appConfig.device.isAndroid) {
            setTimeout(() => this.handleMomentumScrollEnd(), timeout);
          }
          setTimeout(() => this.listChatScrollToItemById(refComment), timeout);
        }
      },
    );
  };

  handleCancelPreviewImage = (image) => {
    const previewImages = [...this.state.previewImages];
    previewImages.splice(image.index, 1);
    this.setStater({previewImages});
  };

  handleKeyPress = (e) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !this.isReplyingYourSelf() &&
      !this.refTickidChat?.state?.text
    ) {
      this.setStater({replyingComment: {}});
    }
  };

  handleBubbleLongPress = (context, message) => {
    if (message.content) {
      const options = [this.props.t('copy'), this.props.t('cancel')];
      const cancelButtonIndex = options.length - 1;
      context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.content);
              break;
          }
        },
      );
    }
  };

  handleCommentDidMount = (refComment, comment) => {
    if (!!comment && comment?.id === this.appendedComment.id) {
      setTimeout(() => this.listChatScrollToItemById(refComment));
      this.appendedComment = {};
    }
  };

  isReplyingYourSelf = (userId = this.state.replyingComment.user?.user_id) => {
    return userId === this.state.user?.user_id;
  };

  renderInputToolbar = (props) => {
    const replyingMention = this.state.replyingComment?.user;
    const isReplyingYourSelf = this.isReplyingYourSelf(
      replyingMention?.user_id,
    );
    const replyingName =
      replyingMention &&
      (isReplyingYourSelf
        ? this.props.t('social:yourself')
        : replyingMention?.name);

    return (
      <CustomInputToolbar
        {...props}
        previewImages={this.state.previewImages}
        replyingName={replyingName}
        replyingMentionName={replyingMention?.name}
        onCancelReplying={() => this.setStater({replyingComment: {}})}
        onCancelPreviewImage={this.handleCancelPreviewImage}
      />
    );
  };

  renderMessage = (props) => {
    const isLoading = typeof props.currentMessage?.real_id !== 'number';
    const pendingMessage = props.currentMessage?.accept_status;
    const isError = props.currentMessage?.error;
    const loadingMessage = isError
      ? this.props.t('social:errorPosting')
      : this.props.t('social:posting');
    const isHighlight =
      this.state.replyingComment.id === props.currentMessage?.id;
    const messageBottomTitleStyle = isError && styles.titleError;
    if (typeof props.currentMessage.id === 'string') {
    }
    return (
      <CustomMessage
        {...props}
        onLongPress={this.handleBubbleLongPress}
        uploadURL={UPLOAD_URL}
        pendingMessage={pendingMessage}
        isPending={!!pendingMessage}
        isError={isError}
        messageBottomTitleStyle={messageBottomTitleStyle}
        seeMoreTitle={this.props.t('social:seeMore')}
        isHighlight={isHighlight}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        onLike={this.handleLikeComment}
        onReply={this.handleReply}
        onDidMount={this.handleCommentDidMount}
        onImageUploaded={this._onSend}
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
          source={{uri: props.currentMessage?.user?.avatar || 'any'}}
        />
      </View>
    );
  };

  renderMessageImage = () => {
    return null;
  };

  renderActions = (props) => {
    const disabled = !!this.state.previewImages.length;
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
      disabled =
        !this.refTickidChat.state.text && !this.state.previewImages.length;
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
      (this.state.replyingComment.id ? REPLYING_BAR_HEIGHT : 0) +
      (this.state.previewImages.length ? PREVIEW_IMAGES_BAR_HEIGHT : 0);

    return (
      <>
        {this.state.loading && <Loading center />}
        <TickidChat
          isMultipleImagePicker={false}
          extraData={this.state.isUpdateForRendering}
          alwaysShowInput
          mixSend={this.handleMixSend}
          handlePickedImages={this.handleAddImageToComposer}
          onKeyPress={this.handleKeyPress}
          renderEmpty={
            !this.state.loading ? (
              <EmptyChat
                icon={
                  <FoundationIcon name="comments" style={styles.emptyIcon} />
                }
                message={this.props.t('social:emptyComment')}
              />
            ) : (
              <View></View>
            )
          }
          // Root props
          setHeader={this.props.setHeader}
          defaultStatusBarColor={appConfig.colors.primary}
          // Refs
          ref={(inst) => (this.refTickidChat = inst)}
          refGiftedChat={(inst) => (this.refGiftedChat = inst)}
          refListMessages={(inst) => {
            this.refListMessages = inst;
          }}
          // GiftedChat props
          giftedChatProps={this.giftedChatProps}
          listChatProps={{
            onMomentumScrollEnd: this.handleMomentumScrollEnd,
            onScroll: (e) => {
              this.currentScrollPositionY = e.nativeEvent.contentOffset.y;
            },
            onTouchStart: this.handleTouchStart,
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
      </>
    );
  }
}

export default withTranslation(['common', 'social'], {withRef: true})(
  observer(Comment),
);
