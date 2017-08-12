/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import { Button } from '../../lib/react-native-elements';

@observer
export default class CartFooter extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
     store_cart_index: 0,
     refreshing: false
    }
  }

  renderItems({item}) {
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

  render() {
    return (
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
              renderItem={this.renderItems}
              keyExtractor={item => item.id}
              horizontal={true}
            />}
          </View>

          <TouchableHighlight
            style={[styles.store_cart_btn, styles.store_cart_btn_left]}
            underlayColor="#f1efef"
            onPress={this._store_cart_prev.bind(this)}>
            <Icon name="chevron-left" size={24} color="#333333" />
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.store_cart_btn, styles.store_cart_btn_right]}
            underlayColor="#f1efef"
            onPress={this._store_cart_next.bind(this)}>
            <Icon name="chevron-right" size={24} color="#333333" />
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          onPress={() => Actions.cart({})}
          style={styles.checkout_btn}
          underlayColor="transparent"
          >
          <View style={styles.checkout_box}>
            <Icon name="shopping-cart" size={22} color="#ffffff" />
            <Text style={styles.checkout_title}>Giỏ hàng</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
