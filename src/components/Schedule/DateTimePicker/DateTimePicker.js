import React, {Component} from 'react';
import {View, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import moment from 'moment';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {DAY_NAME_IN_WEEK, DATE_FORMAT} from '../constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Day from './Day';
import {
  BaseButton,
  FlatList,
  Typography,
  Icon,
  Container,
} from 'src/components/base';

class DateTimePicker extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    containerStyle: PropTypes.object,
    componentPaddingHorizontal: PropTypes.number,
    minWidthDate: PropTypes.number,
    selectedDate: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    disabledDates: PropTypes.array,
  };

  static defaultProps = {
    containerStyle: {},
    componentPaddingHorizontal: 15,
    minWidthDate: 23,
    selectedDate: moment().format(DATE_FORMAT),
    startDate: moment().format(DATE_FORMAT),
    endDate: null,
    disabledDates: [],
  };

  state = {
    selectedDate: this.createDateObj(
      this.props.selectedDate,
      this.props.startDate,
      this.props.endDate,
      this.props.disabledDates,
    ),
    dates: this.getDates(
      this.props.startDate,
      this.props.endDate,
      this.props.disabledDates,
    ),
    factor: 0,
    selectedWeekIndex: 0,
    componentWidth: 0,
    animatedPrevious: new Animated.Value(0),
    animatedNext: new Animated.Value(0),
  };
  refDayFlatList = React.createRef();

  get theme() {
    return getTheme(this);
  }

  getDefaultDates(selectedDate, startDate, endDate, disabledDates) {
    let dates = [],
      factor = 0;
    const momentSelectedDate = moment(selectedDate);
    const momentStartDate = moment(startDate);

    const diffWeek =
      momentSelectedDate.diff(
        momentStartDate.day(momentSelectedDate.weekday()),
        'days',
      ) / 7;

    for (let i = 0; i < Math.abs(diffWeek) + 1; i++) {
      factor = i;
      dates = this.getDates(startDate, endDate, disabledDates, factor, dates);
    }

    const selectedWeekIndex = this.getWeekIndexByDate(dates, {
      fullDate: selectedDate,
    });

    this.setState(
      {
        dates,
        selectedWeekIndex,
        factor,
      },
      () => {
        setTimeout(() => {
          if (this.refDayFlatList.current) {
            this.refDayFlatList.current.scrollToIndex({
              index: selectedWeekIndex,
              animated: true,
            });
          }
        }, 300);
      },
    );
  }

  componentDidMount() {
    this.getDefaultDates(
      this.state.selectedDate.fullDate,
      this.props.startDate,
      this.props.endDate,
      this.props.disabledDates,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.selectedWeekIndex !== this.state.selectedWeekIndex) {
      const selectedDateInNewWeek =
        nextState.dates[nextState.selectedWeekIndex][
          nextState.selectedDate.dayInWeek
        ];

      if (!selectedDateInNewWeek.isDisabled) {
        this.handlePressDate(selectedDateInNewWeek);
      } else {
        const newSelectedDate = this.getClosetEnabledDate(
          nextState.dates[nextState.selectedWeekIndex],
          nextState.selectedDate,
        );

        this.handlePressDate(newSelectedDate);
      }
    }

    if (
      nextProps.startDate !== this.props.startDate ||
      nextProps.endDate !== this.props.endDate ||
      JSON.stringify(nextProps.disabledDates) !==
        JSON.stringify(this.props.disabledDates)
    ) {
      const newState = this.updateDates(
        nextProps.startDate,
        nextProps.endDate,
        nextState.selectedDate,
        nextProps.disabledDates,
        nextState.dates,
        nextProps.startDate !== this.props.startDate,
        nextProps.endDate !== this.props.endDate,
      );

      this.setState(newState, () => {
        this.handlePressDate(newState.selectedDate);
        setTimeout(() => {
          if (this.refDayFlatList.current) {
            this.refDayFlatList.current.scrollToIndex({
              index: newState.selectedWeekIndex,
              animated: false,
            });
          }
        }, 500);
      });
    }

    if (nextProps.selectedDate !== this.props.selectedDate) {
      this.setState({
        selectedDate: this.createDateObj(
          nextProps.selectedDate,
          nextProps.startDate,
          nextProps.endDate,
          nextProps.disabledDates,
        ),
      });
    }

    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }
    return false;
  }

  updateDates(
    startDate,
    endDate,
    selectedDate,
    disabledDates,
    stateDates,
    isUpdateStartDate,
    isUpdateEndDate,
    today = moment().format(DATE_FORMAT),
  ) {
    let dates = [];
    let newWeekOfSelectedDate = [];

    if (isUpdateStartDate && isUpdateEndDate) {
      dates = this.getDates(startDate, endDate, disabledDates, 0);
    } else if (isUpdateStartDate) {
      const diffWeek =
        selectedDate.momentDate.diff(
          moment(startDate).day(selectedDate.dayInWeek),
          'days',
        ) / 7;
      for (let i = 0; i < Math.abs(diffWeek) + 1; i++) {
        const newWeek = this.getDates(startDate, endDate, disabledDates, i)[0];
        dates.push(newWeek);

        if (newWeek.find((date) => date.fullDate === selectedDate.fullDate)) {
          newWeekOfSelectedDate = newWeek;
        }
      }
    } else if (isUpdateEndDate) {
      stateDates.forEach((week, index) => {
        if (week[0].momentDate.isSameOrAfter(moment(endDate), 'day')) {
          return true;
        }

        const newWeek = this.getDates(
          startDate,
          endDate,
          disabledDates,
          index,
        )[0];
        dates.push(newWeek);

        if (newWeek.find((date) => date.fullDate === selectedDate.fullDate)) {
          newWeekOfSelectedDate = newWeek;
        }
      });
    }

    let newSelectedDate = null;
    let isTodayInRange = !this.checkDateDisabled(
      moment(today),
      moment(startDate),
      moment(endDate),
      disabledDates,
    );

    let isSelectedDateInRange = false;
    if (selectedDate) {
      isSelectedDateInRange = !this.checkDateDisabled(
        selectedDate.momentDate,
        moment(startDate),
        moment(endDate),
        disabledDates,
      );
    }

    if (isSelectedDateInRange) {
      newSelectedDate = selectedDate;
    } else if (selectedDate) {
      if (newWeekOfSelectedDate.length === 0) {
        newWeekOfSelectedDate = this.getClosetEnabledWeek(dates, selectedDate);
      }
      newSelectedDate = this.getClosetEnabledDate(
        newWeekOfSelectedDate,
        selectedDate,
      );
    } else if (isTodayInRange) {
      newSelectedDate = this.createDateObj(
        today,
        startDate,
        endDate,
        disabledDates,
      );
    } else {
      newSelectedDate = dates[0][0];
    }

    const newSelectedWeekIndex = this.getWeekIndexByDate(
      dates,
      newSelectedDate,
    );

    return {
      selectedDate: newSelectedDate,
      dates,
      factor: dates.length - 1,
      selectedWeekIndex: newSelectedWeekIndex,
    };
  }

  checkDateDisabled(momentDate, momentStartDate, momentEndDate, disabledDates) {
    return (
      !(
        momentDate.isSame(momentStartDate, 'day') ||
        momentDate.isBetween(momentStartDate, momentEndDate) ||
        momentDate.isSame(momentEndDate, 'day')
      ) ||
      disabledDates.some((date) => {
        if (typeof date === 'object') {
          const dStart = moment(date.start);
          const dEnd = moment(date.end);
          return (
            momentDate.isSame(dStart) ||
            momentDate.isBetween(dStart, dEnd) ||
            momentDate.isSame(dEnd)
          );
        } else {
          if (moment(date).isSame(momentDate, 'day')) {
            return true;
          }
        }
      })
    );
  }

  createDateObj(momentDate, startDate, endDate, disabledDates) {
    momentDate = moment(momentDate);
    startDate = moment(startDate);
    endDate = moment(endDate);

    return {
      momentDate,
      dayInWeek: momentDate.day(),
      day: momentDate.format('DD'),
      month: momentDate.format('MMMM'),
      year: momentDate.format('YYYY'),
      fullDate: momentDate.format(DATE_FORMAT),
      isDisabled: this.checkDateDisabled(
        momentDate,
        startDate,
        endDate,
        disabledDates,
      ),
      isToday: momentDate.format(DATE_FORMAT) === moment().format(DATE_FORMAT),
    };
  }

  getDates(startDate, endDate, disabledDates, factor = 0, dates = []) {
    const week = [];

    for (let i = factor * 7; i < 7 * (factor + 1); i++) {
      const momentDate = moment(startDate).day(i);
      week.push(
        this.createDateObj(
          momentDate.format(DATE_FORMAT),
          startDate,
          endDate,
          disabledDates,
        ),
      );
    }
    dates.push(week);
    return dates;
  }

  getSpecificDay(weekIndex, dayInWeek, state = this.state) {
    return state.dates[weekIndex][dayInWeek];
  }

  getClosetEnabledWeek(dates, selectedDate) {
    const marginLeftWeekMonday = dates[0][0];
    const marginRightWeekMonday = dates[dates.length - 1][0];

    const leftDelta = marginLeftWeekMonday.momentDate.diff(
      selectedDate.momentDate,
      'days',
    );
    const rightDelta = marginRightWeekMonday.momentDate.diff(
      selectedDate.momentDate,
      'days',
    );

    if (Math.abs(leftDelta) <= Math.abs(rightDelta)) {
      return dates[0];
    } else {
      return dates[dates.length - 1];
    }
  }

  getClosetEnabledDate(week, selectedDate) {
    let delta = week.length;
    let newSelectedDate = selectedDate;
    week.map((day, index) => {
      const newDelta = Math.abs(selectedDate.dayInWeek - index);
      if (!day.isDisabled && newDelta < delta) {
        delta = newDelta;
        newSelectedDate = day;
      }
    });

    return newSelectedDate;
  }

  getWeekIndexByDate(dates, date) {
    let weekIndex = 0;

    dates.some((week, index) =>
      week.some((wDate) => {
        if (date.fullDate === wDate.fullDate) {
          weekIndex = index;
          return true;
        }
      }),
    );

    return weekIndex;
  }

  get selectedYear() {
    return this.state.selectedDate.year;
  }

  get selectedMonth() {
    return this.state.selectedDate.month;
  }

  get selectedFullDate() {
    return this.state.selectedDate.fullDate;
  }

  get selectedDate() {
    return this.state.selectedDate.day;
  }

  get selectedDayInWeekIndex() {
    return this.state.selectedDate.dayInWeek;
  }

  handlePressDate = (selectedDate) => {
    this.props.onPress(selectedDate);
  };

  onLayout = (e) => {
    this.setState({componentWidth: e.nativeEvent.layout.width});
  };

  loadMoreDate() {
    if (this.state.dates.length !== 0) {
      if (
        !this.state.dates[
          this.state.dates.length - 1
        ][6].momentDate.isSameOrAfter(moment(this.props.endDate), 'day')
      ) {
        const newFactor = this.state.factor + 1;
        const currentDates = [...this.state.dates];
        const newDates = this.getDates(
          this.props.startDate,
          this.props.endDate,
          this.props.disabledDates,
          newFactor,
          currentDates,
        );

        this.setState({
          factor: newFactor,
          dates: newDates,
        });
      }
    }
  }

  changeDayFlatListIndex(step) {
    if (this.refDayFlatList.current) {
      if (step >= 0) {
        Animated.spring(this.state.animatedNext, {
          toValue: 1,
        }).start(() => {
          this.state.animatedNext.setValue(0);
        });
      } else {
        Animated.spring(this.state.animatedPrevious, {
          toValue: 1,
        }).start(() => {
          this.state.animatedPrevious.setValue(0);
        });
      }

      let nextSelectedWeekIndex = this.state.selectedWeekIndex + step;
      nextSelectedWeekIndex > this.state.dates.length - 1 &&
        nextSelectedWeekIndex--;
      nextSelectedWeekIndex < 0 && (nextSelectedWeekIndex = 0);
      this.refDayFlatList.current.scrollToIndex({
        index: nextSelectedWeekIndex,
        animated: true,
      });
      this.setState({
        selectedWeekIndex: nextSelectedWeekIndex,
      });
    }
  }

  onDayScrollEnd(e) {
    const elementWidth = e.nativeEvent.layoutMeasurement.width;
    const targetOffset = e.nativeEvent.targetContentOffset.x;
    const selectedWeekIndex = targetOffset / elementWidth;

    this.setState({selectedWeekIndex});
  }

  renderHeader() {
    const disabledPrevious = this.state.selectedWeekIndex === 0;
    const disabledNext = this.getSpecificDay(
      this.state.selectedWeekIndex,
      6,
    ).momentDate.isSameOrAfter(this.props.endDate);
    const extraContainerStyle = {
      paddingHorizontal: this.props.componentPaddingHorizontal,
    };

    const extraPrevStyle = {
      transform: [{scale: this.state.animatedPrevious}],
      opacity: this.state.animatedPrevious.interpolate({
        inputRange: [0, 0.618, 1],
        outputRange: [0, 1, 0],
      }),
      // right: -14
    };

    const extraNextStyle = {
      transform: [{scale: this.state.animatedNext}],
      opacity: this.state.animatedNext.interpolate({
        inputRange: [0, 0.618, 1],
        outputRange: [0, 1, 0],
      }),
      // left: -14
    };

    return (
      <View style={[styles.headerContainer, extraContainerStyle]}>
        <BaseButton
          disabled={disabledPrevious}
          hitSlop={HIT_SLOP}
          onPress={() => this.changeDayFlatListIndex(-1)}>
          <View style={styles.btnContainer}>
            <Container
              animated
              style={[
                this.headerBtnBackgroundStyle,
                styles.bgBtn,
                extraPrevStyle,
              ]}
            />
            <Icon
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              neutral
              name="pan-left"
              disabled={disabledPrevious}
              style={styles.icon}
            />
          </View>
        </BaseButton>

        <Typography type={TypographyType.LABEL_SEMI_HUGE} style={styles.title}>
          {this.selectedMonth} {this.selectedYear}
        </Typography>

        <BaseButton
          disabled={disabledNext}
          hitSlop={HIT_SLOP}
          onPress={() => this.changeDayFlatListIndex(1)}>
          <View style={styles.btnContainer}>
            <Container
              animated
              style={[
                this.headerBtnBackgroundStyle,
                styles.bgBtn,
                extraNextStyle,
              ]}
            />
            <Icon
              bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
              neutral
              name="pan-right"
              disabled={disabledNext}
              style={styles.icon}
            />
          </View>
        </BaseButton>
      </View>
    );
  }

  renderDayInWeek() {
    return DAY_NAME_IN_WEEK.map((dayName, index) => {
      return (
        <Typography
          type={TypographyType.LABEL_LARGE_TERTIARY}
          key={index}
          style={styles.subTitle}>
          {dayName}
        </Typography>
      );
    });
  }

  renderDay({item: dates}) {
    return (
      <View
        style={[
          styles.dayInWeekContainer,
          {
            width: this.state.componentWidth,
          },
        ]}>
        {dates.map((date, index) => {
          return (
            <Day
              key={index}
              date={date}
              isSelected={date.fullDate === this.selectedFullDate}
              isToday={date.isToday}
              disabled={date.isDisabled}
              onPress={this.handlePressDate}
            />
          );
        })}
      </View>
    );
  }

  renderDate() {
    return (
      !!this.state.componentWidth && (
        <FlatList
          ref={this.refDayFlatList}
          contentContainerStyle={styles.dateContentContainer}
          onScrollEndDrag={this.onDayScrollEnd.bind(this)}
          onScrollToIndexFailed={(e) => console.log(e)}
          initialNumToRender={5}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          data={this.state.dates}
          renderItem={this.renderDay.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.loadMoreDate.bind(this)}
          onEndReachedThreshold={0.1}
          getItemLayout={(data, index) => ({
            length: this.state.componentWidth,
            offset: this.state.componentWidth * index,
            index,
          })}
        />
      )
    );
  }

  renderCalendar() {
    const extraStyle = {
      paddingHorizontal: this.props.componentPaddingHorizontal,
    };

    return (
      <View onLayout={this.onLayout} style={styles.bodyContainer}>
        <View style={[styles.dayNameContainer, extraStyle]}>
          {this.renderDayInWeek()}
        </View>
        <View style={styles.dateContainer}>{this.renderDate()}</View>
      </View>
    );
  }

  get headerBtnBackgroundStyle() {
    return {
      backgroundColor: this.theme.color.contentBackground,
    };
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
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
    paddingVertical: 10,
  },
  icon: {
    fontSize: 30,
  },
  bodyContainer: {},
  title: {
    textTransform: 'uppercase',
  },
  dayNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  subTitle: {
    textTransform: 'uppercase',
  },
  dayInWeekContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  dateContainer: {
    paddingVertical: 7,
  },
  dateContentContainer: {
    justifyContent: 'center',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgBtn: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default DateTimePicker;
