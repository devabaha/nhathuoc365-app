import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import BuildingButton from './BuildingButton';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const HEADING_BACKGROUND_COLOR = LightenColor(appConfig.colors.primary, -20);

const styles = StyleSheet.create({
  container: {
    // backgroundColor: HEADING_BACKGROUND_COLOR,
    borderColor: '#fff',
    borderBottomWidth: 1
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  dash: {
    height: 1,
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute'
  },
  titleContainer: {},
  mask1: {
    position: 'absolute',
    top: -5,
    left: -7,
    backgroundColor: hexToRgbA(LightenColor(HEADING_BACKGROUND_COLOR, 30), 0.5)
  },
  mask2: {
    position: 'absolute',
    bottom: -5,
    right: -7,
    backgroundColor: hexToRgbA(LightenColor(HEADING_BACKGROUND_COLOR, 30), 0.5)
  },
  title: {
    padding: 3,
    backgroundColor: hexToRgbA(HEADING_BACKGROUND_COLOR, 0.3),
    paddingHorizontal: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontSize: 12
  },
  buildingWrapper: {
    minWidth: appConfig.device.width / 3.5,
    borderRadius: 8,
    margin: 10,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5)
  },
  buildingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    overflow: 'hidden'
  },
  buildingIcon: {
    fontSize: 36,
    color: hexToRgbA(appConfig.colors.primary, 0.1),
    borderRightWidth: 1,
    borderRightColor: appConfig.colors.primary,
    position: 'absolute',
    bottom: '-70%',
    left: '10%'
  },
  buildingText: {
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#242424',
    backgroundColor: hexToRgbA('#fff', 0.2)
  },
  suggestionContainer: {
    top: -5,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 5
  },
  suggestionIcon: {
    opacity: 0,
    color: '#fff',
    fontSize: 12,
    ...elevationShadowStyle(3)
  }
});
const BUILDING_BUTTON_WIDTH = appConfig.device.width / 3;

class BuildingSelector extends Component {
  static defaultProps = {
    onPress: () => {}
  };

  state = {
    titleLayout: {},
    buildingLayout: null
  };
  scrollX = new Animated.Value(0);
  refListBuilding = React.createRef();

  get isScrollable() {
    return this.state.buildingLayout
      ? this.state.buildingLayout.width > appConfig.device.width
      : false;
  }

  get scrollArea() {
    return this.isScrollable
      ? this.state.buildingLayout.width - appConfig.device.width
      : 0;
  }

  handleTitleLayout = e => {
    if (Object.keys(this.state.titleLayout).length === 0) {
      this.setState({ titleLayout: e.nativeEvent.layout });
    }
  };

  handleBuildingsLayout = (width, height) => {
    this.setState({ buildingLayout: { width, height } });
  };

  handlePressBuilding(building, index) {
    this.props.onPress(building);
    if (this.refListBuilding) {
      this.refListBuilding.current
        .getNode()
        .scrollToOffset({ offset: (index - 1) * BUILDING_BUTTON_WIDTH });
    }
  }

  renderSuggestion() {
    const leftAnimation = this.isScrollable && {
      opacity: this.scrollX.interpolate({
        inputRange: [0, this.scrollArea],
        outputRange: [0, 1]
      })
    };
    const rightAnimation = this.isScrollable && {
      opacity: this.scrollX.interpolate({
        inputRange: [0, this.scrollArea],
        outputRange: [1, 0]
      })
    };
    return (
      <View style={styles.suggestionContainer}>
        <AnimatedIcon
          name="angle-double-left"
          style={[styles.suggestionIcon, leftAnimation]}
        />
        <AnimatedIcon
          name="angle-double-right"
          style={[styles.suggestionIcon, rightAnimation]}
        />
      </View>
    );
  }

  renderBuilding({ item: building, index }) {
    const isSelected = building.code === this.props.selectedCode;
    return (
      <BuildingButton
        containerStyle={{ width: BUILDING_BUTTON_WIDTH }}
        wrapperStyle={{
          borderBottomWidth: isSelected ? 2 : 0,
          backgroundColor: isSelected ? appConfig.colors.primary : '#fff',
          borderBottomWidth: 0
        }}
        iconStyle={isSelected && { color: '#fff' }}
        titleStyle={
          isSelected && {
            color: '#fff',
            backgroundColor: hexToRgbA(appConfig.colors.primary, 0.5)
          }
        }
        title={building.name}
        active={isSelected}
        onPress={() => this.handlePressBuilding(building, index)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.titleWrapper}>
          <View style={styles.dash} />
          <View onLayout={this.handleTitleLayout} style={styles.titleContainer}>
            <View
              style={[
                styles.mask1,
                {
                  width: this.state.titleLayout.width,
                  height: this.state.titleLayout.height
                }
              ]}
            />
            <View
              style={[
                styles.mask2,
                {
                  width: this.state.titleLayout.width,
                  height: this.state.titleLayout.height
                }
              ]}
            />
            <Text style={styles.title}>Tòa nhà</Text>
          </View>
        </View> */}
        <View>
          {!!this.props.buildings && (
            <Animated.FlatList
              ref={this.refListBuilding}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: this.scrollX
                      }
                    }
                  }
                ],
                { useNativeDriver: true }
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={this.handleBuildingsLayout}
              getItemLayout={(data, index) => {
                return {
                  length: BUILDING_BUTTON_WIDTH,
                  offset: BUILDING_BUTTON_WIDTH * index,
                  index
                };
              }}
              data={this.props.buildings}
              renderItem={this.renderBuilding.bind(this)}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {this.renderSuggestion()}
        </View>
      </View>
    );
  }
}

export default BuildingSelector;
