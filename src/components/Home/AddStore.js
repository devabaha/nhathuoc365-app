import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Keyboard,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import Sticker from '../Sticker';
import EventTracker from '../../helper/EventTracker';
// import appConfig from 'app-config';

@observer
export default class AddStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_data: null,
      refreshing: false,
      searchValue: null,
      coppy_sticker_flag: false,
      fromIntro: props.fromIntro
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  // onchange text value for typing
  _onChangeSearch(text) {
    clearTimeout(this.search_handler);

    this.setState(
      {
        searchValue: text
      },
      () => {
        this.search_handler = setTimeout(() => {
          this._search_store();
        }, 300);
      }
    );
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

    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_search_store(
            this.state.searchValue
          );

          if (response && response.status == STATUS_SUCCESS) {
            this.setState({
              search_data: [response.data],
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
      }
    );
  }

  // click chọn địa điểm gợi ý
  _onPressSuggest(store) {
    this.setState(
      {
        searchValue: store.site_code
      },
      () => {
        this._search_store();
      }
    );
  }

  // bấm huỷ khi search
  _onSearchCancel() {
    this.setState({
      search_data: null,
      loading: false
    });
  }

  render() {
    var { search_data } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={{
            marginBottom: store.keyboardTop
          }}
          keyboardShouldPersistTaps="always"
        >
          <Text
            style={{
              fontWeight: '500',
              color: '#404040',
              fontSize: 16,
              marginLeft: 15,
              marginTop: 15,
              marginBottom: 8
            }}
          >
            Nhập mã cửa hàng yêu thích của bạn
          </Text>
          <View>
            <TextInput
              underlineColorAndroid="transparent"
              ref={ref => (this.searchInput = ref)}
              onLayout={() => {
                if (this.searchInput) {
                  this.searchInput.focus();
                }
              }}
              style={{
                height: 42,
                borderColor: '#dddddd',
                borderWidth: 1,
                marginHorizontal: 15,
                paddingHorizontal: 8,
                borderRadius: 2,
                color: '#404040',
                fontSize: 18
              }}
              placeholder="Nhập mã cửa hàng"
              onChangeText={this._onChangeSearch.bind(this)}
              value={this.state.searchValue}
            />

            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                Actions.scan_qr_code({
                  onBackHandler: site_code => {
                    this.setState(
                      {
                        searchValue: site_code
                      },
                      () => {
                        this._search_store();
                      }
                    );
                  }
                });
              }}
              style={{
                position: 'absolute',
                right: 20,
                top: 2
              }}
            >
              <Icon name="qrcode" size={40} color="#404040" />
            </TouchableHighlight>
          </View>

          {this.state.search_data != null ? (
            <FlatList
              keyboardShouldPersistTaps="always"
              style={styles.stores_result_box}
              data={search_data}
              onEndReached={num => {}}
              onEndReachedThreshold={0}
              ItemSeparatorComponent={() => (
                <View style={styles.separator}></View>
              )}
              renderItem={({ item, index }) => {
                return <StoreItem item={item} index={index} that={this} />;
              }}
              keyExtractor={item => item.id}
            />
          ) : null
          // <StoreSuggest onPress={this._onPressSuggest.bind(this)} />
          }
        </ScrollView>

        <Sticker
          active={this.state.coppy_sticker_flag}
          message="Thêm Cửa Hàng thành công."
        />

        {search_data == null && (
          <View
            style={{
              position: 'absolute',
              bottom: store.keyboardTop,
              left: 0,
              width: Util.size.width,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                color: '#666666',
                fontSize: 12,
                marginBottom: 8
              }}
            >
              Chưa có mã cửa hàng, mời bạn dùng thử cửa hàng trải nghiệm!
            </Text>
            <TouchableHighlight
              style={{
                borderWidth: Util.pixel,
                borderColor: DEFAULT_COLOR,
                padding: 4,
                borderRadius: 3
              }}
              underlayColor="transparent"
              onPress={() => {
                this.setState(
                  {
                    searchValue: STORE_DEMO_CODE
                  },
                  () => {
                    this.search_handler = setTimeout(() => {
                      this._search_store();
                    }, 300);
                  }
                );
              }}
            >
              <Text
                style={{
                  color: DEFAULT_COLOR
                }}
              >
                Thêm cửa hàng trải nghiệm!
              </Text>
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
    };
  }

  // thực hiện add cửa hàng vào account của user
  _add_store(item) {
    var that = this.props.that;

    if (this._add_store_handler) {
      return;
    }
    this._add_store_handler = true;

    this.setState(
      {
        add_loading: true
      },
      async () => {
        try {
          var response = await APIHandler.user_add_store(item.site_code);

          if (response && response.status == STATUS_SUCCESS) {
            Keyboard.dismiss();

            this.setState(
              {
                coppy_sticker_flag: true,
                add_success: true
              },
              () => {
                // reload home screen
                action(() => {
                  store.setRefreshHomeChange(store.refresh_home_change + 1);
                })();

                clearTimeout(this.timerGoBack);
                this.timerGoBack = setTimeout(() => {
                  that.setState(
                    {
                      coppy_sticker_flag: false
                    },
                    () => {
                      Actions.primaryTabbar({
                        type: ActionConst.RESET
                      });
                    }
                  );
                }, 2000);
              }
            );

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
      }
    );
  }

  render() {
    var { item, index } = this.props;
    var { add_success, add_loading } = this.state;

    if (!add_success) {
      add_success = item.added == 1;
    }

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          // Actions.push(appConfig.routes.store, {});
        }}
      >
        <View
          style={[
            styles.store_result_item,
            index < 3 ? styles.store_result_item_active : null
          ]}
        >
          <View style={styles.store_result_item_image_box}>
            <CachedImage
              mutable
              style={styles.store_result_item_image}
              source={{ uri: item.logo_url }}
            />
          </View>

          <View style={styles.store_result_item_content}>
            <View style={styles.store_result_item_content_box}>
              <Text style={styles.store_result_item_title}>{item.name}</Text>
              <Text style={styles.store_result_item_desc}>{item.address}</Text>

              <View style={styles.store_result_item_add_box}>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={
                    add_success ? null : this._add_store.bind(this, item)
                  }
                >
                  <View
                    style={[
                      styles.add_btn_icon_box,
                      add_success && styles.add_btn_icon_box_active
                    ]}
                  >
                    {add_loading ? (
                      <View
                        style={{
                          width: 14,
                          marginRight: 4
                        }}
                      >
                        <Indicator size="small" color={DEFAULT_COLOR} />
                      </View>
                    ) : add_success ? (
                      <Icon name="check" size={14} color="#ffffff" />
                    ) : (
                      <Text style={[styles.add_btn_icon]}>+</Text>
                    )}
                    <Text
                      style={[
                        styles.add_btn_label,
                        add_success && styles.add_btn_label_active
                      ]}
                    >
                      {add_loading
                        ? 'Đang thêm...'
                        : add_success
                        ? 'Đã thêm cửa hàng'
                        : 'Thêm cửa hàng'}
                    </Text>
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

    marginBottom: 0,
    backgroundColor: '#ffffff'
  },

  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#cccccc'
  },

  stores_result_box: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  store_result_item: {
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 15,
    flexDirection: 'row',
    minHeight: 104
  },
  store_result_item_active: {
    // backgroundColor: "#ebebeb"
  },
  store_result_item_image_box: {
    backgroundColor: '#ebebeb',
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
    color: '#000000',
    fontWeight: '500',
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8
  },
  store_result_item_desc: {
    marginTop: 4,
    color: '#404040',
    fontSize: 12,
    lineHeight: isIOS ? 16 : 18
  },
  store_result_item_time: {
    fontSize: 12,
    color: '#666666',
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
    color: '#ffffff'
  },
  add_btn_label: {
    color: DEFAULT_COLOR,
    fontSize: 14,
    marginLeft: 4
  },
  add_btn_label_active: {
    color: '#ffffff'
  }
});
