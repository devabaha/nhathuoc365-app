import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {Calendar} from 'react-native-calendars';
import getCalendarHeaderStyle from 'react-native-calendars/src/calendar/header/style';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// custom components
import {ScreenWrapper, ScrollView, TypographyType} from 'src/components/base';

class CalendarsScreen extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    current: PropTypes.any,
    onSelected: PropTypes.func,
    minDate: PropTypes.string,
  };

  static defaultProps = {
    current: dateHandler().current,
    onSelected: (value) => value,
    minDate: dateHandler().current,
  };

  state = {
    selected: this.props.current,
  };

  get theme() {
    return getTheme(this);
  }

  _onDayPress(day) {
    console.log(day);
    this.setState(
      {
        selected: day.dateString,
      },
      () => {
        if (this.props.onSelected) {
          this.props.onSelected(this.state.selected, day);
        }
        pop();
      },
    );
  }

  render() {
    const {current, minDate} = this.props;

    return (
      <ScreenWrapper>
        <ScrollView style={styles.container}>
          <Calendar
            theme={{
              calendarBackground: this.theme.color.background,
              textSectionTitleColor: this.theme.color.textTertiary,
              selectedDayBackgroundColor: this.theme.color.primaryHighlight,
              selectedDayTextColor: this.theme.color.onBackground,
              todayTextColor: this.theme.color.accent2,
              selectedDayTextColor: this.theme.color.onPrimaryHighlight,
              dayTextColor: this.theme.color.onBackground,
              textDisabledColor: this.theme.color.textInactive,
              arrowColor: this.theme.color.primaryHighlight,
              monthTextColor: this.theme.color.onBackground,
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayFontSize: this.theme.typography[
                TypographyType.LABEL_LARGE_TERTIARY
              ].fontSize,
              'stylesheet.calendar.header': {
                dayHeader: {
                  ...getCalendarHeaderStyle().dayHeader,
                  width: 40,
                  ...this.theme.typography[TypographyType.LABEL_LARGE_TERTIARY],
                },
              },
            }}
            current={current}
            onDayPress={this._onDayPress.bind(this)}
            style={styles.calendar}
            hideExtraDays
            markedDates={{
              [this.state.selected]: {selected: true},
            }}
            minDate={minDate}
            enableSwipeMonths
          />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    paddingTop: 5,
    height: 350,
  },
  container: {
    flex: 1,
  },
});

export default CalendarsScreen;
