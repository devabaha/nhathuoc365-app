import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  findNodeHandle,
} from 'react-native';
// 3-party libs
import Animated from 'react-native-reanimated';
import {reaction} from 'mobx';
import {isEmpty} from 'lodash';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {willUpdateState} from 'src/packages/tickid-chat/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {clearDrawerContent} from 'src/components/Drawer';
// routing
import {refresh, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {
  BaseButton,
  BundleIconSetName,
  TypographyType,
} from 'src/components/base';
// entities
import EventTracker from 'app-helper/EventTracker';
// custom components
import CartFooter from 'src/components/cart/CartFooter';
import PopupConfirm from 'src/components/PopupConfirm';
import RightButtonChat from 'src/components/RightButtonChat';
import CategoryScreen from './CategoryScreen';
import {FilterProduct} from './FilterProduct';
import {
  FlatList,
  Typography,
  ScreenWrapper,
  Container,
  IconButton,
} from 'src/components/base';
// skeleton
import CategoriesSkeleton from './CategoriesSkeleton';

const CATE_AUTO_LOAD = 'CateAutoLoad';

class Stores extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    categoryId: 0,
  };

  state = {
    loading: true,
    category_nav_index: 0,
    categories_data: this.props.categoriesData || null,
    selected_category: this.props.categoriesData?.length
      ? this.props.categoriesData[0]
      : {id: 0, name: ''},
    categoriesPosition: [],
    filterParams: {},
    valueSort: {},
  };
  unmounted = false;
  refCates = [];

  // action(() => {
  //   store.setStoresFinish(false);
  // })();

  eventTracker = new EventTracker();
  animatedScrollY = new Animated.Value(0);
  animatedContentOffsetY = new Animated.Value(0);

  disposer = () => {};
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get isGetFullStore() {
    return this.props.categoryId === 0;
  }

  handleEffect = (value) => {
    if (isEmpty(value)) {
      this.setState({
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
    this.setState({filterParams: params});
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
      refresh({
        right: this._renderRightButton(),
      });
    });
    this.eventTracker.logCurrentView();
    this.disposer = reaction(
      () => store.selectedFilter,
      (data) => this.handleEffect(data),
    );

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
    this.disposer();
    store.setSelectedFilter({});
    clearDrawerContent();

    this.updateNavBarDisposer();
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
    !this.props.categoriesData && this._getCategoriesNavFromServer();

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
        selected_category: response.data.categories[0],
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

  handleRightBtnNav = () => {
    push(appConfig.routes.searchStore, {
      type: this.props.type,
      categories: this.state.categories_data,
      category_id: this.state.selected_category.id,
      category_name:
        this.state.selected_category.id !== 0
          ? this.state.selected_category.name
          : '',
    });
  };

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        <IconButton
          bundle={BundleIconSetName.FEATHER}
          iconStyle={[this.rightBtnNavStyle, styles.rightBtnNavIcon]}
          name="search"
          onPress={this.handleRightBtnNav}
        />
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
      let order = value.order,
        sort_by = value.value,
        valueSort = value;

      if (valueSort.id === prev.valueSort?.id) {
        order = '';
        sort_by = '';
        valueSort = {};
      }

      return {
        filterParams: {
          ...prev.filterParams,
          sort_by,
          order,
        },
        valueSort,
      };
    });
  };

  renderCategoryItem = ({item, index}) => {
    let active = this.state.category_nav_index == index;
    return (
      <BaseButton
        onPress={() => this._changeCategory(item, index)}
        underlayColor="transparent">
        <View
          ref={(inst) => this.measureCategoriesLayout(inst, item, index)}
          style={styles.categories_nav_items}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            numberOfLines={2}
            style={[
              styles.categories_nav_items_title,
              active && this.categoryItemActiveTitleStyle,
            ]}>
            {item.name}
          </Typography>

          {active && (
            <View
              style={[
                this.categoryItemActiveStyle,
                styles.categories_nav_items_active,
              ]}
            />
          )}
        </View>
      </BaseButton>
    );
  };

  get categoriesContainerStyle() {
    return {
      ...this.theme.layout.shadow,
      shadowColor: this.theme.color.shadow,
    };
  }

  get categoriesStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  get categoryItemActiveTitleStyle() {
    return {
      color: this.theme.color.primaryHighlight,
    };
  }

  get categoryItemActiveStyle() {
    return {
      backgroundColor: this.theme.color.primaryHighlight,
    };
  }

  get rightBtnNavStyle() {
    return {
      color: this.theme.color.onNavBarBackground,
    };
  }

  render() {
    const {t} = this.props;
    return (
      <ScreenWrapper>
        {this.state.categories_data != null
          ? this.state.categories_data.length > 1 && (
              <Container
                style={[
                  this.categoriesContainerStyle,
                  styles.categories_nav_container,
                ]}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ref={(ref) => (this.refs_category_nav = ref)}
                  onScrollToIndexFailed={() => {}}
                  data={this.state.categories_data}
                  extraData={this.state.category_nav_index}
                  keyExtractor={(item) => `${item.id}`}
                  horizontal={true}
                  style={[this.categoriesStyle, styles.categories_nav]}
                  renderItem={this.renderCategoryItem}
                />
              </Container>
            )
          : this.isGetFullStore && <CategoriesSkeleton />}

        {!!this.state.categories_data?.length && (
          <FilterProduct
            selectedFilter={store.selectedFilter}
            onValueSort={this.handleValue}
            animatedScrollY={this.animatedScrollY}
            animatedContentOffsetY={this.animatedContentOffsetY}
          />
        )}

        {this.state.categories_data != null && (
          <FlatList
            scrollEnabled={this.state.categories_data?.length > 1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={(ref) => (this.refs_category_screen = ref)}
            onScrollToIndexFailed={() => {}}
            data={this.state.categories_data || []}
            extraData={this.state.category_nav_index}
            keyExtractor={(item) => `${item.id}`}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={this._onScrollEnd.bind(this)}
            style={styles.listCategories}
            getItemLayout={(data, index) => {
              return {
                length: appConfig.device.width,
                offset: appConfig.device.width * index,
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
                  type={this.props.type}
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

        {this.state.categories_data != null && store.stores_finish == true && (
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
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  right_btn_box: {
    flexDirection: 'row',
  },
  rightBtnNavIcon: {
    fontSize: 26,
  },
  items_box: {
    width: appConfig.device.width,
  },

  categories_nav_container: {
    zIndex: 1,
  },
  listCategories: {
    width: appConfig.device.width,
  },
  categories_nav: {
    height: 40,
  },
  categories_nav_items: {
    justifyContent: 'center',
    height: '100%',
  },
  categories_nav_items_title: {
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
  },
});

export default withTranslation(['stores', 'cart'])(observer(Stores));
