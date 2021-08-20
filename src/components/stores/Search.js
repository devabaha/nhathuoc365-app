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
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';
import Items from './Items';
import ListHeader from './ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import ModernList from 'app-packages/tickid-modern-list';
import {LIST_TYPE} from 'app-packages/tickid-modern-list/constants';
import Animated, {Easing} from 'react-native-reanimated';
import {debounce} from 'lodash';
import EventTracker from '../../helper/EventTracker';
import NoResult from '../NoResult';

const {interpolate} = Animated;
const START_DEG = new Animated.Value(0);
const END_DEG = new Animated.Value(Math.PI);
const STORE_SEARCH_KEY = 'STORE-SEARCH';

class Search extends Component {
  static defaultProps = {
    categoriesCollapsed: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: !!!this.props.categories,
      noResult: false,
      header_title: '',
      search_data: null,
      history: null,
      buying_idx: [],
      searchValue: '',
      categories: this.categories,
      selectedCategory: this.selectedCategory,
      animatedCategories: new Animated.Value(
        !!props.categoriesCollapsed ? 1 : 0,
      ),
      bodyCategoriesHeight: null,
    };

    this.animatedCategoriesShowUp = new Animated.Value(
      props.categoriesCollapsed ? 0 : 1,
    );

    this.onSearch = this.onSearch.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.unmounted = false;
    this.categoriesCollapsed = !!this.props.categoriesCollapsed;

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
      this.setState({loading: true});
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
    if (keyword == null || keyword == '') {
      this.setState({
        search_data: null,
        loading: false,
        noResult: false,
      });

      return;
    }

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

