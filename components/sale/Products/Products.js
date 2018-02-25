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

export default class Products extends Component {

  constructor(props) {
    super(props);

    this.state = {
      datas: null,
      item_data: props.item_data || {}
    }
  }

  componentDidMount() {
    this._getData(300);
  }

  // get products
  _getData = async (delay = 0) => {
    try {
      var response = await ADMIN_APIHandler.site_products(this.state.item_data.id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            datas: response.data || null,
            finish: true
          });

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
    Actions.create_product({
      title: item.name,
      data: item,
      item_data: this.state.item_data,
      editMode: true
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
              if (index == 0) {
                // alert(JSON.stringify(item))
              }
              return(
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this._itemOnpress.bind(this, item)}
                  >
                  <View style={styles.productBox}>
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
                      <Icon name={item.delete_flag == 1 ? "eye-slash" : "eye"} size={16} color="#666" />
                      <Text style={[styles.productFlag, {marginRight: 16}]}>{item.delete_flag == 1 ? "Đang ẩn" : "Đang hiện"}</Text>
                      <Icon name="sort" size={16} color="#666" />
                      <Text style={[styles.productFlag, {marginRight: 16}]}>{item.ordering}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
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
            onPress={() => {
              Actions.create_product({
                title: "Đăng sản phẩm",
                item_data: this.state.item_data
              });
            }}
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
  }
});
