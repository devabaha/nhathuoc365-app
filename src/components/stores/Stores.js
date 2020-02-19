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
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import RightButtonChat from '../RightButtonChat';
import RightButtonOrders from '../RightButtonOrders';
import Button from 'react-native-button';
import appConfig from 'app-config';
import IconFeather from 'react-native-vector-icons/Feather';
import { willUpdateState } from '../../packages/tickid-chat/helper';
import CategoryScreen from './CategoryScreen';
import HeaderStore from './HeaderStore';
import StoreNavBar from './StoreNavBar';

const CATE_AUTO_LOAD = 'CateAutoLoad';
const BANNER_ABSOLUTE_HEIGHT = appConfig.device.height / 3;
const STATUS_BAR_HEIGHT = 20;
const BANNER_VIEW_HEIGHT = BANNER_ABSOLUTE_HEIGHT - STATUS_BAR_HEIGHT;
const NAV_BAR_HEIGHT = appConfig.device.isIOS ? 64 : 54 + STATUS_BAR_HEIGHT;
const COLLAPSED_HEADER_VIEW = BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT;

class Stores extends Component {
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
      scrollY: new Animated.Value(0),
      flatListHeight: undefined
    };

    this.unmounted = false;
    this.flatListPagesHeight = [];
    this.refScrollView = React.createRef();
    this.refCategories = [];

    action(() => {
      store.setStoresFinish(false);
    })();
  }

  componentDidMount() {
    this._initial(this.props);
    this.state.scrollY.addListener(this.scrollListener);

    // pass add store tutorial
    var key_tutorial = 'KeyTutorialGoStore' + store.user_info.id;
    storage.save({
      key: key_tutorial,
      data: { finish: true },
      expires: null
    });

    setTimeout(() => {
      appConfig.device.isIOS
        ? Actions.refresh({
            // right: this._renderRightButton(),
            renderTitle: (
              <StoreNavBar
                onPressSearch={this.handleSearchInStore}
                placeholder="Tìm kiếm trong cửa hàng..."
              />
            ),
            title: ''
          })
        : Actions.refresh({
            // right: this._renderRightButton(),
            renderTitle: null,
            title: ''
          });
    });
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
      action(() => {
        store.setStoresFinish(false);
      })();

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
    this.start_time = time();

    // get categories navigator
    this._getCategoriesNavFromServer();

    // update order information
    this._getCart();

    // callback when unmount this sreen
    store.setStoreUnMount('stores', this._unMount.bind(this));

    // if (props.orderIsPop) {
    //   store.orderIsPop = true;
    // }
  }

  _unMount() {
    Events.trigger(CATE_AUTO_LOAD);
    Events.removeAll(CATE_AUTO_LOAD);

    // store.orderIsPop = false;
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 400 - Math.abs(time() - this.start_time);
    return delay;
  }

  parseDataCategories(response) {
    if (!this.props.categoryId) {
      response.data.categories.unshift({ id: 0, name: 'Cửa hàng' });
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
    Actions.push(appConfig.routes.searchStore);
  };

  _getCategoriesNavFromServer = async () => {
    try {
      var response = await APIHandler.site_info(
        store.store_id,
        this.props.categoryId
      );
      if (response && response.status == STATUS_SUCCESS) {
        // setTimeout(
        //   () =>
        willUpdateState(this.unmounted, () =>
          this.parseDataCategories(response)
        );
        //   ,this._delay()
        // );
      }
    } catch (e) {
      console.log(e + ' site_info');

      store.addApiQueue('site_info', this._getCategoriesNavFromServer);
    }
  };

  _getCart = async () => {
    try {
      var response = await APIHandler.site_cart(store.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
        })();
      } else {
        action(() => {
          store.resetCartData();
        })();
      }
    } catch (e) {
      console.log(e + ' site_cart');
      store.addApiQueue('site_cart', this._getCart.bind(this));
    }
  };

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        {/* <RightButtonOrders tel={store.store_data.tel} /> */}
        <Button
          onPress={() => {
            Actions.push(appConfig.routes.searchStore);
          }}
        >
          <IconFeather size={26} color={appConfig.colors.white} name="search" />
        </Button>
        <RightButtonChat tel={store.store_data.tel} />
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

      this.setState({
        category_nav_index: index
      });
    }
  }

  handlePressFollow = async () => {
    const siteId = store.store_data.id;
    this.setState({
      loading: true,
      active: !this.state.active
    });
    try {
      const response = await APIHandler.user_update_favor_site(
        siteId,
        this.state.active ? 0 : 1
      );
      if (response.status === STATUS_SUCCESS) {
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
    } catch (error) {
      console.log('update_customer_card_wallet', error);
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  };

  handlePressChat = () => {
    Actions.amazing_chat({
      titleStyle: { width: 220 },
      phoneNumber: store.store_data.tel,
      title: store.store_data.name,
      site_id: store.store_id,
      user_id: store.user_info.id
    });
  };

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
      // this.refScrollView.current &&
      // this.refScrollView.current.getNode().scrollTo({x: 0, y: 0, animated: true});
      // this.state.scrollY.setValue(0);
      //   if (appConfig.device.isAndroid) {
      //   Animated.spring(this.state.scrollY, {
      //     toValue: 0,
      //     useNativeDriver: true
      //   }).start(() => this.setState({
      //     refreshingCate: false
      //   }))
      // } else
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

    return (
      <SafeAreaView style={[styles.container]}>
        {appConfig.device.isAndroid && (
          <StoreNavBar
            onPressSearch={this.handleSearchInStore}
            placeholder="Tìm kiếm trong cửa hàng..."
          />
        )}

        <HeaderStore
          active={this.state.active}
          avatarUrl={store.store_data.logo_url}
          bannerUrl={store.store_data.image_url}
          containerStyle={{
            height: BANNER_ABSOLUTE_HEIGHT,
            ...animated
          }}
          infoContainerStyle={infoContainerStyle}
          imageBgStyle={imageBgStyle}
          onPressChat={this.handlePressChat}
          onPressFollow={this.handlePressFollow}
          title={store.store_data.name}
        />

        <Animated.View
          style={[
            styles.categories_nav,
            {
              zIndex: 2,
              transform: [
                {
                  translateY: this.state.scrollY.interpolate({
                    inputRange: [0, 1, BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT],
                    outputRange: [
                      BANNER_VIEW_HEIGHT,
                      BANNER_VIEW_HEIGHT,
                      BANNER_VIEW_HEIGHT -
                        (BANNER_ABSOLUTE_HEIGHT - NAV_BAR_HEIGHT)
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
              keyExtractor={item => `${item.id}`}
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
                renderItem={({ item, index }) => (
                  <CategoryScreen
                    ref={inst => (this.refCategories[index] = inst)}
                    refreshing={
                      index === this.state.category_nav_index &&
                      !!this.state.refreshingCate
                    }
                    item={item}
                    index={index}
                    cate_index={this.state.category_nav_index}
                    that={this}
                    onLayout={e => this.handleLayoutFlatListContent(e, index)}
                    onRefreshEnd={this._onRefreshCateEnd}
                    minHeight={appConfig.device.height / 2}
                  />
                )}
              />
            ) : (
              <Indicator />
            )}
          </Animated.View>
        </Animated.ScrollView>

        {store.stores_finish == true && (
          <CartFooter
            perfix="stores"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
          />
        )}

        <PopupConfirm
          ref_popup={ref => (this.refs_modal_delete_cart_item = ref)}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={this._closePopup.bind(this)}
          yesConfirm={this._removeCartItem.bind(this)}
          otherClose={false}
        />

        {store.cart_fly_show && (
          <View
            style={{
              position: 'absolute',
              top: store.cart_fly_position.py,
              left: store.cart_fly_position.px,
              width: store.cart_fly_position.width,
              height: store.cart_fly_position.height,
              zIndex: 999,
              borderWidth: 1,
              borderColor: DEFAULT_COLOR,
              overflow: 'hidden'
            }}
          >
            {store.cart_fly_image && (
              <CachedImage
                style={{
                  width: store.cart_fly_position.width,
                  height: store.cart_fly_position.height
                }}
                source={store.cart_fly_image}
              />
            )}
          </View>
        )}
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

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  _closePopup() {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    this._closePopup();

    var item = this.cartItemConfirmRemove;

    try {
      var response = await APIHandler.site_cart_remove(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, { index });
            }
          })();
        }, 450);

        flashShowMessage({
          message: response.message,
          type: 'info'
        });
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_remove');
      store.addApiQueue('site_cart_remove', this._removeCartItem.bind(this));
    }
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

export default observer(Stores);
