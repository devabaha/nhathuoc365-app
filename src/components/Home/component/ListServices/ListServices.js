import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from 'react-native-button';
import { IMAGE_ICON_TYPE } from '../../constants';
import {
  LIST_SERVICE_TYPE,
  MIN_ITEMS_PER_ROW,
  INDICATOR_HORIZONTAL_WIDTH
} from './constants';
import appConfig from 'app-config';
import { NotiBadge } from '../../../Badges';
import HorizontalIndicator from './HorizontalIndicator';
import Animated, { event, divide, Easing } from 'react-native-reanimated';
import store from 'app-store';

const BASE_SERVICE_DIMENSION = 45;
const BASE_TITLE_MARGIN = 6;
const SERVICE_DIMENSION_INCREMENT_PERCENTAGE = 20;
const TITLE_MARGIN_INCREMENT_PERCENTAGE = 30;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center'
  },
  itemWrapper: {
    alignItems: 'center'
  },
  iconWrapper: {
    width: BASE_SERVICE_DIMENSION,
    height: BASE_SERVICE_DIMENSION,
    borderRadius: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: '80%',
    height: '80%'
  },
  title: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginTop: BASE_TITLE_MARGIN
  },
  notifyWrapper: {
    right: -8,
    top: -8,
    minWidth: 20,
    height: 20
  },
  notifyLabel: {
    fontSize: 12
  },
  horizontalIndicator: {
    width: INDICATOR_HORIZONTAL_WIDTH,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 5
  }
});

