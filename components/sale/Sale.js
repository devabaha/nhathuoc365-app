import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions, ActionConst} from 'react-native-router-flux';
import store from '../../store/Store';

import {
  OrdersItemComponent
} from './OrdersItemComponent';

@observer
export default class Sale extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      category_nav_index: 0,
      item_data: props.item_data
    }
  }

  componentDidMount() {
    this._getData();

    this._getDataTimer = setInterval(() => {
      if (!this._geting) {
        this._getData();
      }
    }, 5000);

    Actions.refresh({
      onBack: () => {
        clearInterval(this._getDataTimer);
        Actions.pop();
      }
    });
  }

  _getData = async () => {
    var {id} = this.state.item_data;
    this._geting = true;

    try {
      var response = await ADMIN_APIHandler.all_cart(id);

      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setSaleCarts({
            categories_data: response.data.sale_list,
            cart_list: response.data.cart_list
          });

          if (Object.keys(response.data.chat_notify).length) {
            store.setNotifyAdminChat(response.data.chat_notify);
          }
        })();
      }

    } catch (e) {
      console.warn(e);
    } finally {
      this._geting = false;
    }
  }

  _changeCategory(item, index, nav_only) {
    if (this.refs_category_nav) {

      var categories_count = store.sale_carts.categories_data.length;
      var end_of_list = (categories_count - index - 1) >= 3;

      // nav
      if (index > 0 && end_of_list) {
        this.refs_category_nav.scrollToIndex({index: index - 1, animated: true});
      } else if (!end_of_list) {
        this.refs_category_nav.scrollToEnd();
      } else if (index == 0) {
        this.refs_category_nav.scrollToIndex({index, animated: true});
      }

      // content
      if (this.refs_category_screen && !nav_only) {
        this.refs_category_screen.scrollToIndex({index: index, animated: true});
      }

      this.setState({
        category_nav_index: index
      });
    }
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);

    this._changeCategory(null, pageNum, true);
  }

  render() {
    var {stores} = this.state;
    var {categories_data} = store.sale_carts;

    return (
      <View style={styles.container}>
        <View style={styles.categories_nav}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={ref => this.refs_category_nav = ref}
            data={categories_data}
            extraData={this.state.category_nav_index}
            //keyExtractor={item => item.id}
            horizontal={true}
            renderItem={({item, index}) => {
              let active = this.state.category_nav_index == index;
              var ICON;

              switch (item.key) {
                case CART_STATUS_READY:
                  ICON = <Icon name="clock-o" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
                case CART_STATUS_ACCEPTED:
                  ICON = <Icon name="check" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
                case CART_STATUS_PROCESSING:
                  ICON = <Icon name="tasks" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
                case CART_STATUS_DELIVERY:
                  ICON = <Icon name="motorcycle" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
                case CART_STATUS_COMPLETED:
                  ICON = <Icon name="check-square-o" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
                case CART_STATUS_CANCEL:
                  ICON = <Icon name="ban" color={active ? DEFAULT_ADMIN_COLOR : "#666666"} size={20} />;
                  break;
              }

              return(
                <TouchableHighlight
                  onPress={() => this._changeCategory(item, index)}
                  underlayColor="transparent">
                  <View style={styles.categories_nav_items}>
                    {ICON}
                    <Text style={[styles.categories_nav_items_title, active ? styles.categories_nav_items_title_active : null]}>{item.name}</Text>

                    {active && <View style={styles.categories_nav_items_active} />}
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </View>

        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={ref => this.refs_category_screen = ref}
          data={categories_data}
          extraData={this.state.category_nav_index}
          //keyExtractor={item => item.id}
          horizontal={true}
          pagingEnabled
          onMomentumScrollEnd={this._onScrollEnd.bind(this)}
          style={{
            backgroundColor: BGR_SCREEN_COLOR,
            width: Util.size.width
          }}
          getItemLayout={(data, index) => {
            return {length: Util.size.width, offset: Util.size.width * index, index};
          }}
          renderItem={({item, index}) => <OrdersScreen item={item} index={index} cate_index={this.state.category_nav_index} that={this} />}
        />
      </View>
    );
  }
}

@observer
class OrdersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false
    }
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      setTimeout(() => {
        this.setState({
          refreshing: false
        });
      }, 1000);
    });
  }

  render() {
    var {item} = this.props;
    var data = store.sale_carts.cart_list[item.key];

    return(
      <View style={styles.containerScreen}>
        {data != null ? (
          <FlatList
            style={styles.items_box}
            data={data}
            extraData={store.sale_carts.cart_list}
            renderItem={({item, index}) => {
              return(
                <OrdersItemComponent
                  item={item}
                  />
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
          <View style={styles.empty_box}>
            <Icon name="sticky-note-o" size={32} color="#999999" />
            <Text style={styles.empty_box_title}>Chưa có đơn hàng nào</Text>
          </View>
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
  containerScreen: {
    width: Util.size.width,
    flex: 1
  },

  categories_nav: {
    backgroundColor: '#ffffff',
    height: 54,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  categories_nav_items: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
  },
  categories_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    marginTop: 4
  },
  categories_nav_items_title_active: {
    color: DEFAULT_ADMIN_COLOR
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_ADMIN_COLOR
  },

  empty_box: {
    alignItems: 'center',
    marginTop: "50%"
  },
  empty_box_title: {
    fontSize: 14,
    marginTop: 8,
    color: "#666666"
  }
});
