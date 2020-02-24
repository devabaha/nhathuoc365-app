import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const NumberSelection = props => {
  const extraStyle = props.disabled ? styles.disabled : {};
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
    if (props.value >= props.max) {
      plusDisabled = true;
    }
  }
  return (
    <View style={[styles.container, props.containerStyle]}>
      <TouchableHighlight
        disabled={minusDisabled}
        hitSlop={HIT_SLOP}
        underlayColor="rgba(0,0,0,.2)"
        onPress={props.onMinus}
        style={[styles.btn, minusDisabled && styles.disabled]}
      >
        <Icon name="minus" style={[styles.icon, extraStyle]} />
      </TouchableHighlight>
      <View style={styles.textContainer}>
        <Text style={[styles.text, extraStyle]}>{props.value}</Text>
      </View>
      <TouchableHighlight
        disabled={plusDisabled}
        hitSlop={HIT_SLOP}
        underlayColor="rgba(0,0,0,.2)"
        onPress={props.onPlus}
        style={[styles.btn, plusDisabled && styles.disabled]}
      >
        <Icon name="plus" style={[styles.icon, extraStyle]} />
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    flexDirection: 'row',
    width: 100
  },
  textContainer: {
    borderColor: '#d9d9d9',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1
  },
  text: {
    color: DEFAULT_COLOR,
    textAlign: 'center'
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  icon: {
    color: '#8c8c8c',
    fontSize: 16
  },
  disabled: {
    opacity: 0.3
  }
});

export default NumberSelection;
