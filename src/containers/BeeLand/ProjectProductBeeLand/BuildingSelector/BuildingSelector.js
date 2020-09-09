import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const HEADING_BACKGROUND_COLOR = LightenColor(appConfig.colors.primary, -20);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    backgroundColor: HEADING_BACKGROUND_COLOR,
    borderColor: '#fff',
    borderBottomWidth: 2
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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
    left: -5,
    backgroundColor: hexToRgbA(LightenColor(HEADING_BACKGROUND_COLOR, 30), 0.5)
  },
  mask2: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: hexToRgbA(LightenColor(HEADING_BACKGROUND_COLOR, 30), 0.5)
  },
  title: {
    backgroundColor: hexToRgbA(HEADING_BACKGROUND_COLOR, 0.3),
    paddingHorizontal: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  buildingWrapper: {
    minWidth: appConfig.device.width / 3.5,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  buildingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15
  },
  buildingIcon: {
    fontSize: 36,
    color: hexToRgbA(appConfig.colors.primary, 0.15),
    position: 'absolute',
    bottom: '-5%',
    left: '5%'
  },
  buildingText: {
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#242424'
  },
  suggestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 5
  },
  suggestionIcon: {
    color: '#ddd',
    fontSize: 14
  }
});

class BuildingSelector extends Component {
  state = {
    titleLayout: {},
    buildingLayout: null
  };
  scrollX = new Animated.Value(0);

  get isScrollable() {
    return this.state.buildingLayout
      ? this.state.buildingLayout.width > appConfig.device.width
      : false;
  }

  get scrollArea() {
    return this.state.buildingLayout
      ? this.state.buildingLayout.width - appConfig.device.width > 0
        ? this.state.buildingLayout.width - appConfig.device.width
        : 0
      : 0;
  }

  handleTitleLayout = e => {
    if (Object.keys(this.state.titleLayout).length === 0) {
      this.setState({ titleLayout: e.nativeEvent.layout });
    }
  };

  handleBuildingLayout = e => {
    this.setState({ buildingLayout: e.nativeEvent.layout });
  };

  renderBuilding() {
    return this.props.buildings.map((building, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.buildingWrapper}
        >
          <Icon name="building" style={styles.buildingIcon} />
          <View style={styles.buildingContainer}>
            <Text style={styles.buildingText}>{building.name}</Text>
          </View>
        </TouchableOpacity>
      );
    });
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
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
        </View>
        <Animated.ScrollView
          scrollEventThrottle={16}
          horizontal
          showsHorizontalScrollIndicator={false}
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
        >
          <View
            style={{ flexDirection: 'row' }}
            onLayout={this.handleBuildingLayout}
          >
            {this.renderBuilding()}
          </View>
        </Animated.ScrollView>
        {this.renderSuggestion()}
      </View>
    );
  }
}

export default BuildingSelector;
