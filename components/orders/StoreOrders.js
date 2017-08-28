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
export default class StoreOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      store_id: props.data.site_id,
      store_data: props.store_data
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

  async _getData(delay) {
    try {
      var response = await APIHandler.site_cart_list(this.state.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });
        }, delay || 0);
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
            {/*<View style={styles.stores_info_action_notify}>
              <Text style={styles.stores_info_action_notify_value}>3</Text>
            </View>*/}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
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
                from="store_orders"
                onPress={() => {
                  Actions.orders_item({
                    data: item,
                    store_data: this.state.store_data
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
