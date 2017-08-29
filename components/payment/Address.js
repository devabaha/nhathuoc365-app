/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { reaction } from 'mobx';
import store from '../../store/Store';

@observer
export default class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      data: null,
      item_selected: null,
      loading: true,
      continue_loading: false
    }

    this._getData = this._getData.bind(this);
  }

  componentDidMount() {
    this._getData();
  }

  // get list address
  async _getData(delay) {
    try {
      var response = await APIHandler.user_address();

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          setTimeout(() => {
            this.setState({
              data: [...response.data, {id: 0, type: 'address_add'}],
              loading: false,
              item_selected: null
            });

            layoutAnimation();
          }, delay || 0);
        } else {
          this.setState({
            data: null,
            loading: false
          });
        }
      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _goConfirmPage() {
    if (this.state.item_selected == null) {
      return Alert.alert(
        'Thông báo',
        'Nhập địa chỉ nhận hàng trước khi Tiếp tục',
        [
          {text: 'Đồng ý', onPress: this._createNew.bind(this)},
        ],
        { cancelable: false }
      );
    }

    this.setState({
      continue_loading: true
    }, async () => {
      try {
        var response = await APIHandler.site_cart_address(store.store_id, this.state.item_selected);

        if (response && response.status == STATUS_SUCCESS) {
          action(() => {
            store.setCartData(response.data);
            this.setState({
              continue_loading: false
            });
          })();

          this._goConfirm();
        }
      } catch (e) {
        console.warn(e);
      } finally {

      }
    });
  }

  _goConfirm() {
    Actions.confirm({
      type: ActionConst.REPLACE
    });
  }

  // chọn địa chỉ cho đơn hàng
  async _addressSelectHanlder(item) {
    this.setState({
      item_selected: item.id
    });
    layoutAnimation();
  }

  _createNew() {
    Actions.create_address({
      addressReload: this._getData
    });
  }

  render() {
    var { loading } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.payments_nav}>
          <TouchableHighlight
            onPress={() => {

            }}
            underlayColor="transparent">
            <View style={styles.payments_nav_items}>
              <View style={[styles.payments_nav_icon_box, styles.payments_nav_icon_box_active]}>
                <Icon style={[styles.payments_nav_icon, styles.payments_nav_icon_active]} name="map-marker" size={20} color="#999" />
              </View>
              <Text style={[styles.payments_nav_items_title, styles.payments_nav_items_title_active]}>1. Địa chỉ</Text>

              <View style={styles.payments_nav_items_active} />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() =>  {
              if (store.cart_data.address_id == 0) {
                this._goConfirmPage();
              } else {
                this._goConfirm();
              }
            }}
            underlayColor="transparent">
            <View style={styles.payments_nav_items}>
              <View style={[styles.payments_nav_icon_box, styles.payments_nav_icon_box_active]}>
                <Icon style={[styles.payments_nav_icon]} name="check" size={20} color="#999" />
              </View>
              <Text style={[styles.payments_nav_items_title]}>2. Xác nhận</Text>

              {/*<View style={styles.payments_nav_items_active} />*/}
            </View>
          </TouchableHighlight>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.address_list_box}>
            {this.state.data != null ? (
              <FlatList
                ref="address_list"
                data={this.state.data}
                extraData={this.state}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator}></View>}
                renderItem={({item, index}) => {
                  if(item.type == 'address_add') {
                    return(
                      <TouchableHighlight
                        underlayColor="transparent"
                        onPress={this._createNew.bind(this)}
                        style={styles.address_add_box}>
                        <View style={styles.address_add_content}>
                          <Text style={styles.address_add_title}>Thêm địa chỉ mới</Text>
                          <View style={styles.address_add_icon_box}>
                            <Icon name="plus" size={18} color="#999999" />
                          </View>
                        </View>
                      </TouchableHighlight>
                    );
                  }

                  var is_selected = false;

                  if (this.state.item_selected) {
                    if (this.state.item_selected == item.id) {
                      is_selected = true;
                    }
                  } else if (store.cart_data && store.cart_data.address_id != 0) {
                    is_selected = store.cart_data.address_id == item.id;
                    if (is_selected) {
                      this.state.item_selected = item.id;
                    }
                  } else if (index == 0) {
                    this.state.item_selected = item.id;
                    is_selected = true;
                  }

                  return(
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={this._addressSelectHanlder.bind(this, item)}>
                      <View style={[styles.address_box]}>
                        <View style={styles.address_name_box}>
                          <Text style={styles.address_name}>{item.name}</Text>
                        </View>

                        <View style={styles.address_content}>
                          <Text style={styles.address_content_phone}>{item.tel}</Text>
                          <Text style={styles.address_content_address_detail}>{item.address}</Text>
                          {/*<Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
                          <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                          <Text style={styles.address_content_tinh}>Hoà Bình</Text>*/}
                        </View>

                        {is_selected && (
                          <View style={styles.address_selected_box}>
                            <Icon name="check" size={24} color={DEFAULT_COLOR} />
                            <Text style={styles.address_label}>Giao tới địa chỉ này</Text>
                          </View>
                        )}

                        {item.default_flag == 1 && (
                          <View style={styles.address_edit_btn}>
                            <Text style={styles.address_default_title}>[Mặc định]</Text>
                          </View>
                        )}

                        <View style={styles.address_default_box}>
                          <TouchableHighlight
                            underlayColor="transparent"
                            onPress={() => {
                              Actions.create_address({
                                edit_data: item,
                                title: "SỬA ĐỊA CHỈ",
                                addressReload: this._getData
                              });
                            }}>
                            <View style={styles.address_edit_box}>
                              <Icon name="pencil-square-o" size={12} color="#999999" />
                              <Text style={styles.address_edit_label}>Chỉnh sửa</Text>
                            </View>
                          </TouchableHighlight>
                        </View>

                        {!is_selected && (
                          <TouchableHighlight
                            underlayColor="transparent"
                            onPress={this._addressSelectHanlder.bind(this, item)}
                            style={styles.uncheckOverlay}>
                            <View></View>
                          </TouchableHighlight>
                        )}
                      </View>
                    </TouchableHighlight>
                  );
                }}
              />
            ) : (
              <View>
                {this.state.loading && (
                  <View style={{
                    paddingVertical: 16
                  }}>
                    <Indicator size="small" />
                  </View>
                )}

                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={this.props.add_new}
                  style={[styles.address_add_box, {
                    marginTop: 0,
                    borderTopWidth: 0
                  }]}>
                  <View style={styles.address_add_content}>
                    <Text style={styles.address_add_title}>Thêm địa chỉ mới</Text>
                    <View style={styles.address_add_icon_box}>
                      <Icon name="plus" size={18} color="#999999" />
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._goConfirmPage.bind(this)}
          style={styles.address_continue}>
          <View style={styles.address_continue_content}>
            <Text style={styles.address_continue_title}>TIẾP TỤC</Text>
            <View style={{
              minWidth: 20,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {this.state.continue_loading ? (
                <Indicator size="small" color="#fff" />
              ) : (
                <Icon name="chevron-right" size={20} color="#ffffff" />
              )}
            </View>
          </View>
        </TouchableHighlight>
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
  content: {
    marginBottom: 60
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: "#dddddd"
  },
  address_list_box: {
    marginTop: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  address_box: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    minHeight: 120
  },
  address_name_box: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  address_name: {
    fontSize: 16,
    color: "#000000",

  },
  address_default_box: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2
  },
  address_default_title: {
    color: '#999999',
    fontSize: 12
  },
  address_content: {
    marginTop: 8,
    width: Util.size.width - 140
  },
  address_content_phone: {
    color: "#404040",
    fontSize: 16,
    marginTop: 4
  },
  address_content_address_detail: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_phuong: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_city: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_content_tinh: {
    color: "#404040",
    fontSize: 14,
    marginTop: 4
  },
  address_selected_box: {
    position: 'absolute',
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    top: 20,
    right: 10
  },
  address_label: {
    fontSize: 10,
    color: "#666666",
    marginTop: 4
  },

  address_add_box: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderTopColor: "#dddddd"
  },
  address_add_content: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  address_add_title: {
    color: "#404040",
    fontSize: 14
  },
  address_add_icon_box: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0
  },

  address_continue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60
  },
  address_continue_content: {
    width: '100%',
    height: '100%',
    backgroundColor: DEFAULT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  address_continue_title: {
    color: '#ffffff',
    fontSize: 18,
    marginRight: 8
  },

  address_edit_btn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 15
  },
  address_edit_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  address_edit_label: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 4
  },

  uncheckOverlay: {
    backgroundColor: "rgba(0,0,0,0.03)",
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  payments_nav: {
    backgroundColor: '#ffffff',
    height: 60,
    flexDirection: 'row'
  },
  payments_nav_items: {
    justifyContent: 'center',
    height: 60,
    width: Util.size.width / 2,
    alignItems: 'center'
  },
  payments_nav_items_title: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#666666'
  },
  payments_nav_items_title_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_items_active: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: DEFAULT_COLOR
  },
  borderBottom: {
    borderBottomWidth: Util.pixel,
    borderBottomColor: "#dddddd"
  },
  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  payments_nav_icon_box: {
    borderWidth: Util.pixel,
    borderColor: "#cccccc",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  payments_nav_icon_active: {
    color: DEFAULT_COLOR
  },
  payments_nav_icon_box_active: {
    borderColor: DEFAULT_COLOR
  }
});
