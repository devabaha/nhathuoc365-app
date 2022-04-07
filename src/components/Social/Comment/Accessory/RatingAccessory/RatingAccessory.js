import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Animated, {color, Extrapolate} from 'react-native-reanimated';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Ratings from 'src/components/Ratings';
import {Container, Icon, IconButton, TextButton} from 'src/components/base';

const styles = StyleSheet.create({
  ratingWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  ratingContainer: {
    justifyContent: 'center',
  },

  ratingTitleContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  ratingTitle: {
    fontWeight: '500',
  },
  ratingIcon: {
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
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    borderRadius: 20,
    padding: 3,
    marginLeft: 12,
  },
  closeRatingIcon: {},
});

class RatingAccessory extends PureComponent {
  static contextType = ThemeContext;

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
  ratingTitleTypoProps = {
    reanimated: true,
    type: TypographyType.LABEL_SMALL,
  };

  animatedVisibleRating = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

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

  renderRatingIcon = (titleStyle) => {
    return (
      <Icon
        reanimated
        bundle={BundleIconSetName.FONT_AWESOME}
        name="star"
        style={[styles.ratingIcon, titleStyle, this.animatedRatingTitleStyle]}
      />
    );
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
        ...hexToRgbCode(this.theme.color.warning),
        this.animatedVisibleRating.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0],
          extrapolate: Extrapolate.CLAMP,
        }),
      ),
    };
  }

  get ratingContainerStyle() {
    return mergeStyles(styles.ratingContainer, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get ratingTitleContainerStyle() {
    return mergeStyles(styles.ratingTitleContainer, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get ratingTitleStyle() {
    return mergeStyles(styles.ratingTitle, {
      color: this.theme.color.other,
    });
  }

  get closeRatingIconContainerStyle() {
    return mergeStyles(styles.closeRatingIconContainer, {
      backgroundColor: this.theme.color.danger,
    });
  }

  get closeRatingIconStyle() {
    return mergeStyles(styles.closeRatingIcon, {
      color: this.theme.color.white,
    });
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
      <Container style={styles.ratingWrapper}>
        <Animated.View
          onLayout={this.handleRatingContainerLayout}
          style={[
            this.ratingContainerStyle,
            this.animatedRatingContainerStyle,
          ]}>
          <TextButton
            useTouchableHighlight
            disabled={this.state.isVisibleRating}
            hitSlop={HIT_SLOP}
            typoProps={this.ratingTitleTypoProps}
            titleStyle={[this.ratingTitleStyle, this.animatedRatingTitleStyle]}
            style={this.ratingTitleContainerStyle}
            onPress={() => this.toggleRating()}
            renderIconLeft={this.renderRatingIcon}>
            {this.props.title || this.props.t('common:rate')}
          </TextButton>

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

            <IconButton
              hitSlop={HIT_SLOP}
              bundle={BundleIconSetName.ANT_DESIGN}
              name="close"
              style={this.closeRatingIconContainerStyle}
              iconStyle={this.closeRatingIconStyle}
              onPress={() => this.toggleRating()}
            />
          </Container>
        </Animated.View>
      </Container>
    );
  }
}

export default withTranslation(undefined, {withRef: true})(RatingAccessory);
