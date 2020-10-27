import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
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
import RowIndicator from './RowIndicator';
import Animated, { event, divide, Easing } from 'react-native-reanimated';
import store from 'app-store';
import ListServiceSkeleton from './ListServiceSkeleton';

class ListServices extends Component {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(LIST_SERVICE_TYPE)),
    itemsPerRow: PropTypes.number,
    listService: PropTypes.array,
    notify: PropTypes.object,
    onItemPress: PropTypes.func
  };
  static defaultProps = {
    type: LIST_SERVICE_TYPE.HORIZONTAL,
    listService: [],
    itemsPerRow: 6,
    onItemPress: () => {}
  };

  state = {
    horizontalContainerWidth: undefined,
    horizontalContentWidth: undefined
  };
  scrollX = new Animated.Value(0);
  isHomeDataLoaded = false;
  animatedVisibleValue = new Animated.Value(0);

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

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
          (this.props.itemsPerRow < MIN_ITEMS_PER_ROW
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
          translateX: divide(this.scrollX, indicatorRatio)
        }
      ]
    };

    return (
      <View>
        <Animated.ScrollView
          scrollEventThrottle={1}
          horizontal
          showsHorizontalScrollIndicator={false}
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
            {this.renderHorizontalService()}
          </View>
        </Animated.ScrollView>
        <RowIndicator
          containerStyle={{
            width: INDICATOR_HORIZONTAL_WIDTH,
            alignSelf: 'center',
            marginTop: 8,
            marginBottom: 5
          }}
          indicatorStyle={indicatorStyle}
          indicatorWidth={indicatorWidth}
        />
      </View>
    );
  }

  renderHorizontalService() {
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
    return (
      <FlatList
        scrollEnabled={false}
        data={this.props.listService}
        extraData={this.props.notify}
        renderItem={({ item, index }) =>
          this.renderService({
            item,
            notify: this.props.notify,
            onPress: this.props.onItemPress
          })
        }
        keyExtractor={(item, index) => index.toString()}
        numColumns={this.props.itemsPerRow}
      />
    );
  }

  renderService({ item, notify = store.notify, onPress }) {
    const handleOnPress = () => {
      onPress(item);
    };

    return (
      <Button
        onPress={handleOnPress}
        containerStyle={[styles.buttonWrapper, this.serviceStyle]}
      >
        <View style={styles.itemWrapper}>
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: item.bgrColor
              }
            ]}
          >
            {item.iconType === IMAGE_ICON_TYPE ? (
              <Image style={styles.icon} source={{ uri: item.icon }} />
            ) : (
              <MaterialCommunityIcons name={item.icon} color="#fff" size={32} />
            )}
          </View>
          <Text style={styles.title}>{item.title}</Text>

          {notify.notify_chat > 0 && item.type === 'chat' && (
            <NotiBadge
              containerStyle={styles.notifyWrapper}
              label={notify.notify_chat}
            />
          )}
          {notify.notify_list_chat > 0 && item.type === 'list_chat' && (
            <NotiBadge
              containerStyle={styles.notifyWrapper}
              label={notify.notify_list_chat}
            />
          )}
        </View>
      </Button>
    );
  }

  checkVisible() {
    if (store.isHomeLoaded !== this.isHomeDataLoaded) {
      Animated.timing(this.animatedVisibleValue, {
        toValue: store.isHomeLoaded ? 1 : 0,
        duration: 200,
        easing: Easing.quad
      }).start();
    }
    this.isHomeDataLoaded = store.isHomeLoaded;
  }

  render() {
    this.checkVisible();
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
    return this.hasServices ? (
      <Animated.View style={[styles.container, visibleStyle]}>
        {this.renderListService()}
      </Animated.View>
    ) : (
      !store.isHomeLoaded && <ListServiceSkeleton />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  itemWrapper: {
    alignItems: 'center'
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 45,
    height: 45
  },
  title: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '400',
    color: '#333',
    marginTop: 6
  },
  notifyWrapper: {
    right: 16
  }
});

export default observer(ListServices);
