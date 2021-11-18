import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';
import {isValidDate} from 'app-helper';

import {Container} from '../Layout';
import {mergeStyles} from 'src/Themes/helper';

const styles = StyleSheet.create({
  modal: {
    maxHeight: '80%',
    height: undefined,
    paddingBottom: appConfig.device.bottomSpace,
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
    color: Platform.select({
      ios: PlatformColor('systemGray'),
      default: '#888',
    }),
  },
  btnSelect: {
    color: Platform.select({
      ios: PlatformColor('systemBlue'),
      default: appConfig.colors.primary,
    }),
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
    Actions.pop();
  }, []);

  const handleRef = useCallback((inst) => {
    innerRef(inst);
    refModal.current = inst;
  }, []);

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
      <View style={mergeStyles(styles.dateTimeContainer, containerStyle)}>
        <DateTimePicker
          value={value}
          onChange={handleDateChange}
          mode="date"
          display={appConfig.device.isAndroid ? 'default' : 'inline'}
          locale={i18n.language}
          {...props}
        />
      </View>
    </Modal>
  );
};

export default React.memo(ModalDateTimePicker);
