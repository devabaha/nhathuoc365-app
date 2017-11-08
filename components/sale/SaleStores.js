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

import {
  ItemList
} from './ItemList';

export default class SaleStores extends Component {
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

  render() {
    var {stores} = this.state;
    var {homeState, increment} = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          data={stores}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
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
  }
});
