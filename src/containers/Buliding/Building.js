import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Animated,
  RefreshControl
} from 'react-native';
import HeaderStore from '../../components/stores/HeaderStore';
import appConfig from 'app-config';
import Loading from '../../components/Loading';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';

const BANNER_ABSOLUTE_HEIGHT =
  appConfig.device.height / 3 - appConfig.device.bottomSpace;
const STATUS_BAR_HEIGHT = appConfig.device.isIOS
  ? appConfig.device.isIphoneX
    ? 50
    : 20
  : 0;
const BANNER_VIEW_HEIGHT = BANNER_ABSOLUTE_HEIGHT - STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = appConfig.device.isIOS ? 64 : 54 + STATUS_BAR_HEIGHT;
const COLLAPSED_HEADER_VIEW =
  BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT - STATUS_BAR_HEIGHT;

class Building extends Component {
  state = {
    building: this.props.building,
    scrollY: new Animated.Value(0)
  };
  unmounted = false;

  componentDidMount() {
    this.getBuilding();
    this.state.scrollY.addListener(this.scrollListener);

    // setTimeout(() => {
    //     const { t } = this.props;
    //     appConfig.device.isIOS
    //         ? Actions.refresh({
    //             renderTitle: (
    //                 <NavBar />
    //             ),
    //             title: ''
    //         })
    //         : Actions.refresh({
    //             renderTitle: null,
    //             title: ''
    //         });
    // });
    EventTracker.logEvent('building_page');
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.state.scrollY.removeListener(this.scrollListener);
  }

  scrollListener = ({ value }) => {
    if (value < -70 && this.state.refreshingCate === false) {
      const refCate = this.refCategories[this.state.category_nav_index];
      if (refCate) {
        this.setState({ refreshingCate: true }, () => refCate._onRefresh());
      }
    }
    if (value === 0 && this.state.refreshingCate) {
      this.setState({ refreshingCate: false });
    }
  };

  getBuilding = async () => {
    const { t } = this.props;
    try {
    } catch (err) {
      console.log('get_building', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    }
  };

  render() {
    const { building } = this.state;
    const unreadChat = normalizeNotify(building.unreadChat);
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
        <NavBar />
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
          refreshControl={
            appConfig.device.isAndroid ? (
              <RefreshControl
                progressViewOffset={BANNER_ABSOLUTE_HEIGHT}
                refreshing={this.state.refreshingCate}
                onRefresh={() => this.scrollListener({ value: -400 })}
              />
            ) : null
          }
          contentContainerStyle={{ flexGrow: 1 }}
          style={[styles.container]}
          scrollEventThrottle={16}
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
            { useNativeDriver: true }
          )}
        >
          <Animated.View
            style={{
              height: BANNER_VIEW_HEIGHT,
              width: '100%'
            }}
          />
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
});

export default withTranslation()(Building);
