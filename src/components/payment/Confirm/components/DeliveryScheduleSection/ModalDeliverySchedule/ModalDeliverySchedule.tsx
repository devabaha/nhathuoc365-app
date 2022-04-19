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
import {getDateTimeSelected} from './helpers';
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
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
  androidItem: {
    height: 50,
  },
});

class ModalDeliverySchedule extends Component<ModalDeliveryScheduleProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    onConfirm: () => {},
    scheduleDeliveryData: [],
  };

  selectedDate =
    !!this.props.scheduleDateTime && !!this.props.scheduleDeliveryData?.length
      ? this.props.scheduleDeliveryData.find(
          (item: any) =>
            item?.value ===
            getDateTimeSelected(this.props.scheduleDateTime).date,
        ) || this.props.scheduleDeliveryData[0]
      : this.props.scheduleDeliveryData[0];

  state = {
    selectedDate: this.selectedDate,
    selectedTime: !!this.props.scheduleDateTime
      ? this.selectedDate?.time?.find(
          (item: any) =>
            item?.value ===
            getDateTimeSelected(this.props.scheduleDateTime).time,
        ) || {value: this.selectedDate?.time[0].value}
      : this.props.scheduleDeliveryData[0]?.time[0],
  };

  refModal = React.createRef<any>();
  refListDate = React.createRef<any>();
  refListTime = React.createRef<any>();
  titleButtonTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  get theme() {
    return getTheme(this);
  }

  componentDidMount(): void {
    Keyboard.dismiss();

    if (this.state.selectedDate) {
      this.setState({}, () => {
        this.scrollListToIndex(
          this.refListDate,
          this.props.scheduleDeliveryData.length &&
            this.props.scheduleDeliveryData.findIndex(
              (d) =>
                d.value ===
                getDateTimeSelected(this.props.scheduleDateTime).date,
            ),
        );

        this.scrollListToIndex(
          this.refListTime,
          this.state.selectedDate?.time?.length &&
            this.state.selectedDate?.time.findIndex(
              (t) => t.value === this.state.selectedTime?.value,
            ),
        );
      });
    }
  }
  closeModal = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    }
  };

  onDateChange = (date, dateIndex) => {
    const timeData = this.props.scheduleDeliveryData[dateIndex]?.time || [];
    const timeIndex = timeData.findIndex(
      ({value}) => value === this.state.selectedTime?.value,
    );

    this.setState(
      (prevState: any) => ({
        selectedDate: this.props.scheduleDeliveryData[dateIndex],
        selectedTime:
          timeData?.length && timeIndex !== -1
            ? prevState.selectedTime
            : timeData[0]
            ? timeData[0] || ''
            : prevState.selectedTime,
      }),
      () => {
        if (this.refListTime.current) {
          this.scrollListToIndex(this.refListTime, timeIndex);
        }
      },
    );
  };

  scrollListToIndex = (refList, timeIndex) => {
    setTimeout(
      () =>
        refList.current &&
        refList.current.scrollToIndex({
          index: timeIndex - 1 < 0 ? 0 : timeIndex - 1,
        }),
      timeIndex * 30,
    );
  };

  onTimeChange = (time, timeIndex) => {
    this.setState({selectedTime: {value: time}});
  };

  handleConfirm = () => {
    const scheduleDateTime = `${this.state.selectedDate?.value} ${this.state.selectedTime?.value}`;

    const formattedScheduleTime = moment(
      scheduleDateTime,
      'DD/MM/YYYY HH:mm',
    ).format('YYYY-MM-DD HH:mm');

    this.props.onConfirm(formattedScheduleTime);

    this.closeModal();
  };

  formatScheduleData = (data) => {
    if (data[0]?.today) {
      data[0].time[0].label = 'Giao ngay';
    }
    return data;
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
        <Container safeLayout style={[styles.container, this.containerStyle]}>
          <Header
            selectedLabel={
              !!this.state.selectedTime?.value &&
              this.state.selectedTime?.value +
                ' ' +
                this.state.selectedDate?.value
            }
            title={t('confirm.scheduleDelivery.modal.title')}
            cancelTitle={t('common:cancel')}
            confirmTitle={t('common:done')}
            // onHeaderLayout={this.onHeaderLayout}
            onCancelPress={this.closeModal}
            onSelectPress={this.handleConfirm}
            confirmDisabled={!this.props.scheduleDeliveryData?.length}
          />

          <View style={styles.pickerWrapper}>
            {!!this.props.scheduleDeliveryData?.length ? (
              <Container noBackground center flex row>
                <Container
                  noBackground
                  flex
                  style={[styles.pickerContainer, styles.leftPickerContainer]}>
                  <Picker
                    refList={this.refListDate}
                    selectedValue={this.state.selectedDate?.value}
                    onValueChange={this.onDateChange}
                    data={this.formatScheduleData(
                      this.props.scheduleDeliveryData,
                    )}
                    listEmptyIconBundle={
                      BundleIconSetName.MATERIAL_COMMUNITY_ICONS
                    }
                    listEmptyIconName="clock-alert"
                    listEmptyIconSize={32}
                    listEmptyTitleStyle={
                      this.theme.typography[
                        TypographyType.DESCRIPTION_MEDIUM_TERTIARY
                      ]
                    }
                    androidItemStyle={styles.androidItem}
                    androidItemTextStyle={this.androidItemPickerStyles}
                    getAndroidItemLayout={(data, index) => {
                      return {
                        length: 50,
                        offset: 50 * index,
                        index,
                      };
                    }}
                  />
                </Container>

                <Container flex style={styles.pickerContainer}>
                  <Picker
                    refList={this.refListTime}
                    selectedValue={this.state.selectedTime?.value}
                    onValueChange={this.onTimeChange}
                    data={this.state.selectedDate?.time || []}
                    listEmptyIconBundle={
                      BundleIconSetName.MATERIAL_COMMUNITY_ICONS
                    }
                    listEmptyIconName="clock-alert"
                    listEmptyIconSize={32}
                    listEmptyTitleStyle={
                      this.theme.typography[
                        TypographyType.DESCRIPTION_MEDIUM_TERTIARY
                      ]
                    }
                    androidItemStyle={styles.androidItem}
                    androidItemTextStyle={this.androidItemPickerStyles}
                    androidInitNumToRender={50}
                    getAndroidItemLayout={(data, index) => {
                      return {
                        length: 50,
                        offset: 50 * index,
                        index,
                      };
                    }}
                  />
                </Container>
              </Container>
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
