import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, ViewPropTypes } from 'react-native';
import Button from 'react-native-button';
import config from '../../config';

SubmitButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: ViewPropTypes.style,
  iconSource: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
      headers: PropTypes.objectOf(PropTypes.string)
    }),
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        headers: PropTypes.objectOf(PropTypes.string)
      })
    )
  ])
};

SubmitButton.defaultProps = {
  onPress: () => {},
  title: 'Nhãn mặc định',
  style: undefined,
  iconSource: undefined
};

function SubmitButton(props) {
  return (
    <View style={[styles.submitWrapper, props.style]}>
      <Button containerStyle={styles.submitBtn} onPress={props.onPress}>
        {!!props.iconSource && (
          <Image style={styles.icon} source={props.iconSource} />
        )}
        <Text style={styles.submitTitle}>{props.title}</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  submitWrapper: {
    backgroundColor: config.colors.white,
    height: 62,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  submitBtn: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
    position: 'relative',
    top: -2
  }
});

export default SubmitButton;
