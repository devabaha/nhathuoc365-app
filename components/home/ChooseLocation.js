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
  TextInput
} from 'react-native';

// library
import store from '../../store/Store';
import Items from '../stores/Items';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class ChooseLocation extends Component {
  constructor(props) {
    super();

    this.state = {
    }
  }

  componentDidMount() {
    GoogleAnalytic('_choose_location');
  }

  async onPressLocation(item) {
    var response = await APIHandler.user_choose_location(item.id);
    if (response) {
      if(response.status == STATUS_SUCCESS){
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
        <Text style={styles.titleText}>Chọn khu vực bạn cần đặt hàng tới</Text>
        {store.user_info && store.user_info.sites && (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 30
          }}>
            {store.user_info.sites.map((item, index) => (
              <Items
                key={index}
                item={item}
                index={index}
                isLocationItem={true}
                onPress={() => this.onPressLocation(item)}
                />
            ))}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: "#ffffff",
    alignItems: 'center'
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
    marginTop: 50,
    fontSize: 18,
    color: "rgb(0,0,0)",
    fontWeight: "bold",
    alignSelf: "center"
  }
});
