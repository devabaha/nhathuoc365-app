import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Block from './Block';
import { SUB_COLOR } from '../constants';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  rulesTitle: {
    color: SUB_COLOR
  }
});

class Body extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <Block
          title="Thể lệ game"
          content={this.props.rules}
          iconName="balance-scale"
          titleStyle={styles.rulesTitle}
          iconStyle={styles.rulesTitle}
        />
        <Block
          title="Cơ cấu giải thưởng"
          content={this.props.prize}
          iconName="gifts"
        />
      </View>
    );
  }
}

export default Body;
