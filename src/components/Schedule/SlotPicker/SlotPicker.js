import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import {SlotGridView} from './GridView';

class SlotPicker extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {};

  render() {
    return (
      <View style={styles.container}>
        {!!this.props.title && (
          <Typography type={TypographyType.LABEL_SEMI_LARGE} style={styles.box}>
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
            type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
            style={styles.box}>
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
});

export default SlotPicker;
