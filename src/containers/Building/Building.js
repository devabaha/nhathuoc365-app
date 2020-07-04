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

const BANNER_ABSOLUTE_HEIGHT =
  appConfig.device.height / 3 - appConfig.device.bottomSpace;
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

class Building extends Component {
  state = {
    loading: true,
    refreshing: false,
    building: null,
    newses: [],
    rooms: [],
    sites: [],
    promotions: [],
    title_newses: '',
    title_rooms: '',
    title_sites: '',
    scrollY: new Animated.Value(0)
  };
  unmounted = false;
  refTempScrollView = React.createRef();

  componentDidMount() {
    this.getBuilding(this.props.siteId);
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

  getBuilding = async siteId => {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_building_detail(siteId);
      console.log(response);
      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          this.setState({
            building: response.data.building,
            newses: response.data.newses,
            rooms: response.data.rooms,
            sites: response.data.sites,
            promotions: response.data.promotions,
            title_newses: response.data.title_newses,
            title_rooms: response.data.title_rooms,
            title_sites: response.data.title_sites
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (err) {
      console.log('get_building', err);
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

  handlePressChat = () => {
    const { building } = this.state;
    const { user_info } = store;
    if (building) {
      Actions.amazing_chat({
        site_id: building.id,
        user_id: user_info.id,
        phoneNumber: building.tel,
        title: building.name
      });
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getBuilding(this.props.siteId);
  };

  renderTitle = props => {
    const title = this.state.building ? this.state.building.name : '';
    const textStyle = {
      ...props.style,
      opacity: this.state.scrollY.interpolate({
        inputRange: [0, BANNER_ABSOLUTE_HEIGHT / 2, COLLAPSED_HEADER_VIEW],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })
    };
    return <Animated.Text style={textStyle}>{title}</Animated.Text>;
  };

  handlePressNews = news => {
    Actions.notify_item({
      title: news.title,
      data: news
    });
  };

  handlePressStore = store => {
    Actions.push(appConfig.routes.supplierStore, {
      store_id: store.id,
      title: store.title
    });
  };

  handlePressRoom = room => {
    Actions.push(appConfig.routes.room, {
      roomId: room.id,
      siteId: room.site_id,
      title: room.name
    });
  };

  render() {
    const {
      building,
      newses,
      promotions,
      title_newses,
      title_rooms,
      title_sites,
      rooms,
      sites,
      loading
    } = this.state;
    const unreadChat = building ? normalizeNotify(building.unreadChat) : '';
    const skeletonLoading = loading && !!!building;
    const isDataEmpty =
      !!!building &&
      rooms.length === 0 &&
      sites.length === 0 &&
      newses.length === 0;

    const animated = {
      transform: [
        {
          translateY: this.state.scrollY.interpolate({
            inputRange: [0, COLLAPSED_HEADER_VIEW],
            outputRange: [0, -COLLAPSED_HEADER_VIEW],
            extrapolate: 'clamp'
          })
        }
      ],
      opacity: this.state.scrollY.interpolate({
        inputRange: [0, COLLAPSED_HEADER_VIEW / 1.2, COLLAPSED_HEADER_VIEW],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp'
      })
    };
    const navBarAnimated = {
      opacity:
        isDataEmpty && !loading
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
            {!!building && (
              <HeaderStore
                active={null}
                avatarUrl={building.logo_url}
                bannerUrl={building.image_url}
                containerStyle={{
                  height: BANNER_ABSOLUTE_HEIGHT,
                  ...animated
                }}
                infoContainerStyle={infoContainerStyle}
                imageBgStyle={imageBgStyle}
                onPressChat={this.handlePressChat}
                title={building.name}
                subTitle={building.address}
                unreadChat={unreadChat}
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
                  progressViewOffset={BANNER_ABSOLUTE_HEIGHT}
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
                height: isDataEmpty ? NAV_BAR_HEIGHT : BANNER_VIEW_HEIGHT,
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
              {isDataEmpty && !loading ? (
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
                <Body
                  refreshing={this.state.refreshing}
                  newses={newses}
                  rooms={rooms}
                  sites={sites}
                  promotions={promotions}
                  title_newses={title_newses}
                  title_rooms={title_rooms}
                  title_sites={title_sites}
                  onPressNews={this.handlePressNews}
                  onPressStore={this.handlePressStore}
                  onPressRoom={this.handlePressRoom}
                />
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
    position: 'absolute'
  }
});

export default withTranslation()(Building);
