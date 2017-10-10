/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

// library
import Swiper from 'react-native-swiper';
import { Actions, ActionConst } from 'react-native-router-flux';

const images = [
  require('../../images/slide/image_1.png'),
  require('../../images/slide/image_2.png'),
  require('../../images/slide/image_3.png'),
];

export default class Intro extends Component {
  constructor(props) {
    super();
  }
  
  _renderImage() {
    return images.map((image, index) => {
      if (index == (images.length - 1)) {
        return(
          <Image key={index} style={styles.image} source={image}>
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
          <Image key={index} style={styles.image} source={image}>
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
    });
  }

  _onFinish() {
    Actions.myTabBar({
      type: ActionConst.RESET,
      goAddStore: true
    });
  }

  render() {
    return (
      <Swiper
        style={styles.wrapper}
        activeDotColor={DEFAULT_COLOR}
        paginationStyle={{
          bottom: 8
        }}
        width={Util.size.width}
        height={Util.size.height}
        loop={false}
        showsPagination={true}
        showsButtons={false}>
        {this._renderImage.call(this)}
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#666666"
  },
  wrapper: {
  },
  image: {
    width: '100%',
    height: '100%',
    alignItems: 'center'
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
