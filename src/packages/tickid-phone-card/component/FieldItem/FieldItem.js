import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

FieldItem.propTypes = {
  boldValue: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string
};

FieldItem.defaultProps = {
  boldValue: false,
  label: '',
  value: ''
};

function FieldItem(props) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.label}>{props.label}</Text>
      <Text style={[styles.value, props.boldValue && styles.boldValue]}>
        {props.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    minHeight: 32
  },
  label: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400'
  },
  value: {
    color: '#000',
    fontSize: 14,
    fontWeight: '400'
  },
  boldValue: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default FieldItem;
