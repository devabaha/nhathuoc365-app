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
import RightButtonChat from '../RightButtonChat';

@observer
export default class StoreOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      cart_check_list: {},
      loading: true,
      store_id: props.store_id || store.store_id,
      title: props.title || store.store_data.name
    }

    this._getData = this._getData.bind(this);
  }

  componentDidMount() {

    Actions.refresh({
      title: this.state.title,
      renderRightButton: this._renderRightButton.bind(this)
    });

    this.start_time = time();

    this._getData();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.site_cart_list(this.state.store_id);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          layoutAnimation();
          
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });
        }, delay || this._delay());
      } else {
        this.setState({
          loading: false
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  _renderRightButton() {
    return(
      <View style={styles.right_btn_box}>
        <RightButtonChat
          title={this.state.title || undefined}
          store_id={this.state.store_id || undefined}
         />
      </View>
    );
  }

  render() {
    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {this.state.data != null ? (
          <FlatList
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
                      data: item
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
          />
        ) : (
          <CenterText title="Bạn chưa có đơn hàng nào" />
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
  right_btn_box: {
    flexDirection: 'row'
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd",
  }

});
