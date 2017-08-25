/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import Swiper from 'react-native-swiper';
import HTMLView from 'react-native-htmlview';
import store from '../../store/Store';

// components
import Items from '../stores/Items';
import ListHeader from '../stores/ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';

const ITEM_KEY = 'ItemKey';

@observer
export default class Item extends Component {
  constructor(props) {
    super(props);

    this.state = {
     refreshing: false,
     item: props.item,
     item_data: null,
     loading: false,
     store_data: props.store_data
    }

    this._getData = this._getData.bind(this);
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  componentDidMount() {
    this.start_time = time();

    this._getData();

  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  // Lấy chi tiết sản phẩm
  _getData(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id;

    this.setState({
      loading: true
    });

    // load
    storage.load({
      key: item_key,
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        extraFetchOptions: {
        },
        someFlag: true,
      },
    }).then(data => {
      setTimeout(() => {
        this.setState({
          item_data: data,
          loading: false,
          refreshing: false
        });
      }, delay || this._delay());
    }).catch(err => {
      this._getDataFromServer(delay);
    });
  }

  async _getDataFromServer(delay) {
    var {item} = this.state;
    var item_key = ITEM_KEY + item.id;

    this.setState({
      loading: true
    });

    try {
      var response = await APIHandler.site_product(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {

        // delay append data
        setTimeout(() => {
          this.setState({
            item_data: response.data,
            loading: false,
            refreshing: false
          }, () => {
            // cache in five minutes
            storage.save({
              key: item_key,
              data: this.state.item_data,
              expires: ITEM_CACHE
            });
          });

          // animate true
          layoutAnimation();

        }, delay || this._delay());
      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _renderRightButton() {
    var {store_data} = this.state;

    return(
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            Actions.chat({
              title: store_data.name,
              store_id: store_data.id
            });
          }}>
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            {store_data && store_data.count_chat > 0 && (
              <View style={styles.stores_info_action_notify}>
                <Text style={styles.stores_info_action_notify_value}>{store_data.count_chat}</Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getDataFromServer(1000);
  }

  // add item vào giỏ hàng
  async _addCart(item) {
    try {
      var response = await APIHandler.site_cart_adding(store.store_id, item.id);

      if (response && response.status == STATUS_SUCCESS) {

        action(() => {
          store.setCartData(response.data);

          var index = null;
          if (response.data.products) {
            Object.keys(response.data.products).reverse().some((key, key_index) => {
              let value = response.data.products[key];
              if (value.id == item.id) {
                index = key_index;
                return true;
              }
            });
          }

          if (index !== null) {
            setTimeout(() => {
              store.setCartItemIndex(index);
            }, 250);
          }
        })();

      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  render() {
    var {item, item_data} = this.state;
    var {cart_data, cart_products} = store;

    return (
      <View style={styles.container}>

        <ScrollView
          ref={ref => this.refs_body_item = ref}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>

          {item_data == null ? (
            <View
              style={{
                width: Util.size.width,
                height: Util.size.width * 0.6
              }}>
              <Indicator size="small" />
            </View>
          ) : (
            <Swiper
              showsButtons={item_data.img.length > 1}
              showsPagination={false}
              paginationStyle={{marginTop: 100}}
              width={Util.size.width}
              height={Util.size.width * 0.6}
              >
              {
                item_data.img.map((item, index) => {
                  return(
                    <Image style={styles.swiper_image} source={{uri: item.image}} key={index} />
                  );
                })
              }
            </Swiper>
          )}

          <View style={styles.item_heading_box}>

            <Text style={styles.item_heading_title}>{item_data ? item_data.name : item.name}</Text>

            <View style={styles.item_heading_price_box}>
              {item.discount_percent > 0 && (
                <Text style={styles.item_heading_safe_off_value}>{item_data ? item_data.discount : item.discount}</Text>
              )}
              <Text style={styles.item_heading_price}>{item_data ? item_data.price_view : item.price_view}</Text>
            </View>

            <Text style={styles.item_heading_qnt}>{item_data ? item_data.unit_name_view : item.unit_name_view}</Text>

            <View style={styles.item_actions_box}>
              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={[styles.item_actions_btn, styles.item_actions_btn_chat]}>
                  <Icon name="heart" size={20} color={DEFAULT_COLOR} />
                  <Text style={[styles.item_actions_title, styles.item_actions_title_chat]}>Yêu thích</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this._addCart.bind(this, item_data ? item_data : item)}
                underlayColor="transparent">
                <View style={[styles.item_actions_btn, styles.item_actions_btn_add_cart]}>
                  <Icon name="cart-plus" size={24} color="#ffffff" />
                  <Text style={[styles.item_actions_title, styles.item_actions_title_add_cart]}>Chọn mua</Text>
                </View>
              </TouchableHighlight>
            </View>

          </View>

          {item != null && (
            <View style={styles.item_content_box}>

              {/*<View style={[styles.item_content_item, styles.item_content_item_left]}>
                <View style={styles.item_content_icon_box}>
                  <Icon name="clock-o" size={16} color="#999999" />
                </View>
                <Text style={styles.item_content_item_title}>GIAO SỚM NHẤT</Text>
              </View>

              <View style={[styles.item_content_item, styles.item_content_item_right]}>
                <Text style={[styles.item_content_item_value, {color: DEFAULT_COLOR}]}>Trong 1 giờ</Text>
              </View>*/}

              {item.brand != null && item.brand != '' && (
                <View style={[styles.item_content_item, styles.item_content_item_left]}>
                  <View style={styles.item_content_icon_box}>
                    <Icon name="user" size={16} color="#999999" />
                  </View>
                  <Text style={styles.item_content_item_title}>NHÃN HIỆU</Text>
                </View>
              )}

              {item.brand != null && item.brand != '' && (
                <View style={[styles.item_content_item, styles.item_content_item_right]}>
                  <Text style={styles.item_content_item_value}>{item.brand}</Text>
                </View>
              )}

              {item.made_in != null && item.made_in != '' && (
                <View style={[styles.item_content_item, styles.item_content_item_left]}>
                  <View style={styles.item_content_icon_box}>
                    <Icon name="map-marker" size={16} color="#999999" />
                  </View>
                  <Text style={styles.item_content_item_title}>XUẤT XỨ</Text>
                </View>
              )}

              {item.made_in != null && item.made_in != '' && (
                <View style={[styles.item_content_item, styles.item_content_item_right]}>
                  <Text style={styles.item_content_item_value}>{item.made_in}</Text>
                </View>
              )}

              {/*<View style={[styles.item_content_item, styles.item_content_item_left]}>
                <View style={styles.item_content_icon_box}>
                  <Icon name="usd" size={16} color="#999999" />
                </View>
                <Text style={styles.item_content_item_title}>GIÁ HIỂN THỊ</Text>
              </View>

              <View style={[styles.item_content_item, styles.item_content_item_right]}>
                <Text style={styles.item_content_item_value}>Bằng giá cửa hàng</Text>
              </View>*/}

            </View>
          )}

          <View style={styles.item_content_text}>
            {item_data != null ? (
              <HTMLView
                renderNode={this.renderNode.bind(this)}
                value={item_data.content}
                stylesheet={html_styles}
              />
            ) : (
              <Indicator size="small" />
            )}
          </View>

          {item_data != null && item_data.related && <FlatList
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            style={[styles.items_box]}
            ListHeaderComponent={() => <ListHeader title="— SẢN PHẨM CÙNG DANH MỤC —" />}
            data={item_data.related}
            renderItem={({item, index}) => (
              <Items
                item={item}
                index={index}
                onPress={this._itemRefresh.bind(this, item)}
                cartOnPress={this._addCart.bind(this, item)}
                />
            )}
            keyExtractor={item => item.id}
            numColumns={2}
          />}

          {item.discount_percent > 0 && (
            <View style={styles.item_safe_off}>
              <View style={styles.item_safe_off_percent}>
                <Text style={styles.item_safe_off_percent_val}>-{item.discount_percent}%</Text>
              </View>
            </View>
          )}

        </ScrollView>

        <CartFooter
          goCartProps={{
            title: this.state.store_data.name,
            store_data: this.state.store_data
          }}
          confirmRemove={this._confirmRemoveCartItem.bind(this)}
         />

        <PopupConfirm
          ref_popup={ref => this.refs_modal_delete_cart_item = ref}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={() => {
            if (this.refs_modal_delete_cart_item) {
              this.refs_modal_delete_cart_item.close();
            }
          }}
          yesConfirm={this._removeCartItem.bind(this)}
          />
      </View>
    );
  }

  _itemRefresh(item) {
    Actions.refresh({
      title: item.name
    });

    if (this.refs_body_item) {
      this.refs_body_item.scrollTo({x: 0, y: 0, animated: false});
    }

    this.setState({
      item,
      item_data: null
    }, this._getData.bind(this, 500));
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
            store.setCartItemIndex(store.cart_item_index - 1);
          }
        })();

      }
    } catch (e) {
      console.warn(e);
    } finally {
      this.cartItemConfirmRemove = undefined;
    }
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'img') {
      const element = node.attribs;

      return (
        <View
          style={{
            width: Util.size.width - 30,
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 12
          }}>
          <Image
            style={{
              width: Util.size.width * 0.8,
              height: 200,
              resizeMode: 'contain'
            }}
            source={{uri: element.src}}
            />
        </View>
      );
    }
  }
}

const html_styles = StyleSheet.create({
  div: {
    color: "#404040",
    fontSize: 14,
    lineHeight: 24
  },
  p: {
    color: "#404040",
    fontSize: 14,
    lineHeight: 24
  },
  a: {
    fontWeight: '300',
    color: "#FF3366",
  },
  img: {
    width: "200",
    height: "100",
    padding: 10,
    marginTop: 10
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    backgroundColor: "#ffffff"
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
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  },

  wrapper_swiper: {
    alignItems: 'center',
    // height: Util.size.width * 0.6,
  },
  content_swiper: {
    backgroundColor: "#dddddd"
  },
  swiper_image: {
    height: Util.size.width * 0.6,
    resizeMode: 'contain'
  },

  item_heading_box: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: 8
  },
  item_heading_title: {
    fontSize: 20,
    color: "#404040",
    fontWeight: '600'
  },
  item_heading_price_box: {
    flexDirection: 'row',
    marginTop: 4
  },
  item_heading_safe_off_value: {
    fontSize: 20,
    color: "#cccccc",
    textDecorationLine: 'line-through',
    paddingRight: 4
  },
  item_heading_price: {
    fontSize: 20,
    color: DEFAULT_COLOR,
    fontWeight: '600',
    paddingLeft: 4
  },
  item_heading_qnt: {
    color: "#666666",
    fontSize: 12,
    marginTop: 4
  },
  item_actions_box: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  item_actions_btn: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40
  },
  item_actions_btn_chat: {
    marginRight: 8
  },
  item_actions_btn_add_cart: {
    marginLeft: 8,
    backgroundColor: DEFAULT_COLOR
  },
  item_actions_title: {
    color: DEFAULT_COLOR,
    marginLeft: 8
  },
  item_actions_title_add_cart: {
    color: "#ffffff"
  },

  item_safe_off: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  item_safe_off_percent: {
    backgroundColor: '#fa7f50',
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  item_safe_off_percent_val: {
    color: "#ffffff",
    fontSize: 12
  },

  item_content_box: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    borderLeftWidth: Util.pixel,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    flexWrap: 'wrap'
  },
  item_content_item: {
    height: 24,
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  item_content_item_left: {
    width: '45%'
  },
  item_content_item_right: {
    width: '55%'
  },
  item_content_icon_box: {
    width: 24,
    alignItems: 'center'
  },
  item_content_item_title: {
    fontSize: 12,
    color: "#999999",
    paddingLeft: 4
  },
  item_content_item_value: {
    fontSize: 14,
    fontWeight: '600',
    color: "#404040",
    marginLeft: 4
  },

  item_content_text: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 16
  },
  item_content_desc: {
    fontSize: 16,
    color: '#404040',
    lineHeight: 24,
    marginTop: 4
  },

  items_box: {
    // marginBottom: 69,
    marginTop: 20,
    backgroundColor: "#f1f1f1"
  }
});
