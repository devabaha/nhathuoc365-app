import React, {Component} from 'react';
// 3-party libs
import KeyboardSpacer from 'react-native-keyboard-spacer';
import equal from 'deep-equal';
// configs
import appConfig from 'app-config';
// helpers
import {servicesHandler} from 'app-helper/servicesHandler';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {RIGHT_BUTTON_TYPE} from 'src/components/RightButtonNavBar/constants';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Comments from './Comments';
import Loading from 'src/components/Loading';
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import {ScreenWrapper, RefreshControl} from 'src/components/base';

const DELAY_GET_CONVERSATION = 3000;
const MESSAGE_TYPE_TEXT = 'text';
const MESSAGE_TYPE_IMAGE = 'image';

class Detail extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    callbackReload: () => {},
  };

  state = {
    loading: true,
    refreshing: false,
    request: null,
    comments: [],
    title_request: '',
    text: '',
    user: {},
    forceUpdate: false,
  };
  unmounted = false;
  timerGetChat = null;
  editRequestOptionIndex = 0;
  updateStatusRequestOptionIndex = 1;

  updateStatusRequest = new APIRequest();
  requests = [this.updateStatusRequest];

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getRequest(this.updateRightNavBar);

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );

    setTimeout(() =>
      refresh({
        title: this.props.title || this.props.t('screen.requests.detailTitle'),
        onBack: () => {
          this.props.callbackReload();
          pop();
        },
      }),
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    cancelRequests(this.requests);
    this.updateNavBarDisposer();
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

  getRequest = async (
    callbackSuccess = () => {},
    callbackFinally = () => {},
  ) => {
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
          });
          callbackSuccess(response.data);
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
      if (this.unmounted) return;

      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      if (!this.unmounted) {
        this.setState({
          loading: false,
          refreshing: false,
          forceUpdate: false,
        });
      }
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

  updateStatus = async () => {
    this.setState({loading: true});
    const data = {
      status_id: this.state.request?.status_id === 4 ? 0 : 4,
    };
    this.updateStatusRequest.data = APIHandler.site_update_status_request_room(
      this.props.siteId,
      this.props.roomId,
      this.props.requestId,
      data,
    );

    try {
      const response = await this.updateStatusRequest.promise();
      if (this.unmounted) return;
      if (response?.status === STATUS_SUCCESS) {
        if (response.data) {
          this.setState({request: response.data.request});
          this.updateRightNavBar(response.data);
        }
        flashShowMessage({
          type: 'success',
          message: response?.message,
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || this.props.t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('error_update_status', error);
      flashShowMessage({
        type: 'danger',
        message: this.props.t('api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({loading: false});
    }
  };

  editRequest = () => {
    setTimeout(() =>
      servicesHandler({
        type: SERVICES_TYPE.CREATE_REQUEST,
        theme: this.theme,
        title: this.props.t('request:editRequest'),
        site_id: this.props.siteId,
        request: this.state.request,
        object_id: this.state.request?.object_id,
        object_type: this.props.request?.object_type,
        object: this.state.request?.object,
        onRefresh: () => {
          this.setState({loading: true, forceUpdate: true});
          this.getRequest();
        },
      }),
    );
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getRequest();
  };

  updateRightNavBar = ({request}) => {
    let moreOptions = [
      this.props.t('edit'),
      this.props.t('request:closeRequest'),
    ];
    let destructiveMoreOptionsIndex = 1;

    this.editRequestOptionIndex = 0;
    this.updateStatusRequestOptionIndex = 1;

    if (request?.status_id === 4) {
      moreOptions[1] = [this.props.t('request:reopenRequest')];
      destructiveMoreOptionsIndex = undefined;
    }
    moreOptions.push(this.props.t('cancel'));

    refresh({
      right: this.renderRightNavBar(moreOptions, destructiveMoreOptionsIndex),
    });
  };

  handlePressAction = (actionIndex) => {
    switch (actionIndex) {
      case this.editRequestOptionIndex:
        this.editRequest();
        break;
      case this.updateStatusRequestOptionIndex:
        this.updateStatus();
        break;
    }
  };

  renderRightNavBar = (moreOptions, destructiveMoreOptionsIndex) => {
    return (
      <RightButtonNavBar
        type={RIGHT_BUTTON_TYPE.MORE}
        moreOptions={moreOptions}
        moreActionsProps={{
          destructiveButtonIndex: destructiveMoreOptionsIndex,
        }}
        onPressMoreAction={this.handlePressAction}
      />
    );
  };

  render() {
    return (
      <ScreenWrapper>
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
          forceUpdate={this.state.forceUpdate}
        />
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </ScreenWrapper>
    );
  }
}

export default withTranslation(['common', 'request'])(Detail);
