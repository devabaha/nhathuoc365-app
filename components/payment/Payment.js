/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Imgae,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl,
  Keyboard
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

// components
import Address from './Address';
import Confirm from './Confirm';

@observer
export default class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payments_data: [
        {id: 'address', index: 0, name: '1. Địa chỉ', icon: 'map-marker', title: 'ĐỊA CHỈ NHẬN HÀNG'},
        {id: 'confirm', index: 1, name: '2. Xác nhận', icon: 'check', title: 'XÁC NHẬN ĐƠN HÀNG'}
      ],
      refreshing: false,
      payment_nav_index: 0
    }

    this._renderRightButton = this._renderRightButton.bind(this);
    this._go_address_page = this._go_address_page.bind(this);
    this._go_confirm_page = this._go_confirm_page.bind(this);
  }

  componentWillMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton,
      onBack: () => {
        Actions.pop();
      }
    });
  }

  _renderRightButton() {
    return(
      <TouchableHighlight
        style={styles.right_btn_add_store}
        underlayColor="transparent"
        onPress={this._add_new}>
        <Icon name="plus" size={20} color="#ffffff" />
      </TouchableHighlight>
    );
  }

  _add_new() {
    Actions.createAddress({});
  }

  _go_address_page() {
    var key = 0;
    var {id, index, title} = this.state.payments_data[key];

    this._go_to_page_index(id, index, title);

    // Keyboard down
    Keyboard.dismiss();
  }

  _go_confirm_page() {
    var key = 1;
    var {id, index, title} = this.state.payments_data[key];

    this._go_to_page_index(id, index, title);
  }

  _go_to_page_index(id, index, title) {
    if (this.refs_payment_page) {
        layoutAnimation();

        this.refs_payment_page.scrollToIndex({index, animated: true});

        this.setState({
          payment_nav_index: index
        });

        var refresh = {
          title
        }

        switch (id) {
          case 'address':
            refresh.renderRightButton = this._renderRightButton;
            refresh.onBack = () => Actions.pop();
            break;
          case 'confirm':
            refresh.renderRightButton = null;
            refresh.onBack = this._go_address_page;
            break;
          default:
            refresh.renderRightButton = null;
            refresh.onBack = () => Actions.pop()
        }

        Actions.refresh(refresh);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {store.payment_nav_show && (
          <View style={styles.payments_nav}>
            <FlatList
              ref="payment_nav"
              data={this.state.payments_data}
              extraData={this.state}
              keyExtractor={item => item.id}
              horizontal={true}
              style={styles.borderBottom}
              renderItem={({item}) => {
                let active = this.state.payment_nav_index >= item.index;
                return(
                  <TouchableHighlight
                    onPress={() => {
                      if (item.id == "address") {
                        this._go_to_page_index(item.id, item.index, item.title);
                      }
                    }}
                    underlayColor="transparent">
                    <View style={styles.payments_nav_items}>
                      <View style={[styles.payments_nav_icon_box, active ? styles.payments_nav_icon_box_active : null]}>
                        <Icon style={[styles.payments_nav_icon, active ? styles.payments_nav_icon_active : null]} name={item.icon} size={20} color="#999" />
                      </View>
                      <Text style={[styles.payments_nav_items_title, active ? styles.payments_nav_items_title_active : null]}>{item.name}</Text>

                      {active && <View style={styles.payments_nav_items_active} />}
                    </View>
                  </TouchableHighlight>
                );
              }}
            />
          </View>
        )}

        <FlatList
          ref={ref => this.refs_payment_page = ref}
          data={this.state.payments_data}
          extraData={this.state}
          keyExtractor={item => item.id}
          horizontal={true}
          pagingEnabled
          scrollEnabled={false}
          getItemLayout={(data, index) => {
            return {length: Util.size.width, offset: Util.size.width * index, index};
          }}
          renderItem={({item}) => {
            switch (item.id) {
              case 'address':
                return <Address go_confirm_page={this._go_confirm_page} add_new={this._add_new} />
                break;
              case 'confirm':
                return <Confirm go_address_page={this._go_address_page} />
                break;
              default:

            }
          }}
        />
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
  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center'
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666'
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: "#cccccc",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR
  }
});
