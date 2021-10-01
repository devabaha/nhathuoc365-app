import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

import appConfig from 'app-config';

import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    textAlignVertical: 'top',
  },
  footerContainer: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  btn: {
    marginLeft: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: appConfig.colors.primary,
    borderRadius: 4,
  },
  btnPrimary: {
    backgroundColor: appConfig.colors.primary,
  },
  btnTitle: {
    color: appConfig.colors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  btnTitlePrimary: {
    color: appConfig.colors.white,
  },
  disabled: {
    backgroundColor: appConfig.colors.disabled,
    borderColor: appConfig.colors.disabled,
  },
});

const BubbleEditing = ({value: valueProp, onEdit, onCancel}) => {
  const {t} = useTranslation();
  const refTextInput = useRef();

  const [value, setValue] = useState(valueProp || '');

  useEffect(() => {
    if (appConfig.device.isAndroid) {
      setTimeout(() => {
        if (refTextInput.current) {
          refTextInput.current.focus();
        }
      }, 500);
    }
  });

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const handleChangeText = useCallback((text) => {
    setValue(text);
  }, []);

  const handlePressEdit = useCallback(() => {
    onEdit(value);
  }, [value]);

  const editDisabled = !value || value === valueProp;

  return (
    <Container flex centerVertical={false}>
      <TextInput
        ref={refTextInput}
        autoFocus={appConfig.device.isIOS}
        multiline
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
      />
      <Container centerVertical={false}>
        <Container row style={styles.footerContainer}>
          <TouchableOpacity style={styles.btn} onPress={onCancel}>
            <Text style={styles.btnTitle}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={editDisabled}
            style={[
              styles.btn,
              styles.btnPrimary,
              editDisabled && styles.disabled,
            ]}
            onPress={handlePressEdit}>
            <Text style={[styles.btnTitle, styles.btnTitlePrimary]}>
              {t('edit')}
            </Text>
          </TouchableOpacity>
        </Container>
      </Container>
    </Container>
  );
};

export default React.memo(BubbleEditing);
