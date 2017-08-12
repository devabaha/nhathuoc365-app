/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  RefreshControl
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

@observer
export default class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      data: [
        {id: 0, name: 'Hà Nội'},
        {id: 1, name: 'Hà Nội'},
        {id: 2, type: 'address_add'}
      ]
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.address_list_box}>
          {this.state.data != null && <FlatList
            ref="address_list"
            data={this.state.data}
            extraData={this.state}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator}></View>}
            renderItem={({item}) => {
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

              return(
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => 1}>
                  <View style={styles.address_box}>
                    <View style={styles.address_name_box}>
                      <Text style={styles.address_name}>Đặng Ngọc Sơn</Text>
                      <View style={styles.address_default_box}>
                        <Text style={styles.address_default_title}>[Mặc định]</Text>
                      </View>
                    </View>

                    <View style={styles.address_content}>
                      <Text style={styles.address_content_phone}>(+84) 1653538222</Text>
                      <Text style={styles.address_content_address_detail}>Số 10 khu Chuyên Gia</Text>
                      <Text style={styles.address_content_phuong}>Phường Phương Lâm</Text>
                      <Text style={styles.address_content_city}>Thành Phố Hoà Bình</Text>
                      <Text style={styles.address_content_tinh}>Hoà Bình</Text>
                    </View>

                    <View style={styles.address_selected_box}>
                      <Icon name="check" size={24} color={DEFAULT_COLOR} />
                    </View>
                  </View>
                </TouchableHighlight>
              );
            }}
          />}
        </View>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.props.go_confirm_page}
          style={styles.address_continue}>
          <View style={styles.address_continue_content}>
            <Text style={styles.address_continue_title}>TIẾP TỤC</Text>
            <Icon name="chevron-right" size={20} color="#ffffff" />
          </View>
        </TouchableHighlight>
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
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: "#dddddd"
  },
  address_list_box: {
    marginTop: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd",
    paddingTop: 2,
    marginBottom: 60
  },
  address_box: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff"
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
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  address_default_title: {
    color: '#999999',
    fontSize: 14
  },
  address_content: {
    marginTop: 8
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
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    top: '30%',
    right: 0
  },

  address_add_box: {

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
  }
});
