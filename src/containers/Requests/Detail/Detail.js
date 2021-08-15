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
    receptionStaffs: [],
    selectedStaff: {},
    loadingReceptionStaffs: true,
  };
  unmounted = false;
  timerGetChat = null;

  componentDidMount() {
    this.getRequest();
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.timerGetChat);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return (
        nextState.loading !== this.state.loading ||
        nextState.refreshing !== this.state.refreshing ||
        nextState.text !== this.state.text ||
        nextState.title_request !== this.state.title_request ||
        nextState.loadingReceptionStaffs !==
          this.state.loadingReceptionStaffs ||
        !equal(nextState.receptionStaffs, this.state.receptionStaffs) ||
        !equal(nextState.selectedStaff, this.state.selectedStaff) ||
        !equal(nextState.user, this.state.user) ||
        !equal(nextState.comments, this.state.comments) ||
        !equal(nextState.request, this.state.request)
      );
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  getRequest = async () => {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_detail_request_room(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId,
      );

      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            request: response.data.request,
            comments: response.data.comments,
            title_request: response.data.title_request,
            user: response.data.main_user,
            status: this.normalizeDataForPicker(response.data.status),
          });
          this.getListRequestReceptionStaff();
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      }
      this.timerGetChat = setTimeout(
        () => this.getRequest(),
        DELAY_GET_CONVERSATION,
      );
    } catch (error) {
      console.log('get_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false,
        });
    }
  };

  async getListRequestReceptionStaff() {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_get_list_admin_staff(
        this.props.siteId,
      );
      if (!this.unmounted) {
        if (response) {
          if (response.status === STATUS_SUCCESS && response.data) {
            const receptionStaffs = this.normalizeDataForPicker(
              response.data.users,
            );
            const selectedStaff =
              receptionStaffs.find(
                (staff) => staff.id === this.state.request.admin_id,
              ) || {};
            this.setState({receptionStaffs, selectedStaff});
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
      }
    } catch (err) {
      console.log('getListRequestReceptionStaff', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loadingReceptionStaffs: false});
    }
  }

  changeSelectedStaff = async (admin_id) => {
    this.setState({loading: true});
    const {t} = this.props;
    const data = {admin_id};
    try {
      const response = await APIHandler.site_change_admin_request(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId,
        data,
      );
      if (!this.unmounted) {
        if (response) {
          if (response.status === STATUS_SUCCESS && response.message) {
            flashShowMessage({
              type: 'success',
              message: response.message,
            });
            setTimeout(() => {
              this.setState({loadingReceptionStaffs: true}, () => {
                this.getRequest();
                this.props.reloadData();
              });
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: t('api.error.message'),
          });
        }
      }
    } catch (err) {
      console.log('getListRequestReceptionStaff', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  normalizeDataForPicker(data) {
    return data.map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  }

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
    try {
      const response = await APIHandler.site_comment_request_room(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId,
        data,
      );
      if (!this.unmounted && response) {
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
      }
    } catch (error) {
      console.log('send_request', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false,
        });
    }
  };

  handleUpdateStatus = async (status_id) => {
    this.setState({loading: true});
    const {t} = this.props;
    const data = {
      status_id,
    };
    try {
      const response = await APIHandler.site_update_request_status_room(
        this.props.siteId,
        this.props.roomId,
        this.props.requestId,
        data,
      );
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            request: response.data.request,
          });
          this.props.reloadData();
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      }
    } catch (error) {
      console.log('update_request_status', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted &&
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
          onUpdateStatus={this.handleUpdateStatus}
          status={this.state.status}
          text={this.state.text}
          user={this.state.user}
          receptionStaffs={this.state.receptionStaffs}
          selectedStaff={this.state.selectedStaff}
          loadingReceptionStaffs={this.state.loadingReceptionStaffs}
          onChangeStaff={this.changeSelectedStaff}
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
