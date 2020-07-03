import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  RefreshControl
} from 'react-native';
import HeaderStore from '../../components/stores/HeaderStore';
import appConfig from 'app-config';
import store from 'app-store';
import Loading from '../../components/Loading';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import Body from './Body';

const BANNER_ABSOLUTE_HEIGHT =
  appConfig.device.height / 3 - appConfig.device.bottomSpace;
const STATUS_BAR_HEIGHT = appConfig.device.isIOS
  ? appConfig.device.isIphoneX
    ? 50
    : 20
  : 0;
const BANNER_VIEW_HEIGHT = BANNER_ABSOLUTE_HEIGHT - STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = appConfig.device.isIOS ? 64 : 54 + STATUS_BAR_HEIGHT;
const COLLAPSED_HEADER_VIEW = BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT;

class Room extends Component {
  state = {
    loading: true,
    refreshing: false,
    building: null,
    newses: [],
    rooms: [],
    sites: [],
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
      const response = await APIHandler.user_building_detail(siteId);
      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          this.setState({
            building: response.data.building,
            newses: response.data.newses,
            rooms: response.data.rooms,
            sites: response.data.sites,
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

  render() {
    const {
      building,
      newses,
      title_newses,
      title_rooms,
      title_sites,
      rooms,
      sites
    } = this.state;
    const unreadChat = building ? normalizeNotify(building.unreadChat) : '';
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
        inputRange: [0, COLLAPSED_HEADER_VIEW, COLLAPSED_HEADER_VIEW],
        outputRange: [1, 1, 0],
        extrapolate: 'clamp'
      })
    };
    const navBarAnimated = {
      opacity: this.state.scrollY.interpolate({
        inputRange: [0, COLLAPSED_HEADER_VIEW / 2, COLLAPSED_HEADER_VIEW],
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
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        <NavBar maskStyle={navBarAnimated} renderTitle={this.renderTitle} />
        {!!building && (
          <>
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
            <Animated.ScrollView
              ref={this.refScrollView}
              contentContainerStyle={{ flexGrow: 1 }}
              style={[styles.container]}
              scrollEventThrottle={1}
              refreshControl={
                appConfig.device.iaAndroid ? (
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
                  height: BANNER_VIEW_HEIGHT,
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
                <Body
                  refreshing={this.state.refreshing}
                  newses={newses}
                  rooms={rooms}
                  sites={sites}
                  title_newses={title_newses}
                  title_rooms={title_rooms}
                  title_sites={title_sites}
                  onPressNews={this.handlePressNews}
                  onPressStore={this.handlePressStore}
                />
              </ScrollView>
            </Animated.ScrollView>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default withTranslation()(Room);
