import React from 'react';
import {
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomComposer = props => {
  return props.showInput ? (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.containerInput]}
      onPress={props.onFocusInput}
    >
      <TextInput
        style={[styles.input]}
        ref={props.refInput}
        editable={props.editable}
        placeholder={props.placeholder}
        onChange={props.onTyping}
        multiline
        pointerEvents="none"
        onBlur={props.onBlurInput}
        value={props.value}
      />
    </TouchableOpacity>
  ) : (
    <Animated.View
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
    >
      <TouchableOpacity
        onPress={props.onBackPress}
        style={[
          styles.back,
          {
            width: props.btnWidth
          }
        ]}
      >
        <Icon name="angle-left" color="#404040" size={28} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerInput: {
    width: '100%',
    height: '100%',
    flex: 1,
    height: 44,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '100%',
    // height: '100%',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    color: '#404040',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerBack: {
    flex: 1,
    width: '100%',
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  back: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CustomComposer;
