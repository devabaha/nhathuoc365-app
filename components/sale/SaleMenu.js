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
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

export default class SaleMenu extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      stores: null,
      refreshing: false,
      item_data: props.item_data
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    try {
      var response = await ADMIN_APIHandler.user_home();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          stores: response.data
        });
      }

    } catch (e) {
      console.warn(e);
    } finally {

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

        this.props.increment();
      }, 1000);
    });
  }

  render() {
    var {stores, item_data} = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {
              key: Math.random(),
              icon: 'shopping-cart',
              iconColor: DEFAULT_COLOR,
              title: 'Bán hàng',
              onPress: () => {
                Actions.sale({
                  title: item_data.name,
                  item_data
                });
              }
            },
            {
              key: Math.random(),
              icon: 'users',
              iconColor: '#34a0ec',
              title: 'Khách hàng',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'list',
              iconColor: '#fa9726',
              title: 'Danh mục',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'product-hunt',
              iconColor: '#542405',
              title: 'Sản phẩm',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'scribd',
              iconColor: '#fa6769',
              title: 'Khuyến mại',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'line-chart',
              iconColor: '#796d99',
              title: 'Thống kê',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'bell',
              iconColor: '#ec221a',
              title: 'Thông báo',
              onPress: () => {

              },
              disabled: true
            },
            {
              key: Math.random(),
              icon: 'user',
              iconColor: '#3b4155',
              title: 'Tài khoản',
              onPress: () => {

              },
              disabled: true
            }
          ]}
          numColumns={3}
          renderItem={({item, index}) => {
            let {disabled} = item;
            return(
              <TouchableHighlight
                onPress={item.onPress}
                underlayColor="transparent">
                <View style={[styles.iconBox, {
                  backgroundColor: disabled ? "#fafafa" : "#ffffff"
                }]}>
                  <Icon name={item.icon} size={36} color={disabled ? '#cccccc' : item.iconColor} />
                  <Text style={[styles.iconTitle, {
                    color: disabled ? '#cccccc' : '#404040'
                  }]}>{item.title}</Text>
                </View>
              </TouchableHighlight>
            );
          }} />
      </View>
    );
  }
}

const CONTENT_WIDTH = Util.size.width;
const POPUP_WIDTH = Util.size.width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  dashboardContainer: {
    flex: 1,
    // marginTop: isIOS ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  popupDashboard: {
    width: POPUP_WIDTH
  },
  content: {
    width: POPUP_WIDTH
  },
  iconBox: {
    width: POPUP_WIDTH / 3,
    height: POPUP_WIDTH / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  iconTitle: {
    marginTop: 16,
    fontSize: 14,
    color: "#404040"
  },

  storeBox: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    backgroundColor: "#ebebeb"
  },
  storeInfoBox: {
    flex: 1
  },
  storeImg: {
    width: 44,
    height: 44,
    marginTop: 6,
    marginLeft: 8
  },
  storeName: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: 8
  },
  storeAddress: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2
  }
});
