import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import moment from 'moment';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
import {DATE_FORMAT} from 'src/components/Schedule/constants';
// entities
import {APIRequest} from 'src/network/Entity';
import EventTracker from 'app-helper/EventTracker';
// custom components
import {ScheduleDateTimePicker} from 'src/components/Schedule';
import SlotPicker from 'src/components/Schedule/SlotPicker/SlotPicker';
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import {
  ScreenWrapper,
  ScrollView,
  Typography,
  Container,
  RefreshControl,
} from 'src/components/base';

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
  '9:00',
];
class Schedule extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    serviceId: '508',
  };
  state = {
    serviceTitle: '',
    serviceId: this.props.serviceId,
    selectedDate: moment().format(DATE_FORMAT),
    titleSlotPicker: this.getTitleSlotPicker(moment().format(DATE_FORMAT)),
    disabledDates: [],
    // [
    //   { start: "2020-04-03", end: "2020-04-06" },
    //   "2020-04-10",
    //   { start: "2020-04-11", end: "2020-04-12" },
    // ]
    confirmNote: '',
    startDate: '',
    endDate: '',
    slots: [],
    slotsMessage: '',
    user: {},
    loading: true,
    refreshing: false,
  };
  getScheduleDataRequest = new APIRequest();
  requests = [this.getScheduleDataRequest];
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get hasDateData() {
    return !!this.state.startDate;
  }

  get hasSlotsData() {
    return Array.isArray(this.state.slots) && this.state.slots.length !== 0;
  }

  componentDidMount() {
    this.getScheduleData();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  async getScheduleData() {
    const {t} = this.props;
    const errMess = t('common:api.error.message');
    try {
      const serviceId = this.props.serviceId;
      this.getScheduleDataRequest.data = APIHandler.get_service_info(serviceId);
      const response = await this.getScheduleDataRequest.promise();
      console.log(response);

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              disabledDates: response.data.disabled_dates,
              startDate: response.data.start_date,
              endDate: response.data.end_date,
              slots: response.data.slots,
              slotsMessage: response.data.note,
              site: response.data.site,
              serviceId,
              confirmNote: response.data.content,
              serviceTitle: response.data.name,
            });
          } else {
            flashShowMessage({
              type: 'danger',
              message: response.message || errMess,
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || errMess,
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: errMess,
        });
      }
    } catch (err) {
      console.log('%cget_schedule_data', 'color:red', err);
      flashShowMessage({
        type: 'danger',
        message: errMess,
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

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
      diffMess = yearsDiff + ' ' + this.props.t('diffTime.yearFrom') + ' ';
    } else if (monthsDiff) {
      diffMess = monthsDiff + ' ' + this.props.t('diffTime.monthFrom') + ' ';
    } else if (weeksDiff) {
      diffMess = weeksDiff + ' ' + this.props.t('diffTime.weeksFrom') + ' ';
    } else if (daysDiff) {
      diffMess = daysDiff + ' ' + this.props.t('diffTime.dayFrom') + ' ';
    } else if (hoursDiff) {
      diffMess = hoursDiff + ' ' + this.props.t('diffTime.hourFrom') + ' ';
    } else {
      diffMess = minutesDiff + ' ' + this.props.t('diffTime.minuteFrom') + ' ';
    }

    if (diffMess) {
      const [diffTime, affix] = diffMess.split(' ');
      if (diffTime < 0) {
        diffMess = `${this.props.t('delayed')} ${Math.abs(diffTime)} ${affix}`;
      } else {
        diffMess += this.props.t('now');
      }
    } else {
      diffMess = this.props.t('now');
    }
    return diffMess;
  }

  capitalizeFirstLetter(string) {
    let newString = '';
    if (Array.isArray(string)) {
      newString = [];

      string.forEach(
        (str, index) =>
          (newString[index] = str.charAt(0).toUpperCase() + str.slice(1)),
      );
      return newString.join(' ');
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getTitleSlotPicker(date) {
    const momentDate = moment(date);
    const {t, i18n} = this.props;

    const prefix = momentDate.isSame(moment(), 'day')
      ? t('prefix.today')
      : momentDate.isSame(moment().add(1, 'days'), 'day')
      ? t('prefix.tomorrow')
      : momentDate.isSame(moment().subtract(1, 'days'), 'day')
      ? t('prefix.yesterday')
      : this.capitalizeFirstLetter(
          momentDate.locale(i18n.language).format('dddd').split(' '),
        );

    return prefix + ', ' + momentDate.format('DD MMMM');
  }

  handlePressDate = (selectedDate) => {
    const titleSlotPicker = this.getTitleSlotPicker(selectedDate.fullDate);

    this.setState({
      selectedDate: selectedDate.fullDate,
      titleSlotPicker,
    });
  };

  handlePressSlot(slot) {
    push(
      appConfig.routes.scheduleConfirm,
      {
        title: this.state.serviceTitle,
        siteId: this.state.siteId,
        serviceId: this.state.serviceId,

        dateView: this.state.titleSlotPicker,
        date: this.state.selectedDate,
        dateDescription: this.diffTime(`${this.state.selectedDate} ${slot}`),
        timeRange: slot,
        // timeRangeDescription: 'Khoảng thời gian không cố định (FS)',
        appointmentName: this.state.site.name,
        appointmentDescription: this.state.site.address,
        image: this.state.site.logo_url,
        description: this.state.confirmNote,
      },
      this.theme,
    );
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.getScheduleData();
  }

  renderExtraMessage() {
    return (
      this.props.extraMessage && (
        <Container noBackground style={styles.container}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.extraMessageTitle}>
            {this.props.extraMessage.title}
          </Typography>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.extraMessageContent}>
            {this.props.extraMessage.content}
          </Typography>
        </Container>
      )
    );
  }

  renderSlotPicker() {
    return (
      this.state.slots.length !== 0 && (
        <View>
          <SlotPicker
            title={this.state.titleSlotPicker}
            slots={this.state.slots}
            message={this.state.slotsMessage}
            onPress={this.handlePressSlot.bind(this)}
          />
        </View>
      )
    );
  }

  get dateTimePickerStyle() {
    return mergeStyles(styles.dateTimePicker, {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  render() {
    return (
      <ScreenWrapper style={styles.container}>
        <Container flex>
          {this.state.loading && <Loading center />}
          {this.hasDateData && (
            <ScheduleDateTimePicker
              containerStyle={this.dateTimePickerStyle}
              onPress={this.handlePressDate}
              // date-format: YYYY-MM-DD
              selectedDate={this.state.selectedDate}
              // startDate (today) - (margin-left)
              startDate={this.state.startDate}
              // endDate - (margin-right)
              endDate={this.state.endDate}
              // disabledDates (flexible)
              disabledDates={this.state.disabledDates}
            />
          )}

          <ScrollView
            safeLayout
            style={styles.slotPickerContainer}
            contentContainerStyle={styles.slotPickerContent}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }>
            {this.renderExtraMessage()}

            {this.hasSlotsData
              ? this.renderSlotPicker()
              : !this.state.loading && (
                  <NoResult
                    iconName="calendar-remove-outline"
                    message={this.props.t('noSlot')}
                  />
                )}
          </ScrollView>
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateTimePicker: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  slotPickerContainer: {
    paddingHorizontal: 15,
  },
  slotPickerContent: {
    flexGrow: 1,
  },
  extraMessageTitle: {},
  extraMessageContent: {},
});

export default withTranslation(['schedule', 'common'])(Schedule);
