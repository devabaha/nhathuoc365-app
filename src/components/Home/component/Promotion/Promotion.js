import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import Swiper from 'react-native-swiper';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/Entypo';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const PROMOTION_WIDTH = appConfig.device.width - 32;
const PAGINATION_WIDTH = 8;
const PAGINATION_SPACE = 8;

class Promotion extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    ratio: PropTypes.string,
    padding: PropTypes.number
  };

  static defaultProps = {
    data: [],
    ratio: '3:1',
    padding: 16
  };

  constructor(props) {
    super(props);

    this.state = {
      paginationLeft: new Animated.Value(0),
      paginationInactive: new Animated.Value(0)
    };
    this.index = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  renderItem = (promotion, index, dimensionStyle) => {
    return (
      <View
        key={index}
        style={[styles.promotionItem, this.props.promotionItemStyle]}
      >
        <TouchableHighlight
          onPress={() => this.props.onPress(promotion)}
          underlayColor="transparent"
        >
          <CachedImage
            source={{ uri: promotion.banner }}
            style={[
              styles.bannerImage,
              dimensionStyle,
              this.props.bannerImageStyle
            ]}
          />
        </TouchableHighlight>
      </View>
    );
  };

  onIndexChanged(selectedIndex) {
    this.index = selectedIndex;
  }

  handleAnimation = (index, total) => {
    const animationConfig = {
      toValue:
        index * (PAGINATION_WIDTH + (index !== 0 ? PAGINATION_SPACE : 0)),
      duration: 250
    };
    Animated.timing(this.state.paginationLeft, animationConfig).start();
  };

  getRatio() {
    const [w, h] = this.props.ratio.split(':');
    const actualWidth = appConfig.device.width - this.props.padding * 2;
    return [actualWidth, (actualWidth * h) / w];
  }

  renderPagination = (index, total) => {
    this.handleAnimation(index, total);

    return (
      <View style={styles.paginationWrapper}>
        {this.props.data.map((promotion, index) => {
          return (
            <Pagination
              key={index}
              active={index === this.index}
              style={{
                ...(index !== 0 && { marginLeft: PAGINATION_SPACE })
              }}
            />
          );
        })}
        {/* <Animated.View
          style={[
            styles.paginationActive,
            {
              left: this.state.paginationLeft
            }
          ]}
        /> */}
        <AnimatedIcon
          name="circle"
          style={[styles.paginationActive, { left: this.state.paginationLeft }]}
        />
      </View>
    );
  };

  render() {
    const [width, height] = this.getRatio();
    const dimensionStyle = {
      width,
      height
    };
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Swiper
          autoplay
          autoplayTimeout={5}
          backgroundColor="#fafafa"
          renderPagination={this.renderPagination}
          onIndexChanged={this.onIndexChanged.bind(this)}
          containerStyle={[
            styles.slideContainerStyle,
            dimensionStyle,
            this.props.containerSlideStyle
          ]}
          style={styles.slideStyle}
        >
          {this.props.data.map((promotion, index) =>
            this.renderItem(promotion, index, dimensionStyle)
          )}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  slideContainerStyle: {
    position: 'relative',
    marginTop: 8,
    overflow: 'hidden',
    borderRadius: 8
  },
  slideStyle: {},
  bannerImage: {},
  promotionItem: {
    alignItems: 'center'
  },
  paginationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 300,
    height: PAGINATION_WIDTH,
    marginHorizontal: 15,
    position: 'absolute',
    bottom: 15,
    borderRadius: 8
  },
  pagination: {
    height: 1,
    width: PAGINATION_WIDTH,
    backgroundColor: '#fff',
    ...elevationShadowStyle(1)
  },
  paginationActive: {
    fontSize: PAGINATION_WIDTH + 1,
    color: '#fff',
    position: 'absolute',
    ...elevationShadowStyle(2)
  }
});

export default Promotion;

class Pagination extends Component {
  state = {
    animatedShow: new Animated.Value(this.animatedValue)
  };

  get animatedValue() {
    if (this.props.active) {
      return 0;
    }

    return 1;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.active !== this.props.active) {
      Animated.timing(this.state.animatedShow, {
        toValue: nextProps.active ? 0 : 1,
        easing: Easing.quad,
        duration: 200,
        useNativeDriver: true
      }).start();
    }

    return true;
  }

  render() {
    const animatedStyle = {
      opacity: this.state.animatedShow
    };

    return (
      <Animated.View
        style={[styles.pagination, animatedStyle, this.props.style]}
      />
    );
  }
}
