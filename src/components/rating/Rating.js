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
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrdersItemComponent from '../orders/OrdersItemComponent';
import EventTracker from '../../helper/EventTracker';

const DEFAULT_RATING_MSG =
  'Đánh giá, góp ý của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn!';
const STARS = [1, 2, 3, 4, 5];
const MIN_TO_RATE_APP = 4;
const MAX_TO_TAKE_FEEDBACK = 3;

class Rating extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      keyboardHeight: 0,
      cart_data: props.cart_data,
      rating_data: null,
      had_action: false,
      rating_msg: DEFAULT_RATING_MSG,
      rating_selection: [],
      comment: ''
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.getSiteDetailData();
    this.eventTracker.logCurrentView();
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.eventTracker.clearTracking();
  }

  keyboardDidShow = e => {
    this.setState(
      {
        keyboardShow: true,
        keyboardHeight: e.endCoordinates.height
      },
      () => {
        setTimeout(() => {
          this.refRating && this.refRating.scrollToEnd({ animated: true });
        }, 0);
      }
    );
  };

  keyboardDidHide = () => {
    layoutAnimation();
    this.setState({
      keyboardShow: false,
      keyboardHeight: 0
    });
  };

  getSiteDetailData = async () => {
    const { site_id } = this.state.cart_data;
    try {
      const response = await APIHandler.site_detail(site_id);
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.rating_data) {
          this.setState({
            rating_data: JSON.parse(response.data.rating_data)
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  setStar = current => {
    this.setState(prevState => {
      if (prevState.current == 1 && current == 1) {
        current = 0;
      }
      return {
        current,
        had_action: true,
        rating_msg:
          current <= MAX_TO_TAKE_FEEDBACK
            ? 'Chúng tôi cần cải thiện điều gì?'
            : DEFAULT_RATING_MSG
      };
    });
  };

  renderStar = () => {
    const { current } = this.state;
    return STARS.map((star, index) => {
      let active = current >= star;
      return (
        <TouchableHighlight
          key={index}
          onPress={this.setStar.bind(this, star)}
          underlayColor="transparent"
        >
          <Icon
            style={styles.starIcon}
            name="star"
            size={36}
            color={active ? 'rgb(255, 235, 0)' : 'rgba(0, 0, 0, .2)'}
          />
        </TouchableHighlight>
      );
    });
  };

  onSave = async () => {
    Keyboard.dismiss();

    try {
      const { current, comment, rating_selection } = this.state;
      const { site_id, id } = this.state.cart_data;

      const response = await APIHandler.site_cart_rating(site_id, id, {
        star: current,
        comment,
        rating_data: rating_selection.join(', ')
      });

      if (response && response.status == STATUS_SUCCESS) {
        Actions.pop();

        if (
          current >= MIN_TO_RATE_APP &&
          response.data &&
          response.data.vote_app_flag
        ) {
          Actions.push(appConfig.routes.modalRateApp);
        } else {
          flashShowMessage({
            message: 'Góp ý của bạn đã được ghi nhận!',
            type: 'success'
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  isRatingSelected = rating => {
    return this.state.rating_selection.indexOf(rating.name) != -1;
  };

  pushRating = rating => {
    const index = this.state.rating_selection.indexOf(rating.name);
    if (index == -1) {
      this.state.rating_selection.push(rating.name);
      this.setState({
        rating_selection: this.state.rating_selection
      });
    }
  };

  removeRating(rating) {
    const index = this.state.rating_selection.indexOf(rating.name);
    if (index != -1) {
      this.state.rating_selection.splice(index, 1);
      this.setState({
        rating_selection: this.state.rating_selection
      });
    }
  }

  ratingHandle(rating) {
    if (this.isRatingSelected(rating)) {
      this.removeRating(rating);
    } else {
      this.pushRating(rating);
    }
  }

  render() {
    const {
      cart_data,
      current,
      rating_data,
      had_action,
      rating_msg,
      comment
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          ref={ref => (this.refRating = ref)}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cartView}>
            <OrdersItemComponent disableGoDetail={true} item={cart_data} />
          </View>

          <View
            style={[
              styles.feedbackWrapper,
              {
                marginBottom: this.state.keyboardHeight
              }
            ]}
          >
            <Text style={styles.descText}>
              Vui lòng đánh giá chất lượng phục vụ cho đơn hàng
            </Text>

            <View style={styles.starBox}>{this.renderStar()}</View>

            <View style={styles.content}>
              <Text style={styles.questText}>{rating_msg}</Text>

              {current <= 3 && rating_data && had_action && (
                <View style={styles.ratingMoreBox}>
                  {rating_data.map((rating, index) => {
                    const active = this.isRatingSelected(rating);

                    return (
                      <TouchableHighlight
                        key={index}
                        onPress={this.ratingHandle.bind(this, rating)}
                        underlayColor="transparent"
                      >
                        <View
                          style={{
                            alignItems: 'center'
                          }}
                        >
                          <View
                            style={[
                              styles.ratingMore,
                              {
                                borderColor: active
                                  ? appConfig.colors.primary
                                  : '#999999'
                              }
                            ]}
                          >
                            <Icon
                              name="truck"
                              size={24}
                              color={
                                active ? appConfig.colors.primary : '#999999'
                              }
                            />
                          </View>
                          <Text
                            style={[
                              styles.ratingShip,
                              {
                                color: active
                                  ? appConfig.colors.primary
                                  : '#999999'
                              }
                            ]}
                          >
                            {rating.name}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    );
                  })}
                </View>
              )}

              <TextInput
                ref={ref => (this.refs_cart_note = ref)}
                style={styles.ratingNote}
                keyboardType="default"
                maxLength={1000}
                placeholder="Nhập ghi chú của bạn tại đây"
                placeholderTextColor="#999999"
                multiline={true}
                underlineColorAndroid="transparent"
                onChangeText={value => {
                  this.setState({
                    comment: value
                  });
                }}
                value={comment}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.submitBtnWrapper}>
          <TouchableHighlight onPress={this.onSave} underlayColor="transparent">
            <View style={styles.submitBtnContent}>
              <Text style={styles.submitLabel}>GỬI ĐÁNH GIÁ</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  descText: {
    color: '#333',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  starBox: {
    marginTop: 32,
    marginBottom: 20,
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
    width: appConfig.device.width - 32,
    minHeight: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 8
  },
  ratingMoreBox: {
    width: appConfig.device.width,
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
  ratingShip: {
    color: '#999999',
    fontSize: 10
  },
  cartView: {
    marginLeft: 0,
    marginRight: 0,
    width: '100%'
  },
  submitBtnWrapper: {
    width: appConfig.device.width,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appConfig.colors.white
  },
  submitBtnContent: {
    width: appConfig.device.width - 30,
    height: 42,
    backgroundColor: appConfig.colors.primary,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600'
  },
  feedbackWrapper: {
    paddingVertical: 16,
    backgroundColor: appConfig.colors.white
  }
});

export default Rating;
