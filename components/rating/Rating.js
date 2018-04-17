/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  ScrollView,
  Keyboard
} from 'react-native';

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';

var DEFAULT_RATING_MSG = 'Đánh giá, góp ý của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn!';

@observer
export default class  Rating extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      cart_data: props.cart_data,
      rating_data: null,
      had_action: false,
      rating_msg: DEFAULT_RATING_MSG,
      rating_selection: [],
      comment: '',
      HEADER_HEIGHT: 280
    }

    // alert(JSON.stringify(this.state.cart_data))
  }

  componentDidMount() {
    this._getData()
  }

  _getData = async () => {
    var { site_id } = this.state.cart_data;
    try {

      var response = await APIHandler.site_detail(site_id);
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.rating_data) {
          this.setState({
            rating_data: JSON.parse(response.data.rating_data)
          });
        }
      }

    } catch (e) {
      console.warn(e + ' ');
    } finally {

    }
  }

  _setStar(current) {
    this.setState(prevState => {
      if (prevState.current == 1 && current == 1) {
        current = 0;
      }

      return {
        current,
        had_action: true,
        rating_msg: current <= 3 ? 'Chúng tôi cần cải thiện điều gì?' : DEFAULT_RATING_MSG
      }
    });

    // layoutAnimation();
  }

  _renderStar() {
    var {current, isFocus} = this.state;
    return [1,2,3,4,5].map((star, index) => {
      let active = current >= star;
      return(
        <TouchableHighlight
          key={index}
          onPress={this._setStar.bind(this, star)}
          underlayColor="transparent">
          <Icon style={styles.starIcon} name="star" size={isFocus ? 20 : 36} color={active ? 'yellow' : 'rgba(0,0,0,.3)'} />
        </TouchableHighlight>
      );
    });
  }

  render() {
    var {
      cart_data,
      current,
      rating_data,
      had_action,
      rating_msg,
      rating_selection,
      comment,
      isFocus,
      HEADER_HEIGHT
    } = this.state;

    const WrapperView = isIOS ? ScrollView : View;

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.container}>
          <View style={[styles.header, {
            height: HEADER_HEIGHT
          }]}>
            <Text style={[styles.headingText, {
              marginTop: HEADER_HEIGHT * 0.107
            }]}>Cảm ơn bạn!</Text>

            <View style={[styles.storeAvatarBox, {
              marginTop: HEADER_HEIGHT * 0.107,
              width: HEADER_HEIGHT * 0.3,
              height: HEADER_HEIGHT * 0.3,
              borderRadius: HEADER_HEIGHT * 0.3 / 2
            }]}>
              <CachedImage
                style={[styles.storeAvatar, {
                  width: HEADER_HEIGHT * 0.285,
                  height: HEADER_HEIGHT * 0.285,
                  borderRadius: HEADER_HEIGHT * 0.285 / 2,
                  backgroundColor: 'transparent'
                }]}
                source={{uri: cart_data.shop_logo_url}} />
            </View>

            <Text style={[styles.descText, {
              marginTop: HEADER_HEIGHT * 0.057
            }]}>Vui lòng đánh giá dịch vụ của chúng tôi</Text>

            <View style={[styles.starBox, {
              marginTop: HEADER_HEIGHT * 0.0928
            }]}>
              {this._renderStar.call(this)}
            </View>

            <TouchableHighlight
              style={{
                padding: 16,
                position: 'absolute',
                top: isIOS ? 14 : 0,
                left: 0
              }}
              onPress={Actions.pop}
              underlayColor="transparent">
              <Text style={{
                fontSize: 14,
                color: '#ffffff'
              }}>Đóng</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.content}>
            <Text style={styles.questText}>{rating_msg}</Text>

            {current <= 3 && rating_data && had_action && (
              <View style={styles.ratingMoreBox}>
              {rating_data.map((rating, index) => {
                var active = this._isRatingSelected(rating);

                return(
                  <TouchableHighlight
                    key={index}
                    onPress={this._ratingHandle.bind(this, rating)}
                    underlayColor="transparent">
                    <View style={{
                      alignItems: 'center'
                    }}>
                      <View style={[styles.ratingMore, {
                        borderColor: active ? DEFAULT_COLOR : "#999999",
                        width: HEADER_HEIGHT * 0.193,
                        height: HEADER_HEIGHT * 0.193,
                        borderRadius: HEADER_HEIGHT * 0.193 / 2,
                      }]}>
                        <Icon style={styles.ratingIcon} name="truck" size={24} color={active ? DEFAULT_COLOR : "#999999"} />
                      </View>
                      {!isFocus && (
                        <Text style={[styles.ratingShip, {
                          color: active ? DEFAULT_COLOR : "#999999"
                        }]}>{rating.name}</Text>
                      )}
                    </View>
                  </TouchableHighlight>
                );
              })}
              </View>
            )}

            <TextInput
              ref={ref => this.refs_cart_note = ref}
              style={styles.ratingNote}
              keyboardType="default"
              maxLength={1000}
              placeholder="Nhập ghi chú của bạn tại đây"
              placeholderTextColor="#999999"
              multiline={true}
              underlineColorAndroid="transparent"
              onChangeText={(value) => {
                this.setState({
                  comment: value
                });
              }}
              onFocus={() => {
                this.setState({
                  HEADER_HEIGHT: 200,
                  isFocus: true
                });
                // layoutAnimation();
              }}
              onBlur={() => {
                this.setState({
                  HEADER_HEIGHT: 280,
                  isFocus: false
                });
                layoutAnimation();
              }}
              value={comment}
              />
          </View>

          <View style={{
            width: Util.size.width,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TouchableHighlight
              onPress={this._onSave}
              underlayColor="transparent">
              <View style={{
                width: Util.size.width - 30,
                height: 42,
                backgroundColor: DEFAULT_COLOR,
                borderRadius: 3,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600'
                }}>Gửi</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    );
  }

  _onSave = async () => {
    Keyboard.dismiss();

    try {
      var {current, comment, rating_selection} = this.state;
      var {site_id, id} = this.state.cart_data;

      var response = await APIHandler.cart_site_update(site_id, id, {
        star: current,
        comment,
        rating_data: rating_selection.join(', ')
      });

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          Actions.pop();
        }, 1000);
        Toast.show('Góp ý của bạn đã được ghi nhận!');
      }

    } catch (e) {
      console.warn(e + ' ');
    } finally {

    }
  }

  _isRatingSelected(rating) {
    return this.state.rating_selection.indexOf(rating.name) != -1;
  }

  _pushRating(rating) {
    var index = this.state.rating_selection.indexOf(rating.name);
    if (index == -1) {
      this.state.rating_selection.push(rating.name);
      this.setState({
        rating_selection: this.state.rating_selection
      });
    }
  }

  _removeRating(rating) {
    var index = this.state.rating_selection.indexOf(rating.name);
    if (index != -1) {
      this.state.rating_selection.splice(index, 1);
      this.setState({
        rating_selection: this.state.rating_selection
      });
    }
  }

  _ratingHandle(rating) {
    if (this._isRatingSelected(rating)) {
      this._removeRating(rating);
    } else {
      this._pushRating(rating);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    backgroundColor: DEFAULT_COLOR,
    alignItems: 'center'
  },
  headingText: {
    fontSize: 18,
    color: '#ffffff'
  },
  storeAvatarBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  storeAvatar: {
    backgroundColor: '#ccc'
  },
  descText: {
    color: '#ebebeb',
    fontSize: 14,
    backgroundColor: "transparent"
  },
  starBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
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
    borderWidth: 2,
    borderColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16
  },
  ratingIcon: {

  },
  ratingShip: {
    color: '#999999',
    fontSize: 10
  }
});
