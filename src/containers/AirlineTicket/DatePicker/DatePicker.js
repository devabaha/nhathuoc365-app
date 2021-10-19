import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import PropTypes from 'prop-types';

import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  dayNames: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
};

LocaleConfig.defaultLocale = 'vi';

class CalendarsScreen extends Component {
  static propTypes = {
    current: PropTypes.any,
    onSelected: PropTypes.func,
    minDate: PropTypes.string
  }

  static defaultProps = {
    current: dateHandler().current,
    onSelected: value => value,
    minDate: dateHandler().current
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: props.current
    };
  }

  _onDayPress(day) {
    console.log(day)
    this.setState({
      selected: day.dateString
    }, () => {
      if (this.props.onSelected) {
        this.props.onSelected(this.state.selected, day);
      }
      Actions.pop();
    });
  }

  render() {
    var { current, minDate } = this.props;

    return (
      <ScrollView style={styles.container}>
        <Calendar
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2d4150',
            selectedDayBackgroundColor: appConfig.colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: appConfig.colors.primary,
            selectedDayTextColor: '#fff',
            dayTextColor: '#2d4150',
            textDisabledColor: '#ccc',
            dotColor: appConfig.colors.primary,
            selectedDotColor: '#ffffff',
            arrowColor: appConfig.colors.primary,
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          current={current}
          onDayPress={this._onDayPress.bind(this)}
          style={styles.calendar}
          hideExtraDays
          markedDates={{
            [this.state.selected]: {selected: true}
          }}
          minDate={minDate}
          enableSwipeMonths
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    paddingTop: 5,
    height: 350
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
export default CalendarsScreen;