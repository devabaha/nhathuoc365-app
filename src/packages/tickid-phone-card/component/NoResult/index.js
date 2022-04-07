import React from 'react';
import {View, StyleSheet, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

function NoResult(props) {
  return (
    <View style={[styles.noResultWrapper, props.style]}>
      <Typography
        type={TypographyType.TITLE_SEMI_LARGE}
        style={styles.noResultTitle}>
        {props.title}
      </Typography>
      <Typography
        type={TypographyType.TITLE_MEDIUM_TERTIARY}
        style={styles.noResultText}>
        {props.text}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  noResultWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  noResultTitle: {
    fontWeight: '600',
  },
  noResultText: {
    fontWeight: '400',
    marginTop: 8,
  },
});

NoResult.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

export default NoResult;
