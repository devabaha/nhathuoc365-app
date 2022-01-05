import React, {Component} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Input,
  ScrollView,
  Typography,
  Icon,
  ScreenWrapper,
  Container,
  IconButton,
  BaseButton,
} from 'src/components/base';
import OrdersItemComponent from 'src/components/orders/OrdersItemComponent';
import Button from 'src/components/Button';

const DEFAULT_RATING_MSG =
  'Đánh giá, góp ý của bạn giúp chúng tôi cải thiện chất lượng dịch vụ tốt hơn!';
//Your rate, feedback will help us to improve our service!
const STARS = [1, 2, 3, 4, 5];
const MIN_TO_RATE_APP = 4;
const MAX_TO_TAKE_FEEDBACK = 3;

class Feedback extends Component {
  static contextType = ThemeContext;

  state = {
    current: 0,
    keyboardHeight: 0,
    cart_data: this.props.cart_data,
    rating_data: null,
    had_action: false,
    rating_msg: DEFAULT_RATING_MSG,
    rating_selection: [],
    comment: '',
  };

  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  keyboardDidShow = (e) => {
    this.setState(
      {
        keyboardShow: true,
        keyboardHeight: e.endCoordinates.height,
      },
      () => {
        setTimeout(() => {
          this.refRating && this.refRating.scrollToEnd({animated: true});
        }, 0);
      },
    );
  };

  keyboardDidHide = () => {
    layoutAnimation();
    this.setState({
      keyboardShow: false,
      keyboardHeight: 0,
    });
  };

  setStar = (current) => {
    this.setState((prevState) => {
      if (prevState.current == 1 && current == 1) {
        current = 0;
      }
      return {
        current,
        had_action: true,
        rating_msg:
          current <= MAX_TO_TAKE_FEEDBACK
            ? 'Chúng tôi cần cải thiện điều gì?'
            : DEFAULT_RATING_MSG,
      }; // What we need to improve?
    });
  };

  renderStar = () => {
    const {current} = this.state;
    return STARS.map((star, index) => {
      let active = current >= star;
      return (
        <IconButton
          key={index}
          onPress={this.setStar.bind(this, star)}
          underlayColor="transparent"
          bundle={BundleIconSetName.FONT_AWESOME}
          name="star"
          iconStyle={[
            styles.starIcon,
            {
              color: active
                ? this.theme.color.goldenYellow
                : this.theme.color.neutral,
            },
          ]}
        />
      );
    });
  };

  onSave = async () => {
    Keyboard.dismiss();

    try {
      const {current, comment, rating_selection} = this.state;
      const {cart_code: id} = this.state.cart_data;
      const data = {
        star: current,
        comment,
        rating_data: rating_selection.join(', '),
      };

      const response = await APIHandler.service_rating(id, data);

      if (response && response?.status == STATUS_SUCCESS) {
        pop();

        if (
          current >= MIN_TO_RATE_APP &&
          response.data &&
          response.data.vote_app_flag
        ) {
          push(appConfig.routes.modalRateApp);
        } else {
          flashShowMessage({
            message: 'Góp ý của bạn đã được ghi nhận!',
            type: 'success',
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  isRatingSelected = (rating) => {
    return this.state.rating_selection.indexOf(rating.name) != -1;
  };

  pushRating = (rating) => {
    const index = this.state.rating_selection.indexOf(rating.name);
    if (index == -1) {
      this.state.rating_selection.push(rating.name);
      this.setState({
        rating_selection: this.state.rating_selection,
      });
    }
  };

  removeRating(rating) {
    const index = this.state.rating_selection.indexOf(rating.name);
    if (index != -1) {
      this.state.rating_selection.splice(index, 1);
      this.setState({
        rating_selection: this.state.rating_selection,
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

  get ratingMoreStyle() {
    return {
      borderWidth: this.theme.layout.borderWidthLarge,
    };
  }

  get ratingNoteStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    };
  }

  render() {
    const {
      cart_data,
      current,
      rating_data,
      had_action,
      rating_msg,
      comment,
    } = this.state;

    return (
      <ScreenWrapper>
        <ScrollView
          ref={(ref) => (this.refRating = ref)}
          keyboardShouldPersistTaps="handled">
          <View style={styles.cartView}>
            <OrdersItemComponent
              disableGoStore
              disableGoDetail
              item={cart_data}
            />
          </View>

          <Container
            style={[
              styles.feedbackWrapper,
              {
                marginBottom: this.state.keyboardHeight,
              },
            ]}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.descText}>
              Vui lòng đánh giá chất lượng phục vụ cho đơn hàng{' '}
              {/* Please rate our service for this order */}
            </Typography>
            <View style={styles.starBox}>{this.renderStar()}</View>

            <View style={styles.content}>
              <Typography
                type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                style={styles.questText}>
                {rating_msg}
              </Typography>

              {current <= 3 && rating_data && had_action && (
                <View style={styles.ratingMoreBox}>
                  {rating_data.map((rating, index) => {
                    const active = this.isRatingSelected(rating);

                    return (
                      <BaseButton
                        key={index}
                        onPress={this.ratingHandle.bind(this, rating)}
                        underlayColor="transparent">
                        <View
                          style={{
                            alignItems: 'center',
                          }}>
                          <View
                            style={[
                              this.ratingMoreStyle,
                              styles.ratingMore,
                              {
                                borderColor: active
                                  ? this.theme.color.primaryHighlight
                                  : this.theme.color.border,
                              },
                            ]}>
                            <Icon
                              bundle={BundleIconSetName.FONT_AWESOME}
                              name="truck"
                              neutral={!active}
                              primary
                              style={{fontSize: 24}}
                            />
                          </View>
                          <Typography
                            type={TypographyType.LABEL_TINY}
                            style={{
                              color: active
                                ? this.theme.color.primaryHighlight
                                : this.theme.color.textPrimary,
                            }}>
                            {rating.name}
                          </Typography>
                        </View>
                      </BaseButton>
                    );
                  })}
                </View>
              )}

              <Input
                ref={(ref) => (this.refs_cart_note = ref)}
                style={[this.ratingNoteStyle, styles.ratingNote]}
                keyboardType="default"
                maxLength={1000}
                placeholder="Nhập ghi chú của bạn tại đây"
                //Enter you note here
                multiline={true}
                underlineColorAndroid="transparent"
                onChangeText={(value) => {
                  this.setState({
                    comment: value,
                  });
                }}
                value={comment}
              />
            </View>
          </Container>
        </ScrollView>

        <Button
          useTouchableHighlight
          onPress={this.onSave}
          safeLayout
          title="GỬI ĐÁNH GIÁ"
          // SUBMIT
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descText: {
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  starBox: {
    marginTop: 32,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starIcon: {
    marginHorizontal: 8,
    fontSize: 36,
  },

  content: {
    alignItems: 'center',
  },
  questText: {
    marginTop: 16,
    textAlign: 'center',
  },
  ratingNote: {
    fontSize: 14,
    width: appConfig.device.width - 32,
    minHeight: 90,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  ratingMoreBox: {
    width: appConfig.device.width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
  },
  ratingMore: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cartView: {
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
  },
  feedbackWrapper: {
    paddingVertical: 16,
  },
});

export default Feedback;
