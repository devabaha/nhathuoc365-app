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
    slotMessage: ''
  };
  state = {
    selectedDate: moment().format(DATE_FORMAT),
    titleSlotPicker: this.getTitleSlotPicker(moment().format(DATE_FORMAT))
  };

  diffTime(time1, time2 = moment()) {
    if (!moment(time1).diff(time2)) return '';
    let diffMess = '';
    const yearsDiff = moment(time1).diff(time2, 'years');
    const monthsDiff = moment(time1).diff(time2, 'months');
    const weeksDiff = moment(time1).diff(time2, 'weeks');
    const daysDiff = moment(time1).diff(time2, 'days');
    const hoursDiff = moment(time1).diff(time2, 'hours');
    const minutesDiff = moment(time1).diff(time2, 'minutes');

    if (yearsDiff) {
      diffMess = yearsDiff + ' năm từ ';
    } else if (monthsDiff) {
      diffMess = monthsDiff + ' tháng từ ';
    } else if (weeksDiff) {
      diffMess = weeksDiff + ' tuần từ ';
    } else if (daysDiff) {
      diffMess = daysDiff + ' ngày từ ';
    } else if (hoursDiff) {
      diffMess = hoursDiff + ' giờ từ ';
    } else {
      diffMess = minutesDiff + ' phút từ ';
    }

    if (diffMess) {
      const [diffTime, affix] = diffMess.split(' ');
      if (diffTime < 0) {
        diffMess = `Đã trễ ${Math.abs(diffTime)} ${affix}`;
      } else {
        diffMess += 'bây giờ';
      }
    } else {
      diffMess = 'bây giờ';
    }
    return diffMess;
  }

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
    const { t, i18n } = this.props;

    const prefix = momentDate.isSame(moment(), 'day')
      ? t('prefix.today')
      : momentDate.isSame(moment().add(1, 'days'), 'day')
      ? t('prefix.tomorrow')
      : momentDate.isSame(moment().subtract(1, 'days'), 'day')
      ? t('prefix.yesterday')
      : this.capitalizeFirstLetter(
          momentDate
            .locale(i18n.language)
            .format('dddd')
            .split(' ')
        );

    return prefix + ', ' + momentDate.format('DD MMMM');
  }

  handlePressDate = selectedDate => {
    const titleSlotPicker = this.getTitleSlotPicker(selectedDate.fullDate);

    this.setState({
      selectedDate: selectedDate.fullDate,
      titleSlotPicker
    });
  };

  handlePressSlot(slot) {
    Actions.push(appConfig.routes.scheduleConfirm, {
      date: this.state.titleSlotPicker,
      // dateDescription: '1 giờ từ bây giờ (from server - FS)',
      dateDescription: this.diffTime(`${this.state.selectedDate} ${slot}`),
      timeRange: slot,
      // timeRangeDescription: 'Khoảng thời gian không cố định (FS)',
      appointmentName: 'Tick ID',
      description: ''
      // 'Tick ID sẽ nhìn thấy tên tài khoản của bạn để có thể liên hệ với bạn. (FS)',
      // btnMessage: 'Doanh nghiệp thường trả lời trong vòng vài phút (FS)'
    });
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
          onPress={this.handlePressSlot.bind(this)}
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
          startDate={'2020-11-01'}
          // endDate - (margin-right)
          endDate={'2020-11-20'}
          // disabledDates (flexible)
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
    flex: 1,
    backgroundColor: '#fff'
  },
  dateTimePicker: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#bababa',
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  slotPicker: {
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5'
  },
  extraMessageTitle: {
    color: '#555'
  },
  extraMessageContent: {
    color: '#555',
    fontSize: 14
  }
});

export default withTranslation('schedule')(Schedule);
