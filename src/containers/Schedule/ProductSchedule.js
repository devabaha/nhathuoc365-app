import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import moment from 'moment';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ORDER_TYPES} from 'src/constants';
import {DATE_FORMAT} from 'src/components/Schedule/constants';
import {TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {ScheduleDateTimePicker} from 'src/components/Schedule';
import SlotPicker from 'src/components/Schedule/SlotPicker/SlotPicker';
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import {
  Typography,
  ScrollView,
  RefreshControl,
  ScreenWrapper,
  Container,
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
class ProductSchedule extends Component {
  static contextType = ThemeContext;

  state = {
    serviceTitle: '',
    productId: this.props.productId,
    selectedDate: moment().format(DATE_FORMAT),
    selectedDate: '',
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
    site: store.store_data || {},
  };
  getProductConfigRequest = new APIRequest();
  requests = [this.getProductConfigRequest];
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
    this.getProductConfig();
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

  async getProductConfig() {
    const {t} = this.props;
    const errMess = t('common:api.error.message');
    try {
      const productId = this.state.productId;
      const siteId = store.store_data?.id;
      this.getProductConfigRequest.data = APIHandler.site_product_config(
        siteId,
        productId,
      );
      const response = await this.getProductConfigRequest.promise();
      console.log(response);

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              disabledDates: JSON.parse(response.data.service_disabled_dates),
              startDate: response.data.service_start_date,
              endDate: response.data.service_end_date,
              slots: JSON.parse(response.data.service_slots),
              slotsMessage: response.data.service_slot_message,
              confirmNote: response.data.service_confirm_note,
              serviceTitle: response.data.service_name,
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
    const {t} = this.props;

    let diffMess = '';
    const yearsDiff = moment(time1).diff(time2, 'years');
    const monthsDiff = moment(time1).diff(time2, 'months');
    const weeksDiff = moment(time1).diff(time2, 'weeks');
    const daysDiff = moment(time1).diff(time2, 'days');
    const hoursDiff = moment(time1).diff(time2, 'hours');
    const minutesDiff = moment(time1).diff(time2, 'minutes');

    if (yearsDiff) {
      diffMess = yearsDiff + t('yearFrom');
    } else if (monthsDiff) {
      diffMess = monthsDiff + t('monthFrom');
    } else if (weeksDiff) {
      diffMess = weeksDiff + t('weekFrom');
    } else if (daysDiff) {
      diffMess = daysDiff + t('dayFrom');
    } else if (hoursDiff) {
      diffMess = hoursDiff + t('hourFrom');
    } else {
      diffMess = minutesDiff + t('minuteFrom');
    }

    if (diffMess) {
      const [diffTime, affix] = diffMess.split(' ');
      if (diffTime < 0) {
        diffMess = `Đã trễ ${Math.abs(diffTime)} ${affix}`;
      } else {
        diffMess += t('now');
      }
    } else {
      diffMess = t('now');
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
        siteId: this.state.site.id,
        serviceId: this.state.productId,

        dateView: this.state.titleSlotPicker,
        date: this.state.selectedDate,
        dateDescription: this.diffTime(`${this.state.selectedDate} ${slot}`),
        timeRange: slot,
        // timeRangeDescription: 'Khoảng thời gian không cố định (FS)',
        appointmentName: this.state.site.name,
        appointmentDescription: this.state.site.address,
        image: this.state.site.logo_url,
        cover: this.state.site.banner_url,
        description: this.state.confirmNote,
        type: ORDER_TYPES.BOOKING,
      },
      this.theme,
    );
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.getProductConfig();
  }

  renderExtraMessage() {
    return (
      this.props.extraMessage && (
        <Container noBackground flex>
          <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
            {this.props.extraMessage.title}
          </Typography>
          <Typography type={TypographyType.LABEL_MEDIUM_TERTIARY}>
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

  get dateTimePickerContainerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderBottomColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        {this.hasDateData && (
          <ScheduleDateTimePicker
            containerStyle={[
              this.dateTimePickerContainerStyle,
              styles.dateTimePicker,
            ]}
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
          style={styles.slotPicker}
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
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  dateTimePicker: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  slotPicker: {
    paddingHorizontal: 15,
  },
});

export default withTranslation(['schedule', 'common'])(ProductSchedule);
