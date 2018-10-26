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
    console.log(response)
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
        <ImageBackground resizeMode="stretch" style={styles.image} source={require('../../images/foodhub_loadding_screen.png')}>
          <View style={styles.store_result_item_image_box}>
            <CachedImage mutable style={styles.store_result_item_image} source={require('../../images/icon-320.png')} />
          </View>
          <Text style={styles.titleText}>Chọn khu vực bạn cần đặt hàng tới</Text>
          {store.user_info && store.user_info.sites && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap'
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
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: "#ffffff"
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center'
  },
  store_result_item_image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    marginTop: 20,
    fontSize: 16,
    color: "white",
    alignSelf: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});
