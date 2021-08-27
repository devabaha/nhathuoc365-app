import React, {PureComponent} from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {color, Extrapolate} from 'react-native-reanimated';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';

import Ratings from 'src/components/Ratings';
import {Container} from 'src/components/Layout';

const AnimatedFontAwesomeIcon = Animated.createAnimatedComponent(
  FontAwesomeIcon,
);

const styles = StyleSheet.create({
  ratingWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  ratingContainer: {
    justifyContent: 'center',
    borderRadius: 4,
  },

  ratingTitleContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  ratingTitle: {
    color: appConfig.colors.status.other,
    fontWeight: '500',
    fontSize: 12,
  },
  ratingIcon: {
    color: appConfig.colors.status.other,
    alignSelf: 'center',
    marginRight: 5,
  },

  ratingStarContainer: {
    position: 'absolute',
  },
  closeRatingContainer: {
    paddingLeft: 5,
    marginLeft: 7,
  },
  closeRatingIconContainer: {
    backgroundColor: appConfig.colors.status.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 3,
  },
  closeRatingIcon: {
    color: appConfig.colors.white,
  },
});

class RatingAccessory extends PureComponent {
  static defaultProps = {
    defaultRating: 5,
    onChangeRating: () => {},
    isDefaultVisible: false,
  };

  state = {
    isVisibleRating: false,
    ratingContainerWidth: 0,
    ratingWidth: 0,
  };
  ratingValue = this.props.defaultRating;

  animatedVisibleRating = new Animated.Value(0);

  componentDidMount() {
    if (this.props.isDefaultVisible) {
      this.toggleRating(true);
    }
  }

  toggleRating = (isVisibleRating = !this.state.isVisibleRating) => {
    Animated.spring(this.animatedVisibleRating, {
      toValue: !isVisibleRating ? 0 : 1,
      damping: !isVisibleRating ? 30 : 15,
      mass: 0.8,
      stiffness: 200,
    }).start();

    this.props.onChangeRating(!isVisibleRating ? 0 : this.ratingValue);
    this.setState({
      isVisibleRating,
    });
  };

  handleFinishRating = (rating) => {
    this.ratingValue = rating;
    this.props.onChangeRating(this.ratingValue);
  };

  handleRatingContainerLayout = (e) => {
    if (!this.state.ratingContainerWidth) {
      this.setState({ratingContainerWidth: e.nativeEvent.layout.width});
    }
  };

  handleRatingLayout = (e) => {
    this.setState({ratingWidth: e.nativeEvent.layout.width});
  };

  get animatedRatingContainerStyle() {
    return {
      width: !!this.state.ratingContainerWidth
        ? this.animatedVisibleRating.interpolate({
            inputRange: [0, 1],
            outputRange: [
              this.state.ratingContainerWidth,
              this.state.ratingWidth,
            ],
            extrapolateLeft: Extrapolate.CLAMP,
          })
        : undefined,
      backgroundColor: color(
        ...hexToRgbCode(appConfig.colors.status.warning),
        this.animatedVisibleRating.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
          extrapolate: Extrapolate.CLAMP,
        }),
      ),
    };
  }

  animatedRatingTitleStyle = {
    opacity: this.animatedVisibleRating.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    }),
  };
  animatedRatingStyle = {
    opacity: this.animatedVisibleRating.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
      extrapolate: Extrapolate.CLAMP,
    }),
    transform: [
      {
        translateX: this.animatedVisibleRating.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };

  render() {
    return (
      <View style={styles.ratingWrapper}>
        <Animated.View
          onLayout={this.handleRatingContainerLayout}
          style={[styles.ratingContainer, this.animatedRatingContainerStyle]}>
          <TouchableHighlight
            disabled={this.state.isVisibleRating}
            hitSlop={HIT_SLOP}
            underlayColor="rgba(0,0,0,.1)"
            style={styles.ratingTitleContainer}
            onPress={() => this.toggleRating()}>
            <Container row>
              <AnimatedFontAwesomeIcon
                name="star"
                style={[styles.ratingIcon, this.animatedRatingTitleStyle]}
              />
              <Animated.Text
                style={[styles.ratingTitle, this.animatedRatingTitleStyle]}>
                {this.props.title || this.props.t('common:rate')}
              </Animated.Text>
            </Container>
          </TouchableHighlight>

          <Container
            reanimated
            row
            pointerEvents={this.state.isVisibleRating ? 'auto' : 'none'}
            style={[styles.ratingStarContainer, this.animatedRatingStyle]}
            onLayout={this.handleRatingLayout}>
            <Ratings
              type="airbnb"
              size={20}
              defaultRating={this.props.defaultRating}
              startingValue={this.props.defaultRating}
              onFinishRating={this.handleFinishRating}
            />
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              style={styles.closeRatingContainer}
              onPress={() => this.toggleRating()}>
              <View style={styles.closeRatingIconContainer}>
                <AntDesignIcon name="close" style={styles.closeRatingIcon} />
              </View>
            </TouchableOpacity>
          </Container>
        </Animated.View>
      </View>
    );
  }
}

export default withTranslation(undefined, {withRef: true})(RatingAccessory);
