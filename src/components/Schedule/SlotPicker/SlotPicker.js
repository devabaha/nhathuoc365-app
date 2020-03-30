import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SlotGridView } from './GridView';
import PropTypes from 'prop-types';

class SlotPicker extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {};

  render() {
    return (
      <View style={styles.container}>
        {!!this.props.title && (
          <Text style={[styles.box, styles.title]}>{this.props.title}</Text>
        )}
        <SlotGridView
          slots={this.props.slots}
          containerStyle={styles.box}
          onPress={this.props.onPress}
        />
        {!!this.props.message && (
          <Text style={[styles.box, styles.message]}>{this.props.message}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    marginTop: 15
  },
  title: {
    fontSize: 15
  },
  message: {
    fontSize: 13,
    color: '#6b6b6b'
  }
});

export default SlotPicker;
