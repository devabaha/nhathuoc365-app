import React, {Component} from 'react';
import {StyleSheet, View, Easing} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
import Modal from 'react-native-modalbox';
// types
import {ModalDeliveryScheduleProps} from '.';
import {Style} from 'src/Themes/interface';
//  configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {getDataSchedule, isTimeAvailable} from './helpers';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, TextButton, Typography} from 'src/components/base';
import Picker from 'src/components/Picker';

const styles = StyleSheet.create({
  modalLicense: {
    height: null,
    backgroundColor: 'transparent',
    justifyContent: 'center',
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
    height: appConfig.device.height * 0.3,
    flexDirection: 'row',
  },
  pickerContainer: {
    paddingHorizontal: 15,
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
  };

  dataSchedule = getDataSchedule(
    this.props.t('confirm.schedule.modal.deliveryNowLabel'),
    this.props.t('confirm.schedule.modal.todayLabel'),
  );

  state = {
    selectedDate: this.props.selectedDate || this.dataSchedule[0]?.value,
    time: this.dataSchedule[0]?.time,
    selectedTime:
      this.props.selectedTime || this.dataSchedule[0]?.time[0]?.value,
    loading: false,
  };

  dateIndex = 0;
  refModal = React.createRef<any>();
  refListTime = React.createRef<any>();
  titleButtonTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  get theme() {
    return getTheme(this);
  }

  closeModal = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    }
  };

  onDateChange = (date, dateIndex) => {
    const timeData = this.dataSchedule[dateIndex]?.time || [];
    const timeIndex = timeData.findIndex(
      ({value}) => value === this.state.selectedTime,
    );
    this.setState(
      (prevState: any) => ({
        selectedDate: date,
        time: timeData,
        selectedTime:
          timeData?.length && timeIndex !== -1
            ? prevState.selectedTime
            : timeData[0]
            ? timeData[0]?.value || ''
            : prevState.selectedTime,
      }),
      () => {
        if (this.refListTime.current) {
          setTimeout(
            () =>
              this.refListTime.current.scrollToIndex({
                index: isTimeAvailable()
                  ? timeIndex - 1 < 0
                    ? 0
                    : timeIndex - 1
                  : 0,
              }),
            // this.refListTime.current.scrollTo({
            //   y: isTimeAvailable() ? (timeIndex - 1) * 50 || 0 : 0,
            // }),
          );
        }
      },
    );

    this.dateIndex = dateIndex;
  };

  onTimeChange = (time, index) => {
    this.setState({selectedTime: time});
  };

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
        style={styles.modalLicense}
        backdropPressToClose
        isOpen
        // @ts-ignore
        easing={Easing.quad}
        animationDuration={250}
        onClosed={pop}>
        <Container safeLayout style={[styles.container, this.containerStyle]}>
          <View style={[styles.titleContainer, this.titleContainerStyle]}>
            <TextButton
              typoProps={this.titleButtonTypoProps}
              onPress={this.closeModal}
              titleStyle={styles.titleButtonStyle}
              style={styles.leftButton}>
              {t('common:cancel')}
            </TextButton>

            <Typography type={TypographyType.TITLE_LARGE} style={styles.title}>
              {t('confirm.schedule.modalTitle')}
            </Typography>

            <TextButton
              primaryHighlight
              typoProps={this.titleButtonTypoProps}
              onPress={() => {
                this.props.onConfirm(
                  this.state.selectedDate,
                  this.state.selectedTime,
                );
                this.closeModal();
              }}
              titleStyle={styles.titleButtonStyle}
              style={styles.rightButton}>
              {t('common:done')}
            </TextButton>
          </View>

          <View style={styles.pickerWrapper}>
            <Container noBackground center flex row>
              <Container
                noBackground
                flex
                style={[styles.pickerContainer, styles.leftPickerContainer]}>
                <Picker
                  selectedValue={this.state.selectedDate}
                  onValueChange={this.onDateChange}
                  data={this.dataSchedule}
                  androidItemStyle={styles.androidItem}
                  androidItemTextStyle={this.androidItemPickerStyles}
                />
              </Container>

              <Container flex style={styles.pickerContainer}>
                <Picker
                  refList={this.refListTime}
                  selectedValue={this.state.selectedTime}
                  onValueChange={this.onTimeChange}
                  data={this.state.time}
                  androidItemStyle={styles.androidItem}
                  androidItemTextStyle={this.androidItemPickerStyles}
                  isDeliverySchedule
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
          </View>
        </Container>
      </Modal>
    );
  }
}

export default withTranslation('orders')(ModalDeliverySchedule);
