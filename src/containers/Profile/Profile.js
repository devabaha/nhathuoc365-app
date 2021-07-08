import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  Alert,
  View,
  RefreshControl
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';
import appConfig from 'app-config';
import Header from './Header';
import ComboButton from './ComboButton';
import Gallery from './Gallery';
import Loading from 'src/components/Loading';
import RNFetchBlob from 'rn-fetch-blob';
import { ProfileProvider } from './ProfileContext';
import Communications from 'react-native-communications';
import Intro from './Intro';
import NavBar from './NavBar';
import EventTracker from 'src/helper/EventTracker';

const IMAGE_TYPE = {
  COVER: 'cover',
  IMAGE: 'image'
};

class Profile extends Component {
  static defaultProps = {
    isMainUser: false
  };
  state = {
    userInfo: {},
    gallery: null,
    loading: true,
    refreshing: false,
    upperLayout: undefined,
    animatedScroll: new Animated.Value(0)
  };
  unmounted = false;
  eventTracker = new EventTracker();

  get introData() {
    const { userInfo } = this.state;
    let data = [];
    if (userInfo.premium != MEMBERSHIP_TYPE.STANDARD) {
      data = data.concat([
        {
          title: 'Ngành nghề',
          value: userInfo.name_profession
        },
        {
          title: 'Thương hiệu',
          value: userInfo.brand
        }
      ]);
    }
    data = data.concat([
      {
        title: 'My Facebook',
        select: true,
        value: userInfo.facebook
      },
      {
        title: 'My Youtube',
        select: true,
        value: userInfo.youtube
      }
    ]);

    return data;
  }

