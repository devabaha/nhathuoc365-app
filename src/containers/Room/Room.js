import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  RefreshControl,
  View
} from 'react-native';
import HeaderStore from '../../components/stores/HeaderStore';
import appConfig from 'app-config';
import store from 'app-store';
import Loading from '../../components/Loading';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import Body from './Body';
import SkeletonLoading from '../../components/SkeletonLoading';
import BuildingSVG from '../../images/building.svg';
import NoResult from '../../components/NoResult';
import { default as RoomActions } from './Actions';
import { servicesHandler } from '../../helper/servicesHandler';

const BANNER_ABSOLUTE_HEIGHT =
  appConfig.device.height / 3.5 - appConfig.device.bottomSpace;
const STATUS_BAR_HEIGHT = appConfig.device.isIOS
  ? appConfig.device.isIphoneX
    ? 50
    : 20
  : 0;
const BANNER_VIEW_HEIGHT = BANNER_ABSOLUTE_HEIGHT - STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = appConfig.device.isIOS
  ? appConfig.device.isIphoneX
    ? 60 + appConfig.device.statusBarHeight
    : 64
  : 54 + STATUS_BAR_HEIGHT;
const COLLAPSED_HEADER_VIEW = BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT;

class room extends Component {
  state = {
    loading: true,
    refreshing: false,
    room: null,
    newses: [],
    sites: [],
    bills: [],
    requests: [],
    title_newses: '',
    title_rooms: '',
    title_sites: '',
    title_bills: '',
    title_requests: '',
    scrollY: new Animated.Value(0),
    actionsHeight: 0
  };
  unmounted = false;
  refTempScrollView = React.createRef();

  get isDataEmpty() {
    const { room, sites, newses } = this.state;
    return !!!room && sites.length === 0 && newses.length === 0;
  }

  componentDidMount() {
    this.getData();
    this.state.scrollY.addListener(this.scrollListener);

    EventTracker.logEvent('building_page');
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.state.scrollY.removeListener(this.scrollListener);
  }

  scrollListener = ({ value }) => {
    if (value < -70 && this.state.refreshing === false) {
      this.setState({ refreshing: true });
    }
    if (value === 0 && this.state.refreshing) {
      this.setState({ refreshing: false });
    }
  };

