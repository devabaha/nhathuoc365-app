import React, {Component} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
//3-party libs
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// routing
import {push, pop} from 'app-helper/routing';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base/Icon/constants';
// custom components
import {
  Container,
  Typography,
  TypographyType,
  ScrollView,
  Input,
  ScreenWrapper,
  TextButton,
  IconButton,
  Icon,
} from 'src/components/base';
import OrdersItemComponent from '../orders/OrdersItemComponent';
import Button from 'src/components/Button';
import Loading from '../Loading';

const STARS = [1, 2, 3, 4, 5];
const MIN_TO_RATE_APP = 4;
const MAX_TO_TAKE_FEEDBACK = 3;

class Rating extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      current: 5,
      keyboardHeight: 0,
      cart_data: props.cart_data,
      rating_data: null,
      had_action: false,
      rating_msg: this.props.t('defaultRating'),
      rating_selection: [],
      comment: '',
      loading: false,
    };
    this.unmounted = false;
    this.refInputContainer = React.createRef();

    this.eventTracker = new EventTracker();

    this.updateNavBarDisposer = () => {};
  }

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
    this.getSiteDetailData();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  keyboardDidShow = (e) => {
    this.setState({
      keyboardShow: true,
      keyboardHeight: e.endCoordinates.height,
    });
    this.refRating && this.refRating.scrollToEnd();
  };

  keyboardDidHide = () => {
    layoutAnimation();
    this.setState({
      keyboardShow: false,
      keyboardHeight: 0,
    });
  };

  getSiteDetailData = async () => {
    const {site_id} = this.state.cart_data;
    try {
      const response = await APIHandler.site_detail(site_id);
      if (response && response.status == STATUS_SUCCESS) {
        if (response.data.rating_data) {
          this.setState({
            rating_data: JSON.parse(response.data.rating_data),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
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
            ? this.props.t('description')
            : this.props.t('defaultRating'),
      };
    });
  };

  renderStar = () => {
    const {current} = this.state;
    return STARS.map((star, index) => {
      let active = current >= star;
      return (
        <IconButton
          useTouchableHighlight
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
                : this.theme.color.textSecondary,
            },
          ]}
        />
      );
    });
  };

  onSave = async () => {
    Keyboard.dismiss();

    this.setState({loading: true});

    try {
      const {current, comment, rating_selection} = this.state;
      const {site_id, id} = this.state.cart_data;

      const response = await APIHandler.site_cart_rating(site_id, id, {
        star: current,
        comment,
        rating_data: rating_selection.join(', '),
      });

      if (response && response.status == STATUS_SUCCESS) {
        pop();

        if (
          current >= MIN_TO_RATE_APP &&
          response.data &&
          response.data.vote_app_flag
        ) {
          push(appConfig.routes.modalRateApp, this.theme);
        } else {
          flashShowMessage({
            message: this.props.t('message'),
            type: 'success',
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.unmounted) return;

      this.setState({loading: false});
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
  get ratingNoteStyle() {
    return mergeStyles(styles.ratingNote, {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    });
  }

  get inactiveIconColor() {
    return this.theme.color.iconInactive;
  }

  get activeIconColor() {
    return this.theme.color.persistPrimary;
  }

  get textButtonTypoProps() {
    return {type: TypographyType.LABEL_TINY_TERTIARY};
  }

  get ratingMoreStyle() {
    return mergeStyles(styles.ratingMore, {
      borderWidth: this.theme.layout.borderWidthLarge,
    });
  }

  renderIconLeft = (titleStyle) => {
    return (
      <View style={[this.ratingMoreStyle, titleStyle]}>
        <Icon
          name="truck"
          bundle={BundleIconSetName.FONT_AWESOME}
          style={[titleStyle, styles.iconTruck]}
        />
      </View>
    );
  };

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
      <ScreenWrapper safeLayout={!store.keyboardTop}>
        {this.state.loading && <Loading center />}
        <ScrollView
          ref={(ref) => (this.refRating = ref)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: store.keyboardTop,
          }}>
          <View style={styles.cartView}>
            <OrdersItemComponent disableGoDetail={true} item={cart_data} />
          </View>

          <Container style={[styles.feedbackWrapper]}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.descText}>
              {this.props.t('titleRating')}
            </Typography>

            <Container style={styles.starBox}>{this.renderStar()}</Container>

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
                    const mainColor = active
                      ? this.activeIconColor
                      : this.inactiveIconColor;
                    return (
                      <TextButton
                        underlayColor="transparent"
                        useTouchableHighlight
                        key={index}
                        onPress={this.ratingHandle.bind(this, rating)}
                        column
                        typoProps={this.textButtonTypoProps}
                        titleStyle={[
                          styles.ratingShip,
                          {
                            color: mainColor,
                            borderColor: mainColor,
                          },
                        ]}
                        renderIconLeft={this.renderIconLeft}>
                        {rating.name}
                      </TextButton>
                    );
                  })}
                </View>
              )}

              <Input
                ref={(ref) => (this.refs_cart_note = ref)}
                style={this.ratingNoteStyle}
                maxLength={1000}
                placeholder={this.props.t('placeholderInput')}
                multiline
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

        <View
          style={{
            bottom: store.keyboardTop,
          }}>
          <Button
            showBackground
            onPress={this.onSave}
            style={styles.submitBtnContent}
            underlayColor="transparent"
            titleStyle={styles.submitLabel}
            title={this.props.t('sendRating')}
          />
        </View>
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
    fontSize: 36,
    marginHorizontal: 8,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  questText: {
    marginTop: 10,
    textAlign: 'center',
  },
  ratingNote: {
    width: appConfig.device.width - 32,
    minHeight: 90,
    marginTop: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
    marginTop: 30,
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
  ratingShip: {},
  cartView: {
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
  },
  submitBtnWrapper: {
    width: appConfig.device.width,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnContent: {},
  submitLabel: {
    fontWeight: '600',
  },
  feedbackWrapper: {
    paddingVertical: 16,
  },
  iconTruck: {
    fontSize: 24,
  },
});

export default withTranslation('rating')(observer(Rating));
