import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from 'react-native';
import { ScheduleDateTimePicker } from '../../components/Schedule';
import SlotPicker from '../../components/Schedule/SlotPicker/SlotPicker';
import moment from 'moment';
import { DATE_FORMAT } from '../../components/Schedule/constants';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';

const SLOTS = [
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00',
  '9:00'
];
class Schedule extends Component {
  static defaultProps = {
    slots: SLOTS,
    slotMessage: 'Tất cả thời gian đều thuộc giờ Đông Dương',
    date: 'Ngày mai, 23 tháng 3'
  };
  state = {
    selectedDate: moment().format(DATE_FORMAT),
    titleSlotPicker: this.getTitleSlotPicker(moment().format(DATE_FORMAT))
  };

  capitalizeFirstLetter(string) {
    let newString = '';
    if (Array.isArray(string)) {
      newString = [];

      string.forEach(
        (str, index) =>
          (newString[index] = str.charAt(0).toUpperCase() + str.slice(1))
      );
      return newString.join(' ');
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getTitleSlotPicker(date) {
    const momentDate = moment(date);

    const prefix = momentDate.isSame(moment(), 'day')
      ? 'Hôm nay'
      : momentDate.isSame(moment().add(1, 'days'), 'day')
      ? 'Ngày mai'
      : momentDate.isSame(moment().subtract(1, 'days'), 'day')
      ? 'Hôm qua'
      : this.capitalizeFirstLetter(
          momentDate
            .locale('vi')
            .format('dddd')
            .split(' ')
        );

    return (
      prefix + ', ' + momentDate.date() + ' tháng ' + (momentDate.month() + 1)
    );
  }

  handlePressDate = selectedDate => {
    const titleSlotPicker = this.getTitleSlotPicker(selectedDate.fullDate);

    this.setState({
      selectedDate: selectedDate.fullDate,
      titleSlotPicker
    });
  };

  handlePressSlot(slot) {
    Actions.push(appConfig.routes.scheduleConfirm);
  }

  renderExtraMessage() {
    return (
      this.props.extraMessage && (
        <View style={styles.container}>
          <Text style={styles.extraMessageTitle}>
            {this.props.extraMessage.title}
          </Text>
          <Text style={styles.extraMessageContent}>
            {this.props.extraMessage.content}
          </Text>
        </View>
      )
    );
  }

  renderSlotPicker() {
    return (
      this.props.slots.length !== 0 && (
        <SlotPicker
          title={this.state.titleSlotPicker}
          slots={this.props.slots}
          message={this.props.slotMessage}
          onPress={this.handlePressSlot}
        />
      )
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScheduleDateTimePicker
          containerStyle={styles.dateTimePicker}
          onPress={this.handlePressDate}
          // date-format: YYYY-MM-DD
          selectedDate={this.state.selectedDate}
          // startDate (today) - (margin-left)
          startDate={'2020-03-07'}
          // endDate - (margin-right)
          endDate={'2020-05-01'}
          // disabledDates (flexile)
          disabledDates={[
            { start: '2020-04-03', end: '2020-04-06' },
            '2020-04-10',
            { start: '2020-04-11', end: '2020-04-12' }
          ]}
        />

        <ScrollView style={styles.slotPicker}>
          {this.renderExtraMessage()}

          {this.renderSlotPicker()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dateTimePicker: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#bababa',
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  slotPicker: {
    paddingHorizontal: 15
  },
  extraMessageTitle: {
    color: '#555'
  },
  extraMessageContent: {
    color: '#555',
    fontSize: 14
  }
});

export default Schedule;
