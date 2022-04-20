import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {ScrollView, Typography, BaseButton} from 'src/components/base';

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
  valueContainerProps,
}) => {
  const {theme} = useTheme();

  const Wrapper = scrollable ? ScrollView : View;

  const rowItemStyle = useMemo(() => {
    return mergeStyles(styles.rowItem, {
      borderTopWidth: theme.layout.borderWidthPixel,
      borderTopColor: theme.color.border,
    });
  }, [theme]);

  return (
    <View style={rowItemStyle}>
      {renderRow || (
        <View style={[isColumn || styles.row]}>
          {!!label && (
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={[styles.rowLabel, labelStyle]}>
              {label}
            </Typography>
          )}
          <Wrapper {...valueContainerProps}>
            {(!!value || !!valueComponent) && (
              <BaseButton
                disabled={disabled}
                onPress={onPressValue}
                hitSlop={HIT_SLOP}>
                {valueComponent || (
                  <View style={valueContainerStyle}>
                    <Typography
                      type={TypographyType.LABEL_MEDIUM}
                      style={[styles.rowValue, valueStyle]}>
                      {value}
                    </Typography>
                  </View>
                )}
              </BaseButton>
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
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {},
  rowValue: {
    fontWeight: '500',
  },
});

export default Row;
