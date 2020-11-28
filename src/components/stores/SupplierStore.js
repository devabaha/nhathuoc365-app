import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  RefreshControl,
  Animated,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import Button from 'react-native-button';
import appConfig from 'app-config';
import IconFeather from 'react-native-vector-icons/Feather';
import { willUpdateState } from '../../packages/tickid-chat/helper';
import CategoryScreen from './CategoryScreen';
import HeaderStore from './HeaderStore';
import Loading from '../Loading';
import EventTracker from '../../helper/EventTracker';

const CATE_AUTO_LOAD = 'CateAutoLoad';
const BANNER_ABSOLUTE_HEIGHT = 140 - appConfig.device.bottomSpace;
const STATUS_BAR_HEIGHT = 0;
const BANNER_VIEW_HEIGHT = BANNER_ABSOLUTE_HEIGHT - STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = 0;
const COLLAPSED_HEADER_VIEW =
  BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT - STATUS_BAR_HEIGHT;

class SupplierStore extends Component {
  static propTypes = {
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    categoryId: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshingCate: false,
      category_nav_index: 0,
      categories_data: null,
      selected_category: { id: 0, name: '' },
      scrollY: new Animated.Value(0),
      flatListHeight: undefined,
      store: {},
      siteNotify: {
        favor_flag: 0,
        notify_chat: 0
      }
    };

    this.unmounted = false;
    this.flatListPagesHeight = [];
    this.refScrollView = React.createRef();
    this.refCategories = [];
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this._getNotifySite();
    this._initial(this.props);
    this.state.scrollY.addListener(this.scrollListener);

    this.eventTracker.logCurrentView();
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

  componentWillReceiveProps(nextProps) {
    if (this.props.title != nextProps.title) {
      this.setState(
        {
          loading: true,
          category_nav_index: 0,
          categories_data: null
        },
        () => {
          this._initial(nextProps);
        }
      );
    }
  }

  _initial(props) {
    // get categories navigator
    this._getCategoriesNavFromServer();
  }

