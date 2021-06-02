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
import CategoriesSkeleton from './CategoriesSkeleton';
import {findNodeHandle} from 'react-native';
import APIHandler from 'src/network/APIHandler';
import {APIRequest} from 'src/network/Entity';
import {reaction} from 'mobx';
import FilterProduct from './FilterProduct';
import {isEmpty} from 'lodash';

const CATE_AUTO_LOAD = 'CateAutoLoad';

const dataSort = [
  {id: 1, name: 'Phổ biến', value: 'ordering', isSelected: false, order: 'asc'},
  {id: 2, name: 'Bán chạy', value: 'sales', isSelected: false, order: 'desc'},
  {id: 3, name: 'Mới nhất', value: 'created', isSelected: false, order: 'desc'},
  {
    id: 4,
    name: 'Giá từ thấp đến cao',
    value: 'price',
    isSelected: false,
    order: 'asc',
  },
  {
    id: 5,
    name: 'Giá từ cao đến thấp',
    value: 'price',
    isSelected: false,
    order: 'desc',
  },
];

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
      filterParams: {},
      valueSort: {},
    };
    this.unmounted = false;
    this.refCates = [];

    action(() => {
      store.setStoresFinish(false);
    })();

    this.eventTracker = new EventTracker();
    this.animatedScrollY = new Animated.Value(0);
    this.animatedContentOffsetY = new Animated.Value(0);
  }

  get isGetFullStore() {
    return this.props.categoryId === 0;
  }

  handleEffect = async (value) => {
    if (isEmpty(value)) {
      await this.setState({
        filterParams: {
          order: this.state.valueSort?.order ?? '',
          sort_by: this.state.valueSort?.value ?? '',
        },
      });
      return;
    }
    let min_price = '';
    let max_price = '';
    if (!!value['price']) {
      min_price = value['price'].min_price;
      max_price = value['price'].max_price;
    }
    const tag_id = Object.values(value)
      .map((i) => i?.id)
      .filter(Boolean)
      .join(',');
    const params = {
      min_price,
      max_price,
      tag: tag_id,
      order: !!this.state.valueSort.order ? this.state.valueSort.order : 'asc',
      sort_by: !isEmpty(this.state.valueSort) ? this.state.valueSort.value : '',
    };
    await this.setState({filterParams: params});
  };

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
    reaction(
      () => store.selectedFilter,
      (data) => this.handleEffect(data),
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    store.setSelectedFilter({});
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
      // () =>
      //   this.state.categories_data.map((item, index) => {
      //     if (!this.props.goCategory) return;
      //     if (this.props.goCategory === item.id) {
      //       setTimeout(()=>this._changeCategory(item, index), 500);
      //       return;
      //     }
      //   }),
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

  async _changeCategory(item, index, nav_only) {
    if (this.refs_category_nav) {
      const categories_count = this.state.categories_data.length;
      const end_of_list = categories_count - index - 1 >= 1;
      setTimeout(() =>
        willUpdateState(this.unmounted, () => {
          // nav
          if (index > 0 && end_of_list) {
            this.refs_category_nav.scrollToOffset({
              offset: this.refCates[index - 1].offsetX,
            });
          } else if (!end_of_list) {
            this.refs_category_nav.scrollToEnd();
          } else if (index == 0) {
            this.refs_category_nav.scrollToOffset({
              offset: this.refCates[index].offsetX,
            });
          }

          if (this.refs_category_screen && !nav_only) {
            this.refs_category_screen.scrollToIndex({index});
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

  measureCategoriesLayout = (ref, category, index) => {
    if (
      ref &&
      (!this.refCates[index] || this.refCates[index].offsetX === undefined)
    ) {
      setTimeout(() => {
        if (!this.refs_category_nav) return;

        ref.measureLayout(findNodeHandle(this.refs_category_nav), (offsetX) => {
          this.refCates[index] = {
            offsetX,
          };

          if (this.props.goCategory && this.props.goCategory === category.id) {
            this._changeCategory(category, index);
          }
        });
      });
    }
  };

  handleValue = async (value) => {
    this.setState((prev) => {
      return {
        filterParams: {
          ...prev.filterParams,
          sort_by: value.value,
          order: value.order,
        },
        valueSort: value,
      };
    });
  };

  render() {
    const {t} = this.props;
    return (
      <View style={styles.container}>
        {this.state.categories_data != null
          ? this.state.categories_data.length > 1 && (
              <View style={styles.categories_nav}>
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
                          ref={(inst) =>
                            this.measureCategoriesLayout(inst, item, index)
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
              </View>
            )
          : this.isGetFullStore && <CategoriesSkeleton />}

        {/* <FilterProduct
          selectedFilter={store.selectedFilter}
          dataSort={dataSort}
          onValueSort={this.handleValue}
        /> */}

        {this.state.categories_data != null && (
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
            renderItem={({item, index}) => {
              const isAutoLoad =
                (this.state.category_nav_index - 1 >= 0 &&
                  index === this.state.category_nav_index - 1) ||
                (this.state.category_nav_index + 1 <=
                  this.state.categories_data.length - 1 &&
                  index === this.state.category_nav_index + 1);

              return (
                <CategoryScreen
                  item={item}
                  index={index}
                  cate_index={this.state.category_nav_index}
                  isAutoLoad={isAutoLoad}
                  promotions={this.state.promotions}
                  animatedScrollY={this.animatedScrollY}
                  animatedContentOffsetY={this.animatedContentOffsetY}
                  paramsFilter={this.state.filterParams}
                />
              );
            }}
          />
        )}

        {store.stores_finish == true && (
          <CartFooter
            prefix="stores"
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
      </View>
    );
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
