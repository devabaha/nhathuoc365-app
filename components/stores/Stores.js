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
import { Button } from 'react-native-elements';

// header for FlatList
class ListHeader extends Component {
  render() {
    return (
      <View style={styles.store_heading_box}>
        <Text style={styles.store_heading_title}>— Tất cả sản phẩm —</Text>
      </View>
    );
  }
}

@autobind
@observer
export default class Stores extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      category_nav_index: 0,
      store_cart_index: 0,
      data: [
       {id: 1, name: 'https://dl.airtable.com/Qh7rvfKTpixsA8EJY8gN_DF084%20-%202-thumbnail%402x.jpg'},
       {id: 2, name: 'https://dl.airtable.com/fHPF5j1wS4ygkQXajEJo_DF049%20-%203-thumbnail%402x.jpg'},
       {id: 3, name: 'https://dl.airtable.com/857k6KkTQjmYhntXG7bA_CAT0142-thumbnail%402x.jpg'},
       {id: 4, name: 'https://dl.airtable.com/49DRLvioQEmPia4ax2sB_CAT0169-thumbnail%402x.jpg.jpg'},
       {id: 5, name: 'https://dl.airtable.com/h6BemcmSYqFCa846oZQg_IMG_9563-thumbnail%402x.jpg'},
       {id: 6, name: 'https://dl.airtable.com/PFaOAMWQ4y1Tu8jmgxJV_DF059%20-%202-thumbnail%402x.jpg'},
       {id: 7, name: 'https://dl.airtable.com/JNaHnxaoQqyU8wwDyNsV_1.1%20Ba%20roi%20rut%20suong-thumbnail%402x.jpg.jpg'},
       {id: 8, name: 'https://dl.airtable.com/wJpDFze3T0mTRXvXiYIb_DF078%20-%202-thumbnail%402x.jpg'},
       {id: 9, name: 'https://dl.airtable.com/UKLNZUjeT3u14Odw69OP_9-thumbnail%402x.jpg.jpg'},
       {id: 10, name: 'https://dl.airtable.com/Q9spiMmGTWCuYT0s8kNa_CAT0147-thumbnail%402x.jpg.jpg'},
     ],
     categories_data: [
       {id: 0, name: 'Tất cả'},
       {id: 1, name: 'Rau hữu cơ'},
       {id: 2, name: 'Thịt cá dân dã'},
       {id: 3, name: 'Hải sản'},
     ]
    }
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton
    });
  }

  _renderRightButton() {
    return(
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {

        }}>
        <View style={styles.right_btn_add_store}>
          <Icon name="cart-plus" size={22} color="#ffffff" />
          <View style={styles.stores_info_action_notify}>
            <Text style={styles.stores_info_action_notify_value}>3</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderItems({item, index}) {
    return(
      <TouchableHighlight
        onPress={() => {
          Actions.item({});
        }}
        underlayColor={DEFAULT_COLOR}>
        <View style={[styles.item_box, {borderRightWidth: index%2 == 0 ? Util.pixel : 0}]}>

          <View style={styles.item_image_box}>
            <Image style={styles.item_image} source={{uri: item.name}} />
          </View>

          <View style={styles.item_info_box}>
            <View style={styles.item_info_made}>
              <Icon name="map-marker" size={12} color="#666666" />
              <Text style={styles.item_info_made_title}>Đà Lạt</Text>
              <View style={styles.item_info_weight}>
                <Text style={styles.item_info_made_title}>1 kg</Text>
              </View>
            </View>
            <Text style={styles.item_info_name}>Bưởi năm roi Đà Lạt</Text>
            <Text style={styles.item_info_price}>48.000</Text>
          </View>

          <TouchableHighlight
            style={styles.item_add_cart_btn}
            underlayColor="transparent"
            onPress={() => 1}>

            <View style={styles.item_add_cart_box}>
              <Icon name="shopping-cart" size={24} color={DEFAULT_COLOR} />
              <Text style={styles.item_add_cart_title}>Chọn mua</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.item_safe_off}>
            <View style={styles.item_safe_off_percent}>
              <Text style={styles.item_safe_off_percent_val}>-23%</Text>
            </View>
            <Text style={styles.item_safe_off_price}>26,000</Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  _changeCategory(category_id) {
    if (_.isObject(this.refs) && this.refs.category_nav) {
      layoutAnimation();

      var categories_count = this.state.categories_data.length;
      var end_of_list = (categories_count - category_id - 1) >= 3;

      if (category_id > 0 && end_of_list) {
          this.refs.category_nav.scrollToIndex({index: category_id - 1, animated: true});
      } else if (!end_of_list) {
        this.refs.category_nav.scrollToEnd();
      }

      this.setState({
        category_nav_index: category_id
      });
    }
  }

  _item_qnt_decrement() {

  }

  _item_qnt_increment() {

  }

  _store_cart_prev() {
    if (this.state.store_cart_index <= 0) {
      return;
    }

    this.setState({
      store_cart_index: this.state.store_cart_index - 1
    }, () => {
      this.refs.store_cart.scrollToIndex({index: this.state.store_cart_index, animated: true});
    });
  }

  _store_cart_next() {
    if (this.state.store_cart_index + 1 >= this.state.data.length) {
      return;
    }

    this.setState({
      store_cart_index: this.state.store_cart_index + 1
    }, () => {
      this.refs.store_cart.scrollToIndex({index: this.state.store_cart_index, animated: true});
    });
  }

  renderItemsCart({item}) {
    return(
      <View style={styles.store_cart_item}>
        <View style={styles.store_cart_item_image_box}>
          <Image style={styles.store_cart_item_image} source={{uri: item.name}} />
        </View>
        <View style={styles.store_cart_item_title_box}>
          <Text style={styles.store_cart_item_title}>Bưởi năm roi Đà Lạt</Text>
          <Text style={styles.store_cart_item_price}>48.000</Text>
        </View>

        <View style={styles.store_cart_calculator}>
          <TouchableHighlight
            onPress={this._item_qnt_decrement}
            underlayColor="transparent"
            style={styles.store_cart_item_qnt_change}>
            <Icon name="minus" size={16} color="#404040" />
          </TouchableHighlight>

          <Text style={styles.store_cart_item_qnt}>2</Text>

          <TouchableHighlight
            onPress={this._item_qnt_increment}
            underlayColor="transparent"
            style={styles.store_cart_item_qnt_change}>
            <Icon name="plus" size={16} color="#404040" />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>

        <FlatList
          ref="category_nav"
          data={this.state.categories_data}
          extraData={this.state}
          keyExtractor={item => item.id}
          horizontal={true}
          style={styles.categories_nav}
          renderItem={({item}) => {
            let active = this.state.category_nav_index == item.id;
            return(
              <TouchableHighlight
                onPress={() => this._changeCategory(item.id)}
                underlayColor="transparent">
                <View style={styles.categories_nav_items}>
                  <Text style={[styles.categories_nav_items_title, active ? styles.categories_nav_items_title_active : null]}>{item.name}</Text>

                  {active && <View style={styles.categories_nav_items_active} />}
                </View>
              </TouchableHighlight>
            );
          }}
        />

        {this.state.data != null && <FlatList
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          style={styles.items_box}
          ListHeaderComponent={ListHeader}
          data={this.state.data}
          renderItem={this.renderItems}
          keyExtractor={item => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}

        <View style={styles.store_cart_box}>
          <View style={styles.store_cart_container}>
            <View style={styles.store_cart_content}>
              {this.state.data != null && <FlatList
                ref="store_cart"
                data={this.state.data}
                pagingEnabled
                scrollEnabled={false}
                getItemLayout={(data, index) => {
                  return {length: Util.size.width - 172, offset: (Util.size.width - 172) * index, index};
                }}
                renderItem={this.renderItemsCart}
                keyExtractor={item => item.id}
                horizontal={true}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              />}
            </View>

            <TouchableHighlight
              style={[styles.store_cart_btn, styles.store_cart_btn_left]}
              underlayColor="#f1efef"
              onPress={this._store_cart_prev}>
              <Icon name="chevron-left" size={24} color="#333333" />
            </TouchableHighlight>

            <TouchableHighlight
              style={[styles.store_cart_btn, styles.store_cart_btn_right]}
              underlayColor="#f1efef"
              onPress={this._store_cart_next}>
              <Icon name="chevron-right" size={24} color="#333333" />
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            onPress={() => 1}
            style={styles.checkout_btn}
            underlayColor="transparent"
            >
            <View style={styles.checkout_box}>
              <Icon name="shopping-cart" size={22} color="#ffffff" />
              <Text style={styles.checkout_title}>Giỏ hàng</Text>
            </View>
          </TouchableHighlight>
        </View>
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
    paddingHorizontal: 8
  },
  stores_info_action_notify: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: 'red',
    top: -4,
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
    marginBottom: 60
  },
  item_box: {
    width: Math.floor(Util.size.width / 2),
    height: Math.floor(Util.size.width / 2),
    borderRightWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    backgroundColor: "#ffffff"
  },
  item_image_box: {
    width: '100%',
    height: '80%'
  },
  item_image: {
    height: '100%',
    resizeMode: 'center'
  },
  item_info_box: {
    width: '100%',
    minHeight: '34%',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)"
  },
  item_info_made: {
    flexDirection: 'row'
  },
  item_info_made_title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 8
  },
  item_info_weight: {
    flex: 1,
    alignItems: 'flex-end'
  },
  item_info_name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginTop: 2
  },
  item_info_price: {
    fontSize: 16,
    fontWeight: '600',
    color: DEFAULT_COLOR,
    marginTop: 2
  },

  store_heading_box: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_heading_title: {
    fontSize: 14,
    color: '#333333'
  },
  item_add_cart_btn: {
    position: 'absolute',
    top: 4,
    right: 0,
    width: 60,
    height: 40,
    zIndex: 2
  },
  item_add_cart_box: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item_add_cart_title: {
    color: "#404040",
    fontSize: 8
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
  item_safe_off_price: {
    color: "#404040",
    fontSize: 12,
    marginLeft: 4,
    textDecorationLine: 'line-through'
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
    color: '#404040'
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
  },
  store_cart_box: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderTopColor: '#dddddd',
    flexDirection: 'row'
  },
  store_cart_container: {
    width: Util.size.width - 100,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_cart_btn: {
    height: '100%',
    width: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  store_cart_btn_left: {
    left: 0
  },
  store_cart_btn_right: {
    right: 0
  },
  checkout_btn: {
    width: 100,
    height: '100%',
  },
  checkout_box: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DEFAULT_COLOR
  },
  checkout_title: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 4
  },
  store_cart_content: {
    width: Util.size.width - 172,
    height: '100%'
  },
  store_cart_item: {
    width: Util.size.width - 172,
    height: '100%',
    flexDirection: 'row'
  },
  store_cart_item_image_box: {
    width: 60,
    height: 50,
    overflow: 'hidden',
    marginHorizontal: 4
  },
  store_cart_item_image: {
    height: '100%',
    resizeMode: 'cover'
  },
  store_cart_item_title_box: {
    flex: 1
  },
  store_cart_item_title: {
    color: "#404040",
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500'
  },
  store_cart_item_price: {
    fontSize: 10,
    color: '#fa7f50'
  },
  store_cart_calculator: {
    position: 'absolute',
    height: '50%',
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    width: Util.size.width - 232,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  store_cart_item_qnt_change: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Util.pixel,
    borderColor: '#404040',
    borderRadius: 3
  },
  store_cart_item_qnt: {
    fontWeight: '600',
    color: "#404040",
    fontSize: 16,
    paddingHorizontal: 16
  }
});
