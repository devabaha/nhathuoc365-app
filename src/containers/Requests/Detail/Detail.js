import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import appConfig from 'app-config';

import Loading from '../../../components/Loading';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Comments from './Comments';

export const DEFAULT_USER_ID = 'home_id_user';
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
    user: this.user
  };
  unmounted = false;

  get user() {
    let _id = DEFAULT_USER_ID;

    return {
      _id
      //   name: store.store_data.name,
      //   avatar: store.store_data.logo_url
    };
  }

  componentDidMount() {
    this.getRequest();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getRequest = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_detail_request_room(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            request: response.data.request,
            comments: this.normalizeComments(response.data.comments),
            title_request: response.data.title_request
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      } else {
        throw Error(response);
      }
    } catch (error) {
      console.log('get_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  };

  normalizeComments(comments) {
    return comments.map((comment, index) => {
      const [date = '', hour = ''] = comment.create.split(' ');
      const message = {
        createdAt: comment.create,
        day: date.trim(),
        hour: hour.trim(),
        text: comment.content
      };
      const chatFormat = {
        _id: new Date().getTime() + '',
        createdAt: comment.create,
        text: comment.content,
        user: {
          _id: comment.user_name || DEFAULT_USER_ID
        }
      };
      return {
        ...comment,
        message,
        ...chatFormat
      };
    });
  }

  handlePressSend = callBack => {
    const text = this.state.text.trim();
    if (text) {
      const date = new Date();
      const day =
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      const hour = date.getHours() + ':' + date.getMinutes();
      const comments = [...this.state.comments];
      const message = {
        createdAt: day + ' ' + hour,
        day: day.trim(),
        hour: hour.trim(),
        text
      };
      comments.push({ message });
      this.setState({ comments }, () => {
        callBack();
      });

      this.sendRequest(text);
      this.setState({
        text: ''
      });
    }
  };

  sendRequest = async text => {
    const { t } = this.props;
    const data = {
      content: text
    };
    try {
      const response = await APIHandler.site_comment_request_room(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId,
        data
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            comments: this.normalizeComments(response.data.comments)
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      } else {
        throw Error(response);
      }
    } catch (error) {
      console.log('send_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  };

  handleChangeText = text => {
    this.setState({ text });
  };

  _appendMessages(comments, callBack = () => {}, isAppendDirectly = false) {
    const newComments = [...this.state.comments];
    comments.forEach(comment => {
      if (comment.user._id !== this.state.user._id || isAppendDirectly) {
        newComments.unshift(comment);
      }
    });
    this.setState(
      {
        comments: newComments
      },
      () => callBack()
    );
  }

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
    this.sendRequest(message);
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

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getRequest();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        <Comments
          loading={this.state.loading}
          headerData={this.state.request}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          comments={this.state.comments}
          onPressSend={this.handlePressSend}
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
    flex: 1
  },
  emptyText: {
    color: '#666',
    textAlign: 'center'
  }
});

export default withTranslation()(Detail);
