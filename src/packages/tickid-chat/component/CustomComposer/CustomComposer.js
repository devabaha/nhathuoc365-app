import React, {PureComponent} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
// constants
import {MIN_HEIGHT_COMPOSER} from '../../constants';
// custom components
import {Container, Input, BaseButton} from 'src/components/base';

class CustomComposer extends PureComponent {
  static defaultProps = {
    onInputSizeChanged: () => {},
    onTextChanged: () => {},
    onKeyPress: () => {},
  };
  state = {};
  contentSize = undefined;

  componentDidMount() {
    this.props.autoFocus && this.props.onFocusInput();
  }

  onContentSizeChange = (e) => {
    const {contentSize} = e.nativeEvent;
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
  onChangeText = (text) => {
    this.props.onTyping(text);
    this.props.onTextChanged(text);
  };

  render() {
    const props = this.props;
    return (
      <Container
        style={[
          styles.container,
          {
            height: props.composerHeight,
          },
        ]}>
        {props.showInput ? (
          <BaseButton
            activeOpacity={1}
            style={styles.containerInput}
            onPress={props.onFocusInput}>
            <View
              pointerEvents={props.editable ? 'auto' : 'none'}
              style={styles.containerInput}>
              <Input
                style={styles.input}
                ref={props.refInput}
                placeholder={props.placeholder}
                onChange={props.onTyping}
                multiline
                onBlur={props.onBlurInput}
                value={props.value}
                onChange={this.onContentSizeChange}
                onContentSizeChange={this.onContentSizeChange}
                onChangeText={this.onChangeText}
                onKeyPress={this.props.onKeyPress}
              />
            </View>
          </BaseButton>
        ) : (
          <Animated.View
            onStartShouldSetResponder={() => true}
            style={{
              opacity: props.animatedBtnBackValue,
              transform: [
                {
                  scale: props.animatedBtnBackValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.2, 1],
                  }),
                },
              ],
            }}></Animated.View>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    minHeight: MIN_HEIGHT_COMPOSER,
  },
  containerInput: {
    width: '100%',
    minHeight: MIN_HEIGHT_COMPOSER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default CustomComposer;
