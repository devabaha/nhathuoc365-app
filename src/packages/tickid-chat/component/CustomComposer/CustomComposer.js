import React from 'react';
import {
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet
} from 'react-native';
import { MIN_HEIGHT_COMPOSER, isIos } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomComposer = props => {
  const inputProps = isIos
    ? { pointerEvents: props.editable ? 'auto' : 'none' }
    : { editable: props.editable };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // transform: [
          //   {
          //     translateY: props.animatedValue
          //   }
          // ]
        }
      ]}
    >
      {props.showInput ? (
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.containerInput]}
          onPress={props.onFocusInput}
        >
          <TextInput
            style={[styles.input]}
            ref={props.refInput}
            placeholder={props.placeholder}
            onChange={props.onTyping}
            multiline
            onBlur={props.onBlurInput}
            value={props.value}
            {...inputProps}
          />
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
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    height: MIN_HEIGHT_COMPOSER
  },
  containerInput: {
    width: '100%',
    height: '100%',
    flex: 1,
    height: MIN_HEIGHT_COMPOSER,
    // zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '100%',
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
    height: MIN_HEIGHT_COMPOSER,
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
