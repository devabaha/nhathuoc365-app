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

import {
  ItemList
} from './ItemList';

export default class Dashboard extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      stores: [
        {
          key: 0,
          image_url: 'https://images.enca.com/enca/food.jpg',
          name: 'EcoFoods Ngụy Như Kon Tum',
          address: 'Số 30 Ngụy Như Kon Tum, Hà Nội'
        },
        {
          key: 1,
          image_url: 'http://sohanews.sohacdn.com/2016/tpsach-1471575328454.png',
          name: 'Cửa hàng Bác Tôm',
          address: 'Số 01 Hoa Lư, Hà Nội'
        },
        {
          key: 2,
          image_url: 'http://www.seriouseats.com/images/20110623-food-policy.jpg',
          name: 'OGreen Bộ Công Thương',
          address: 'Toà nhà Bộ Công Thương, Phạm Văn Đồng, Hà Nội'
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

        this.props.increment();
      }, 1000);
    });
  }

  itemListOnPress = (item) => {
    this.item_data = item;

    this.ref_dashboard.open();
  }

  render() {
    var {stores} = this.state;
    var {homeState, increment} = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={stores}
          renderItem={({item, index}) => <ItemList itemListOnPress={this.itemListOnPress} item={item} index={index} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          />

        <Modal
          style={styles.popupDashboard}
          ref={ref => this.ref_dashboard = ref}
          onClosed={() => {

          }}
          onOpened={() => {

          }}>
          <PopupDashboard item_data={() => this.item_data} />
        </Modal>
      </View>
    );
  }
}

class PopupDashboard extends Component {
  static propTypes = {
    item_data: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      item_data: props.item_data()
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
    var {item_data} = this.state;

    return (
      <View style={styles.dashboardContainer}>
        <View style={styles.content}>
          <View style={styles.storeBox}>
            <Image style={styles.storeImg} source={{uri: item_data.image_url}} />
            <View style={styles.storeInfoBox}>
              <Text style={styles.storeName}>{item_data.name}</Text>
              <Text style={styles.storeAddress}>{item_data.address}</Text>
            </View>
          </View>

          <FlatList
            data={[
              {
                key: Math.random(),
                icon: 'shopping-cart',
                iconColor: DEFAULT_COLOR,
                title: 'Bán hàng',
                onPress: () => {
                  Actions.sale({
                    title: item_data.name
                  });
                }
              },
              {
                key: Math.random(),
                icon: 'users',
                iconColor: '#34a0ec',
                title: 'Khách hàng',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'list',
                iconColor: '#fa9726',
                title: 'Danh mục',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'product-hunt',
                iconColor: '#542405',
                title: 'Sản phẩm',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'scribd',
                iconColor: '#fa6769',
                title: 'Khuyến mại',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'line-chart',
                iconColor: '#796d99',
                title: 'Thống kê',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'bell',
                iconColor: '#ec221a',
                title: 'Thông báo',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'user',
                iconColor: '#3b4155',
                title: 'Tài khoản',
                onPress: () => {

                }
              },
              {
                key: Math.random(),
                icon: 'chevron-left',
                iconColor: '#79738a',
                title: 'Quay lại',
                onPress: () => {

                }
              }
            ]}
            numColumns={3}
            renderItem={({item, index}) => {
              return(
                <TouchableHighlight
                  onPress={item.onPress}
                  underlayColor="transparent">
                  <View style={styles.iconBox}>
                    <Icon name={item.icon} size={36} color={item.iconColor} />
                    <Text style={styles.iconTitle}>{item.title}</Text>
                  </View>
                </TouchableHighlight>
              );
            }} />

        </View>
      </View>
    );
  }
}

const CONTENT_WIDTH = Util.size.width;
const POPUP_WIDTH = Util.size.width * 0.9;

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
    width: POPUP_WIDTH,
    height: POPUP_WIDTH + 60
  },
  content: {
    width: POPUP_WIDTH,
    height: POPUP_WIDTH + 60,
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
  storeImg: {
    width: 44,
    height: 44,
    marginTop: 6,
    marginLeft: 8
  },
  storeName: {
    fontSize: 16,
    marginTop: 8,
    marginLeft: 8
  },
  storeAddress: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2
  }
});
