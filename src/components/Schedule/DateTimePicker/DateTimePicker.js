import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from 'react-native';
import moment from 'moment';
import momentVI from 'moment/locale/vi';
import Icon from 'react-native-vector-icons/FontAwesome';
import appConfig from 'app-config';
import { DAY_NAME_IN_WEEK, DATE_FORMAT } from '../constants';

moment.locale('vi', momentVI);

class DateTimePicker extends Component {
  firstDate = moment().day(0);
  state = {
    selectedDate: moment(),
    today: moment(),
    dates: this.getDates(),
    factor: 0,
    componentWidth: 0
  };

  getDates(factor = 0, dates = []) {
    for (let i = factor * 7; i < 7 * (1 + factor); i++) {
      dates.push(moment().day(i));
    }

    return dates;
  }

  get selectedYear() {
    return this.state.selectedDate.format('YYYY');
  }

  get selectedMonth() {
    return this.state.selectedDate.format('MMMM');
  }

  get selectedFullDate() {
    return this.state.selectedDate.format(DATE_FORMAT);
  }

  get selectedDate() {
    return this.state.selectedDate.format('DD');
  }

  componentDidMount() {}

  handlePressDate = () => {};

  onLayout = e => {
    this.setState({ componentWidth: e.nativeEvent.layout.width });
  };

  loadMoreDate() {
    const newFactor = this.state.factor + 1;
    const currentDates = [...this.state.dates];
    const newDates = this.getDates(newFactor, currentDates);

    this.setState({
      factor: newFactor,
      dates: newDates
    });
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Icon name="angle-left" style={styles.icon} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {this.selectedMonth}, {this.selectedYear}
        </Text>

        <TouchableOpacity>
          <Icon name="angle-right" style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  renderDayInWeek() {
    return DAY_NAME_IN_WEEK.map((dayName, index) => {
      return (
        <Text key={index} style={styles.subTitle}>
          {dayName}
        </Text>
      );
    });
  }

  renderDateItem({ item: date, index }) {
    const isDisabled = date < this.state.today;
    const notSundayAndSartuday =
      (index + 1) % 7 !== 1 && (index + 1) % 7 !== 0 && index !== 0;
    const distance = (this.state.componentWidth - 10 * 7) / 6;
    const extraStyle = {
      marginHorizontal: notSundayAndSartuday ? distance : 0
    };
    return (
      <TouchableWithoutFeedback onPress={this.handlePressDate}>
        <Text
          style={[styles.text, isDisabled && styles.textDisabled, extraStyle]}
        >
          {date.format('DD')}
        </Text>
      </TouchableWithoutFeedback>
    );
  }

  renderDate() {
    return (
      <FlatList
        contentContainerStyle={styles.dateContentContainer}
        horizontal
        data={this.state.dates}
        renderItem={this.renderDateItem.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={this.loadMoreDate.bind(this)}
        onEndReachedThreshold={1}
      />
    );
  }

  renderCalendar() {
    return (
      <View style={styles.bodyContainer}>
        <View style={styles.dayNameContainer}>{this.renderDayInWeek()}</View>
        <View style={styles.dateContainer}>{this.renderDate()}</View>
      </View>
    );
  }

  render() {
    // console.log(moment().add(19, 'd').day(1).date());

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        {this.renderHeader()}
        {this.renderCalendar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1
  },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  icon: {
    fontSize: 30,
    color: '#242424'
  },
  bodyContainer: {},
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    color: appConfig.colors.text
  },
  dayNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  subTitle: {
    textTransform: 'uppercase',
    fontSize: 16,
    // fontWeight: '300',
    color: '#666'
  },
  dateContainer: {
    paddingVertical: 20
  },
  dateContentContainer: {
    // justifyContent: 'space-between',
  },
  text: {
    textTransform: 'uppercase',
    fontSize: 18,
    color: '#242424'
  },
  textDisabled: {
    color: '#aaa'
  }
});

export default DateTimePicker;
