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

import Icon from 'react-native-vector-icons/FontAwesome';

import {
  OrdersItemComponent
} from './OrdersItemComponent';

export default class Sale extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      category_nav_index: 0,
      categories_data: [
        {key: 0, name: 'Đang đặt hàng '},
        {key: 1, name: 'Đang chờ duyệt'},
        {key: 2, name: 'Đã phê duyệt'},
        {key: 3, name: 'Đang xử lý'},
        {key: 4, name: 'Đang giao hàng'},
        {key: 5, name: 'Đã hoàn thành'},
        {key: 6, name: 'Đã từ chối'},
      ]
    }
  }

  _changeCategory(item, index, nav_only) {
    if (this.refs_category_nav) {

      var categories_count = this.state.categories_data.length;
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
    var {stores, categories_data} = this.state;

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
              return(
                <TouchableHighlight
                  onPress={() => this._changeCategory(item, index)}
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

class OrdersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          "id": "582",
          "cart_code": "CHTNMF2410582",
          "site_id": "14",
          "user_id": "41",
          "products": {
            "cart-270": {
              "quantity": 1,
              "id": "270",
              "name": "Cà chua hữu cơ túi 300gr",
              "selected": 1,
              "discount_percent": "12",
              "service_price": 0,
              "discount": "17.000đ",
              "price": "15000",
              "price_view": "15.000đ",
              "unit_name": "túi",
              "cart_step": "1.0",
              "quantity_view": "1 túi",
              "image": "http://myfood.com.vn/photos/resized/320x/14-1507975722-cuahangtrainghiem.png"
            }
          },
          "total_value": 15000,
          "total_count_selected": 1,
          "count_selected": 1,
          "point": 15,
          "fcoin": "0",
          "award_date": "0",
          "award_month": "0",
          "status": "5",
          "address_id": "148",
          "user_note": null,
          "site_note": null,
          "payment": "Khi nhận hàng",
          "delete_flag": "0",
          "pushed": "0",
          "orders_time": "2017-10-24 18:54:10",
          "modified": "2017-10-24 18:54:10",
          "created": "2017-10-24 18:51:46",
          "count": 1,
          "total": "15.000đ",
          "total_selected": "15.000đ",
          "status_view": "Đã đặt hàng",
          "address": {
            "id": "148",
            "user_id": "41",
            "name": "Ngọc Sơn",
            "tel": "01653538222",
            "address": "Số 1 Lương Yên, Hà Nội",
            "city": "",
            "district": "",
            "default_flag": "0",
            "delete_flag": "0",
            "modified": "2017-10-13 17:27:33",
            "created": "2017-10-13 17:27:33"
          },
          "shop_logo_url": "http://myfood.com.vn/photos/resized/120x120/14-1507956244-cuahangtrainghiem.png",
          "shop_name": "Cửa hàng trải nghiệm",
          "shop_id": "14",
          "tel": "0905250209"
        },
        {
          "id": "581",
          "cart_code": "CHTNMF2410581",
          "site_id": "14",
          "user_id": "41",
          "products": {
            "cart-270": {
              "quantity": 1,
              "id": "270",
              "name": "Cà chua hữu cơ túi 300gr",
              "selected": 1,
              "discount_percent": "12",
              "service_price": 0,
              "discount": "17.000đ",
              "price": "15000",
              "price_view": "15.000đ",
              "unit_name": "túi",
              "cart_step": "1.0",
              "quantity_view": "1 túi",
              "image": "http://myfood.com.vn/photos/resized/320x/14-1507975722-cuahangtrainghiem.png"
            },
            "cart-272": {
              "quantity": 1,
              "id": "272",
              "name": "Dưa chuột hữu cơ túi 300gr",
              "selected": 1,
              "discount_percent": "18",
              "service_price": 0,
              "discount": "12.000đ",
              "price": "10000",
              "price_view": "10.000đ",
              "unit_name": "túi",
              "cart_step": "1.0",
              "quantity_view": "1 túi",
              "image": "http://myfood.com.vn/photos/resized/320x/14-1507968961-cuahangtrainghiem.png"
            },
            "cart-273": {
              "quantity": 1,
              "id": "273",
              "name": "Rau muống hữu cơ túi 300gr",
              "selected": 1,
              "discount_percent": "18",
              "service_price": 0,
              "discount": "12.000đ",
              "price": "10000",
              "price_view": "10.000đ",
              "unit_name": "túi",
              "cart_step": "1.0",
              "quantity_view": "1 túi",
              "image": "http://myfood.com.vn/photos/resized/320x/14-1507970644-cuahangtrainghiem.png"
            }
          },
          "total_value": 35000,
          "total_count_selected": 3,
          "count_selected": 3,
          "point": 35,
          "fcoin": "0",
          "award_date": "0",
          "award_month": "0",
          "status": "5",
          "address_id": "148",
          "user_note": null,
          "site_note": null,
          "payment": "Khi nhận hàng",
          "delete_flag": "0",
          "pushed": "0",
          "orders_time": "2017-10-24 18:51:23",
          "modified": "2017-10-24 18:51:23",
          "created": "2017-10-24 18:43:16",
          "count": 3,
          "total": "35.000đ",
          "total_selected": "35.000đ",
          "status_view": "Đã đặt hàng",
          "address": {
            "id": "148",
            "user_id": "41",
            "name": "Ngọc Sơn",
            "tel": "01653538222",
            "address": "Số 1 Lương Yên, Hà Nội",
            "city": "",
            "district": "",
            "default_flag": "0",
            "delete_flag": "0",
            "modified": "2017-10-13 17:27:33",
            "created": "2017-10-13 17:27:33"
          },
          "shop_logo_url": "http://myfood.com.vn/photos/resized/120x120/14-1507956244-cuahangtrainghiem.png",
          "shop_name": "Cửa hàng trải nghiệm",
          "shop_id": "14",
          "tel": "0905250209"
        }
      ],
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
    var {data} = this.state;

    return(
      <View style={styles.containerScreen}>
        {data != null ? (
          <FlatList
            style={styles.items_box}
            data={data}
            extraData={this.state}
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
    color: DEFAULT_COLOR
  },
  categories_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
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
