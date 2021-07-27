import React from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';

import SectionContainer from 'src/components/payment/Confirm/components/SectionContainer';
import {SlotGridView} from 'src/components/Schedule/SlotPicker/GridView';

const SLOTS = [
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const styles = StyleSheet.create({
  icon: {
    fontSize: 14,
    color: '#333',
  },

  dateContainer: {
    borderRadius: 4,
    backgroundColor: appConfig.colors.primary,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  date: {
    color: appConfig.colors.white,
  },
  unselectedDateContainer: {
    borderWidth: 1,
    borderColor: appConfig.colors.primary,
    backgroundColor: undefined,
  },
  unselectedDate: {
    fontStyle: 'italic',
    color: appConfig.colors.text,
  },

  slotGridViewContainer: {
    marginHorizontal: -15,
    marginTop: 15,
    marginBottom: -10,
  },
  slotGridViewContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
});

const ScheduleSection = ({
  date,
  timeSlots,
  selectedTimeSlot,
  onChangeDate = () => {},
  onChangeTime = () => {},
}) => {
  const {t} = useTranslation('orders');

  const hasDate = !!date;
  const dateValue = hasDate ? date : t('confirm.date.unselected');

  const handlePressDatePicker = () => {
    Actions.push(appConfig.routes.modalCalendar, {
      title: "Chọn ngày",
      current: date,
      onPressDate: (date, closeCallback) => {
        onChangeDate(date);
        closeCallback();
      },
    });
  };

  return (
    <>
      <SectionContainer
        marginTop
        iconName="calendar-alt"
        title={t('confirm.date.title')}
        actionBtnTitle={t('confirm.change')}
        onPressActionBtn={handlePressDatePicker}>
        <TouchableOpacity
          onPress={handlePressDatePicker}
          style={[
            styles.dateContainer,
            !hasDate && styles.unselectedDateContainer,
          ]}>
          <Text style={[styles.date, !hasDate && styles.unselectedDate]}>
            {dateValue}
          </Text>
        </TouchableOpacity>
      </SectionContainer>
      <SectionContainer iconName="clock" title={t('confirm.time.title')}>
        {!!timeSlots && (
          <SlotGridView
            horizontal
            slots={timeSlots}
            selectedSlot={selectedTimeSlot}
            containerStyle={styles.slotGridViewContainer}
            contentContainerStyle={styles.slotGridViewContentContainer}
            onPress={onChangeTime}
          />
        )}
      </SectionContainer>
    </>
  );
};

export default React.memo(ScheduleSection);
