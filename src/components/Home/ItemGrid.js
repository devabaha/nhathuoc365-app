import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import store from '../../store/Store';
import appConfig from 'app-config';

@observer
export default class ItemGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // tới màn hình store
  _goStores(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.push(appConfig.routes.store, {
      title: item.name
    });
  }

  // tới màn hình giỏ hàng
  _goCart(item) {
    action(() => {
      store.setStoreData(item);

      Actions.store_orders();
    })();
  }

  // tới màn hình chat
  _goChat(item) {
    action(() => {
      store.setStoreData(item);
    })();

    Actions.chat();
  }

  render() {
    var { item } = this.props;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._goStores.bind(this, item)}
      >
        <View style={styles.stores}>
          <CachedImage
            mutable
            style={styles.stores_image}
            source={{ uri: item.image_url }}
          />

          <View style={styles.stores_info}>
            <View style={styles.stores_info_text}>
              <Text style={styles.stores_info_name}>{item.name}</Text>
              <Text style={styles.stores_info_address}>{item.address}</Text>
            </View>

            <View style={styles.stores_info_cart}>
              <TouchableHighlight
                onPress={this._goChat.bind(this, item)}
                underlayColor="transparent"
                style={styles.stores_info_action}
              >
                <View style={styles.stores_info_action_box}>
                  <Icon name="commenting" size={20} color="#ffffff" />
                  <Text style={styles.stores_info_action_label}>Tin nhắn</Text>

                  {item.count_chat > 0 && (
                    <View style={styles.stores_info_action_notify}>
                      <Text style={styles.stores_info_action_notify_value}>
                        {item.count_chat}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={this._goCart.bind(this, item)}
                underlayColor="transparent"
                style={styles.stores_info_action}
              >
                <View style={styles.stores_info_action_box}>
                  <Icon name="shopping-cart" size={22} color="#ffffff" />
                  <Text style={styles.stores_info_action_label}>Đơn hàng</Text>

                  {item.count_cart > 0 && (
                    <View style={styles.stores_info_action_notify}>
                      <Text style={styles.stores_info_action_notify_value}>
                        {item.count_cart}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

ItemGrid.propTypes = {
  item: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  stores: {
    backgroundColor: '#cccccc',
    width: '100%',
    height: ~~(CONTAINER_HEIGHT / 3),
    overflow: 'hidden',
    borderBottomWidth: Util.pixel,
    borderBottomColor: '#000000'
  },
  stores_image: {
    height: '100%',
    resizeMode: 'cover'
  },
  stores_info: {
    width: '100%',
    minHeight: 56,
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  stores_info_text: {
    width: Util.size.width - 130
  },
  stores_info_name: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  stores_info_address: {
    color: '#fafafa',
    fontSize: 12,
    marginTop: 4
  },
  stores_info_cart: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    width: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 10
  },
  stores_info_action: {
    padding: 10
  },
  stores_info_action_box: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46
  },
  stores_info_action_label: {
    fontSize: 9,
    color: '#fafafa',
    marginTop: 4
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 0,
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
  }
});
