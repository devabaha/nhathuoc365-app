import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// customs components
import {SlotGridView} from './GridView';
import {Typography} from 'src/components/base';

class SlotPicker extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {};

  render() {
    return (
      <View style={styles.container}>
        {!!this.props.title && (
          <Typography
            type={TypographyType.LABEL_MEDIUM}
            style={[styles.box, styles.title]}>
            {this.props.title}
          </Typography>
        )}
        <SlotGridView
          slots={this.props.slots}
          containerStyle={styles.box}
          onPress={this.props.onPress}
        />
        {!!this.props.message && (
          <Typography
            type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
            style={[styles.box, styles.message]}>
            {this.props.message}
          </Typography>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    marginTop: 15,
  },
  title: {
    fontSize: 15,
  },
  message: {},
});

export default SlotPicker;
