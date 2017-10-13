/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  FlatList
} from 'react-native';

// library
import Swiper from 'react-native-swiper';
import store from '../../store/Store';
import { Actions, ActionConst } from 'react-native-router-flux';

const images = [
  {key: 1, image: require('../../images/slide/image_1.png')},
  {key: 2, image: require('../../images/slide/image_2.png')},
  {key: 3, image: require('../../images/slide/image_3.png')},
];

export default class Intro extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNum: 0,
      finish: false,
      stores_data: null
    }
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      var response = await APIHandler.user_sites();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          stores_data: response.data
        });
      }
    } catch (e) {
      console.warn(e + ' user_sites');

      return Alert.alert(
        'Thông báo',
        'Kết nối mạng bị lỗi',
        [
          {text: 'Thử lại', onPress: this._getData.bind(this)},
        ],
        { cancelable: false }
      );
    } finally {
      this.setState({
        finish: true
      });
    }
  }

  _renderImage({item, index}) {
    if (index == (images.length - 1)) {
      return(
        <Image key={index} style={styles.image} source={item.image}>
          <TouchableHighlight
            style={styles.finish_btn_box}
            underlayColor="transparent"
            onPress={this._onFinish.bind(this)}>
            <View style={styles.finish_btn}>
              <Text style={styles.finish_text}>TRẢI NGHIỆM NGAY!</Text>
            </View>
          </TouchableHighlight>
        </Image>
      );
    } else {
      return(
        <Image key={index} style={styles.image} source={item.image}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={this._onFinish.bind(this)}
            style={{
              position: 'absolute',
              right: 0,
              paddingTop: isIOS ? 24 : 4,
              paddingHorizontal: 15
            }}
            >
            <Text style={{
              fontSize: 14,
              color: "#404040"
            }}>Bỏ qua</Text>
          </TouchableHighlight>
        </Image>
      );
    }
  }

  _onFinish() {
    if (this.state.stores_data) {
      Actions.myTabBar({
        type: ActionConst.RESET
      });

      // intro finish
      storage.save({
        key: STORAGE_INTRO_KEY,
        data: {
          finish: true
        },
        expires: null
      });
    } else {
      Actions.add_store({
        type: ActionConst.RESET
      });
    }
  }

  _onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum != this.state.pageNum) {
      this.setState({
        pageNum
      });
    }
  }

  render() {
    var {pageNum, finish} = this.state;

    if (finish == false) {
      return(
        <View style={styles.container}>
          <Indicator size="small" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={this._onScrollEnd.bind(this)}
          data={images}
          horizontal={true}
          pagingEnabled
          renderItem={this._renderImage.bind(this)}
        />

        {pageNum < (images.length - 1) && (<View style={styles.pagination}>
          {images.map((item, index) => {
            return(
              <View key={index} style={[styles.dot, index == pageNum ? styles.dotActive : {}]} />
            );
          })}
        </View>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  pagination: {
    width: Util.size.width,
    height: 14,
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dot: {
    backgroundColor:'rgba(0,0,0,.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },
  dotActive: {
    backgroundColor: DEFAULT_COLOR
  },
  image: {
    width: Util.size.width,
    height: Util.size.height - (isAndroid ? 24 : 0),
    alignItems: 'center',
    resizeMode: 'stretch'
  },
  finish_btn_box: {
    width: Util.size.width,
    height: 100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  finish_btn: {
    backgroundColor: DEFAULT_COLOR,
    padding: 12,
    borderRadius: 2
  },
  finish_text: {
    color: "#ffffff",
    fontSize: 16
  }
});
