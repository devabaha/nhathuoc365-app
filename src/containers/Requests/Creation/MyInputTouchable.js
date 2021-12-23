import React from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {compose} from 'recompose';
import {handleTextInput} from 'react-native-formik';
// custom components
import FloatingLabelInput from 'src/components/FloatingLabelInput';
import {BaseButton, Container} from 'src/components/base';
import Image from 'src/components/Image';

const MyInput = compose(handleTextInput)(FloatingLabelInput);

const MyInputTouchable = ({
  onPress,
  label,
  name,
  type,
  onFocus,
  value,
  style,
  uri,
  ...props
}) => {
  return (
    <BaseButton onPress={() => onPress(name)}>
      <View style={[styles.inputTouchableWrapper, style]} pointerEvents="none">
        <MyInput
          label={label}
          name={name}
          type={type}
          onFocus={onFocus}
          value={value}
          containerStyle={[{flex: 1}]}
          {...props}
        />
        {!!uri && (
          <Container style={styles.imageContainer}>
            <Image source={{uri}} style={styles.image} />
          </Container>
        )}
      </View>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputTouchableWrapper: {
    flexDirection: 'row',
  },
});

export default MyInputTouchable;
