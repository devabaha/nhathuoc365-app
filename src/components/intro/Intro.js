/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableHighlight,
  FlatList
} from 'react-native';

// library
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import Icon from 'react-native-vector-icons/FontAwesome';

const images = [{ key: 1, image: require('../../images/slide/image_3.png') }];

export default class Intro extends Component {
  constructor(props) {
    super();

    this.state = {
      pageNum: 0
    };
  }

  componentDidMount() {
    EventTracker.logEvent('intro_page');
  }

  _renderImage({ item, index }) {
    return (
      <ImageBackground
        key={index}
        resizeMode="stretch"
        style={styles.image}
        source={item.image}
      >
        <TouchableHighlight
          style={styles.finish_btn_box}
          underlayColor="transparent"
          onPress={this._onFinish.bind(this)}
        >
          <View style={styles.finish_btn}>
            <Text style={styles.finish_text}>
              <Icon name="heart-o" size={16} color="#ffffff" /> TRẢI NGHIỆM{' '}
              {APP_NAME_SHOW}
            </Text>
          </View>
        </TouchableHighlight>
      </ImageBackground>
    );
  }

  _onFinish() {
    this._run_fbak();
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
    var { pageNum } = this.state;

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

        {pageNum < images.length - 1 && (
          <View style={styles.pagination}>
            {images.map((item, index) => {
              return (
                <View
                  key={index}
                  style={[styles.dot, index == pageNum ? styles.dotActive : {}]}
                />
              );
            })}
          </View>
        )}

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
          <Text
            style={{
              fontSize: 14,
              color: '#404040'
            }}
          >
            Tiếp tục
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
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
    backgroundColor: 'rgba(0,0,0,.3)',
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
    alignItems: 'center'
  },
  finish_btn_box: {
    width: Util.size.width,
    height: 100,
    position: 'absolute',
    bottom: 20,
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
    color: '#ffffff',
    fontSize: 16
  }
});
