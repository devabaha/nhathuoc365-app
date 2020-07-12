import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import Reanimated, { Easing } from 'react-native-reanimated';

import appConfig from 'app-config';
import Header from './Header';
import Row from './Row';
import Images from './Images';
import Toggle from './Toggle';

const EXTEND_MESSAGE = 'Mở rộng';
const COLLAPSE_MESSAGE = 'Thu gọn';

class Card extends Component {
  state = {
    isExpanded: false,
    animatedArrow: new Animated.Value(0),
    animatedAreaHeight: new Reanimated.Value(0),
    heightCollapsable: undefined
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isExpanded !== this.state.isExpanded) {
      const config = {
        damping: 15,
        mass: 1,
        stiffness: 150,
        overshootClamping: true,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        duration: 300,
        easing: Easing.quad,
        useNativeDriver: true
      };
      const method = nextState.isExpanded ? 'spring' : 'timing';

      Reanimated[method](this.state.animatedAreaHeight, {
        toValue: nextState.isExpanded ? 1 : 0,
        ...config
      }).start();

      Animated.spring(this.state.animatedArrow, {
        toValue: nextState.isExpanded ? 1 : 0,
        useNativeDriver: true
      }).start();
    }

    if (nextState !== this.state) {
      console.log('render card state');
      return true;
    }

    if (nextProps.request !== this.props.request) {
      return true;
    }

    return false;
  }

  onTogglePress = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleLayoutAnimatedArea = e => {
    if (this.state.heightCollapsable === undefined) {
      const { height } = e.nativeEvent.layout;
      this.setState({
        heightCollapsable: height
      });
    }
  };

  render() {
    const {
      title,
      department,
      status,
      created,
      content,
      images,
      color
    } = this.props.request;
    const toggleValue = this.state.isExpanded
      ? COLLAPSE_MESSAGE
      : EXTEND_MESSAGE;

    const showUpStyle = {
      position: this.state.heightCollapsable ? 'relative' : 'absolute',
      opacity: this.state.heightCollapsable ? 1 : 0
    };
    const animatedIconStyle = {
      transform: [
        {
          rotate: this.state.animatedArrow.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-180deg']
          })
        }
      ]
    };

    const animatedHeight = {
      overflow: 'hidden',
      height: this.state.animatedAreaHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.state.heightCollapsable || 0]
      }),
      opacity: this.state.animatedAreaHeight
    };
    console.log('render card');
    return (
      <Animated.View
        onLayout={this.props.onContainerLayout}
        style={this.props.containerStyle}
      >
        <TouchableWithoutFeedback onPress={this.props.onPressLayout}>
          <View style={[styles.container, showUpStyle]}>
            <Header title={title} subTitle={department} />

            <Row
              label="Trạng thái"
              value={status}
              valueStyle={{ backgroundColor: color, padding: 7 }}
            />
            <Reanimated.View
              onLayout={this.handleLayoutAnimatedArea}
              style={animatedHeight}
            >
              <Row label="Thời gian yêu cầu" value={created} />
              <Row
                isColumn
                label="Nội dung"
                labelStyle={{ marginBottom: 10 }}
                value={content}
                extraComponent={<Images images={images} />}
              />
            </Reanimated.View>
            <Row
              disabled={false}
              isColumn
              valueComponent={
                <Toggle
                  value={toggleValue}
                  animatedIconStyle={animatedIconStyle}
                />
              }
              onPressValue={this.onTogglePress}
              valueStyle={styles.imagesValue}
            />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    ...elevationShadowStyle(7)
  },
  imagesValue: {
    alignSelf: 'center',
    color: appConfig.colors.primary
  }
});

export default Card;
