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
  Keyboard,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';

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
      fromIntro: props.fromIntro
    }
  }

  componentDidMount() {
    var site_code = this.props.site_code;
    var fromIntro = this.state.fromIntro;

    var options = {
      showSearchBar: true,
      searchValue: site_code || '',
      placeholder: "Tên, địa chỉ, mã cửa hàng",
      onChangeText: this._onChangeSearch.bind(this),
      onSubmitEditing: this._search_store.bind(this),
      onSearchCancel: this._onSearchCancel.bind(this),
      inputAnimate: true,
      autoFocus: true,
      cancelIsPop: true,
      renderIconInput: () => {
        return(
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              Actions.scan_qr_code({
                onBackHandler: (site_code) => {
                  this.setState({
                    searchValue: site_code
                  }, () => {
                    Actions.refresh({
                      searchValue: site_code
                    });

                    this.search_handler = setTimeout(() => {
                      this._search_store();
                    }, 300);
                  });
                }
              });
            }}>
            <Icon
              style={{
                marginLeft: 4
              }}
              name="qrcode" size={24} color="#999999" />
          </TouchableHighlight>
        );
      }
    }

    if (fromIntro) {
      options.hideBackImage = true;
      options.panHandlers = null;
      options.onBack = () => false;
      options.cancelIsPop = false;
    }

    Actions.refresh(options);

    // search when has site_code
    if (site_code) {
      this.setState({
        searchValue: site_code
      }, () => {
        this.search_handler = setTimeout(() => {

          this._search_store();

        }, 300);
      });
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

  // tìm cửa hàng theo mã CH
  _search_store() {

    if (this.state.searchValue == '') {
      this.setState({
        search_data: null,
        loading: false
      });
      return;
    }

    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_search_stores(this.state.searchValue);

        if (response && response.status == STATUS_SUCCESS) {
          this.setState({
            search_data: response.data,
            loading: false
          });
        } else {
          this.setState({
            search_data: null,
            loading: false
          });
        }

      } catch (e) {
        console.warn(e + ' user_search_store');

        store.addApiQueue('user_search_store', this._search_store.bind(this));
      } finally {
      }
    });
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
    this.setState({
      search_data: null,
      loading: false
    });
  }

  render() {
    var {search_data} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            marginBottom: store.keyboardTop
          }}
          keyboardShouldPersistTaps="always">

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

                return(
                  <StoreItem
                    item={item}
                    index={index}
                    that={this}
                    />
                );
              }}
              keyExtractor={item => item.id}
            />
          ) : (
            null
            // <StoreSuggest onPress={this._onPressSuggest.bind(this)} />
          )}

        </ScrollView>

        <Sticker
          active={this.state.coppy_sticker_flag}
          message="Thêm Cửa Hàng thành công."
         />

         {this.state.fromIntro && (
           <View style={{
             position: 'absolute',
             bottom: store.keyboardTop,
             left: 0,
             width: Util.size.width,
             height: 60,
             alignItems: 'center',
             justifyContent: 'center'
           }}>
            <TouchableHighlight
              style={{
                borderWidth: Util.pixel,
                borderColor: DEFAULT_COLOR,
                padding: 8,
                borderRadius: 3
              }}
              underlayColor="transparent"
              onPress={() => {
                this.setState({
                  searchValue: STORE_DEMO_CODE
                }, () => {
                  Actions.refresh({
                    searchValue: STORE_DEMO_CODE
                  });

                  this.search_handler = setTimeout(() => {
                    this._search_store();
                  }, 300);
                });
              }}>
              <Text style={{
                color: DEFAULT_COLOR
              }}>Thêm cửa hàng Trải nghiệm</Text>
            </TouchableHighlight>
           </View>
         )}
      </View>
    );
  }
}

/* @flow */
@observer
class StoreItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add_success: false
    }
  }

  // thực hiện add cửa hàng vào account của user
  _add_store(item) {
    var that = this.props.that;

    if (this._add_store_handler) {
      return;
    }
    this._add_store_handler = true;

    this.setState({
      add_loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_add_store(item.site_code);

        if (response && response.status == STATUS_SUCCESS) {
          Keyboard.dismiss();

          this.setState({
            coppy_sticker_flag: true,
            add_success: true
          }, () => {
            // reload home screen
            action(() => {
              store.setRefreshHomeChange(store.refresh_home_change + 1);
            })();

            clearTimeout(this.timerGoBack);
            this.timerGoBack = setTimeout(() => {
              that.setState({
                coppy_sticker_flag: false
              }, () => {
                Actions.pop();
              });
            }, 2000);
          });

          // intro finish
          storage.save({
            key: STORAGE_INTRO_KEY,
            data: {
              finish: true
            },
            expires: null
          });

          Events.trigger(KEY_EVENTS_STORE);
        }
      } catch (e) {
        console.warn(e + ' user_add_store');

        store.addApiQueue('user_add_store', this._add_store.bind(this, item));
      } finally {
        this._add_store_handler = false;

        this.setState({
          add_loading: false
        });
      }
    });
  }

  render() {
    var {item, index} = this.props;
    var {add_success, add_loading} = this.state;

    if (!add_success) {
      add_success = item.added == 1;
    }

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          // Actions.stores({});
        }}>

        <View style={[styles.store_result_item, index < 3 ? styles.store_result_item_active : null]}>
          <View style={styles.store_result_item_image_box}>
            <CachedImage mutable style={styles.store_result_item_image} source={{uri: item.logo_url}} />
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
                    {add_loading ? (
                      <View style={{
                        width: 14,
                        marginRight: 4
                      }}>
                        <Indicator size="small" color={DEFAULT_COLOR} />
                      </View>
                    ) : add_success ? (
                      <Icon name="check" size={14} color="#ffffff" />
                    ) : (
                      <Text style={[styles.add_btn_icon]}>+</Text>
                    )}
                    <Text style={[styles.add_btn_label, add_success && styles.add_btn_label_active]}>{add_loading ? "Đang thêm..." : add_success ? "Đã thêm cửa hàng" : "Thêm cửa hàng"}</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
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
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  store_result_item: {
    backgroundColor: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 104
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
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  store_result_item_desc: {
    marginTop: 4,
    color: "#404040",
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18
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