  componentDidMount() {
    this.getProfile();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  getProfile = async () => {
    let userInfo = store.user_info;
    if (this.props.userInfo) {
      userInfo = this.props.userInfo;
    }

    const user_id = userInfo.id;

    const { store_id } = store;
    let { t } = this.props;
    if (store_id === undefined || store_id === null) return;

    try {
      const response = await APIHandler.site_user_profile(store_id, user_id);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            userInfo: response.data.user,
            gallery: response.data.images || []
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('site_user_profile', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted && this.setState({ loading: false, refreshing: false });
    }
  };

  handleEdit = () => {
    Actions.push(appConfig.routes.skv_editProfile, {
      user_info: this.state.userInfo,
      refresh: this.getProfile
    });
  };

  handleLogout = () => {
    const { t } = this.props;

    Alert.alert(
      t('signOut.warningTitle'),
      t('signOut.warningDescription'),
      [
        {
          text: t('signOut.cancel'),
          onPress: () => {}
        },
        {
          text: t('signOut.title'),
          onPress: this.logout,
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  logout = async () => {
    this.setState({
      loading: true
    });
    try {
      const { t } = this.props;
      const response = await APIHandler.user_logout();
      switch (response.status) {
        case STATUS_SUCCESS:
          EventTracker.removeUserId();
          store.setUserInfo(response.data);
          store.resetCartData();
          store.setRefreshHomeChange(store.refresh_home_change + 1);
          store.setOrdersKeyChange(store.orders_key_change + 1);
          store.resetAsyncStorage();
          flashShowMessage({
            message: t('account:signOut.successMessage'),
            type: 'info'
          });
          Actions.reset(appConfig.routes.sceneWrapper);
          break;
        default:
          console.log('default');
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  onCall = () => {
    if (!Object.keys(this.state.userInfo).length === 0) {
      return;
    }
    let userName = this.state.userInfo.tel;
    if (this.state.userInfo.name) {
      userName += ' ' + this.state.userInfo.name.trim();
    }

    if (this.state.userInfo.tel && this.state.userInfo.tel != '') {
      Communications.phonecall(this.state.userInfo.tel, true);
    } else {
      Alert.alert(
        'Không thể liên lạc',
        userName + ' chưa đăng ký số điện thoại',
        [{ text: 'Đã hiểu' }]
      );
    }
  };

  onChat = async () => {
    this.setState({
      loading: true
    });
    const { t } = this.props;
    if (!this.state.userInfo) return;
    if (!this.state.userInfo.id) return;

    const data = {
      friend_id: this.state.userInfo.id
    };
    try {
      const response = await APIHandler.user_create_conversation(data);

      if (response && response.status === STATUS_SUCCESS && response.data) {
        Actions.push(appConfig.routes.amazingUserChat, {
          user: response.data.user,
          title: response.data.user.name,
          conversation_id: response.data.conversation_id
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
    } catch (error) {
      console.log('create_conversation', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  };

  uploadMultiTempImage = async images => {
    this.setState({ loading: true });
    const uploadImages = [];
    for (const image of images) {
      const img = await this.uploadTempImageLoop(image);
      uploadImages.push(img);
    }
    this.uploadImage(uploadImages);
  };

  uploadTempImageLoop(image) {
    return new Promise((resolve, reject) => {
      this.uploadTempImage(
        image,
        IMAGE_TYPE.IMAGE,
        data => resolve(data),
        () => reject()
      );
    });
  }

  handleUploadImage(type, data) {
    switch (type) {
      case IMAGE_TYPE.IMAGE:
        this.uploadImage(data);
        break;
      case IMAGE_TYPE.COVER:
        this.uploadCover(data);
        break;
      default:
        this.uploadImage(data);
        break;
    }
  }

  uploadTempImage = (response, type, resolve, reject) => {
    this.setState(
      {
        loading: true
      },
      () => {
        const { t } = this.props;
        const image = {
          name: 'image',
          filename: response.filename,
          data: response.data
        };
        // call api post my form data
        RNFetchBlob.fetch(
          'POST',
          APIHandler.url_user_upload_image(),
          {
            'Content-Type': 'multipart/form-data'
          },
          [image]
        )
          .then(resp => {
            if (!this.unmounted) {
              const { data } = resp;
              const response = JSON.parse(data);
              if (
                response &&
                response.status == STATUS_SUCCESS &&
                response.data
              ) {
                if (resolve) {
                  resolve(response.data.name);
                } else {
                  this.handleUploadImage(type, [response.data.name]);
                }
              } else {
                reject && reject();
                flashShowMessage({
                  type: 'danger',
                  message: response.message || t('common:api.error.message')
                });
                !this.unmounted && this.setState({ loading: false });
              }
            }
          })
          .catch(error => {
            reject && reject();

            console.log(error);
            flashShowMessage({
              type: 'danger',
              message: t('common:api.error.message')
            });
            !this.unmounted && this.setState({ loading: false });
          });
      }
    );
  };

  async uploadImage(images) {
    const data = {
      image_name: images
    };
    const { t } = this.props;
    try {
      const response = await APIHandler.user_upload_image(data);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS && response.data) {
          this.setState({ gallery: response.data.images });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('user_upload_image', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  }

  deleteImage = async images => {
    this.setState({ loading: true });
    if (!Array.isArray(images)) {
      images = [images];
    }
    const data = {
      user_image_ids: images
    };

    const { t } = this.props;
    try {
      const response = await APIHandler.user_delete_image(data);

      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS && response.data) {
          this.setState({ gallery: response.data.images || [] });
          flashShowMessage({
            type: 'success',
            message: response.message
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('user_delete_image', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  };

  async uploadCover(cover) {
    const data = {
      image_cover: cover
    };
    const { t } = this.props;
    try {
      const response = await APIHandler.user_upload_image_cover(data);
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS && response.data) {
          this.setState({ userInfo: response.data.user });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('user_upload_image', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  }

  onUpperLayout = e => {
    this.setState({ upperLayout: e.nativeEvent.layout.height });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getProfile();
  };

  render() {
    const data = {
      isMainUser: this.props.isMainUser,
      upperLayout: this.state.upperLayout,
      animatedScroll: this.state.animatedScroll,
      animatedInputRange: [0, 70]
    };

    return (
      <ProfileProvider value={data}>
        <NavBar
          onEdit={this.handleEdit}
          onLogout={this.handleLogout}
          title={this.state.userInfo.name}
        />
        <Animated.ScrollView
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.animatedScroll
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          style={styles.container}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {this.state.loading && <Loading center />}
          <View onLayout={this.onUpperLayout}>
            <Header
              onEdit={this.handleEdit}
              onLogout={this.handleLogout}
              avatar={this.state.userInfo.avatar}
              cover={this.state.userInfo.image_cover}
              name={this.state.userInfo.name}
              quote={this.state.userInfo.quote}
              address={this.state.userInfo.address_view}
              tel={this.state.userInfo.tel}
              distance={this.state.userInfo.distance}
              premium={this.state.userInfo.premium}
              loading={this.state.loading}
              uploadTempCover={data =>
                this.uploadTempImage(data, IMAGE_TYPE.COVER)
              }
            />
          </View>
          <Gallery
            uploadMultiTempImage={this.uploadMultiTempImage}
            uploadTempImage={this.uploadTempImage}
            onDeleteImage={this.deleteImage}
            data={this.state.gallery}
            headerComponent={
              this.props.isMainUser || (
                <ComboButton
                  style={styles.comboBtn}
                  onCall={this.onCall}
                  onChat={this.onChat}
                />
              )
            }
          />
          <Intro content={this.state.userInfo.intro} data={this.introData} />
        </Animated.ScrollView>
      </ProfileProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingBottom: appConfig.device.bottomSpace,
    backgroundColor: '#fcfcfc'
  },
  icon: {
    color: '#fff',
    fontSize: 22,
    paddingHorizontal: 10,
    ...elevationShadowStyle(7)
  },
  comboBtn: {
    backgroundColor: '#f9f9f9'
  }
});

export default withTranslation(['profileDetail', 'common'])(observer(Profile));