  _unMount() {
    Events.trigger(CATE_AUTO_LOAD);
    Events.removeAll(CATE_AUTO_LOAD);
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  parseDataCategories(response) {
    const { t } = this.props;
    if (!this.props.categoryId) {
      response.data.categories.unshift({ id: 0, name: t('tabs.store.title') });
    }

    this.setState(
      {
        categories_data: response.data.categories,
        promotions: response.data.promotions
      },
      () =>
        this.state.categories_data.map((item, index) => {
          if (!this.props.goCategory) return;
          if (this.props.goCategory === item.id) {
            this._changeCategory(item, index);
            return;
          }
        })
    );
  }

  handleSearchInStore = () => {
    Actions.push(appConfig.routes.searchStore, {
      categories: this.state.categories_data,
      category_id: this.state.selected_category.id,
      category_name:
        this.state.selected_category.id !== 0
          ? this.state.selected_category.name
          : ''
    });
  };

  _getNotifySite = async () => {
    try {
      var response = await APIHandler.site_notify(store.store_id);
      console.log(response);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          this.setState({
            siteNotify: response.data
          });
        }
      }
    } catch (e) {
      console.log(e + ' site_notify');
    }
  };

  _getCategoriesNavFromServer = async () => {
    try {
      var response = await APIHandler.site_info(
        this.props.store_id,
        this.props.categoryId
      );
      if (response && response.status == STATUS_SUCCESS) {
        willUpdateState(this.unmounted, () => {
          this.setState({ store: response.data, loading: false });
          this.parseDataCategories(response);
        });
      }
    } catch (e) {
      console.log(e + ' site_info');
    }
  };

  handlePressFollow = async () => {
    const siteId = this.props.store_id;
    const active = this.state.siteNotify.favor_flag ? 0 : 1;
    this.setState({
      loading: true
    });
    try {
      const response = await APIHandler.user_update_favor_site(siteId, active);
      if (!this.unmounted) {
        if (response.status === STATUS_SUCCESS) {
          this.setState(prevState => ({
            siteNotify: {
              ...prevState.siteNotify,
              favor_flag: active
            }
          }));
          flashShowMessage({
            type: 'success',
            message: response.message
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message
          });
        }
      }
    } catch (error) {
      console.log('update_follow_store', error);
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  handlePressChat = () => {
    const { store: storeData } = this.state;
    if (store) {
      Actions.amazing_chat({
        titleStyle: { width: 220 },
        phoneNumber: storeData.tel,
        title: storeData.name,
        site_id: storeData.id,
        user_id: store.user_info.id
      });
    }
  };

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        <Button
          onPress={() => {
            Actions.push(appConfig.routes.searchStore, {
              categories: this.state.categories_data,
              category_id: this.state.selected_category.id,
              category_name:
                this.state.selected_category.id !== 0
                  ? this.state.selected_category.name
                  : ''
            });
          }}
        >
          <IconFeather size={26} color={appConfig.colors.white} name="search" />
        </Button>
      </View>
    );
  }

  _changeCategory(item, index, nav_only) {
    this.setState({ flatListHeight: this.flatListPagesHeight[index] });
    if (this.refs_category_nav) {
      const categories_count = this.state.categories_data.length;
      const end_of_list = categories_count - index - 1 >= 3;

      setTimeout(() =>
        willUpdateState(this.unmounted, () => {
          // nav
          if (index > 0 && end_of_list) {
            this.refs_category_nav.scrollToIndex({
              index: index - 1,
              animated: true
            });
          } else if (!end_of_list) {
            this.refs_category_nav.scrollToEnd();
          } else if (index == 0) {
            this.refs_category_nav.scrollToIndex({ index, animated: true });
          }

          if (this.refs_category_screen && !nav_only) {
            this.refs_category_screen.scrollToIndex({
              index: index,
              animated: true
            });
          }
        })
      );

      if (item) {
        this.setState({
          category_nav_index: index,
          selected_category: item
        });
      } else if (nav_only) {
        this.setState({
          category_nav_index: index,
          selected_category: this.state.categories_data[index]
        });
      }
    }
  }

  handleLayoutFlatListContent = (e, index) => {
    if (e.nativeEvent) {
      const { height } = e.nativeEvent.layout;
      this.flatListPagesHeight[index] = height;

      this.setState({
        flatListHeight: height
      });
    }
  };

  _onRefreshCateEnd = () => {
    if (!this.unmounted) {
      appConfig.device.isAndroid &&
        this.setState({
          refreshingCate: false
        });
    }
  };

  render() {
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

    unreadChat = normalizeNotify(
      this.state.siteNotify ? this.state.siteNotify.unreadChat : ''
    );

    const { t } = this.props;
    return (
      <SafeAreaView style={[styles.container]}>
        {this.state.loading && <Loading center />}
        <HeaderStore
          active={this.state.siteNotify.favor_flag}
          avatarUrl={this.state.store.logo_url}
          bannerUrl={this.state.store.image_url}
          containerStyle={{
            height: BANNER_ABSOLUTE_HEIGHT,
            ...animated
          }}
          infoContainerStyle={infoContainerStyle}
          imageBgStyle={imageBgStyle}
          onPressChat={this.handlePressChat}
          onPressFollow={this.handlePressFollow}
          title={this.state.store.name}
          subTitle={this.state.store.address}
          description={this.state.siteNotify.favor_count}
          unreadChat={unreadChat}
        />

        <Animated.View
          style={[
            styles.categories_nav,
            {
              zIndex: 2,
              transform: [
                {
                  translateY: this.state.scrollY.interpolate({
                    inputRange: [
                      0,
                      1,
                      BANNER_ABSOLUTE_HEIGHT -
                        NAV_BAR_HEIGHT -
                        STATUS_BAR_HEIGHT
                    ],
                    outputRange: [
                      BANNER_VIEW_HEIGHT,
                      BANNER_VIEW_HEIGHT,
                      NAV_BAR_HEIGHT
                    ],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }
          ]}
        >
          {this.state.categories_data != null ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              ref={ref => (this.refs_category_nav = ref)}
              onScrollToIndexFailed={() => {}}
              data={this.state.categories_data}
              extraData={this.state.category_nav_index}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              style={styles.categories_nav}
              renderItem={({ item, index }) => {
                let active = this.state.category_nav_index == index;
                return (
                  <TouchableHighlight
                    onPress={() => this._changeCategory(item, index)}
                    underlayColor="transparent"
                  >
                    <View style={styles.categories_nav_items}>
                      <Text
                        style={[
                          styles.categories_nav_items_title,
                          active
                            ? styles.categories_nav_items_title_active
                            : null
                        ]}
                      >
                        {item.name}
                      </Text>

                      {active && (
                        <View style={styles.categories_nav_items_active} />
                      )}
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          ) : (
            <Indicator size="small" />
          )}
        </Animated.View>

        <Animated.ScrollView
          ref={this.refScrollView}
          removeClippedSubviews={appConfig.device.isAndroid}
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

          <Animated.View style={[styles.container]}>
            {this.state.categories_data != null ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ref={ref => (this.refs_category_screen = ref)}
                onScrollToIndexFailed={() => {}}
                data={this.state.categories_data}
                extraData={this.state.category_nav_index}
                keyExtractor={item => `${item.id}`}
                horizontal={true}
                pagingEnabled
                onMomentumScrollEnd={this._onScrollEnd.bind(this)}
                style={{
                  width: Util.size.width
                }}
                contentContainerStyle={{ height: this.state.flatListHeight }}
                getItemLayout={(data, index) => {
                  return {
                    length: Util.size.width,
                    offset: Util.size.width * index,
                    index
                  };
                }}
                renderItem={({ item, index }) => {
                  return (
                    <CategoryScreen
                      ref={inst => (this.refCategories[index] = inst)}
                      scrollEnabled={false}
                      activeRefreshControl={appConfig.device.isIOS}
                      refreshing={
                        index === this.state.category_nav_index &&
                        this.state.refreshingCate
                      }
                      store_id={this.props.store_id}
                      item={item}
                      index={index}
                      cate_index={this.state.category_nav_index}
                      that={this}
                      onLayout={e => this.handleLayoutFlatListContent(e, index)}
                      onRefreshEnd={this._onRefreshCateEnd}
                      minHeight={appConfig.device.height / 2}
                    />
                  );
                }}
              />
            ) : (
              <Indicator />
            )}
          </Animated.View>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this._changeCategory(null, pageNum, true);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  right_btn_box: {
    flexDirection: 'row'
  },

  items_box: {
    width: Util.size.width
  },

  categories_nav: {
    backgroundColor: '#ffffff',
    zIndex: 1,
    height: 40,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd'
  },
  categories_nav_items: {
    justifyContent: 'center',
    height: '100%'
  },
  categories_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#666666'
  },
  categories_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: DEFAULT_COLOR
  }
});

export default withTranslation(['stores', 'cart'])(observer(SupplierStore));
