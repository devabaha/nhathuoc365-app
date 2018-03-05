/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableHighlight
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import store from '../../../store/Store';
import Selections from '../../Selections';
import _ from 'lodash';

export default class Products extends Component {

  constructor(props) {
    super(props);

    this.state = {
      datas: null,
      item_data: props.item_data || {},
      sort: null,
      sorting: null
    }
  }

  componentDidMount() {
    this._getData(300);
  }

  // get products
  _getData = async (delay = 0, callback = null) => {
    try {
      var response = await ADMIN_APIHandler.site_products(this.state.item_data.id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            datas: response.data.products || null,
            finish: true,
            sort: response.data.sort,
            sorting: response.data.sort[0]
          });

          if (typeof callback == 'function') {
            callback();
          }

          layoutAnimation();
        }, delay);
      }

    } catch (e) {
      console.warn(e + ' site_products');

      store.addApiQueue('site_products', this._getData.bind(this, delay));
    } finally {

    }
  }

  _itemOnpress(item) {
    Actions.edit_product({
      title: "Sửa sản phẩm",
      data: item,
      item_data: this.state.item_data,
      editMode: true,
      parentReload: this._getData
    });
  }

  _createNew() {
    Actions.create_product({
      title: "Đăng sản phẩm",
      item_data: this.state.item_data,
      parentReload: this._getData
    });
  }

  posOnPress(item) {
    this.setState({
      sorting: item.ordering,
      currentItem: item
    }, () => {
      if (this.ref_prod_sort) {
        this.ref_prod_sort.open();
      }
      if (this.ref_selection) {
        this.ref_selection.positionHandle();
      }
    });
  }

  render() {
    var { datas, finish } = this.state;

    return (
      <View style={styles.container}>
        {datas != null && finish == true ? (
          <FlatList
            data={datas}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              return(
                <ProductItem
                  parentReload={this._getData}
                  onPress={this._itemOnpress.bind(this, item)}
                  posOnPress={item => this.posOnPress(item)}
                  item={item}
                  index={index} />
              );
            }}
            />
        ) : finish == true ? (
          null
        ) : (
          <Indicator size="small" />
        )}

        {finish && (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._createNew.bind(this)}
            style={{
              position: 'absolute',
              bottom: 40,
              right: 30
            }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: HEADER_ADMIN_BGR,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Icon name="plus" size={20} color="#ffffff" />
            </View>
          </TouchableHighlight>
        )}

        {_.isArray(this.state.sort) && (
          <Selections
            ref={ref => this.ref_selection = ref}
            refs={ref => this.ref_prod_sort = ref}
            datas={this.state.sort}
            selected={this.state.sorting}
            onSelect={this._onSorting.bind(this)}
            height={this._getSelectionsHeight(this.state.sort.length)}
           />
        )}
      </View>
    );
  }

  async _onSorting(sorting) {
    try {
      var response = await ADMIN_APIHandler.product_ordering(this.state.currentItem.site_id, this.state.currentItem.id, {
        value: sorting
      });
      if (response && response.status) {
        this._getData();
      }
    } catch (e) {
      console.warn(e + ' product_ordering');

      store.addApiQueue('product_ordering', this._onSorting.bind(this, sorting));
    } finally {

    }
  }

  // get height for selections
  _getSelectionsHeight(length) {
    var height = length * 48;
    return height < 400 ? height : 400;
  }
}

class ProductItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }
  }

  _changeFlag(item) {
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await ADMIN_APIHandler.product_change_flag(item.site_id, item.id);
        if (response && response.status == STATUS_SUCCESS) {
          if (this.props.parentReload) {
            this.props.parentReload(0, () => {
              this.setState({
                loading: false
              });
            });
          }
        }
      } catch (e) {
        console.warn(e + ' product_change_flag');

        store.addApiQueue('product_change_flag', this._changeFlag.bind(this, item));
      } finally {

      }
    });
  }

  render() {
    var {item} = this.props;
    var {loading} = this.state;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          if (this.props.onPress) {
            this.props.onPress();
          }
        }}
        >
        <View style={[styles.productBox, {
          backgroundColor: item.delete_flag == 1 ? "#f1f1f1" : "#ffffff"
        }]}>
          <CachedImage
            source={{uri: item.image}}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productBrand}>{item.brand}</Text>
            <Text style={styles.productBrand}>{item.price_view}</Text>
          </View>

          <View style={styles.productActions}>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._changeFlag.bind(this, item)}>
              <View style={styles.productBtnBox}>
                {loading ? (
                  <Indicator size="small" />
                ) : (
                  <Icon name={item.delete_flag == 1 ? "eye-slash" : "eye"} size={16} color="#666" />
                )}
                <Text style={[styles.productFlag, {marginRight: 16}]}>{item.delete_flag == 1 ? "Đang ẩn" : "Đang hiện"}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (this.props.posOnPress) {
                  this.props.posOnPress(item);
                }
              }}>
              <View style={styles.productBtnBox}>
                <Icon name="sort" size={16} color="#666" />
                <Text style={[styles.productFlag, {marginRight: 16}]}>{item.ordering}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  productBox: {
    width: '100%',
    minHeight: 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  productImage: {
    width: 50,
    height: 50,
    backgroundColor: '#ebebeb'
  },
  productInfo: {
    marginLeft: 8
  },
  productName: {
    fontSize: 16,
    fontWeight: '500'
  },
  productBrand: {
    // position: 'absolute',
    // left: 15,
    // bottom: 8,
    fontSize: 12
  },
  productActions: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 24,
    minWidth: 100,
    // backgroundColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center'
  },
  productFlag: {
    paddingHorizontal: 4,
    fontSize: 12,
    color: "#666"
  },
  productBtnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4
  }
});
