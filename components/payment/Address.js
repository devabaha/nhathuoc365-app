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
      loading: true
    }

    // auto reload address list
    reaction(() => store.address_key_change, () => {
      this._getData();
    });

    this._getData = this._getData.bind(this);
  }

  componentDidMount() {
    this._getData();
  }

  // get list address
  async _getData() {
    try {
      var response = await APIHandler.user_address();

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          this.setState({
            data: [...response.data, {id: 0, type: 'address_add'}],
            loading: false,
            item_selected: null
          });
          layoutAnimation();
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

  _renderSelected(item, index) {
    const selected_box = (
      <View style={styles.address_selected_box}>
        <Icon name="check" size={24} color={DEFAULT_COLOR} />
        <Text style={styles.address_label}>Giao tới địa chỉ này</Text>
      </View>
    );

    if (this.state.item_selected) {
      if (this.state.item_selected == item.id) {
        return selected_box;
      }
    } else if (index == 0) {
      this.state.item_selected = item.id;
      return selected_box;
    }
  }

  async _goConfirmPage() {
    if (this.state.data == null) {
      return Alert.alert(
        'Thông báo',
        'Nhập địa chỉ nhận hàng trước khi Tiếp tục',
        [
          {text: 'Đồng ý', onPress: () => {
            if (this.props.add_new) {
              this.props.add_new();
            }
          }},
        ],
        { cancelable: false }
      );
    }

    try {
      var response = await APIHandler.site_cart_address(store.store_id, this.state.item_selected);

      if (response && response.status == STATUS_SUCCESS) {
        // go confirm screen
        if (this.props.go_confirm_page) {
          this.props.go_confirm_page();
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  // chọn địa chỉ cho đơn hàng
  async _addressSelectHanlder(item) {
    this.setState({
      item_selected: item.id
    });
    layoutAnimation();
  }

  render() {
    var { loading } = this.state;

    return (
      <View style={styles.container}>
        {loading ? (
          <Indicator />
        ) : (
          <View style={styles.container}>
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
                            onPress={this.props.add_new}
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

                      if (this.state.item_selected) {
                        var is_selected = this.state.item_selected == item.id;
                      } else {
                        var is_selected = item.default_flag == 1;
                      }

                      return(
                        <TouchableHighlight
                          underlayColor="transparent"
                          onPress={this._addressSelectHanlder.bind(this, item)}>
                          <View style={[styles.address_box, {
                            backgroundColor: is_selected ? "#ffffff" : "#fafafa"
                          }]}>
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

                            {this._renderSelected.call(this, item, index)}

                            {item.default_flag == 1 && (
                              <View style={styles.address_edit_btn}>
                                <Text style={styles.address_default_title}>[Mặc định]</Text>
                              </View>
                            )}

                            <View style={styles.address_default_box}>
                              <TouchableHighlight
                                underlayColor="transparent"
                                onPress={() => {
                                  Actions.createAddress({
                                    edit_data: item,
                                    title: "SỬA ĐỊA CHỈ"
                                  });
                                }}>
                                <View style={styles.address_edit_box}>
                                  <Icon name="pencil-square-o" size={12} color="#999999" />
                                  <Text style={styles.address_edit_label}>Chỉnh sửa</Text>
                                </View>
                              </TouchableHighlight>
                            </View>
                          </View>
                        </TouchableHighlight>
                      );
                    }}
                  />
                ) : (
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
                )}
              </View>
            </ScrollView>

            <TouchableHighlight
              underlayColor="transparent"
              onPress={this._goConfirmPage.bind(this)}
              style={styles.address_continue}>
              <View style={styles.address_continue_content}>
                <Text style={styles.address_continue_title}>TIẾP TỤC</Text>
                <Icon name="chevron-right" size={20} color="#ffffff" />
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    width: Util.size.width
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
    backgroundColor: "#ebebeb",
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
    right: 0
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
  }
});
