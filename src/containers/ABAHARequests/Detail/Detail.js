import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, RefreshControl} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import equal from 'deep-equal';

import appConfig from 'app-config';

import Loading from '../../../components/Loading';
import Comments from './Comments';
import {APIRequest} from '../../../network/Entity';

const DELAY_GET_CONVERSATION = 3000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';

class Detail extends Component {
  state = {
    loading: true,
    refreshing: false,
    request: null,
    comments: [],
    title_request: '',
    text: '',
    user: {},
  };
  timerGetChat = null;
  detailRequestRequest = new APIRequest();
  commentRequestRequest = new APIRequest();
  requests = [this.detailRequestRequest, this.commentRequestRequest];

  componentDidMount() {
    this.getRequest();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    clearTimeout(this.timerGetChat);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return !equal(nextState, this.state);
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  getRequest = async () => {
    const {t} = this.props;
    this.detailRequestRequest.data = ADMIN_APIHandler.site_detail_request_site(
      this.props.siteId,
      this.props.requestId,
    );
    try {
      const response = await this.detailRequestRequest.promise();

      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            request: response.data.request,
            comments: response.data.comments,
            title_request: response.data.title_request,
            user: response.data.main_user,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
      
      this.timerGetChat = setTimeout(this.getRequest, DELAY_GET_CONVERSATION);
    } catch (error) {
      console.log('get_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  };

  handlePressSend = (callBack) => {
    const text = this.state.text.trim();
    if (text) {
      const comments = [...this.state.comments];
      const chatFormat = {
        _id: new Date().getTime() + '',
        createdAt: new Date(),
        text,
        user: this.state.user,
      };
      comments.push(chatFormat);
      this.setState({comments}, () => {
        callBack();
      });

      this.sendRequest({content: text});
      this.setState({
        text: '',
      });
    }
  };

  sendRequest = async (message) => {
    const {t} = this.props;
    const data = message;
    this.commentRequestRequest.data = ADMIN_APIHandler.site_comment_request_site(
      this.props.siteId,
      this.props.requestId,
      data,
    );
    try {
      const response = await this.commentRequestRequest.promise();

      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            comments: response.data.comments,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('send_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  };

  handleChangeText = (text) => {
    this.setState({text});
  };

  _appendMessages(comments, callBack = () => {}, isAppendDirectly = false) {
    const newComments = [...this.state.comments];
    comments.forEach((comment) => {
      if (comment.user._id !== this.state.user._id || isAppendDirectly) {
        newComments.unshift(comment);
      }
    });
    this.setState(
      {
        comments: newComments,
      },
      () => callBack(),
    );
  }

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
    this.sendRequest({content: message});
  };

  getFormattedMessage(type, message) {
    const formattedMessage = {
      _id: String(new Date().getTime()),
      createdAt: new Date(),
      user: this.state.user,
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

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getRequest();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        <Comments
          loading={this.state.loading}
          request={this.state.request}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          comments={this.state.comments}
          onPressSend={this.handlePressSend}
          onSendTempImage={this.handleSendImage}
          onSendImage={this.sendRequest}
          onSendText={this.handleSendText}
          text={this.state.text}
          user={this.state.user}
        />
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default withTranslation()(Detail);
