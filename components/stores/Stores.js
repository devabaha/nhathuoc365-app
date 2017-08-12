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
      renderRightButton: this._renderRightButton.bind(this)
    });
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.categories_nav}>
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
        </View>

        {this.state.data != null && <FlatList
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          style={styles.items_box}
          ListHeaderComponent={() => <ListHeader title="Tất cả sản phẩm" />}
          data={this.state.data}
          renderItem={({item, index}) => <Items item={item} index={index} onPress={() => Actions.item({})} />}
          keyExtractor={item => item.id}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />}

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
    paddingHorizontal: 8
  },
  right_btn_box: {
    flexDirection: 'row'
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
    color: '#404040'
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
