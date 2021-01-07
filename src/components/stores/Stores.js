import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Animated from 'react-native-reanimated';
import store from '../../store/Store';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import RightButtonChat from '../RightButtonChat';
import RightButtonOrders from '../RightButtonOrders';
import Button from 'react-native-button';
import appConfig from '../../config';
import IconFeather from 'react-native-vector-icons/Feather';
import {willUpdateState} from '../../packages/tickid-chat/helper';
import CategoryScreen from './CategoryScreen';
import EventTracker from '../../helper/EventTracker';

const CATE_AUTO_LOAD = 'CateAutoLoad';

class Stores extends Component {
  static propTypes = {
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    categoryId: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      category_nav_index: 0,
      categories_data: null,
      selected_category: {id: 0, name: ''},
      categoriesPosition: [],
    };

    this.unmounted = false;

    action(() => {
      store.setStoresFinish(false);
    })();

    this.eventTracker = new EventTracker();
    this.animatedScrollY = new Animated.Value(0);
    this.animatedContentOffsetY = new Animated.Value(0);
  }

  componentDidMount() {
    this._initial(this.props);

    // pass add store tutorial
    var key_tutorial = 'KeyTutorialGoStore' + store.user_info.id;
    storage.save({
      key: key_tutorial,
      data: {finish: true},
      expires: null,
    });

    setTimeout(() => {
      Actions.refresh({
        right: this._renderRightButton(),
      });
    });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.title != nextProps.title) {
      action(() => {
        store.setStoresFinish(false);
      })();

      this.setState(
        {
          loading: true,
          category_nav_index: 0,
          categories_data: null,
        },
        () => {
          this._initial(nextProps);
        },
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
    const {t} = this.props;
    if (!this.props.categoryId || this.props.extraCategoryId) {
      response.data.categories.unshift({
        id: this.props.extraCategoryId || 0,
        name: this.props.extraCategoryName || t('tabs.store.title'),
      });
    }

    this.setState(
      {
        categories_data: response.data.categories,
        promotions: response.data.promotions,
      },
      () =>
        this.state.categories_data.map((item, index) => {
          if (!this.props.goCategory) return;
          if (this.props.goCategory === item.id) {
            this._changeCategory(item, index);
            return;
          }
        }),
    );
  }

  _getCategoriesNavFromServer = async () => {
    const site_id = this.props.siteId || store.store_id;
    try {
      var response = await APIHandler.site_info(site_id, this.props.categoryId);
      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(
          () =>
            willUpdateState(this.unmounted, () =>
              this.parseDataCategories(response),
            ),
          this._delay(),
        );
      }
    } catch (e) {
      console.log(e + ' site_info');
    }
  };

  _getCart = async () => {
    try {
      const response = await APIHandler.site_cart_show(store.store_id);

      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          store.setCartData(response.data);
        } else {
          store.resetCartData();
        }
      }
    } catch (e) {
      console.log(e + ' site_cart_show');
    }
  };

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        {/* <RightButtonOrders tel={store.store_data.tel} /> */}
        <Button
          onPress={() => {
            Actions.push(appConfig.routes.searchStore, {
              categories: this.state.categories_data,
              category_id: this.state.selected_category.id,
              category_name:
                this.state.selected_category.id !== 0
                  ? this.state.selected_category.name
                  : '',
            });
          }}>
          <IconFeather size={26} color={appConfig.colors.white} name="search" />
        </Button>
        <RightButtonChat tel={store.store_data.tel} />
      </View>
    );
  }

  _changeCategory(item, index, nav_only) {
    if (this.refs_category_nav) {
      const categories_count = this.state.categories_data.length;
      const end_of_list = categories_count - index - 1 >= 3;

      setTimeout(() =>
        willUpdateState(this.unmounted, () => {
          // nav
          if (index > 0 && end_of_list) {
            this.refs_category_nav.scrollToIndex({
              index: index - 1,
              animated: true,
            });
          } else if (!end_of_list) {
            this.refs_category_nav.scrollToEnd();
          } else if (index == 0) {
            this.refs_category_nav.scrollToIndex({index, animated: true});
          }

          if (this.refs_category_screen && !nav_only) {
            this.refs_category_screen.scrollToIndex({
              index: index,
              animated: true,
            });
          }
        }),
      );

      if (item) {
        this.setState({
          category_nav_index: index,
          selected_category: item,
        });
      } else if (nav_only) {
        this.setState({
          category_nav_index: index,
          selected_category: this.state.categories_data[index],
        });
      }
    }
  }

  render() {
    const {t} = this.props;
    return (
      <View style={styles.container}>
        {this.state.categories_data != null &&
          this.state.categories_data.length > 1 && (
            <View style={styles.categories_nav}>
              {this.state.categories_data != null ? (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ref={(ref) => (this.refs_category_nav = ref)}
                  onScrollToIndexFailed={() => {}}
                  data={this.state.categories_data}
                  extraData={this.state.category_nav_index}
                  keyExtractor={(item) => `${item.id}`}
                  horizontal={true}
                  style={styles.categories_nav}
                  renderItem={({item, index}) => {
                    let active = this.state.category_nav_index == index;
                    return (
                      <TouchableHighlight
                        onPress={() => this._changeCategory(item, index)}
                        underlayColor="transparent">
                        <View
                          onLayout={(e) =>
                            this.handlePositionCategories(e, item)
                          }
                          style={styles.categories_nav_items}>
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.categories_nav_items_title,
                              active
                                ? styles.categories_nav_items_title_active
                                : null,
                            ]}>
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
            </View>
          )}

        {this.state.categories_data != null ? (
          <FlatList
            scrollEnabled={this.state.categories_data.length > 1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={(ref) => (this.refs_category_screen = ref)}
            onScrollToIndexFailed={() => {}}
            data={this.state.categories_data}
            extraData={this.state.category_nav_index}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={this._onScrollEnd.bind(this)}
            style={{
              width: Util.size.width,
            }}
            getItemLayout={(data, index) => {
              return {
                length: Util.size.width,
                offset: Util.size.width * index,
                index,
              };
            }}
            renderItem={({item, index}) => (
              <CategoryScreen
                item={item}
                index={index}
                cate_index={this.state.category_nav_index}
                that={this}
                animatedScrollY={this.animatedScrollY}
                animatedContentOffsetY={this.animatedContentOffsetY}
              />
            )}
          />
        ) : (
          <Indicator />
        )}

        {store.stores_finish == true && (
          <CartFooter
            perfix="stores"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
            animatedScrollY={this.animatedScrollY}
            animatedContentOffsetY={this.animatedContentOffsetY}
            animating
          />
        )}

        <PopupConfirm
          ref_popup={(ref) => (this.refs_modal_delete_cart_item = ref)}
          title={t('cart:popup.remove.message')}
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
              overflow: 'hidden',
            }}>
            {store.cart_fly_image && (
              <CachedImage
                style={{
                  width: store.cart_fly_position.width,
                  height: store.cart_fly_position.height,
                }}
                source={store.cart_fly_image}
              />
            )}
          </View>
        )}
      </View>
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
      const data = {
        quantity: 0,
        model: item.model,
      };

      var response = await APIHandler.site_cart_update(
        store.store_id,
        item.id,
        data,
      );

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }
          })();
        }, 450);

        flashShowMessage({
          message: response.message,
          type: 'success',
        });
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: appConfig.device.bottomSpace,
  },
  right_btn_box: {
    flexDirection: 'row',
  },

  items_box: {
    width: Util.size.width,
  },

  categories_nav: {
    backgroundColor: '#ffffff',
    height: 40,
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#dddddd',
  },
  categories_nav_items: {
    justifyContent: 'center',
    height: '100%',
  },
  categories_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categories_nav_items_title_active: {
    color: DEFAULT_COLOR,
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR,
  },
});

export default withTranslation(['stores', 'cart'])(observer(Stores));
