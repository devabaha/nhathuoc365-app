import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import {Calendar} from 'react-native-calendars';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  modal: {
    height: null,
    paddingBottom: 5 + appConfig.device.bottomSpace,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
  },
  icon: {
    fontSize: 22,
    color: '#666',
  },
  headingContainer: {
    padding: 30,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1.6,
    textAlign: 'right',
  },
});

const ModalCalendar = ({
  entry = 'bottom',
  position = 'bottom',
  minDate = new Date(),
  current = new Date(),
  title,
  modalStyle,
  headingContainerStyle,
  onCloseModal,
  innerRef = () => {},
  onPressDate = () => {},
}) => {
  const theme = useRef({
    backgroundColor: appConfig.colors.white,
    calendarBackground: appConfig.colors.white,
    textSectionTitleColor: '#2d4150',
    selectedDayBackgroundColor: appConfig.colors.black,
    selectedDayTextColor: appConfig.colors.white,
    todayTextColor: appConfig.colors.primary,
    // todayBackgroundColor: appConfig.colors.primary,
    selectedDayTextColor: '#fff',
    dayTextColor: '#2d4150',
    textDisabledColor: '#ccc',
    dotColor: appConfig.colors.primary,
    selectedDotColor: appConfig.colors.white,
    arrowColor: appConfig.colors.primary,
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayFontSize: 16,
    textDayHeaderFontSize: 16,
  });
  const refModal = useRef();

  const [selectedDate, setSelectedDate] = useState(current);

  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
    onPressDate(day.dateString, handleClose, day);
  });

  const handleClose = useCallback(() => {
    if (refModal.current) {
      refModal.current.close();
    }
  });

  const handleCloseModal = () => {
    if (typeof onCloseModal === 'function') {
      onCloseModal();
    } else {
      Actions.pop();
    }
  };

  return (
    <ModalBox
      entry={entry}
      position={position}
      style={[styles.modal, modalStyle]}
      swipeToClose={false}
      backButtonClose
      ref={(inst) => {
        innerRef(inst);
        refModal.current = inst;
      }}
      isOpen
      onClosed={handleCloseModal}
      useNativeDriver>
      <View style={[styles.headingContainer, headingContainerStyle]}>
        <TouchableOpacity onPress={handleClose} style={styles.iconContainer}>
          <FontAwesomeIcon name="close" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{title}</Text>
      </View>
      <Calendar
        theme={theme.current}
        current={current}
        onDayPress={handleDayPress}
        // hideExtraDays
        markedDates={{
          [selectedDate]: {selected: true},
        }}
        minDate={minDate}
        enableSwipeMonths
      />
    </ModalBox>
  );
};

export default React.memo(ModalCalendar);
