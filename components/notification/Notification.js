/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  RefreshControl,
  FlatList
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true
    }
  }

  componentDidMount() {
    this._getData();
  }

  async _getData(delay) {
    this.setState({
      loading: true
    });


    try {
      var response = await APIHandler.user_news_list();

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });

          layoutAnimation();
        }, delay || 0);
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  _goDetail(item) {
    Actions.notify_item({
      data: item
    });
  }

  render() {
    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>

        {this.state.data != null && <FlatList
          data={this.state.data}
          onEndReached={(num) => {

          }}
          onEndReachedThreshold={0}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          renderItem={({item, index}) => {

            return(
              <TouchableHighlight
                underlayColor="transparent"
                onPress={this._goDetail.bind(this, item)}>

                <View style={[styles.notify_item, index < 3 ? styles.notify_item_active : null]}>
                  <View style={styles.notify_item_image_box}>
                    <Image style={styles.notify_item_image} source={{uri: item.image_url}} />
                  </View>

                  <View style={styles.notify_item_content}>
                    <View style={styles.notify_item_content_box}>
                      <Text style={styles.notify_item_title}>{item.title}</Text>
                      <Text style={styles.notify_item_desc}>{item.short_content}</Text>
                      <View style={styles.notify_item_time_box}>
                        <Icon name="clock-o" size={14} color="#666666" />
                        <Text style={styles.notify_item_time}>{item.shop_name} | {item.created_view}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
            );
          }}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  notify_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  notify_item_active: {
    backgroundColor: "#ebebeb"
  },
  notify_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  notify_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  notify_item_content: {
    flex: 1
  },
  notify_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  notify_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '500',
    lineHeight: isIOS ? 18 : 20
  },
  notify_item_desc: {
    marginTop: 8,
    color: "#404040",
    fontSize: 14,
    lineHeight: isIOS ? 18 : 20
  },
  notify_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notify_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
});
