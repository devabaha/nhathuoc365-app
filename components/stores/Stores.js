/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';

// components
import Items from './Items';
import ListHeader from './ListHeader';
import CartFooter from '../cart/CartFooter';

@observer
export default class Stores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      loading: false,
      category_nav_index: 0,
      store_cart_index: 0,
      items_data: null,
      categories_data: null
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  componentDidMount() {
    this.start_time = time();

    this._getCategoriesNav();

    this._getItemByCateId(0);
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  // lấy thông tin cửa hàng
  async _getCategoriesNav() {
    try {
      var response = await APIHandler.site_info(this.props.store.store_id);

      if (response && response.status == STATUS_SUCCESS) {

        setTimeout(() => {
          this.setState({
            categories_data: [{id: 0, name: "Tất cả"}, ...response.data.categories],
          });
        }, this._delay());

      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // lấy d/s sản phẩm theo category_id
  async _getItemByCateId(category_id) {
    this.setState({
      loading: true
    });

    try {
      var response = await APIHandler.site_category_product(this.props.store.store_id, category_id);

      if (response && response.status == STATUS_SUCCESS) {

        setTimeout(() => {
          this.setState({
            items_data: response.data,
            loading: false
          });
          layoutAnimation();
        }, this._delay());

      }

    } catch (e) {
      console.warn(e);
    }
  }

  _renderRightButton() {
    return(
      <View style={styles.right_btn_box}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {

          }}>
          <View style={styles.right_btn_add_store}>
            <Icon name="commenting" size={20} color="#ffffff" />
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => Actions.cart({})}>
          <View style={styles.right_btn_add_store}>
            <Icon name="shopping-cart" size={22} color="#ffffff" />
            <View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  _changeCategory(item, index) {
    if (_.isObject(this.refs) && this.refs.category_nav) {

      this._getItemByCateId(item.id);

      var categories_count = this.state.categories_data.length;
      var end_of_list = (categories_count - index - 1) >= 3;

      if (index > 0 && end_of_list) {
          this.refs.category_nav.scrollToIndex({index: index - 1, animated: true});
      } else if (!end_of_list) {
        this.refs.category_nav.scrollToEnd();
      }

      this.setState({
        category_nav_index: index
      });
      layoutAnimation();
    }
  }

  // tới màn hình chi tiết item
  _goItem(item) {

    Actions.item({
      title: item.name,
      item
    });
  }

  // add item vào giỏ hàng
  async _addCart(item) {
    try {
      var response = await APIHandler.site_cart_adding(this.props.store.store_id, item.id);

      console.warn(JSON.stringify(response));

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // render danh sách sản phẩm
  _renderItemsContent() {
    if (this.state.items_data) {
      return(
        <FlatList
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          style={styles.items_box}
          ListHeaderComponent={() => <ListHeader title="— Tất cả sản phẩm —" />}
          data={this.state.items_data}
          renderItem={({item, index}) => (
            <Items
              item={item}
              index={index}
              onPress={this._goItem.bind(this, item)}
              cartOnPress={this._addCart.bind(this, item)}
              />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      );
    } else if (this.state.loading) {
      return <Indicator />
    } else {
      return <CenterText title="Chưa có sản phẩm nào" />
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.categories_nav}>
          {this.state.categories_data != null ? (
            <FlatList
              ref="category_nav"
              data={this.state.categories_data}
              extraData={this.state}
              keyExtractor={item => item.id}
              horizontal={true}
              style={styles.categories_nav}
              renderItem={({item, index}) => {
                let active = this.state.category_nav_index == index;
                return(
                  <TouchableHighlight
                    onPress={() => this._changeCategory(item, index)}
                    underlayColor="transparent">
                    <View style={styles.categories_nav_items}>
                      <Text style={[styles.categories_nav_items_title, active ? styles.categories_nav_items_title_active : null]}>{item.name}</Text>

                      {active && <View style={styles.categories_nav_items_active} />}
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          ) : (
            <Indicator size="small" />
          )}
        </View>

        {this._renderItemsContent.call(this)}

        <CartFooter />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
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
    width: 16,
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

  items_box: {
    marginBottom: 59
  },

  categories_nav: {
    backgroundColor: '#ffffff',
    height: 40,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
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
