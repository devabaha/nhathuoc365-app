import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import APIHandler from '../services/services';
import Indicator from './Indicator';

class ListService extends Component {
  static propTypes = {
    keyword: PropTypes.string,
    page: PropTypes.number,
    limit: PropTypes.number,
    onPressItem: PropTypes.func
  };

  static defaultProps = {
    keyword: '',
    page: 0,
    limit: 20,
    onPressItem: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowIndicator: false,
      listServiceDto: null,
      flatListData: [],
      keyword: this.props.keyword,
      page: this.props.page,
      limit: this.props.limit,
      isRefreshing: false
    };
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      const category = this.props.category;
      const { keyword, page, limit, isRefreshing } = this.state;
      if (!isRefreshing) {
        this.setState({ isShowIndicator: true });
      }
      var response = await APIHandler.getListServices(
        category.id,
        keyword,
        page,
        limit
      );
      if (response && response.status == 200) {
        this.setState({
          listServiceDto: response,
          isShowIndicator: false,
          isRefreshing: false
        });
      } else {
        this.setState({
          listServiceDto: null,
          isShowIndicator: false,
          isRefreshing: false
        });
      }
    } catch (e) {
      this.setState({
        listServiceDto: null,
        isShowIndicator: false,
        isRefreshing: false
      });
    }
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={this._onPressItem.bind(this, item)}>
        <View style={styles.serviceWrapper}>
          <Image style={styles.serviceImage} source={{ uri: item.image }} />
          <View style={styles.nameView}>
            <Text style={styles.serviceName}>{item.name}</Text>
            <View style={styles.lineView} />
            <TouchableOpacity>
              <Image
                style={styles.cartImage}
                source={require('../assets/ic_cart.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = item => item.id.toString();

  _onPressItem(item) {
    this.props.onPressItem(item);
  }

  _handleLoadMore = () => {
    const { isShowIndicator, page, listServiceDto } = this.state;
    let total = listServiceDto.total || 0;
    let limit = listServiceDto.limit || 1;
    let maximumPage = parseInt(total / limit);
    if (!isShowIndicator && page + 1 <= maximumPage) {
      this.setState({ page: page + 1 }, function() {
        this._getData();
      });
    }
  };

  _onRefresh() {
    this.setState({ isRefreshing: true, page: 0 }, function() {
      this._getData();
    });
  }

  render() {
    const { listServiceDto, isShowIndicator } = this.state;
    let flatListData = listServiceDto ? listServiceDto.services : [];

    return (
      <View style={styles.container}>
        <Indicator loading={isShowIndicator} />
        <FlatList
          contentContainerStyle={{ paddingBottom: padding }}
          data={flatListData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          onEndReachedThreshold={0.4}
          onEndReached={this._handleLoadMore.bind(this)}
        />
      </View>
    );
  }
}

const categoryWrapperHeight = 200;
const padding = 10;
const cartImageHeight = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#F9F9F9'
  },
  serviceWrapper: {
    flex: 1,
    marginHorizontal: padding,
    marginTop: padding,
    height: categoryWrapperHeight,
    flexDirection: 'column-reverse',
    borderRadius: 10,
    overflow: 'hidden'
  },
  serviceImage: {
    flex: 1
  },
  nameView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%'
  },
  serviceName: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    paddingVertical: 8,
    marginHorizontal: 8
  },
  cartImage: {
    height: cartImageHeight,
    width: cartImageHeight,
    tintColor: 'white',
    marginHorizontal: 20
  },
  lineView: {
    height: '80%',
    width: 1,
    backgroundColor: 'white'
  }
});

export default ListService;
