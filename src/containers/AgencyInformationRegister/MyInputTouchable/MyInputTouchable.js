import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {compose} from 'recompose';
import {
  handleTextInput,
  withNextInputAutoFocusInput,
} from 'react-native-formik';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {BaseButton} from 'src/components/base';
import FloatingLabelInput from 'src/components/FloatingLabelInput';
import Image from 'src/components/Image';

const MyInput = compose(
  handleTextInput,
  withNextInputAutoFocusInput,
)(FloatingLabelInput);

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
  const {theme} = useTheme();

  const imageContainerStyle = useMemo(() => {
    return mergeStyles(styles.imageContainer, {
      borderRadius: theme.layout.borderRadiusMedium,
    });
  }, [theme]);

  return (
    <BaseButton onPress={() => onPress(name)}>
      <View style={[styles.inputTouchableWrapper, style]} pointerEvents="none">
        <MyInput
          label={label}
          name={name}
          type={type}
          onFocus={onFocus}
          value={value}
          containerStyle={styles.inputContainer}
          {...props}
        />
        {!!uri && (
          <View style={imageContainerStyle}>
            <Image source={{uri}} style={styles.image} />
          </View>
        )}
      </View>
    </BaseButton>
  );
};

export default memo(MyInputTouchable);

const styles = StyleSheet.create({
  inputTouchableWrapper: {
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
  },
  imageContainer: {
    width: 50,
    height: 50,
    marginRight: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
