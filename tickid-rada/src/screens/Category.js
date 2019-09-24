import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import Indicator from './Indicator';
import APIHandler from '../services/services';
import { SCREEN_WIDTH } from '../services/constants';

class Category extends Component {
  static propTypes = {
    onPressItem: PropTypes.func
  };

  static defaultProps = {
    onPressItem: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      flatListData: [],
      isRefreshing: false,
      isShowIndicator: false
    };
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      const { isRefreshing } = this.state;
      if (!isRefreshing) {
        this.setState({ isShowIndicator: true });
      }
      var response = await APIHandler.getCategories();
      if (response && response.status == 200) {
        this.setState({
          flatListData: response.categories ? response.categories : [],
          isShowIndicator: false,
          isRefreshing: false
        });
      } else {
        Toast.show(response.message);
        this.setState({
          flatListData: [],
          isShowIndicator: false,
          isRefreshing: false
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        flatListData: [],
        isShowIndicator: false,
        isRefreshing: false
      });
    }
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={this._onPressItem.bind(this, item)}>
        <View style={styles.categoryWrapper}>
          <Image style={styles.categoryImage} source={{ uri: item.image }} />
          <View style={styles.nameView}>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _keyExtractor = item => item.id.toString();

  _onPressItem(item) {
    this.props.onPressItem(item);
  }

  _onRefresh() {
    this.setState({ isRefreshing: true }, function() {
      this._getData();
    });
  }

  render() {
    const { flatListData, isShowIndicator } = this.state;
    return (
      <View style={styles.container}>
        <Indicator loading={isShowIndicator} />
        <FlatList
          contentContainerStyle={{ paddingBottom: padding }}
          data={flatListData}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          numColumns={numberOfColumns}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

const padding = 10;
const numberOfColumns = 2;
const categoryWrapperWidth =
  (SCREEN_WIDTH - (numberOfColumns + 1) * padding) / numberOfColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#F9F9F9'
  },
  categoryWrapper: {
    marginLeft: padding,
    marginTop: padding,
    height: categoryWrapperWidth,
    width: categoryWrapperWidth,
    flexDirection: 'column-reverse',
    borderRadius: 10,
    overflow: 'hidden'
  },
  categoryImage: {
    flex: 1
  },
  nameView: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: categoryWrapperWidth
  },
  categoryName: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 8
  }
});

export default Category;
