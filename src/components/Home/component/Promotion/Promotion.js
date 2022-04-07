import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import Swiper from 'react-native-swiper';
import Svg, {
  Circle,
  Defs,
  Mask,
  RadialGradient,
  Stop,
  Use,
} from 'react-native-svg';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';

// constants
import {
  PAGINATION_WIDTH,
  PAGINATION_COLOR,
  PAGINATION_SHADOW,
} from './Pagination';
// custom components
import {BundleIconSetName, ImageButton, Icon} from 'src/components/base';
import Pagination from './Pagination';

const PAGINATION_SPACE = 8;
const PAGINATION_ACTIVE_SHADOW_STROKE = 'rgba(0,0,0,.2)';
const PAGINATION_ACTIVE_FILL = '#000';

class Promotion extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array.isRequired,
    ratio: PropTypes.string,
    padding: PropTypes.number,
  };

  static defaultProps = {
    data: [],
    ratio: '3:1',
    padding: 16,
    containerStyle: {},
  };

  constructor(props) {
    super(props);

    this.state = {};
    this.index = 0;
    this.paginationLeft = new Animated.Value(0);
  }

  get theme() {
    return getTheme(this);
  }

  onIndexChanged(selectedIndex) {
    this.index = selectedIndex;
  }

  handleAnimation = (index, total) => {
    const animationConfig = {
      toValue:
        index * (PAGINATION_WIDTH + (index !== 0 ? PAGINATION_SPACE : 0)),
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    };
    Animated.timing(this.paginationLeft, animationConfig).start();
  };

  getRatio() {
    const [w, h] = this.props.ratio.split(':');
    const actualWidth = appConfig.device.width - this.props.padding * 2;
    return [actualWidth, (actualWidth * h) / w];
  }

  renderPagination = (index, total) => {
    if (this.props.data && this.props.data.length <= 1) return null;
    this.handleAnimation(index, total);

    return (
      <View style={[styles.paginationWrapper, this.paginationWrapperStyle]}>
        {this.props.data.map((promotion, index) => {
          return (
            <Pagination
              key={index}
              active={index === this.index}
              style={{
                ...(index !== 0 && {marginLeft: PAGINATION_SPACE}),
              }}
            />
          );
        })}

        {appConfig.device.isIOS ? (
          <Icon
            animated
            bundle={BundleIconSetName.ENTYPO}
            name="circle"
            style={[styles.paginationActive, {left: this.paginationLeft}]}
          />
        ) : (
          <Animated.View
            style={{
              width: PAGINATION_WIDTH + 1,
              height: PAGINATION_WIDTH + 1,
              borderRadius: (PAGINATION_WIDTH + 1) / 2,
              overflow: 'hidden',
              position: 'absolute',

              ...{left: this.paginationLeft},
            }}>
            <Svg>
              <Defs>
                <RadialGradient
                  id="Gradient"
                  gradientUnits="userSpaceOnUse"
                  cx={PAGINATION_WIDTH / 2}
                  cy={PAGINATION_WIDTH / 2}
                  rx={PAGINATION_WIDTH / 2}
                  ry={PAGINATION_WIDTH / 2}>
                  <Stop
                    offset="0.3"
                    stopColor={PAGINATION_COLOR}
                    stopOpacity="0"
                  />
                  <Stop
                    offset="1"
                    stopColor={PAGINATION_COLOR}
                    stopOpacity="1"
                  />
                </RadialGradient>
                <Mask
                  id="Mask"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="100%"
                  height="100%">
                  <Circle
                    cx={PAGINATION_WIDTH / 2}
                    cy={PAGINATION_WIDTH / 2}
                    r={(PAGINATION_WIDTH + 1) / 2}
                    width="100%"
                    height="100%"
                    fill="url(#Gradient)"
                  />
                </Mask>
                <Circle
                  id="Text"
                  cx={(PAGINATION_WIDTH + 1) / 2}
                  cy={(PAGINATION_WIDTH + 1) / 2}
                  r={PAGINATION_WIDTH / 2}
                  strokeWidth="4"
                  stroke={PAGINATION_ACTIVE_SHADOW_STROKE}
                />
              </Defs>
              <Use
                href="#Text"
                fill={PAGINATION_ACTIVE_FILL}
                mask="url(#Mask)"
              />
            </Svg>
            <Svg
              width={PAGINATION_WIDTH}
              height={PAGINATION_WIDTH}
              style={{position: 'absolute'}}>
              <Circle
                cx={(PAGINATION_WIDTH + 1) / 2}
                cy={(PAGINATION_WIDTH + 1) / 2}
                r={(PAGINATION_WIDTH - 2) / 2}
                strokeWidth="1"
                stroke={PAGINATION_COLOR}
              />
            </Svg>
          </Animated.View>
        )}
      </View>
    );
  };

  renderItem = (promotion, index, dimensionStyle) => {
    return (
      <ImageButton
        key={index}
        activeOpacity={0.9}
        style={[styles.promotionItem, this.props.promotionItemStyle]}
        onPress={() => this.props.onPress(promotion, index)}
        source={{uri: promotion.banner}}
        imageStyle={[
          styles.bannerImage,
          dimensionStyle,
          this.props.bannerImageStyle,
        ]}
      />
    );
  };

  get shadowStyle() {
    return {
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  get sliderContainerStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  get paginationWrapperStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  render() {
    const [width, height] = this.getRatio();
    const dimensionStyle = {
      width,
      height,
    };

    return (
      <View
        style={[
          styles.container,
          // shadow for ios
          this.shadowStyle,
          this.props.containerStyle,
        ]}>
        <Swiper
          autoplay
          key={this.props.data?.length}
          autoplayTimeout={5}
          // removeClippedSubviews={false}
          renderPagination={this.renderPagination}
          onIndexChanged={this.onIndexChanged.bind(this)}
          containerStyle={{
            ...styles.slideContainer,
            ...this.sliderContainerStyle,
            // shadow for android
            ...this.shadowStyle,
            ...dimensionStyle,
            ...this.props.containerStyle,
          }}
          style={styles.slideStyle}>
          {this.props.data.map((promotion, index) =>
            this.renderItem(promotion, index, dimensionStyle),
          )}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  slideContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  slideStyle: {},
  bannerImage: {},
  promotionItem: {
    alignItems: 'center',
  },
  paginationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PAGINATION_WIDTH,
    marginHorizontal: 15,
    position: 'absolute',
    bottom: 15,
  },
  pagination: {
    height: 1,
    width: PAGINATION_WIDTH,
  },
  paginationActive: {
    fontSize: PAGINATION_WIDTH + 1,
    color: PAGINATION_COLOR,
    position: 'absolute',
    ...PAGINATION_SHADOW,
  },
});

export default Promotion;
