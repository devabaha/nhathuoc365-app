/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { CheckBox } from '../../lib/react-native-elements';
import store from '../../store/Store';
import {reaction} from 'mobx';

// components
import ListHeader from '../stores/ListHeader';
import PopupConfirm from '../PopupConfirm';
import OrdersItemComponent from './OrdersItemComponent';

@observer
export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      empty: false
    }

    this._getData = this._getData.bind(this);

    // refresh
    reaction(() => store.orders_key_change, this._getData);
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  componentDidMount() {
    this._getData();
  }

  componentWillReceiveProps() {
    this._getData();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.user_cart_list();

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false,
            empty: false
          });
        }, delay || 0);
      } else {
        this.setState({
          empty: true
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  _renderRightButton() {
    return null;

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
      </View>
    );
  }

  _is_delete_cart_item(item_id) {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  _delete_cart_item(item_id, flag) {
    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }
  }

  render() {
    if (this.state.empty) {
      return <CenterText title="Chưa có đơn hàng nào" />
    }

    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {this.state.data != null && <FlatList
          // renderSectionHeader={({section}) => (
          //   <View style={styles.cart_section_box}>
          //     <Image style={styles.cart_section_image} source={{uri: section.image}} />
          //     <Text style={styles.cart_section_title}>{section.key}</Text>
          //   </View>
          // )}
          onEndReached={(num) => {

          }}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          onEndReachedThreshold={0}
          style={styles.items_box}
          data={this.state.data}
          extraData={this.state}
          renderItem={({item, index}) => {
            return(
              <OrdersItemComponent
                item={item}
                storeOnPress={() => {
                  Actions.store_orders({
                    data: item,
                    title: item.shop_name
                  });
                }}
                onPress={() => {
                  Actions.orders_item({
                    data: item,
                    title: `Đơn hàng #${item.cart_code}`,
                    store_data: {
                      name: item.shop_name,
                      id: item.site_id
                    }
                  });
                }} />
            );
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />}

        <PopupConfirm
          ref_popup={ref => this.refs_modal_delete_cart_item = ref}
          title="Bạn muốn bỏ sản phẩm này khỏi giỏ hàng?"
          height={110}
          noConfirm={this._delete_cart_item.bind(this, false)}
          yesConfirm={this._delete_cart_item.bind(this, true)}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
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

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  }

});