class ListServices extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(LIST_SERVICE_TYPE)),
    itemsPerRow: PropTypes.number,
    listService: PropTypes.array,
    notify: PropTypes.object,
    onItemPress: PropTypes.func
  };
  static defaultProps = {
    type: LIST_SERVICE_TYPE.VERTICAL,
    listService: [],
    itemsPerRow: MIN_ITEMS_PER_ROW,
    onItemPress: () => {}
  };

  state = {
    horizontalContainerWidth: undefined,
    horizontalContentWidth: undefined
  };
  scrollX = new Animated.Value(0);
  animatedVisibleValue = new Animated.Value(0);

  get hasServices() {
    return (
      !!Array.isArray(this.props.listService) &&
      this.props.listService.length !== 0
    );
  }

  get serviceStyle() {
    const serviceStyle = {};
    switch (this.props.type) {
      case LIST_SERVICE_TYPE.HORIZONTAL:
        serviceStyle.width =
          appConfig.device.width /
          (this.props.itemsPerRow <= MIN_ITEMS_PER_ROW
            ? this.props.itemsPerRow
            : MIN_ITEMS_PER_ROW + 0.5);
        break;
      case LIST_SERVICE_TYPE.VERTICAL:
        serviceStyle.width = appConfig.device.width / this.props.itemsPerRow;
        break;
      default:
        serviceStyle.width = appConfig.device.width / this.props.itemsPerRow;
    }

    return serviceStyle;
  }

  get isHorizontal() {
    return this.props.type === LIST_SERVICE_TYPE.HORIZONTAL;
  }

  get scrollEnabled() {
    return (
      this.isHorizontal &&
      this.state.horizontalContentWidth > this.state.horizontalContainerWidth
    );
  }

  componentDidMount() {
    Animated.timing(this.animatedVisibleValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad
    }).start();
  }

  renderListService() {
    switch (this.props.type) {
      case LIST_SERVICE_TYPE.HORIZONTAL:
        return this.renderListHorizontal();
      case LIST_SERVICE_TYPE.VERTICAL:
        return this.renderListVertical();
    }
  }

  handleLayoutHorizontalContainer(e) {
    const {
      nativeEvent: {
        layout: { width }
      }
    } = e;
    this.setState({
      horizontalContainerWidth: width
    });
  }

  handleLayoutHorizontalContent(e) {
    const {
      nativeEvent: {
        layout: { width }
      }
    } = e;
    this.setState({
      horizontalContentWidth: width
    });
  }

  renderListHorizontal() {
    return this.renderServiceLayout();
  }

  renderHorizontalIndicator() {
    if (
      this.state.horizontalContainerWidth === this.state.horizontalContentWidth
    ) {
      return;
    }

    const indicatorWidth =
      this.state.horizontalContainerWidth && this.state.horizontalContentWidth
        ? (this.state.horizontalContainerWidth /
            this.state.horizontalContentWidth) *
          INDICATOR_HORIZONTAL_WIDTH
        : 0;

    const indicatorRatio = indicatorWidth
      ? (this.state.horizontalContentWidth -
          this.state.horizontalContainerWidth) /
        (INDICATOR_HORIZONTAL_WIDTH - indicatorWidth)
      : 1;

    const indicatorStyle = {
      transform: [
        {
          translateX: divide(this.scrollX, indicatorRatio || 1)
        }
      ]
    };

    return (
      <HorizontalIndicator
        containerStyle={styles.horizontalIndicator}
        indicatorStyle={indicatorStyle}
        indicatorWidth={indicatorWidth}
      />
    );
  }

  renderServiceLayout() {
    let result = [],
      rowData = [];
    this.props.listService.forEach((service, index) => {
      rowData.push(
        this.renderService({
          item: service,
          notify: this.props.notify,
          onPress: this.props.onItemPress
        })
      );

      if (
        (index + 1) % this.props.itemsPerRow === 0 ||
        index === this.props.listService.length - 1
      ) {
        result.push(
          <View style={{ flex: 1, flexDirection: 'row' }}>{rowData}</View>
        );
        rowData = [];
      }
    });
    return result;
  }

  renderListVertical() {
    return this.renderServiceLayout();
  }

  calculateIncrementDimensionByPercentage(baseValue, incrementValue) {
    return (
      baseValue +
      (baseValue *
        (Math.abs(MIN_ITEMS_PER_ROW - this.props.itemsPerRow) *
          incrementValue)) /
        100
    );
  }

  renderService({ item, notify = store.notify, onPress }) {
    const handleOnPress = () => {
      onPress(item);
    };

    const serviceAutoIncrementDimension = this.calculateIncrementDimensionByPercentage(
      BASE_SERVICE_DIMENSION,
      SERVICE_DIMENSION_INCREMENT_PERCENTAGE
    );

    const serviceDimension =
      this.props.itemsPerRow < MIN_ITEMS_PER_ROW
        ? serviceAutoIncrementDimension
        : BASE_SERVICE_DIMENSION;

    const titleAutoIncrementMarginTop = this.calculateIncrementDimensionByPercentage(
      BASE_TITLE_MARGIN,
      TITLE_MARGIN_INCREMENT_PERCENTAGE
    );

    const titleMarginTop =
      this.props.itemsPerRow < MIN_ITEMS_PER_ROW
        ? titleAutoIncrementMarginTop
        : BASE_TITLE_MARGIN;

    return (
      <Button
        onPress={handleOnPress}
        containerStyle={[styles.buttonWrapper, this.serviceStyle]}
      >
        <View style={styles.itemWrapper}>
          <View>
            <View
              style={[
                styles.iconWrapper,
                {
                  width: serviceDimension,
                  height: serviceDimension,
                  backgroundColor: item.bgrColor
                }
              ]}
            >
              {item.iconType === IMAGE_ICON_TYPE ? (
                <Image style={styles.icon} source={{ uri: item.icon }} />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon}
                  color="#fff"
                  size={32}
                />
              )}
            </View>
            <NotiBadge
              containerStyle={styles.notifyWrapper}
              labelStyle={styles.notifyLabel}
              label={notify[`list_service_${item.type}`]}
              show={notify[`list_service_${item.type}`]}
              alert
              animation
            />
          </View>
          <Text style={[styles.title, { marginTop: titleMarginTop }]}>
            {item.title}
          </Text>
        </View>
      </Button>
    );
  }

  render() {
    const visibleStyle = {
      opacity: this.animatedVisibleValue,
      transform: [
        {
          translateY: this.animatedVisibleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-5, 0]
          })
        }
      ]
    };
    return (
      <Animated.View style={[styles.container, visibleStyle]}>
        <Animated.ScrollView
          scrollEventThrottle={1}
          scrollEnabled={this.scrollEnabled}
          horizontal={this.isHorizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onLayout={this.handleLayoutHorizontalContainer.bind(this)}
          onScroll={event([
            {
              nativeEvent: {
                contentOffset: {
                  x: this.scrollX
                }
              }
            }
          ])}
        >
          <View onLayout={this.handleLayoutHorizontalContent.bind(this)}>
            {this.renderListService()}
          </View>
        </Animated.ScrollView>
        {this.scrollEnabled && this.renderHorizontalIndicator()}
      </Animated.View>
    );
  }
}

export default observer(ListServices);
