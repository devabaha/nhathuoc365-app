/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class Rating extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      cart_data: props.cart_data
    }

    alert(JSON.stringify(this.state.cart_data))
  }

  _setStar(current) {
    this.setState(prevState => {
      if (prevState.current == 1 && current == 1) {
        current = 0;
      }

      return {
        current
      }
    });

    layoutAnimation();
  }

  _renderStar() {
    var {current} = this.state;
    return [1,2,3,4,5].map((star, index) => {
      let active = current >= star;
      return(
        <TouchableHighlight
          key={index}
          onPress={this._setStar.bind(this, star)}
          underlayColor="transparent">
          <Icon style={styles.starIcon} name="star" size={36} color={active ? 'yellow' : 'rgba(0,0,0,.3)'} />
        </TouchableHighlight>
      );
    });
  }

  render() {
    var {cart_data, current} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headingText}>Cảm ơn bạn!</Text>

          <View style={styles.storeAvatarBox}>
            <CachedImage
              style={styles.storeAvatar}
              source={{uri: cart_data.shop_logo_url}} />
          </View>

          <Text style={styles.descText}>Vui lòng đánh giá dịch vụ của chúng tôi</Text>

          <View style={styles.starBox}>
            {this._renderStar.call(this)}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.questText}>Đánh giá, góp ý của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn!</Text>

          {current <= 3 && (
            <View style={styles.ratingMoreBox}>
              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => 1}
                underlayColor="transparent">
                <View style={styles.ratingMore}>
                  <Icon style={styles.ratingIcon} name="truck" size={20} color="#999999" />
                  <Text style={styles.ratingShip}>Vận chuyển</Text>
                </View>
              </TouchableHighlight>
            </View>
          )}

          <TextInput
            ref={ref => this.refs_cart_note = ref}
            style={styles.ratingNote}
            keyboardType="default"
            maxLength={250}
            placeholder="Nhập ghi chú của bạn tại đây"
            placeholderTextColor="#999999"
            multiline={true}
            underlineColorAndroid="transparent"
            onChangeText={(value) => {

            }}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 280,
    backgroundColor: DEFAULT_COLOR,
    alignItems: 'center'
  },
  headingText: {
    marginTop: 30,
    fontSize: 18,
    color: '#ffffff'
  },
  storeAvatarBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 30
  },
  storeAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 40
  },
  descText: {
    color: '#ebebeb',
    fontSize: 14,
    marginTop: 16
  },
  starBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 26
  },
  starIcon: {
    marginHorizontal: 8
  },

  content: {
    alignItems: 'center'
  },
  questText: {
    color: '#404040',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center'
  },

  ratingNote: {
    fontSize: 14,
    width: Util.size.width * 0.9,
    height: 69,
    backgroundColor: '#dddddd',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 4
  },

  ratingMoreBox: {
    width: Util.size.width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center'
  },
  ratingMore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8
  },
  ratingIcon: {
    marginTop: -8
  },
  ratingShip: {
    color: '#999999',
    fontSize: 10
  }
});
