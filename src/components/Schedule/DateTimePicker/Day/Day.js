import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native';
import appConfig from 'app-config';

class Day extends Component {
  state = {
    animatedSelection: new Animated.Value(0)
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.isSelected
    ) {
      Animated.spring(this.state.animatedSelection, {
        toValue: nextProps.isSelected ? 1 : 0,
        useNativeDriver: true
      }).start();
    }

    if (
      nextProps.disabled !== this.props.disabled ||
      nextProps.date !== this.props.date ||
      nextProps.isSelected !== this.props.isSelected
    ) {
      return true;
    }
    return false;
  }

  render() {
    const extraBgStyle = {
      backgroundColor: this.props.isToday
        ? this.props.isSelected && appConfig.colors.primary
        : this.props.isSelected && '#000',
      ...(this.props.disabled && styles.bgDisabled),
      transform: [
        {
          scale: this.state.animatedSelection.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 0, 1]
          })
        }
      ]
    };
    const extraStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      color: this.props.isToday
        ? this.props.isSelected
          ? '#fff'
          : appConfig.colors.primary
        : this.props.isSelected
        ? '#fff'
        : '#242424',
      ...(this.props.disabled && styles.textDisabled),
      opacity: this.state.animatedSelection.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [1, 0, 1]
      })
    };

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress(this.props.date)}
        disabled={this.props.disabled}
        hitSlop={HIT_SLOP}
      >
        <View style={styles.dateItemWrapper}>
          <Animated.View style={[styles.backgroundDateItem, extraBgStyle]} />
          <Animated.Text style={[styles.text, extraStyle]}>
            {this.props.date.day}
          </Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  dateItemWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundDateItem: {
    position: 'absolute',
    zIndex: -1,
    width: 46,
    height: 46,
    borderRadius: 23
  },
  text: {
    textTransform: 'uppercase',
    fontSize: 18
  },
  textDisabled: {
    color: '#aaa'
  },
  bgDisabled: {
    backgroundColor: 'transparent'
  }
});

export default Day;
