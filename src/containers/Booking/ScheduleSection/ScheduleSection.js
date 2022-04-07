import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {ButtonRoundedType, TypographyType} from 'src/components/base';
// custom components
import SectionContainer from 'src/components/payment/Confirm/components/SectionContainer';
import {SlotGridView} from 'src/components/Schedule/SlotPicker/GridView';
import {AppOutlinedButton} from 'src/components/base';

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
  dateContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unselectedDate: {
    fontStyle: 'italic',
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
  editable = true,
  onChangeDate = () => {},
  onChangeTime = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const hasDate = !!date;
  const dateValue = hasDate ? date : t('confirm.date.unselected');
  const selectedTimeSlotValue =
    selectedTimeSlot?.value || t('confirm.date.unselected');

  const handlePressDatePicker = () => {
    push(appConfig.routes.modalCalendar, {
      title: t('common:selectDate'),
      current: date,
      onPressDate: (date, closeCallback) => {
        onChangeDate(date);
        closeCallback();
      },
    });
  };

  const dateStyle = useMemo(() => {
    return mergeStyles(
      theme.typography[TypographyType.LABEL_MEDIUM],
      hasDate
        ? {
            color: theme.color.onPersistPrimary,
          }
        : styles.unselectedDate,
    );
  }, [theme, hasDate]);

  const dateBtnContanerStyle = useMemo(() => {
    return mergeStyles(
      styles.dateContainer,
      hasDate && {
        backgroundColor: theme.color.persistPrimary,
        borderColor: theme.color.persistPrimary,
      },
    );
  }, [theme, hasDate]);

  const renderButtonSelection = (value, onPress = () => {}) => {
    return (
      <AppOutlinedButton
        rounded={ButtonRoundedType.EXTRA_SMALL}
        primaryHighlight
        disabled={!editable}
        onPress={onPress}
        titleStyle={dateStyle}
        style={dateBtnContanerStyle}>
        {value}
      </AppOutlinedButton>
    );
  };

  return (
    <>
      <SectionContainer
        marginTop
        iconName="calendar-alt"
        title={t('confirm.date.title')}
        actionBtnTitle={editable && t('confirm.change')}
        onPressActionBtn={handlePressDatePicker}>
        {renderButtonSelection(dateValue, handlePressDatePicker)}
      </SectionContainer>
      <SectionContainer iconName="clock" title={t('confirm.time.title')}>
        {editable
          ? !!timeSlots?.length && (
              <SlotGridView
                horizontal
                slots={timeSlots}
                selectedSlot={selectedTimeSlot}
                containerStyle={styles.slotGridViewContainer}
                contentContainerStyle={styles.slotGridViewContentContainer}
                onPress={onChangeTime}
              />
            )
          : renderButtonSelection(selectedTimeSlotValue)}
      </SectionContainer>
    </>
  );
};

export default React.memo(ScheduleSection);
