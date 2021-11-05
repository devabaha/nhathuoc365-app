import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Keyboard,
  // Animated,
  // Easing,
  SafeAreaView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {Easing} from 'react-native-reanimated';

import appConfig from 'app-config';
import store from 'app-store';
import {LIST_TYPE} from 'app-packages/tickid-modern-list/constants';
import EventTracker from '../../helper/EventTracker';

import Items from './Items';
import ListHeader from './ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import ModernList from 'app-packages/tickid-modern-list';
import {debounce} from 'lodash';
import NoResult from '../NoResult';
import {Container} from '../Layout';

const {interpolate} = Animated;
const START_DEG = new Animated.Value(0);
const END_DEG = new Animated.Value(Math.PI);
const STORE_SEARCH_KEY = 'STORE-SEARCH';
const MAX_PREVIEW_HISTORY_LENGTH = 3;

class Search extends Component {
  static defaultProps = {
    categoriesCollapsed: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: !!!this.props.categories,
      noResult: false,
      header_title: '',
      search_data: null,
      history: null,
      isShowFullHistory: false,
      buying_idx: [],
      searchValue: '',
      categories: this.categories,
      selectedCategory: this.selectedCategory,
      isFinishedCategoriesShowUp: false,
      animatedCategories: new Animated.Value(
        !!props.categoriesCollapsed ? 1 : 0,
      ),
      bodyCategoriesHeight: null,
    };

    this.refList = React.createRef();

    this.animatedCategoriesShowUp = new Animated.Value(
      props.categoriesCollapsed ? 0 : 1,
    );

    this.refListResult = React.createRef();
    this.onSearch = this.onSearch.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.unmounted = false;
    this.categoriesCollapsed = !!this.props.categoriesCollapsed;
    this.isSearched = false;

