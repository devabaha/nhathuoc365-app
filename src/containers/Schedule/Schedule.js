import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScheduleDateTimePicker } from '../../components/Schedule';

class Schedule extends Component {
  state = {};
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <ScheduleDateTimePicker />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    padding: 15
    // flex: 1,
  }
});

export default Schedule;
