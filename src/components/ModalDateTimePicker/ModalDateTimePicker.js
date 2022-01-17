import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PlatformColor, StyleSheet, Text, TouchableOpacity} from 'react-native';
// 3-party libs
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modalbox';
// configs
import appConfig from 'app-config';
// helpers
import {isValidDate, isDarkMode} from 'app-helper';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// custom components
import {Container} from 'src/components/base';
import {useTheme} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  modal: {
    maxHeight: '80%',
    height: undefined,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  headerContainer: {
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  btnContainer: {
    marginHorizontal: 15,
  },
  btnTitle: {
    ...appConfig.styles.typography.heading3,
    fontWeight: 'bold',
    fontSize: 18,
  },
  btnCancel: {
    color: PlatformColor('systemGray'),
  },
  btnSelect: {
    color: PlatformColor('systemBlue'),
  },
  dateTimeContainer: {
    paddingHorizontal: 7,
  },
});

const ModalDateTimePicker = ({
  value: valueProps,
  containerStyle,
  entry = 'bottom',
  position = 'bottom',
  modalStyle,
  innerRef = () => {},
  onSelect = () => {},
  ...props
}) => {
  const {theme} = useTheme();

  const {t, i18n} = useTranslation();
  const refModal = useRef();

  const [value, setValue] = useState();

  useEffect(() => {
    setValue(isValidDate(valueProps) ? valueProps : new Date());
  }, [valueProps]);

  const handleDateChange = useCallback(
    (e, date) => {
      if (date) {
        setValue(date);
      }

      if (appConfig.device.isAndroid) {
        switch (e.type) {
          case 'set':
            handleSelect(undefined, date);
            break;
          case 'dismissed':
            handleClosedModal();
            break;
        }
      }
    },
    [value],
  );

  const handleSelect = useCallback(
    (e, data = value) => {
      handleClosingModal();
      setTimeout(() => onSelect(moment(data).format('YYYY-MM-DD'), data));
    },
    [value],
  );

  const handleClosingModal = useCallback(() => {
    refModal.current ? refModal.current.close() : handleClosedModal();
  }, []);

  const handleClosedModal = useCallback(() => {
    pop();
  }, []);

  const handleRef = useCallback((inst) => {
    innerRef(inst);
    refModal.current = inst;
  }, []);

  const textColor = theme.color.onSurface;
  const themeVariant = isDarkMode(theme) ? 'dark' : 'light';

  return (
    <Modal
      ref={handleRef}
      entry={entry}
      position={position}
      style={[styles.modal, modalStyle]}
      swipeToClose={false}
      backButtonClose
      isOpen
      onClosed={handleClosedModal}
      useNativeDriver>
      {appConfig.device.isIOS && (
        <Container row style={styles.headerContainer}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            style={[styles.btnContainer, styles.btnCancelContainer]}
            onPress={handleClosingModal}>
            <Text style={[styles.btnTitle, styles.btnCancel]}>
              {t('cancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={HIT_SLOP}
            style={styles.btnContainer}
            onPress={handleSelect}>
            <Text style={[styles.btnTitle, styles.btnSelect]}>{t('done')}</Text>
          </TouchableOpacity>
        </Container>
      )}
      <Container
        safeLayout
        style={mergeStyles(styles.dateTimeContainer, containerStyle)}>
        <DateTimePicker
          value={value}
          onChange={handleDateChange}
          mode="date"
          display={appConfig.device.isAndroid ? 'default' : 'inline'}
          locale={i18n.language}
          textColor={textColor}
          themeVariant={themeVariant}
          {...props}
        />
      </Container>
    </Modal>
  );
};

export default React.memo(ModalDateTimePicker);
