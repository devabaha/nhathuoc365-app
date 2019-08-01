/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';

// library
import store from '../../store/Store';
import Items from '../stores/Items';
import ItemList from './ItemList';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class ChooseLocation extends Component {
  constructor(props) {
    super();

    this.state = {
    }
  }

  componentDidMount() {
    //GoogleAnalytic('_choose_location');
  }

  async onPressLocation(item) {
    var response = await APIHandler.user_choose_location(item.id);
    if (response) {
      if(response.status == STATUS_SUCCESS){
        action(() => {
          store.setRefreshHomeChange(store.refresh_home_change + 1);
          store.setRefreshNews(store.refresh_news + 1);
        })();
        Actions.myTabBar({
          type: ActionConst.RESET
        });
      }else{
        Toast.show(response.message);
      }
    }else{
      Toast.show("Có lỗi xảy ra, vui lòng thử lại");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {store.user_info && store.user_info.sites && (
          <View style={{marginTop: 20}}>
            <View style={styles.myFavoriteBox}>
              <Text style={styles.add_store_title}>Mời bạn chọn cửa hàng để được phục vụ</Text>
            </View>
            {store.user_info.sites.map((item, index) => (
              <TouchableHighlight
              underlayColor="transparent"
              onPress={() => this.onPressLocation(item)}>

              <View style={[styles.store_result_item, styles.store_result_item_active]}>
                <View style={styles.store_result_item_image_box}>
                  <CachedImage mutable style={styles.store_result_item_image} source={{uri: item.logo_url}} />
                </View>

                <View style={styles.store_result_item_content}>
                  <View style={styles.store_result_item_content_box}>
                    <Text style={styles.store_result_item_title}>{item.name}</Text>
                    <Text style={styles.store_result_item_desc}>{item.address}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            ))}
          </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: BAR_HEIGHT,
    backgroundColor: BGR_SCREEN_COLOR
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center'
  },
  store_result_item_image_box: {
    marginTop: 30,
  },
  store_result_item_image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  titleText: {
    marginTop: 70,
    fontSize: 18,
    color: "rgb(0,0,0)",
    fontWeight: "bold",
    alignSelf: "center"
  },
  myFavoriteBox: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  stores_box: {
    marginBottom: 8,
    borderTopWidth: Util.pixel,
    borderColor: "#dddddd"
  },

  add_store_box: {
    width: '100%',
    backgroundColor: "#ffffff",
    paddingBottom: 8,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_title: {
    color: "#404040",
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20
  },
  add_store_actions_box: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  add_store_action_btn: {
    paddingVertical: 4
  },
  add_store_action_btn_box: {
    alignItems: 'center',
    // width: ~~((Util.size.width - 16) / 2),
    width: ~~(Util.size.width / 3),
    borderRightWidth: Util.pixel,
    borderRightColor: '#ebebeb'
  },
  add_store_action_label: {
    fontSize: 12,
    color: '#404040',
    marginTop: 4
  },

  right_btn_add_store: {
    paddingVertical: 1,
    paddingHorizontal: 8
  },

  modal_add_store: {
    width: '90%',
    // height: 228,
    height: 180,
    borderRadius: 3
  },
  modal_add_store_title: {
    color: "#404040",
    fontSize: 18,
    marginTop: 12,
    marginLeft: 15,
    marginBottom: 8
  },
  modal_add_store_btn: {
    marginTop: 12
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
    paddingLeft: 15,
    flexDirection: 'row',
    minHeight: 104,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
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
    resizeMode: 'cover',
    borderRadius: 2
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
    lineHeight: isIOS ? 16 : 18,
    paddingRight: 15
  },
  store_result_item_time: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4
  },
  store_result_item_add_box: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    flexDirection: 'row'
  }
});
