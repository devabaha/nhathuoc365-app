import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Animated,
  TouchableOpacity
} from 'react-native';
import Button from './Button';
import Icon from 'react-native-vector-icons/FontAwesome';

class ComboHeaderButton extends PureComponent {
  static defaultProps = {
    onCloseInput: () => {},
    onPress: () => {},
    onContainerLayout: () => {},
    secretComponent: null,
    rightSecretComponent: null
  };

  state = {
    selectedBtn: {},
    selectedIndex: -1,
    animated: new Animated.Value(0),
    smoothlyAnimated: new Animated.Value(0)
  };
  animating = false;

  handleOnPress = (btn, index) => {
    if (this.animating) {
      this.state.animated.resetAnimation();
      this.state.smoothlyAnimated.resetAnimation();
    }
    this.props.onPress(btn);
    this.animating = true;
    this.setState(
      {
        selectedIndex: index,
        selectedBtn: btn,
        visibleInput: true
      },
      () =>
        Animated.parallel([
          Animated.spring(this.state.smoothlyAnimated, {
            toValue: 1,
            useNativeDriver: true,
            friction: 13,
            tension: 14
          }),
          Animated.spring(this.state.animated, {
            toValue: 1,
            friction: 13,
            tension: 14
          })
        ]).start(({ finished }) => finished && (this.animating = false))
    );
  };

  handleClose() {
    this.props.onCloseInput();
    Keyboard.dismiss();
    this.animating = true;
    Animated.parallel([
      Animated.spring(this.state.smoothlyAnimated, {
        toValue: 0,
        useNativeDriver: true
        // friction: 8,
        // tension: 14
      }),
      Animated.spring(this.state.animated, {
        toValue: 0
        // friction: 8,
        // tension: 14
      })
    ]).start(() => {
      this.setState(
        {
          selectedBtn: {},
          selectedIndex: -1,
          visibleInput: false
        },
        () => (this.animating = false)
      );
    });
  }

  renderButton() {
    return this.props.data.map((btn, index) => {
      const elementWidth = `${100 / this.props.data.length}%`;
      const extraStyle =
        index === this.state.selectedIndex
          ? {
              width: this.state.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [elementWidth, '100%']
              }),
              flex: 0
            }
          : {
              width: this.state.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [elementWidth, '0%']
              }),
              opacity: this.state.animated.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            };

      return (
        <Button
          containerStyle={extraStyle}
          key={index}
          title={btn.title}
          iconName={btn.iconName}
          first={index === 0}
          effectType={btn.effectType}
          onPress={() => this.handleOnPress(btn, index)}
        />
      );
    });
  }

  render() {
    const inputAnimatedStyle = {
      opacity: this.state.smoothlyAnimated.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 0, 1]
      }),
      transform: [
        {
          scaleY: this.state.smoothlyAnimated
        }
      ]
    };

    return (
      <View
        onLayout={this.props.onContainerLayout}
        style={[styles.wrapper, this.props.containerStyle]}
      >
        <View style={[styles.container, styles.shadow]}>
          {this.renderButton()}
        </View>
        <Animated.View
          style={[styles.secretContainer, inputAnimatedStyle]}
          pointerEvents={this.state.visibleInput ? 'auto' : 'none'}
        >
          {this.props.secretComponent}
          {!!!this.props.rightSecretComponent && (
            <TouchableOpacity
              onPress={this.handleClose.bind(this)}
              hitSlop={HIT_SLOP}
            >
              <Icon name="close" size={20} color="#a5a5a5" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  container: {
    borderRadius: 10,
    zIndex: 99,
    backgroundColor: '#c7c7cd',
    flexDirection: 'row',
    alignSelf: 'center',
    overflow: 'hidden'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  secretContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 999,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flexDirection: 'row'
  }
});

export default ComboHeaderButton;
