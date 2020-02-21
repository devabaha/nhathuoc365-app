import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  Keyboard,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import Items from './Items';
import ListHeader from './ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';

const SEARCH_KEY = 'KeySearch';

@observer
class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      finish: false,
      header_title: '',
      search_data: null,
      history: null,
      buying_idx: [],
      searchValue: ''
    };

    this.onSearch = this.onSearch.bind(this);
    this.getHistory = this.getHistory.bind(this);
  }

  componentDidMount() {
    var keyword = this.props.qr_code;
    this.getHistory();

    setTimeout(() => {
      Actions.refresh({
        searchValue: keyword || '',
        placeholder: `Tìm kiếm trong ${this.props.category_name &&
          `${this.props.category_name} - `}${store.store_data.name ||
          'cửa hàng'}...`,
        autoFocus: true,
        onSearch: text => {
          Actions.refresh({
            searchValue: text
          });

          this.setState({
            searchValue: text
          });

          // auto search on changed text
          clearTimeout(this.onSearchTimer);
          this.onSearchTimer = setTimeout(() => {
            this.onSearch(text);
          }, 400);
        },
        onCancel: () => {
          Keyboard.dismiss();
        },
        onClearText: () => {
          Actions.refresh({
            searchValue: ''
          });

          this.setState({
            searchValue: ''
          });

          this.onSearch('');
        }
      });
    });
  }

  getHistory() {
    storage
      .load({
        key: SEARCH_KEY + store.user_info.id,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true
        }
      })
      .then(history => {
        this.setState({
          history
        });
      })
      .catch(e => {});
  }

  onSearch(keyword) {
    if (keyword == null || keyword == '') {
      this.setState({
        search_data: null,
        loading: false,
        finish: true
      });
    }

    keyword = keyword.trim();

    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.search_product(store.store_id, {
            search: keyword,
            category_id: this.props.category_id
          });

          if (response && response.status == STATUS_SUCCESS) {
            if (response.data) {
              this.setState({
                search_data: response.data,
                loading: false,
                finish: true,
                header_title: `— Kết quả cho "${keyword}" —`
              });
            } else {
              this.getHistory();

              this.setState({
                search_data: null,
                loading: false,
                finish: true
              });
            }
          }
        } catch (e) {
          console.log(e + ' search_product');
          store.addApiQueue(
            'search_product',
            this.onSearch.bind(this, keyword)
          );
        }
      }
    );
  }

  // tới màn hình chi tiết item
  _goItem(item) {
    //SEARCH_KEY

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
        item
      });
    }
  }

  _insertName(item) {
    Actions.refresh({
      searchValue: item.name
    });
    this.setState({
      searchValue: item.name
    });
  }

  _onTouchHistory(item) {
    this._insertName(item);

    this.onSearch(item.name);
  }

  _updateHistory(item) {
    var item = {
      id: item.id,
      name: item.name
    };

    // load
    storage
      .load({
        key: SEARCH_KEY + store.user_info.id,
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true
        }
      })
      .then(data => {
        this._saveHistorey([...data, item]);
      })
      .catch(err => {
        // save
        this._saveHistorey([item]);
      });
  }

  _saveHistorey(data) {
    // cache in five minutes
    storage.save({
      key: SEARCH_KEY + store.user_info.id,
      data,
      expires: null
    });
  }

  render() {
    var { loading, search_data, history, buying_idx } = this.state;
    // show loading
    if (loading) {
      return <Indicator />;
    }

    return (
      <View style={styles.container}>
        {search_data != null ? (
          <FlatList
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={
              Platform.OS === 'ios' ? 'on-drag' : 'interactive'
            }
            onEndReached={num => {}}
            onEndReachedThreshold={0}
            style={[styles.items_box]}
            ListHeaderComponent={() => (
              <ListHeader title={this.state.header_title} />
            )}
            data={search_data}
            extraData={this.state}
            renderItem={({ item, index }) => (
              <Items
                item={item}
                index={index}
                buying_idx={buying_idx}
                onPress={this._goItem.bind(this, item)}
                buyPress={this._updateHistory.bind(this, item)}
              />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        ) : history != null ? (
          (() => {
            let data = Object.assign([], history);
            data = data.reverse();

            return (
              <ScrollView
                style={[
                  styles.items_box,
                  {
                    marginBottom: store.keyboardTop
                  }
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                  Platform.OS === 'ios' ? 'on-drag' : 'interactive'
                }
              >
                <ListHeader alignLeft title="Sản phẩm đã tìm kiếm" />

                {data.map((item, index) => {
                  return (
                    <TouchableHighlight
                      key={index}
                      underlayColor="transparent"
                      onPress={this._onTouchHistory.bind(this, item)}
                      style={styles.seach_history}
                    >
                      <View style={styles.seach_history_box}>
                        <View style={styles.seach_history_name_box}>
                          <Text style={styles.seach_history_name}>
                            {item.name}
                          </Text>
                        </View>

                        <TouchableHighlight
                          underlayColor="transparent"
                          onPress={this._insertName.bind(this, item)}
                          style={styles.seach_history_expand}
                        >
                          <Icon name="expand" size={14} color="#999999" />
                        </TouchableHighlight>
                      </View>
                    </TouchableHighlight>
                  );
                })}
              </ScrollView>
            );
          })()
        ) : (
          <CenterText
            title="Nhập tên sản phẩm để tìm"
            marginTop={isIOS ? -(Util.size.height * 0.3) : undefined}
          />
        )}

        {search_data != null && store.keyboardTop == 0 && (
          <CartFooter
            perfix="search"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
          />
        )}

        <View
          style={{
            height: 0,
            width: '100%'
          }}
        ></View>

        <PopupConfirm
          ref_popup={ref => (this.refs_modal_delete_cart_item = ref)}
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
      </View>
    );
  }

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
      var response = await APIHandler.site_cart_remove(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setCartData(response.data);
          // prev item in list
          if (isAndroid && store.cart_item_index > 0) {
            var index = store.cart_item_index - 1;
            store.setCartItemIndex(index);
            Events.trigger(NEXT_PREV_CART, { index });
          }
        })();

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
  seach_history: {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  seach_history_name_box: {
    justifyContent: 'center',
    height: '100%'
  },
  seach_history_box: {
    paddingHorizontal: 15
  },
  seach_history_name: {
    fontSize: 14,
    color: '#404040'
  },
  seach_history_expand: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    flex: 1,

    marginBottom: 0
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: isAndroid ? 4 : 0
  },
  right_btn_box: {
    flexDirection: 'row'
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
    paddingHorizontal: 2
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  items_box: {},

  categories_nav: {
    backgroundColor: '#ffffff',
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
    height: 3,
    backgroundColor: DEFAULT_COLOR
  }
});

export default Search;
