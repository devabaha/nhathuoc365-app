/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  FlatList,
  Keyboard
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

// components
import Sticker from '../Sticker';
import StoreSuggest from './StoreSuggest';

@observer
export default class SearchStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_data: null,
      refreshing: false,
      searchValue: null,
      coppy_sticker_flag: false,
      list_added: {},
      loading: true
    }
  }

  componentWillMount() {
    Actions.refresh({
      showSearchBar: true,
      placeholder: "Nhập mã cửa hàng",
      // autoFocus: true,
      onChangeText: this._onChangeSearch.bind(this),
      searchValue: this.state.searchValue,
      onSubmitEditing: this._search_store.bind(this),
      onSearchCancel: this._onSearchCancel.bind(this)
    });
  }

  componentDidMount() {
    this.start_time = time();

    this._getData();
  }

  // thời gian trễ khi chuyển màn hình
  _delay() {
    var delay = 450 - (Math.abs(time() - this.start_time));
    return delay;
  }

  async _getData() {
    this.setState({
      loading: true
    });

    try {
      var response = await APIHandler.user_list_site();

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          this.setState({
            search_data: response.data,
            loading: false
          });
        }, this._delay());
      }
    } catch (e) {
      console.warn(e);
    } finally {
    }
  }

  // onchange text value for typing
  _onChangeSearch(text) {
    clearTimeout(this.search_handler);

    Actions.refresh({
      searchValue: text
    });

    this.setState({
      searchValue: text
    }, () => {
      this.search_handler = setTimeout(() => {

        this._search_store();

      }, 300);
    });
  }

  // thực hiện add cửa hàng vào account của user
  async _add_store(store) {
    if (this._add_store_handler) {
      return;
    }
    this._add_store_handler = true;

    try {
      var response = await APIHandler.user_add_store(store.site_code);

      if (response && response.status == STATUS_SUCCESS) {
        Keyboard.dismiss();

        this.state.list_added[store.id] = true;

        this.setState({
          list_added: this.state.list_added
        });

        // reload home screen
        if (this.props.parent_reload) {
          this.props.parent_reload();
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      this._add_store_handler = false;
    }
  }

  // tìm cửa hàng theo mã CH
  async _search_store() {

    if (this.state.searchValue == '') {
      this.setState({
        search_data: null
      });
      return;
    }

    this.is_search = true;

    try {
      var response = await APIHandler.user_search_store(this.state.searchValue);

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          search_data: [response.data]
        });
      } else {
        this.setState({
          search_data: null
        });
      }

    } catch (e) {
      console.warn(e);
    } finally {
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  // click chọn địa điểm gợi ý
  _onPressSuggest(store) {
    this.setState({
      searchValue: store.site_code
    }, () => {
      Actions.refresh({
        searchValue: this.state.searchValue
      });

      this._search_store();
    });
  }

  // bấm huỷ khi search
  _onSearchCancel() {
    if (this.is_search) {
      this.is_search = false;
      this._getData();
    }

    Actions.refresh({
      searchValue: ''
    });
  }

  render() {
    if (this.state.loading) {
      return <Indicator />
    }

    var {search_data} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView keyboardShouldPersistTaps="always">

          {this.state.search_data != null ? (
            <FlatList
              keyboardShouldPersistTaps="always"
              style={styles.stores_result_box}
              data={search_data}
              onEndReached={(num) => {

              }}
              onEndReachedThreshold={0}
              ItemSeparatorComponent={() => <View style={styles.separator}></View>}
              renderItem={({item, index}) => {

                let add_success = this.state.list_added[item.id] == true;

                return(
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => {
                      // Actions.stores({});
                    }}>

                    <View style={[styles.store_result_item, index < 3 ? styles.store_result_item_active : null]}>
                      <View style={styles.store_result_item_image_box}>
                        <Image style={styles.store_result_item_image} source={{uri: item.logo_url}} />
                      </View>

                      <View style={styles.store_result_item_content}>
                        <View style={styles.store_result_item_content_box}>
                          <Text style={styles.store_result_item_title}>{item.name}</Text>
                          <Text style={styles.store_result_item_desc}>{item.address}</Text>

                          <View style={styles.store_result_item_add_box}>
                            <TouchableHighlight
                              underlayColor="transparent"
                              onPress={add_success ? null : this._add_store.bind(this, item)}>
                              <View style={[styles.add_btn_icon_box, add_success && styles.add_btn_icon_box_active]}>
                                {add_success ? (
                                  <Icon name="check" size={14} color="#ffffff" />
                                ) : (
                                  <Text style={[styles.add_btn_icon]}>+</Text>
                                )}
                                <Text style={[styles.add_btn_label, add_success && styles.add_btn_label_active]}>{add_success ? "Đã thêm cửa hàng" : "Thêm cửa hàng"}</Text>
                              </View>
                            </TouchableHighlight>
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
            />
          ) : (
            <StoreSuggest onPress={this._onPressSuggest.bind(this)} />
          )}

        </ScrollView>

        <Sticker
          active={this.state.coppy_sticker_flag}
          message="Thêm Cửa Hàng thành công."
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
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#cccccc"
  },

  stores_result_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 110
  },
  store_result_item_active: {
    // backgroundColor: "#ebebeb"
  },
  store_result_item_image_box: {
    backgroundColor: "#ebebeb",
    width: 60,
    height: 60,
    marginTop: 8
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  store_result_item_content: {
    flex: 1
  },
  store_result_item_content_box: {
    flex: 1,
    paddingLeft: 15
  },
  store_result_item_title: {
    fontSize: 14,
    color: "#000000",
    fontWeight: '500',
    lineHeight: isIOS ? 18 : 20
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 14,
    lineHeight: isIOS ? 18 : 20
  },
  store_result_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
  store_result_item_add_box: {
    position: 'absolute',
    bottom: 4,
    right: 0
  },
  add_btn_icon_box: {
    borderWidth: 1,
    borderColor: DEFAULT_COLOR,
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  add_btn_icon_box_active: {
    backgroundColor: DEFAULT_COLOR
  },
  add_btn_icon: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginTop: -2
  },
  add_btn_icon_active: {
    color: "#ffffff"
  },
  add_btn_label: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginLeft: 4
  },
  add_btn_label_active: {
    color: "#ffffff"
  }
});