    this.eventTracker = new EventTracker();
  }

  get categories() {
    const categories = this.props.categories || [];
    return categories.map((category) => ({
      ...category,
      active: category.id === this.props.category_id,
    }));
  }

  get selectedCategory() {
    const categories = this.props.categories || [];
    return (
      categories.find((category) => category.id === this.props.category_id) || {
        id: 0,
      }
    );
  }

  getPlaceholder(name = '') {
    const {t} = this.props;
    return `${name && `${name} - `}${store.store_data.name || 'cửa hàng'}`;
  }

  componentDidMount() {
    if (!!!this.props.categories) {
      this.getCategories();
    }
    var keyword = this.props.qr_code;
    this.getHistory();

    const placeholder = this.getPlaceholder(
      this.props.category_id !== 0 ? this.props.category_name : '',
    );
    if (keyword) {
      this.onSearch(keyword);
    }
    setTimeout(() => {
      Actions.refresh({
        searchValue: keyword || '',
        placeholder,
        autoFocus: true,
        onSearch: (text) => {
          Actions.refresh({
            searchValue: text,
          });

          this.setState({
            searchValue: text,
          });

          // auto search on changed text
          this.onSearch(text);
        },
        onCancel: () => {
          Keyboard.dismiss();
        },
        onClearText: () => {
          Actions.refresh({
            searchValue: '',
            placeholder: this.getPlaceholder(
              this.state.selectedCategory.id !== 0
                ? this.state.selectedCategory.name
                : '',
            ),
          });

          this.setState({
            searchValue: '',
          });

          this.onSearch('');
        },
      });
    });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();
  }

  getCategories = async () => {
    try {
      const response = await APIHandler.site_info(
        store.store_id,
        this.props.categoryId,
      );
      if (!this.unmounted) {
        if (response && response.status == STATUS_SUCCESS) {
          this.parseDataCategories(response);
        }
      }
    } catch (e) {
      console.log(e + ' site_info');
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
        });
    }
  };

  parseDataCategories(response) {
    const {t} = this.props;
    if (!this.props.categoryId) {
      response.data.categories.unshift({
        id: 0,
        name: t('tabs.store.title'),
        active: true,
      });
    }
    this.setState({categories: response.data.categories});
  }

  getHistory(categoryId = this.state.selectedCategory.id) {
    storage
      .load({
        key:
          STORE_SEARCH_KEY +
          store.user_info.id +
          '/' +
          store.store_id +
          '/' +
          categoryId,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((history) => {
        this.setState({
          history,
        });
      })
      .catch((e) => {
        console.log('load storage history', e);
        this.setState({history: null});
      });
  }

  onSearch = debounce((keyword) => {
    keyword = keyword.trim();

    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const response = await APIHandler.search_product(store.store_id, {
            search: keyword,
            category_id: this.state.selectedCategory.id,
            type: this.props.type,
          });
          if (this.unmounted) return;

          if (response && response.status == STATUS_SUCCESS) {
            if (response.data) {
              if (!this.categoriesCollapsed) {
                this.collapseCategories();
              }

              this.refList.current &&
                this.refList.current.scrollToOffset({offset: 0});
            } else {
              flashShowMessage({
                type: 'danger',
                message:
                  response?.message || this.props.t('common:api.error.message'),
              });
            }
          } else {
            this.getHistory();

            flashShowMessage({
              type: 'danger',
              message:
                response?.message || this.props.t('common:api.error.message'),
            });
          }

          this.setState({
            search_data: response?.data || null,
            noResult: !!!response?.data,
            searchValue: keyword,
          });
        } catch (e) {
          console.log(e + ' search_product');
          flashShowMessage({
            type: 'danger',
            message: this.props.t('common:api.error.message'),
          });
        } finally {
          if (this.unmounted) return;

          this.setState({
            header_title: !keyword ? null : `— Kết quả cho "${keyword}" —`,
            loading: false,
          });
          this.isSearched = true;
        }
      },
    );
  }, 500);

  // tới màn hình chi tiết item
  _goItem(item) {
    //STORE_SEARCH_KEY

    this._updateHistory(item);

    if (this.props.from_item) {
      Actions.pop();
      setTimeout(() => {
        if (this.props.itemRefresh) {
          this.props.itemRefresh(item);
        }
      }, 450);
    } else {
      Actions.item({
        title: item.name,
        item,
      });
    }
  }

  _insertName(item) {
    Actions.refresh({
      searchValue: item.name,
    });
    this.setState({
      searchValue: item.name,
    });
  }

  _onTouchHistory(item) {
    this.setState({isShowFullHistory: false});
    this._insertName(item);

    this.onSearch(item.name);
  }

  _updateHistory(item) {
    const isExisted =
      this.state.history?.length &&
      this.state.history.find((history) => history.id === item.id);
    if (isExisted || !this.state.searchValue) return;

    item = {
      id: item.id,
      name: item.name,
    };

    // load
    storage
      .load({
        key:
          STORE_SEARCH_KEY +
          store.user_info.id +
          '/' +
          store.store_id +
          '/' +
          this.state.selectedCategory.id,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then((data) => {
        this._saveHistory([...data, item]);
      })
      .catch((err) => {
        // save
        this._saveHistory([item]);
      });
  }

  _saveHistory(data) {
    storage.save({
      key:
        STORE_SEARCH_KEY +
        store.user_info.id +
        '/' +
        store.store_id +
        '/' +
        this.state.selectedCategory.id,
      data,
      expires: null,
    });

    this.setState({history: data});
  }

  removeHistory = (history) => {
    if (!this.state.history?.length) return;
    history = {
      id: history.id,
      name: history.name,
    };

    const histories = this.state.history.filter((h) => h.name !== history.name);
    this._saveHistory(histories);
  };

  removeAllHistory = () => {
    storage.remove({
      key:
        STORE_SEARCH_KEY +
        store.user_info.id +
        '/' +
        store.store_id +
        '/' +
        this.state.selectedCategory.id,
    });

    this.setState({history: null});
  };

  handlePressCategory = (category) => {
    if (category.id !== this.state.selectedCategory.id) {
      this.getHistory(category.id);

      const categories = [...this.state.categories];
      categories.forEach((cate) => {
        cate.active = cate.id === category.id;
      });
      const placeholder = this.getPlaceholder(
        category.id !== 0 ? category.name : '',
      );
      Actions.refresh({
        placeholder,
      });
      this.setState({
        categories,
        selectedCategory: category,
      });
      this.onSearch(this.state.searchValue);
    }
  };

  updateCategoriesLayout = debounce((bodyCategoriesHeight) => {
    if (this.unmounted) return;

    this.setState({bodyCategoriesHeight}, () => {
      Animated.timing(this.animatedCategoriesShowUp, {
        toValue: 1,
        duration: 300,
        easing: Easing.quad,
      }).start(({finished}) => {
        if (finished && !this.unmounted) {
          this.setState({isFinishedCategoriesShowUp: true});
        }
      });
    });
  }, 500);

  handleCategoriesLayout = (e) => {
    if (!this.state.bodyCategoriesHeight && this.state.categories?.length) {
      this.updateCategoriesLayout(e.nativeEvent.layout.height);
    }
  };

  collapseCategories = () => {
    Animated.timing(this.state.animatedCategories, {
      toValue: this.categoriesCollapsed ? 0 : 1,
      easing: Easing.inOut(Easing.ease),
      duration: 300,
    }).start();
    this.categoriesCollapsed = !this.categoriesCollapsed;
    Keyboard.dismiss();
  };

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }

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
        action(() => {
          store.setCartData(response.data);
          // prev item in list
          if (isAndroid && store.cart_item_index > 0) {
            var index = store.cart_item_index - 1;
            store.setCartItemIndex(index);
            Events.trigger(NEXT_PREV_CART, {index});
          }
        })();

        flashShowMessage({
          message: response.message,
          type: 'success',
        });
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');

      store.addApiQueue('site_cart_update', this._removeCartItem.bind(this));
    }
  }

  toggleShowMoreHistory = () => {
    this.setState((prevState) => ({
      isShowFullHistory: !prevState.isShowFullHistory,
    }));
  };

  renderHeader = () => {
    return (
      <>
        {this.renderCategoriesSelector()}
        {this.renderHistory()}
        <ListHeader
          containerStyle={{
            marginTop: this.state.header_title ? 0 : 5,
            marginBottom: this.state.header_title ? 0 : 15,
          }}
          title={this.state.header_title}
        />
      </>
    );
  };

  renderCategoriesSelector = () => {
    const MIN_HEIGHT_CATEGORIES = new Animated.Value(0);
    const MAX_HEIGHT_CATEGORIES =
      this.state.bodyCategoriesHeight &&
      new Animated.Value(this.state.bodyCategoriesHeight);

    const animatedIconStyle = {
      transform: [
        {
          rotate: interpolate(this.state.animatedCategories, {
            inputRange: [0, 1],
            outputRange: [START_DEG, END_DEG],
          }),
        },
      ],
    };
    const animatedCategoriesBodyStyle = {
      position: this.state.isFinishedCategoriesShowUp ? undefined : 'absolute',
      opacity: this.animatedCategoriesShowUp,

      ...(this.state.bodyCategoriesHeight && {
        height: interpolate(this.state.animatedCategories, {
          inputRange: [0, 1],
          outputRange: [MAX_HEIGHT_CATEGORIES, MIN_HEIGHT_CATEGORIES],
        }),
      }),
    };

    const animatedCategoriesStyle = {};

    return (
      // this.state.categories.length !== 0 && (
      <ModernList
        containerStyle={[
          styles.listCategoriesContainer,
          animatedCategoriesStyle,
        ]}
        scrollEnabled={false}
        headerTitle={
          this.state.selectedCategory.name
            ? this.state.selectedCategory.name
            : 'Chọn danh mục'
        }
        mainKey="name"
        data={this.state.categories}
        onPressItem={this.handlePressCategory}
        onHeaderPress={this.collapseCategories}
        bodyWrapperStyle={animatedCategoriesBodyStyle}
        onBodyLayout={this.handleCategoriesLayout}
        activeStyle={{backgroundColor: DEFAULT_COLOR}}
        activeTextStyle={{color: '#fff'}}
        type={LIST_TYPE.TAG}
        headerRightComponent={
          <CollapseIcon
            onPress={this.collapseCategories}
            style={animatedIconStyle}
          />
        }
      />
    );
    // );
  };

  renderHistory = () => {
    if (!this.state.history?.length) return;
    let data = [...this.state.history];
    data = data.reverse();
    data = this.state.isShowFullHistory
      ? data
      : data.slice(0, MAX_PREVIEW_HISTORY_LENGTH);
    data = data.map((history) => {
      history = {...history};
      history.titleStyle = styles.historyTitle;
      history.iconLeft = (
        <MaterialCommunityIcons name="history" style={styles.historyIcon} />
      );
      history.iconRight = (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          onPress={() => this.removeHistory(history)}>
          <MaterialCommunityIcons name="close" style={styles.historyIcon} />
        </TouchableOpacity>
      );
      return history;
    });

    return (
      <>
        <ModernList
          headerTitle="Lịch sử tìm kiếm"
          mainKey="name"
          data={data}
          onPressItem={(item) => this._onTouchHistory(item)}
          containerStyle={{marginTop: 10}}
          scrollEnabled={false}
          headerRightComponent={<RemoveBtn onPress={this.removeAllHistory} />}
        />
        {this.state.history?.length > MAX_PREVIEW_HISTORY_LENGTH && (
          <View style={styles.showFullHistoryWrapper}>
            <TouchableOpacity
              style={styles.showFullHistoryContainer}
              onPress={this.toggleShowMoreHistory}>
              <Text style={styles.showFullHistoryTitle}>
                {this.props.t(
                  this.state.isShowFullHistory
                    ? 'common:showLess'
                    : 'common:showMore',
                )}
              </Text>
              <FontAwesomeIcon
                name={
                  this.state.isShowFullHistory ? 'chevron-up' : 'chevron-down'
                }
                style={styles.showFullHistoryIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  renderEmpty = () => {
    return (
      <NoResult
        iconName={this.isSearched ? undefined : 'magnify'}
        message={
          this.isSearched ? this.props.t('common:noResult') : 'Nhập để tìm kiếm'
        }
      />
    );
  };

  render() {
    const {loading, search_data, history, buying_idx} = this.state;
    return (
      <>
        <SafeAreaView style={styles.container}>
          {loading && <Indicator />}
          <FlatList
            ref={this.refList}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={search_data || []}
            contentContainerStyle={styles.listProductContentContainer}
            renderItem={({item, index}) => (
              <Items
                item={item}
                index={index}
                buying_idx={buying_idx}
                onPress={this._goItem.bind(this, item)}
              />
            )}
            keyExtractor={(item) => item.id}
            numColumns={2}
            ListHeaderComponent={this.renderHeader()}
            ListEmptyComponent={this.renderEmpty()}
          />

          <PopupConfirm
            ref_popup={(ref) => (this.refs_modal_delete_cart_item = ref)}
            title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
            height={110}
            noConfirm={() => {
              if (this.refs_modal_delete_cart_item) {
                this.refs_modal_delete_cart_item.close();
              }
            }}
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
        </SafeAreaView>

        {search_data != null && store.keyboardTop == 0 && (
          <CartFooter
            prefix="search"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  seach_history: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  seach_history_name_box: {
    justifyContent: 'center',
    height: '100%',
  },
  seach_history_box: {
    paddingHorizontal: 15,
  },
  seach_history_name: {
    fontSize: 14,
    color: appConfig.colors.text,
  },
  seach_history_expand: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyTitle: {
    marginLeft: 10,
    color: appConfig.colors.text,
  },
  historyIcon: {
    fontSize: 18,
    color: appConfig.colors.typography.secondary,
  },

  container: {
    flex: 1,
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0,
  },
  right_btn_box: {
    flexDirection: 'row',
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },

  items_box: {
    marginTop: 15,
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
  listCategoriesContainer: {},
  listHistoryContainer: {
    paddingBottom: 15,
  },
  listProductContentContainer: {
    flexGrow: 1,
  },
  noResult: {
    textAlign: 'center',
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  collapseIcon: {
    fontSize: 20,
    color: '#555',
  },
  removeHistoryTxt: {
    color: DEFAULT_COLOR,
    fontWeight: '500',
  },

  showFullHistoryWrapper: {
    backgroundColor: appConfig.colors.white,
  },
  showFullHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  showFullHistoryTitle: {
    color: appConfig.colors.primary,
  },
  showFullHistoryIcon: {
    color: appConfig.colors.primary,
    marginLeft: 5,
  },
});

export default withTranslation(['stores', 'common'])(observer(Search));

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesomeIcon);
const CollapseIcon = (props) => (
  <TouchableOpacity
    hitSlop={HIT_SLOP}
    activeOpacity={0.6}
    onPress={props.onPress}>
    <AnimatedIcon name="caret-up" style={[styles.collapseIcon, props.style]} />
  </TouchableOpacity>
);

const RemoveBtn = (props) => (
  <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
    <Text style={styles.removeHistoryTxt}>Xóa</Text>
  </TouchableOpacity>
);
