import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import Animated, {event, divide, Easing} from 'react-native-reanimated';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// constants
import {
  LIST_SERVICE_TYPE,
  MIN_ITEMS_PER_ROW,
  INDICATOR_HORIZONTAL_WIDTH,
} from '../../constants';
import {
  BASE_SERVICE_DIMENSION,
  BASE_TITLE_MARGIN,
  SERVICE_DIMENSION_INCREMENT_PERCENTAGE,
  TITLE_MARGIN_INCREMENT_PERCENTAGE,
} from './constants';
// custom components
import Service from './Service';
import HorizontalIndicator from './HorizontalIndicator';
import {Container, ScrollView} from 'src/components/base';
// themes
import Themes from 'src/Themes';

const homeThemes = Themes.getNameSpace('home');
const listServiceStyle = homeThemes('styles.home.listService');

let styles = StyleSheet.create({
  container: {
    marginBottom: -15,
  },
  horizontalIndicator: {
    width: INDICATOR_HORIZONTAL_WIDTH,
    alignSelf: 'center',
    marginBottom: 15,
  },
});

styles = Themes.mergeStyles(styles, listServiceStyle);
class ListServices extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(LIST_SERVICE_TYPE)),
    itemsPerRow: PropTypes.number,
    listService: PropTypes.array,
    notify: PropTypes.object,
    onItemPress: PropTypes.func,
  };
  static defaultProps = {
    type: LIST_SERVICE_TYPE.VERTICAL,
    listService: [],
    itemsPerRow: MIN_ITEMS_PER_ROW,
    onItemPress: () => {},
  };

  state = {
    horizontalContainerWidth: undefined,
    horizontalContentWidth: undefined,
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
          (this.itemsPerRow <= MIN_ITEMS_PER_ROW
            ? this.itemsPerRow
            : MIN_ITEMS_PER_ROW + 0.5);
        break;
      case LIST_SERVICE_TYPE.VERTICAL:
        serviceStyle.width = appConfig.device.width / this.itemsPerRow;
        break;
      default:
        serviceStyle.width = appConfig.device.width / this.itemsPerRow;
    }

    return serviceStyle;
  }

  get isHorizontal() {
    return this.props.type === LIST_SERVICE_TYPE.HORIZONTAL;
  }

  get scrollEnabled() {
    return (
      this.isHorizontal &&
      this.state.horizontalContentWidth !== this.state.horizontalContainerWidth
    );
  }

  get itemsPerRow() {
    if (!this.hasServices) return;
    switch (this.props.type) {
      case LIST_SERVICE_TYPE.HORIZONTAL:
        return Math.ceil(
          this.props.listService.length / this.props.itemsPerRow,
        );
      default:
        return this.props.itemsPerRow;
    }
  }

  componentDidMount() {
    Animated.timing(this.animatedVisibleValue, {
      toValue: 1,
      duration: 200,
      easing: Easing.quad,
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
        layout: {width},
      },
    } = e;
    this.setState({
      horizontalContainerWidth: width,
    });
  }

  handleLayoutHorizontalContent(e) {
    const {
      nativeEvent: {
        layout: {width},
      },
    } = e;
    this.setState({
      horizontalContentWidth: width,
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
          translateX: divide(this.scrollX, indicatorRatio || 1),
        },
      ],
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
          index,
        }),
      );

      if (
        (index + 1) % this.itemsPerRow === 0 ||
        index === this.props.listService.length - 1
      ) {
        result.push(
          <View key={index} style={{flex: 1, flexDirection: 'row'}}>
            {rowData}
          </View>,
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
        (Math.abs(MIN_ITEMS_PER_ROW - this.itemsPerRow) * incrementValue)) /
        100
    );
  }

  renderService({item, notify = store.notify, index}) {
    const serviceAutoIncrementDimension = this.calculateIncrementDimensionByPercentage(
      BASE_SERVICE_DIMENSION,
      SERVICE_DIMENSION_INCREMENT_PERCENTAGE,
    );

    const serviceDimension =
      this.itemsPerRow < MIN_ITEMS_PER_ROW
        ? serviceAutoIncrementDimension
        : BASE_SERVICE_DIMENSION;

    const titleAutoIncrementMarginTop = this.calculateIncrementDimensionByPercentage(
      BASE_TITLE_MARGIN,
      TITLE_MARGIN_INCREMENT_PERCENTAGE,
    );

    const titleMarginTop =
      this.itemsPerRow < MIN_ITEMS_PER_ROW
        ? titleAutoIncrementMarginTop
        : BASE_TITLE_MARGIN;

    const serviceMainStyle = {
      width: serviceDimension,
      height: serviceDimension,
      backgroundColor: item.bgrColor,
    };

    const titleStyle = {marginTop: titleMarginTop};
    const selfRequest = this.props.selfRequest;

    return (
      <Service
        key={index}
        selfRequest={selfRequest}
        service={item}
        onPress={(item) => this.props.onItemPress(item)}
        containerStyle={this.serviceStyle}
        itemStyle={serviceMainStyle}
        titleStyle={titleStyle}
        notiLabel={notify[`list_service_${item.type}`]}
        isShowNoti={notify[`list_service_${item.type}`]}
      />
    );
  }

  render() {
    const visibleStyle = {
      opacity: this.animatedVisibleValue,
      transform: [
        {
          translateY: this.animatedVisibleValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-5, 0],
          }),
        },
      ],
    };

    return (
      <Container
        reanimated
        style={[styles.container, visibleStyle, this.props.containerStyle]}>
        <ScrollView
          reanimated
          scrollEventThrottle={1}
          scrollEnabled={this.scrollEnabled}
          horizontal={this.isHorizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onLayout={this.handleLayoutHorizontalContainer.bind(this)}
          contentContainerStyle={this.props.contentContainerStyle}
          onScroll={event([
            {
              nativeEvent: {
                contentOffset: {
                  x: this.scrollX,
                },
              },
            },
          ])}>
          <View onLayout={this.handleLayoutHorizontalContent.bind(this)}>
            {this.renderListService()}
          </View>
        </ScrollView>
        {this.scrollEnabled && this.renderHorizontalIndicator()}
      </Container>
    );
  }
}

export default observer(ListServices);
