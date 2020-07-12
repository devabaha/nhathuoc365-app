import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const Row = ({
  isColumn = false,
  disabled = true,
  label,
  labelStyle,
  value,
  valueComponent,
  valueStyle,
  extraComponent,
  onPressValue
}) => {
  return (
    <View style={[styles.rowItem]}>
      <View style={[isColumn || styles.row]}>
        {!!label && <Text style={[styles.rowLabel, labelStyle]}>{label}</Text>}
        {(!!value || !!valueComponent) && (
          <TouchableOpacity
            disabled={disabled}
            onPress={onPressValue}
            hitSlop={HIT_SLOP}
          >
            {valueComponent || (
              <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      {extraComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  rowItem: {
    // flexGrow: 1,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    padding: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowLabel: {
    color: '#666'
  },
  rowValue: {
    color: '#333',
    fontWeight: '500'
  }
});

export default Row;
