import React, {Component} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';

class Day extends Component {
  static contextType = ThemeContext;

  state = {
    animatedSelection: new Animated.Value(0),
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.isSelected !== this.props.isSelected ||
      nextProps.isSelected
    ) {
      Animated.spring(this.state.animatedSelection, {
        toValue: nextProps.isSelected ? 1 : 0,
        useNativeDriver: true,
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

  get textDisabledStyle() {
    return {color: this.theme.color.disabled};
  }

  render() {
    const extraBgStyle = {
      backgroundColor: this.props.isToday
        ? this.props.isSelected && this.theme.color.primaryHighlight
        : this.props.isSelected && this.theme.color.primaryHighlight,
      ...(this.props.disabled && styles.bgDisabled),
      transform: [
        {
          scale: this.state.animatedSelection.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 0, 1],
          }),
        },
      ],
    };
    const extraStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      color: this.props.isToday
        ? this.props.isSelected
          ? this.theme.color.onPrimaryHighlight
          : this.theme.color.persistPrimary
        : this.props.isSelected
        ? this.theme.color.onPrimaryHighlight
        : this.theme.color.onBackground,
      ...(this.props.disabled && this.textDisabledStyle),
      opacity: this.state.animatedSelection.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [1, 0, 1],
      }),
    };

    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.onPress(this.props.date)}
        disabled={this.props.disabled}
        hitSlop={HIT_SLOP}>
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
    alignItems: 'center',
  },
  backgroundDateItem: {
    position: 'absolute',
    zIndex: -1,
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  text: {
    textTransform: 'uppercase',
    fontSize: 18,
  },
  textDisabled: {},
  bgDisabled: {
    backgroundColor: 'transparent',
  },
});

export default Day;
