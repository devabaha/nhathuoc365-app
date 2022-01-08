import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {Calendar} from 'react-native-calendars';
import {default as ModalBox} from 'react-native-modalbox';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {IconButton, Typography, Container} from 'src/components/base';

const styles = StyleSheet.create({
  backdropContent: {
    height: 100,
    marginTop: 'auto',
  },
  modal: {
    height: null,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
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
  },
  headingContainer: {
    padding: 30,
    marginBottom: 5,
  },
  heading: {
    fontWeight: 'bold',
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
  const {theme} = useTheme();
  const refModal = useRef();

  const [selectedDate, setSelectedDate] = useState(current);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [calendarHeightDiff, setCalendarHeightDiff] = useState(0);

  const themeCalendar = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
      calendarBackground: theme.color.surface,
      textSectionTitleColor: theme.color.textPrimary,
      selectedDayBackgroundColor: theme.color.persistPrimary,
      selectedDayTextColor: theme.color.onPrimary,
      todayTextColor: theme.color.persistPrimary,
      // todayBackgroundColor: appConfig.colors.primary,
      monthTextColor: theme.color.textPrimary,
      dayTextColor: theme.color.textPrimary,
      textDisabledColor: theme.color.neutral,
      dotColor: theme.color.primary,
      selectedDotColor: appConfig.colors.primary,
      arrowColor: theme.color.neutral,
      textDayFontWeight: '300',
      textMonthFontWeight: 'bold',
      textDayFontSize: 16,
      textDayHeaderFontSize: 16,
    };
  }, [theme]);

  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
    onPressDate(day.dateString, handleClose, day);
  }, []);

  const handleClose = useCallback(() => {
    if (refModal.current) {
      refModal.current.close();
    }
  }, []);

  const handleCloseModal = () => {
    if (typeof onCloseModal === 'function') {
      onCloseModal();
    } else {
      pop();
    }
  };

  const handleContainerLayout = (e) => {
    if (e.nativeEvent.layout.height > calendarHeight) {
      const diff = e.nativeEvent.layout.height - calendarHeight;
      if (!!calendarHeight) {
        setCalendarHeightDiff(diff > 0 ? diff : 0);
      }
      setCalendarHeight(e.nativeEvent.layout.height);
    }
  };

  const headerContainerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.headingContainer,
        {
          borderBottomWidth: theme.layout.borderWidth,
          borderColor: theme.color.border,
        },
      ],
      headingContainerStyle,
    );
  }, [theme, headingContainerStyle]);

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
      useNativeDriver
      backdropContent={<Container style={styles.backdropContent} />}>
      <Container
        noBackground
        style={{top: -calendarHeightDiff}}
        onLayout={handleContainerLayout}>
        <Container safeLayout style={styles.contentContainer}>
          <Container style={headerContainerStyle}>
            <IconButton
              neutral
              bundle={BundleIconSetName.FONT_AWESOME}
              onPress={handleClose}
              name="close"
              iconStyle={styles.icon}
              style={styles.iconContainer}
            />
            <Typography
              type={TypographyType.DISPLAY_SMALL}
              style={styles.heading}>
              {title}
            </Typography>
          </Container>

          <Container style={{paddingBottom: calendarHeightDiff}}>
            <Calendar
              theme={themeCalendar}
              current={current}
              onDayPress={handleDayPress}
              // hideExtraDays
              markedDates={{
                [selectedDate]: {selected: true},
              }}
              minDate={minDate}
              enableSwipeMonths
            />
          </Container>
        </Container>
      </Container>
    </ModalBox>
  );
};

export default React.memo(ModalCalendar);
