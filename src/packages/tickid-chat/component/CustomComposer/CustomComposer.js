import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  View,
  Platform
} from 'react-native';
import { MIN_HEIGHT_COMPOSER } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

class CustomComposer extends PureComponent {
  state = {};
  contentSize = undefined;
  onContentSizeChange = e => {
    const { contentSize } = e.nativeEvent;
    // Support earlier versions of React Native on Android.
    if (!contentSize) {
      return;
    }
    if (
      !this.contentSize ||
      (this.contentSize &&
        (this.contentSize.width !== contentSize.width ||
          this.contentSize.height !== contentSize.height))
    ) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  };
  onChangeText = text => {
    this.props.onTyping(text);
    this.props.onTextChanged(text);
  };

  render() {
    const props = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            height: props.composerHeight
          }
        ]}
      >
        {props.showInput ? (
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.containerInput]}
            onPress={props.onFocusInput}
          >
            <View
              pointerEvents={props.editable ? 'auto' : 'none'}
              style={[styles.containerInput]}
            >
              <TextInput
                style={[styles.input]}
                ref={props.refInput}
                placeholder={props.placeholder}
                onChange={props.onTyping}
                multiline
                onBlur={props.onBlurInput}
                value={props.value}
                onChange={this.onContentSizeChange}
                onContentSizeChange={this.onContentSizeChange}
                onChangeText={this.onChangeText}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <Animated.View
            onStartShouldSetResponder={() => true}
            style={[
              styles.containerBack,
              {
                opacity: props.animatedBtnBackValue,
                transform: [
                  {
                    scale: props.animatedBtnBackValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 1]
                    })
                  }
                ]
              }
            ]}
          ></Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: MIN_HEIGHT_COMPOSER
  },
  containerInput: {
    width: '100%',
    minHeight: MIN_HEIGHT_COMPOSER,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#404040'
  }
});

export default CustomComposer;
