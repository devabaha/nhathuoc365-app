import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, PlatformColor, StyleSheet} from 'react-native';
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
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, TextButton} from 'src/components/base';

const styles = StyleSheet.create({
  modal: {
    maxHeight: '80%',
    height: undefined,
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
    fontWeight: 'bold',
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

  const headerBtnTitleTypoProps = {type: TypographyType.LABEL_SEMI_HUGE};

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

  const btnCancelStyle = useMemo(() => {
    return mergeStyles(styles.btnTitle, {
      color: Platform.select({
        ios: PlatformColor('systemGray'),
        default: theme.color.textSecondary,
      }),
    });
  }, [theme]);

  const btnSelectStyle = useMemo(() => {
    return mergeStyles(styles.btnTitle, {
      color: Platform.select({
        ios: PlatformColor('systemBlue'),
        default: theme.color.primaryHighlight,
      }),
    });
  }, [theme]);

  const modalBaseStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.modal,
        {
          borderTopLeftRadius: theme.layout.borderRadiusHuge,
          borderTopRightRadius: theme.layout.borderRadiusHuge,
        },
      ],
      modalStyle,
    );
  }, [theme, modalStyle]);

  return (
    <Modal
      ref={handleRef}
      entry={entry}
      position={position}
      style={modalBaseStyle}
      swipeToClose={false}
      backButtonClose
      isOpen
      onClosed={handleClosedModal}
      useNativeDriver>
      {appConfig.device.isIOS && (
        <Container row style={styles.headerContainer}>
          <TextButton
            typoProps={headerBtnTitleTypoProps}
            hitSlop={HIT_SLOP}
            style={styles.btnContainer}
            titleStyle={btnCancelStyle}
            onPress={handleClosingModal}>
            {t('cancel')}
          </TextButton>

          <TextButton
            typoProps={headerBtnTitleTypoProps}
            hitSlop={HIT_SLOP}
            style={styles.btnContainer}
            titleStyle={btnSelectStyle}
            onPress={handleSelect}>
            {t('done')}
          </TextButton>
        </Container>
      )}
      <Container
        safeLayout
        style={mergeStyles(styles.dateTimeContainer, containerStyle)}>
        <DateTimePicker
          textColor={theme.color.textPrimary}
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
