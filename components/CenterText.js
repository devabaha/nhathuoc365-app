/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CenterText extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: this.props.fontSize || 14,
            color: this.props.color || '#404040',
            marginTop:
              this.props.marginTop != undefined
                ? this.props.marginTop
                : -NAV_HEIGHT / 2,
            textAlign: 'center'
            // lineHeight: 20
          }}
        >
          {this.props.showIcon && (
            <Icon name="smile-o" size={28} color={DEFAULT_COLOR} />
          )}
          {this.props.showIcon && '\n\n'}
          {this.props.title || 'Vui lòng nhập text'}
        </Text>
      </View>
    );
  }
}

CenterText.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  marginTop: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
