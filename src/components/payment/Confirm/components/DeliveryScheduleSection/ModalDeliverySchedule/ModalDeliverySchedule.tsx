import React, {Component} from 'react';
import {StyleSheet, View, Easing, Keyboard} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modalbox';
// types
import {ModalDeliveryScheduleProps} from '.';
import {Style} from 'src/Themes/interface';
// 3 party libs
import moment from 'moment';
//  configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Container} from 'src/components/base';
import Picker from 'src/components/Picker';
import NoResult from 'src/components/NoResult';
import Header from 'src/components/ModalPicker/Header';

const styles = StyleSheet.create({
  modal: {
    height: null,
    maxHeight: appConfig.device.height * 0.8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topSpacing: {
    height: 30,
  },
  titleContainer: {
    padding: 15,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontWeight: '500',
  },
  titleButtonStyle: {
    fontWeight: 'bold',
  },
  pickerWrapper: {
    flexDirection: 'row',
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  leftPickerContainer: {
    paddingRight: 0,
  },
  leftButton: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 999,
  },
  rightButton: {
    position: 'absolute',
    right: 15,
    top: 20,
    zIndex: 999,
  },
});

class ModalDeliverySchedule extends Component<ModalDeliveryScheduleProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    onConfirm: () => {},
    scheduleDeliveryData: [],
  };

  initSelectedDate = !!this.props.scheduleDeliveryData.length
    ? !!this.props.selectedDate
      ? this.props.scheduleDeliveryData.find((item: any) => {
          return item?.value === this.props.selectedDate;
        }) || this.props.scheduleDeliveryData?.[0]
      : this.props.scheduleDeliveryData?.[0]
    : undefined;

  initSelectedTime = !!this.initSelectedDate
    ? !!this.props.selectedTime
      ? this.initSelectedDate?.time?.find(
          (item: any) => item?.value === this.props.selectedTime,
        ) || {value: this.initSelectedDate?.time?.[0]?.value}
      : this.props.scheduleDeliveryData?.[0]?.time?.[0]
    : undefined;

  state = {
    selectedDate: this.initSelectedDate,
    selectedTime: this.initSelectedTime,
  };

  hourMinuteIndex = 0;
  refModal = React.createRef<any>();
  refListDate = React.createRef<any>();
  refListTime = React.createRef<any>();
  titleButtonTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  listEmptyIconBundle = BundleIconSetName.MATERIAL_COMMUNITY_ICONS;
  listEmptyTitleStyle = this.theme.typography[
    TypographyType.DESCRIPTION_MEDIUM_TERTIARY
  ];

  get theme() {
    return getTheme(this);
  }

  componentDidMount(): void {
    Keyboard.dismiss();

    this.formatScheduleData();
  }

  closeModal = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    }
  };

  onDateChange = (date, dateIndex) => {
    let timeIndex = 0;

    this.setState(
      (prevState: any) => {
        const timeData = this.props.scheduleDeliveryData[dateIndex]?.time || [];

        timeIndex = timeData.findIndex(
          ({value}) => value === prevState.selectedTime?.value,
        );
        return {
          selectedDate: this.props.scheduleDeliveryData[dateIndex],
          selectedTime:
            timeData?.length && timeIndex !== -1
              ? prevState.selectedTime
              : timeData[0]
              ? timeData[0] || ''
              : prevState.selectedTime,
        };
      },
      () => {
        if (this.refListTime.current) {
          this.scrollListToIndex(this.refListTime, timeIndex);
        }
      },
    );
  };

  scrollListToIndex = (refList, timeIndex) => {
    refList.current &&
      refList.current.scrollToIndex({
        index: timeIndex < 0 ? 0 : timeIndex,
      });
  };

  onTimeChange = (time, timeIndex) => {
    this.setState({
      selectedTime: this.state.selectedDate.time[timeIndex],
    });

    this.hourMinuteIndex = timeIndex;
  };

  handleConfirm = () => {
    if (this.state.selectedDate?.today && this.hourMinuteIndex === 0) {
      this.props.onConfirm('');
      this.closeModal();
      return;
    }

    const scheduleDateTime = `${this.state.selectedDate?.value} ${this.state.selectedTime?.value}`;

    const formattedScheduleTime = moment(
      scheduleDateTime,
      'DD/MM/YYYY HH:mm',
    ).format('YYYY-MM-DD HH:mm');

    this.props.onConfirm(formattedScheduleTime);

    this.closeModal();
  };

  formatScheduleData = () => {
    if (
      this.props.scheduleDeliveryData.length &&
      this.props.scheduleDeliveryData?.[0]?.today
    ) {
      this.props.scheduleDeliveryData[0].time[0].label = this.props.t(
        'confirm.scheduleDelivery.modal.deliveryNowLabel',
      );
    }
  };

  renderEmpty = () => {
    return (
      <Container>
        <NoResult
          iconSize={60}
          iconBundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          iconName="clock-alert"
          message={this.props.t('common:noResult')}
        />
      </Container>
    );
  };

  get modalStyle() {
    return [
      styles.modal,
      {
        borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
        borderTopRightRadius: this.theme.layout.borderRadiusHuge,
      },
    ];
  }

  get containerStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
      borderTopRightRadius: this.theme.layout.borderRadiusHuge,
    };
  }

  get titleContainerStyle(): Style {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidth,
    };
  }

  get pickerContainerStyle() {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get androidItemPickerStyles() {
    return {
      //@ts-ignore
      fontSize: this.theme.typography[TypographyType.LABEL_LARGE].fontSize,
    };
  }

  render() {
    const {t} = this.props;

    const headerSelectedLabel =
      this.state.selectedDate?.today && this.hourMinuteIndex === 0
        ? t('confirm.scheduleDelivery.modal.deliveryNowLabel') +
          ' ' +
          this.state.selectedDate?.value
        : !!this.state.selectedTime?.label &&
          this.state.selectedTime?.label + ' ' + this.state.selectedDate?.value;

    return (
      <Modal
        ref={this.refModal}
        entry="bottom"
        position="bottom"
        swipeToClose={false}
        style={this.modalStyle}
        backdropPressToClose
        isOpen
        // @ts-ignore
        easing={Easing.quad}
        animationDuration={250}
        onClosed={pop}>
        <Container style={[styles.container, this.containerStyle]}>
          <Header
            selectedLabel={headerSelectedLabel}
            title={t('confirm.scheduleDelivery.modal.title')}
            cancelTitle={t('common:cancel')}
            confirmTitle={t('common:done')}
            onCancelPress={this.closeModal}
            onSelectPress={this.handleConfirm}
            confirmDisabled={!this.props.scheduleDeliveryData?.length}
          />
          <View style={styles.pickerWrapper}>
            {!!this.props.scheduleDeliveryData?.length ? (
              <>
                <Container
                  noBackground
                  flex
                  style={[styles.pickerContainer, styles.leftPickerContainer]}>
                  <Picker
                    refList={this.refListDate}
                    selectedValue={this.state.selectedDate?.value}
                    onValueChange={this.onDateChange}
                    data={this.props.scheduleDeliveryData}
                    listEmptyIconBundle={this.listEmptyIconBundle}
                    listEmptyIconName="clock-alert"
                    listEmptyIconSize={32}
                    listEmptyTitleStyle={this.listEmptyTitleStyle}
                    androidItemTextStyle={this.androidItemPickerStyles}
                    androidItemHeight={50}
                  />
                </Container>

                <Container noBackground flex style={styles.pickerContainer}>
                  <Picker
                    refList={this.refListTime}
                    selectedValue={this.state.selectedTime?.value}
                    onValueChange={this.onTimeChange}
                    data={this.state.selectedDate?.time || []}
                    listEmptyIconBundle={this.listEmptyIconBundle}
                    listEmptyIconName="clock-alert"
                    listEmptyIconSize={32}
                    listEmptyTitleStyle={this.listEmptyTitleStyle}
                    androidItemTextStyle={this.androidItemPickerStyles}
                    androidInitNumToRender={50}
                    androidItemHeight={50}
                  />
                </Container>
              </>
            ) : (
              this.renderEmpty()
            )}
          </View>
        </Container>
      </Modal>
    );
  }
}

export default withTranslation('orders')(ModalDeliverySchedule);