  apiExcutor = async (
    api,
    siteId,
    roomId,
    onSuccess = () => {},
    onFinally = () => {},
    onError
  ) => {
    const { t } = this.props;
    try {
      const response = await APIHandler[api](siteId, roomId);
      console.log(api, response);
      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          onSuccess(response.data);
        } else {
          const errMess = response.message || t('api.error.message');
          onError
            ? onError(errMess)
            : flashShowMessage({
                type: 'danger',
                message: errMess
              });
        }
      }
    } catch (err) {
      console.log(api, err);
      onError
        ? onError(err)
        : flashShowMessage({
            type: 'danger',
            message: t('api.error.message')
          });
    } finally {
      !this.unmounted && onFinally();
    }
  };

  getData() {
    this.getRoom(this.props.siteId, this.props.roomId);
    this.getBills(this.props.siteId, this.props.roomId);
    this.getRequests(this.props.siteId, this.props.roomId);
  }

  getRoom = (siteId, roomId) => {
    this.apiExcutor(
      'site_room_detail',
      siteId,
      roomId,
      data => {
        this.setState({
          room: data.room,
          newses: data.newses,
          sites: data.sites,
          title_newses: data.title_newses,
          title_sites: data.title_sites
        });
      },
      () => {
        this.setState({
          loading: false,
          refreshing: false
        });
      }
    );
  };

  getBills = (siteId, roomId) => {
    this.apiExcutor(
      'site_bills_room',
      siteId,
      roomId,
      data => {
        console.log(data);
        this.setState({
          bills: data.bills,
          title_bills: data.title_bills
        });
      },
      () => {},
      err => {
        console.log('get_bills', err);
      }
    );
  };

  getRequests = (siteId, roomId) => {
    this.apiExcutor(
      'site_requests_room',
      siteId,
      roomId,
      data => {
        console.log(data);
        this.setState({
          requests: data.requests,
          title_requests: data.title_requests
        });
      },
      () => {},
      err => {
        console.log('get_requests', err);
      }
    );
  };

  handlePressBill = () => {};

  handlePressRequest = () => {};

  handlePressChat = () => {
    const { room } = this.state;
    const { user_info } = store;
    if (room) {
      Actions.amazing_chat({
        site_id: room.id,
        user_id: user_info.id,
        phoneNumber: room.tel,
        title: room.name
      });
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getData();
  };

  handlePressNews = news => {
    Actions.notify_item({
      title: news.title,
      data: news
    });
  };

  handlePressStore = store => {
    servicesHandler({ type: 'open_shop', siteId: store.id }, this.props.t);
  };

  handleActionsLayout = e => {
    this.setState({
      actionsHeight: e.nativeEvent.layout.height
    });
  };

  renderTitle = props => {
    const title =
      this.props.title || (this.state.room ? this.state.room.name : '');
    const textStyle = {
      ...props.style,
      opacity:
        this.isDataEmpty && !this.state.loading
          ? 1
          : this.state.scrollY.interpolate({
              inputRange: [
                0,
                BANNER_ABSOLUTE_HEIGHT / 2,
                COLLAPSED_HEADER_VIEW
              ],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp'
            })
    };
    return <Animated.Text style={textStyle}>{title}</Animated.Text>;
  };

  render() {
    const {
      room,
      newses,
      bills,
      requests,
      sites,
      title_newses,
      title_rooms,
      title_sites,
      title_bills,
      title_requests,
      loading
    } = this.state;
    const unreadChat = room ? normalizeNotify(room.unreadChat) : '';
    const skeletonLoading = loading && !!!room;

    const animated = {
      transform: [
        {
          translateY: this.state.scrollY.interpolate({
            inputRange: [0, COLLAPSED_HEADER_VIEW],
            outputRange: [0, -COLLAPSED_HEADER_VIEW],
            extrapolate: 'clamp'
          })
        }
      ]
    };
    const navBarAnimated = {
      opacity:
        this.isDataEmpty && !loading
          ? 1
          : this.state.scrollY.interpolate({
              inputRange: [
                0,
                COLLAPSED_HEADER_VIEW / 1.2,
                COLLAPSED_HEADER_VIEW
              ],
              outputRange: [0, 0, 1],
              extrapolate: 'clamp'
            })
    };

    const infoContainerStyle = {
      height: BANNER_VIEW_HEIGHT / 1.618,
      opacity: this.state.scrollY.interpolate({
        inputRange: [0, COLLAPSED_HEADER_VIEW / 1.2],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    };

    const imageBgStyle = {
      transform: [
        {
          scale: this.state.scrollY.interpolate({
            inputRange: [0, COLLAPSED_HEADER_VIEW],
            outputRange: [1, 1.1],
            extrapolate: 'clamp'
          })
        }
      ]
    };

    return (
      <View style={styles.screenContainer}>
        <SafeAreaView style={styles.container}>
          {loading && <Loading center />}
          <NavBar maskStyle={navBarAnimated} renderTitle={this.renderTitle} />

          <SkeletonLoading loading={skeletonLoading} style={styles.skeleton}>
            {!!room && (
              <HeaderStore
                active={null}
                hideChat
                avatarUrl={room.logo_url}
                bannerUrl={room.image_url}
                containerStyle={{
                  height: BANNER_ABSOLUTE_HEIGHT + this.state.actionsHeight,
                  ...animated
                }}
                wrapperStyle={{
                  height: BANNER_ABSOLUTE_HEIGHT
                }}
                infoContainerStyle={infoContainerStyle}
                imageBgStyle={imageBgStyle}
                title={room.name}
                subTitle={room.address}
                extraComponent={
                  <RoomActions
                    onLayout={this.handleActionsLayout}
                    onBillPress={this.handlePressBill}
                    onRequestPress={this.handlePressRequest}
                    onChatPress={this.handlePressChat}
                    chatNoti={unreadChat}
                  />
                }
              />
            )}
          </SkeletonLoading>

          <Animated.ScrollView
            ref={this.refScrollView}
            contentContainerStyle={{ flexGrow: 1 }}
            style={[styles.container]}
            scrollEventThrottle={1}
            refreshControl={
              appConfig.device.isAndroid ? (
                <RefreshControl
                  progressViewOffset={
                    BANNER_ABSOLUTE_HEIGHT + this.state.actionsHeight
                  }
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              ) : null
            }
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: this.state.scrollY
                    }
                  }
                }
              ],
              {
                useNativeDriver: true
              }
            )}
          >
            <Animated.View
              style={{
                height: this.isDataEmpty
                  ? NAV_BAR_HEIGHT
                  : BANNER_VIEW_HEIGHT + this.state.actionsHeight,
                width: '100%'
              }}
            />

            <ScrollView
              refreshControl={
                appConfig.device.isIOS ? (
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                ) : null
              }
            >
              {this.isDataEmpty && !loading ? (
                <NoResult
                  containerStyle={{ paddingTop: '30%' }}
                  icon={
                    <BuildingSVG
                      width={appConfig.device.width / 3}
                      height={appConfig.device.width / 3}
                      fill={appConfig.colors.primary}
                    />
                  }
                  message="Chưa có dữ liệu"
                />
              ) : (
                !loading && (
                  <>
                    <Body
                      refreshing={this.state.refreshing}
                      newses={newses}
                      sites={sites}
                      bills={bills}
                      requests={requests}
                      title_bills={title_bills}
                      title_requests={title_requests}
                      title_newses={title_newses}
                      title_rooms={title_rooms}
                      title_sites={title_sites}
                      onPressNews={this.handlePressNews}
                      onPressStore={this.handlePressStore}
                      onPressBill={this.handlePressBill}
                      onPressRequest={this.handlePressRequest}
                    />
                  </>
                )
              )}
            </ScrollView>
          </Animated.ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1
  },
  skeleton: {
    width: '100%',
    height: BANNER_ABSOLUTE_HEIGHT,
    backgroundColor: 'rgba(59,52,70, .65)',
    position: 'absolute',
    zIndex: 1
  }
});

export default withTranslation()(room);
