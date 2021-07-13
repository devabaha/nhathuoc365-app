import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import PropTypes from 'prop-types';

// librarys
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Actions, ActionConst } from 'react-native-router-flux';

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  monthNamesShort: ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'],
  dayNames: ['CN','TH 2','TH 3','TH 4','TH 5','TH 6','TH 7'],
  dayNamesShort: ['CN','TH 2','TH 3','TH 4','TH 5','TH 6','TH 7']
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

  render() {
    var { current, minDate } = this.props;

    return (
      <ScrollView style={styles.container}>
        <Calendar
          current={current}
          onDayPress={this._onDayPress.bind(this)}
          style={styles.calendar}
          hideExtraDays
          markedDates={{
            [this.state.selected]: {selected: true}
          }}
          minDate={minDate}
        />
      </ScrollView>
    );
  }

  _onDayPress(day) {
    this.setState({
      selected: day.dateString
    }, () => {
      if (this.props.onSelected) {
        this.props.onSelected(this.state.selected);
      }
      Actions.pop();
    });
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