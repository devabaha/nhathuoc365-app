import React, {Component} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
// 3-party libs
import Animated, {Easing} from 'react-native-reanimated';
import {debounce} from 'lodash';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop, push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {LIST_TYPE} from 'app-packages/tickid-modern-list/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Items from 'src/components/stores/Items';
import ListHeader from 'src/components/stores/ListHeader';
import CartFooter from 'src/components/cart/CartFooter';
import PopupConfirm from 'src/components/PopupConfirm';
import ModernList from 'app-packages/tickid-modern-list';
import NoResult from 'src/components/NoResult';
import Image from 'src/components/Image';
import CollapseIcon from './CollapseIcon';
import RemoveBtn from './RemoveBtn';
import {
  FlatList,
  Icon,
  IconButton,
  ScreenWrapper,
  TextButton,
  Container,
} from 'src/components/base';

const {interpolate} = Animated;
const START_DEG = new Animated.Value(0);
const END_DEG = new Animated.Value(Math.PI);
const STORE_SEARCH_KEY = 'STORE-SEARCH';
const MAX_PREVIEW_HISTORY_LENGTH = 3;

class Search extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    categoriesCollapsed: true,
  };

  state = {
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
      !!this.props.categoriesCollapsed ? 1 : 0,
    ),
    bodyCategoriesHeight: null,
  };

  refList = React.createRef();

  animatedCategoriesShowUp = new Animated.Value(
    this.props.categoriesCollapsed ? 0 : 1,
  );

  refListResult = React.createRef();
  getHistory = this.getHistory.bind(this);
  unmounted = false;
  categoriesCollapsed = !!this.props.categoriesCollapsed;
  isSearched = false;

  eventTracker = new EventTracker();

  showFullHistoryTypoProp = {type: TypographyType.LABEL_MEDIUM_PRIMARY};

  get theme() {
    return getTheme(this);
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
    return `${name && `${name} - `}${
      store.store_data.name || t('placeholder.suffix')
    }`;
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
      refresh({
        searchValue: keyword || '',
        placeholder,
        autoFocus: true,
        onSearch: (text) => {
          refresh({
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
          refresh({
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
            header_title: !keyword
              ? null
              : this.props.t('searchResult', {
                  keyword: keyword,
                }),
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

    this._updateHistory(this.state.searchValue);

    if (this.props.from_item) {
      pop();
      setTimeout(() => {
        if (this.props.itemRefresh) {
          this.props.itemRefresh(item);
        }
      }, 450);
    } else {
      push(appConfig.routes.item, {
        title: item.name,
        item,
      });
    }
  }

  _insertName(item) {
    refresh({
      searchValue: item.keyword,
    });
    this.setState({
      searchValue: item.keyword,
    });
  }

  _onTouchHistory(item) {
    this.setState({isShowFullHistory: false});
    this._insertName(item);
    this.onSearch(item.keyword);

    this.setState((prevState) => {
      const histories = [...prevState.history];
      const pressedItemIndex = prevState.history.findIndex(
        (h) => h.keyword === item.keyword,
      );
      const pressedItem = prevState.history[pressedItemIndex];
      histories.splice(pressedItemIndex, 1);
      histories.push(pressedItem);
      return {history: histories};
    });
  }

  _updateHistory(keyword) {
    const isExisted =
      this.state.history?.length &&
      this.state.history.find((history) => {
        return history.keyword === keyword;
      });
    if (isExisted || !this.state.searchValue) return;

    const item = {keyword: keyword};

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
      keyword: history.keyword,
    };

    const histories = this.state.history.filter(
      (h) => h.keyword !== history.keyword,
    );
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
      refresh({
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
      this.state.categories.length !== 0 && (
        <ModernList
          containerStyle={[
            styles.listCategoriesContainer,
            animatedCategoriesStyle,
          ]}
          scrollEnabled={false}
          headerTitle={
            this.state.selectedCategory.name
              ? this.state.selectedCategory.name
              : this.props.t('chooseCategory')
          }
          mainKey="name"
          data={this.state.categories}
          onPressItem={this.handlePressCategory}
          onHeaderPress={this.collapseCategories}
          bodyWrapperStyle={animatedCategoriesBodyStyle}
          onBodyLayout={this.handleCategoriesLayout}
          type={LIST_TYPE.TAG}
          headerRightComponent={
            <CollapseIcon
              onPress={this.collapseCategories}
              style={animatedIconStyle}
            />
          }
        />
      )
    );
  };

  renderShowFullHistoryIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name={this.state.isShowFullHistory ? 'angle-up' : 'angle-down'}
        style={[titleStyle, styles.showFullHistoryIcon]}
      />
    );
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
      history.titleStyle = [
        styles.historyTitle,
        this.theme.typography[TypographyType.LABEL_MEDIUM],
      ];
      history.iconLeft = (
        <Icon
          neutral
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          name="history"
          style={styles.historyIcon}
        />
      );
      history.iconRight = (
        <IconButton
          neutral
          hitSlop={HIT_SLOP}
          onPress={() => this.removeHistory(history)}
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          name="close"
          iconStyle={styles.historyIcon}
        />
      );
      return history;
    });

    return (
      <>
        <ModernList
          headerTitle={this.props.t('searchHistory')}
          mainKey="keyword"
          data={data}
          onPressItem={(item) => this._onTouchHistory(item)}
          containerStyle={{marginTop: 10}}
          scrollEnabled={false}
          headerRightComponent={
            <RemoveBtn t={this.props.t} onPress={this.removeAllHistory} />
          }
        />
        {this.state.history?.length > MAX_PREVIEW_HISTORY_LENGTH && (
          <Container>
            <TextButton
              typoProps={this.showFullHistoryTypoProp}
              style={styles.showFullHistoryContainer}
              onPress={this.toggleShowMoreHistory}
              renderIconRight={this.renderShowFullHistoryIcon}>
              {this.props.t(
                this.state.isShowFullHistory
                  ? 'common:showLess'
                  : 'common:showMore',
              )}
            </TextButton>
          </Container>
        )}
      </>
    );
  };

  renderEmpty = () => {
    return (
      <NoResult
        iconName={this.isSearched ? undefined : 'magnify'}
        message={
          this.isSearched
            ? this.props.t('common:noResult')
            : this.props.t('enterToSearch')
        }
      />
    );
  };

  get cartFlyStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.primaryHighlight,
    };
  }

  render() {
    const {loading, search_data, history, buying_idx} = this.state;
    var hasCartData = !(store.cart_data == null || store.cart_products == null);
    const isShowCartFooter =
      hasCartData && search_data != null && store.keyboardTop == 0;

    return (
      <>
        <ScreenWrapper>
          {loading && <Indicator />}
          <FlatList
            safeLayout={!isShowCartFooter}
            ref={this.refList}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={search_data || []}
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
            title={this.props.t('cart:popup.remove.message')}
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
              style={[
                {
                  position: 'absolute',
                  top: store.cart_fly_position.py,
                  left: store.cart_fly_position.px,
                  width: store.cart_fly_position.width,
                  height: store.cart_fly_position.height,
                  zIndex: 999,
                  overflow: 'hidden',
                },
                this.cartFlyStyle,
              ]}>
              {store.cart_fly_image && (
                <Image
                  style={{
                    width: store.cart_fly_position.width,
                    height: store.cart_fly_position.height,
                  }}
                  source={store.cart_fly_image}
                />
              )}
            </View>
          )}
        </ScreenWrapper>

        {isShowCartFooter && (
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
  historyTitle: {
    marginLeft: 10,
  },
  historyIcon: {
    fontSize: 18,
  },

  collapseIcon: {
    fontSize: 20,
  },
  showFullHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  showFullHistoryIcon: {
    marginLeft: 5,
  },
});

export default withTranslation(['stores', 'common', 'cart'])(observer(Search));
