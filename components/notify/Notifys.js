/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  RefreshControl,
  FlatList,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

// components
import NewItemComponent from './NewItemComponent';

@observer
export default class Notifys extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      news_type: props.news_type || ''
    }
  }

  componentDidMount() {
    this._getData();

    store.getNoitify();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.user_news_list(this.state.news_type);

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {

          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });
        }, delay || 0);
      }
    } catch (e) {
      console.warn(e + ' user_news_list');

      store.addApiQueue('user_news_list', this._getData.bind(this, delay));
    } finally {

    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  render() {
    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {this.state.data != null ? (
          <FlatList
            data={this.state.data}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            renderItem={({item, index}) => {

              return(
                <NewItemComponent
                  item={item} />
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
          <CenterText title="Oops... Chưa có tin tức nào :(" />
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
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  }
});
