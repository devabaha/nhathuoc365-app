import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

FieldItem.propTypes = {
  boldValue: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FieldItem.defaultProps = {
  boldValue: false,
  label: '',
  value: '',
};

function FieldItem(props) {
  const {theme} = useTheme();

  const boldValue = useMemo(() => {
    return mergeStyles(
      styles.boldValue,
      theme.typography[TypographyType.LABEL_SEMI_HUGE],
    );
  }, [theme]);

  return (
    <View style={styles.fieldWrapper}>
      <Typography
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        style={styles.label}>
        {props.label}
      </Typography>
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        style={[styles.value, props.boldValue && boldValue]}>
        {props.value}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    minHeight: 32,
  },
  label: {},
  value: {},
  boldValue: {
    fontWeight: 'bold',
  },
});

export default FieldItem;
