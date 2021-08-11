import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView
} from 'react-native';

const Row = ({
  isColumn = false,
  disabled = true,
  label,
  labelStyle,
  value,
  valueComponent,
  valueContainerStyle,
  valueStyle,
  extraComponent,
  onPressValue,
  renderRow,
  scrollable = false,
  valueContainerProps
}) => {
  const Wrapper = scrollable ? ScrollView : View;
  return (
    <View style={[styles.rowItem]}>
      {renderRow || (
        <View style={[isColumn || styles.row]}>
          {!!label && (
            <Text style={[styles.rowLabel, labelStyle]}>{label}</Text>
          )}
          <Wrapper {...valueContainerProps}>
            {(!!value || !!valueComponent) && (
              <TouchableOpacity
                disabled={disabled}
                onPress={onPressValue}
                hitSlop={HIT_SLOP}
              >
                {valueComponent || (
                  <View style={valueContainerStyle}>
                    <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </Wrapper>
        </View>
      )}
      {extraComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  rowItem: {
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
