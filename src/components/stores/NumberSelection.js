import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import {Container, IconButton, Input} from 'src/components/base';

const NumberSelection = (props) => {
  const {theme} = useTheme();

  const isValueAsNumber = !isNaN(props.value);
  let disabled = props.disabled;
  let minusDisabled = disabled;
  let plusDisabled = disabled;
  if (!isValueAsNumber) {
    disabled = true;
  } else {
    if (props.value <= props.min) {
      minusDisabled = true;
    }
    if (
      props.max !== null && props.max !== undefined
        ? props.value >= props.max
        : false
    ) {
      plusDisabled = true;
    }
  }

  const containerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          borderWidth: theme.layout.borderWidth,
          borderColor: theme.color.border,
        },
      ],
      props.containerStyle,
    );
  }, [props.containerStyle, theme]);

  const textContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.textContainer,
        {
          borderLeftWidth: theme.layout.border,
          borderRightWidth: theme.layout.border,
          borderColor: theme.color.border,
        },
      ],
      props.textContainer,
    );
  }, [props.textContainer, theme]);

  const inputStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.text,
        {
          color: theme.color.primaryHighlight,
        },
      ],
      props.disabled && styles.disabled,
    );
  }, [props.disabled, theme]);

  return (
    <Container style={containerStyle}>
      <IconButton
        useTouchableHighlight
        bundle={BundleIconSetName.ANT_DESIGN}
        disabled={minusDisabled}
        hitSlop={HIT_SLOP}
        onPress={props.onMinus}
        style={styles.btn}
        name="minus"
        iconStyle={styles.icon}
      />
      <View style={textContainerStyle}>
        <Input
          editable={!props.disabled}
          style={inputStyle}
          value={'  ' + props.value.toString()}
          keyboardType="number-pad"
          onChangeText={props.onChangeText}
          onBlur={props.onBlur}
        />
      </View>
      <IconButton
        useTouchableHighlight
        bundle={BundleIconSetName.ANT_DESIGN}
        disabled={plusDisabled}
        hitSlop={HIT_SLOP}
        onPress={props.onPlus}
        style={styles.btn}
        name="plus"
        iconStyle={styles.icon}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100,
    height: 30,
  },
  textContainer: {
    paddingVertical: 0,
    marginVertical: 0,
    flex: 1,
  },
  text: {
    textAlign: 'center',
    height: '100%',
    padding: 0,
    paddingHorizontal: 5,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  icon: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default NumberSelection;