          if (response && response.status == STATUS_SUCCESS) {
            if (response.data) {
              this.setState({
                search_data: response.data,
                noResult: false,
                header_title: `— Kết quả cho "${keyword}" —`,
              });
            }
          } else {
            this.getHistory();

            this.setState({
              search_data: null,
              noResult: true,
            });
          }
        } catch (e) {
          console.log(e + ' search_product');
          // store.addApiQueue(
          //   'search_product',
          //   this.onSearch.bind(this, keyword)
          // );
        } finally {
          !this.unmounted &&
            this.setState({
              loading: false,
            });
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
    this._insertName(item);

    this.onSearch(item.name);
  }

  _updateHistory(item) {
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
        this._saveHistorey([...data, item]);
      })
      .catch((err) => {
        // save
        this._saveHistorey([item]);
      });
  }

  _saveHistorey(data) {
    // cache in five minutes
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

  removeHistory = () => {
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

  handleCategoriesLayout = (e) => {
    if (!this.state.bodyCategoriesHeight) {
      this.setState({bodyCategoriesHeight: e.nativeEvent.layout.height}, () => {
        Animated.timing(this.animatedCategoriesShowUp, {
          toValue: 1,
          duration: 300,
          easing: Easing.quad,
        }).start();
      });
    }
  };

  collapseCategories = () => {
    Animated.timing(this.state.animatedCategories, {
      toValue: this.categoriesCollapsed ? 0 : 1,
      easing: Easing.inOut(Easing.ease),
      duration: 300,
    }).start();
    this.categoriesCollapsed = !this.categoriesCollapsed;
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

  render() {
    const {loading, search_data, history, buying_idx} = this.state;

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
    const animatedCategoriesStyle = {
      ...(this.state.bodyCategoriesHeight && {
        height: interpolate(this.state.animatedCategories, {
          inputRange: [0, 1],
          outputRange: [MAX_HEIGHT_CATEGORIES, MIN_HEIGHT_CATEGORIES],
        }),
      }),
    };

    const animatedCategoriesBodyStyle = {
      opacity: this.animatedCategoriesShowUp,
      transform: [
        {
          translateY: interpolate(this.animatedCategoriesShowUp, {
            inputRange: [0, 1],
            outputRange: [-100, 0],
          }),
        },
      ],
    };
    // show loading
    // if (loading) {
    //   return <Indicator />;
    // }

    return (
      <>
        <SafeAreaView style={styles.container}>
          {loading && <Indicator />}
          {search_data != null ? (
            <FlatList
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              onEndReached={(num) => {}}
              onEndReachedThreshold={0}
              style={[styles.items_box]}
              ListHeaderComponent={() => (
                <ListHeader title={this.state.header_title} />
              )}
              data={search_data}
              extraData={this.state}
              renderItem={({item, index}) => (
                <Items
                  item={item}
                  index={index}
                  buying_idx={buying_idx}
                  onPress={this._goItem.bind(this, item)}
                  buyPress={this._updateHistory.bind(this, item)}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="always">
              {this.state.noResult && (
                <Text style={styles.noResult}>Không tìm thấy sản phẩm</Text>
              )}
              {this.state.categories.length !== 0 && (
                <ModernList
                  containerStyle={[
                    {
                      marginBottom: 15,
                    },
                    animatedCategoriesBodyStyle,
                  ]}
                  scrollEnabled={false}
                  headerTitle="Danh mục"
                  mainKey="name"
                  data={this.state.categories}
                  onPressItem={this.handlePressCategory}
                  bodyWrapperStyle={animatedCategoriesStyle}
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
              )}
              {history != null &&
                (() => {
                  let data = Object.assign([], history);
                  data = data.reverse();

                  return (
                    <ModernList
                      headerTitle="Lịch sử tìm kiếm"
                      mainKey="name"
                      data={data}
                      onPressItem={(item) => this._onTouchHistory(item)}
                      headerRightComponent={
                        <RemoveBtn onPress={this.removeHistory} />
                      }
                    />
                  );
                  // return (
                  //   <ScrollView
                  //     style={[
                  //       styles.items_box,
                  //       {
                  //         marginBottom: store.keyboardTop
                  //       }
                  //     ]}
                  //     keyboardShouldPersistTaps="handled"
                  //     keyboardDismissMode="on-drag"
                  //   >
                  //     <ListHeader alignLeft title="Sản phẩm đã tìm kiếm" />

                  //     {data.map((item, index) => {
                  //       return (
                  //         <TouchableHighlight
                  //           key={index}
                  //           underlayColor="transparent"
                  //           onPress={this._onTouchHistory.bind(this, item)}
                  //           style={styles.seach_history}
                  //         >
                  //           <View style={styles.seach_history_box}>
                  //             <View style={styles.seach_history_name_box}>
                  //               <Text style={styles.seach_history_name}>
                  //                 {item.name}
                  //               </Text>
                  //             </View>

                  //             <TouchableHighlight
                  //               underlayColor="transparent"
                  //               onPress={this._insertName.bind(this, item)}
                  //               style={styles.seach_history_expand}
                  //             >
                  //               <Icon name="expand" size={14} color="#999999" />
                  //             </TouchableHighlight>
                  //           </View>
                  //         </TouchableHighlight>
                  //       );
                  //     })}
                  //   </ScrollView>
                  // );
                })()}
              {!this.state.history &&
                !this.state.noResult &&
                !this.state.loading &&
                !this.state.searchValue && (
                  <NoResult iconName="magnify" message="Nhập để tìm kiếm" />
                )}
            </ScrollView>
          )}

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
    color: '#404040',
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

  container: {
    flex: 1,
    marginBottom: 0,
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

  items_box: {},

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
});

export default withTranslation('stores')(observer(Search));

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const CollapseIcon = (props) => (
  <TouchableOpacity
    hitSlop={HIT_SLOP}
    activeOpacity={0.6}
    onPress={props.onPress}>
    <AnimatedIcon
      name="caret-down"
      style={[styles.collapseIcon, props.style]}
    />
  </TouchableOpacity>
);

const RemoveBtn = (props) => (
  <TouchableOpacity activeOpacity={0.6} onPress={props.onPress}>
    <Text style={styles.removeHistoryTxt}>Xóa</Text>
  </TouchableOpacity>
);
