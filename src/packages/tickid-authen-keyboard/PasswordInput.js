import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

PasswordInput.propTypes = {
  value: PropTypes.string
};

PasswordInput.defaultProps = {
  value: ''
};

function PasswordInput(props) {
  const renderPasswordDots = () => {
    const dots = [];
    const passwordLength = `${props.value}`.length;
    for (let i = 0; i < 4; i++) {
      const isActive = i < passwordLength;
      dots.push(
        <View style={[styles.dot, isActive && styles.active]} key={i} />
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <View style={styles.passwordInputWrap}>{renderPasswordDots()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  passwordInputWrap: {
    width: 220,
    height: 50,
    borderRadius: 30,
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#ebebeb',
    marginHorizontal: 6
  },
  active: {
    backgroundColor: '#999'
  }
});

export default PasswordInput;
