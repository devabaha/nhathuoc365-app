import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

FieldItemWrapper.propTypes = {
  children: PropTypes.node,
  separate: PropTypes.bool
};

FieldItemWrapper.defaultProps = {
  children: null,
  separate: false
};

function FieldItemWrapper(props) {
  return (
    <View style={[styles.wrapper, props.separate && styles.separate]}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8
  },
  separate: {
    paddingBottom: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
});

export default FieldItemWrapper;
