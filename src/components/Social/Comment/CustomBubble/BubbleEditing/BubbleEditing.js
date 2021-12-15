import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {TypographyType} from 'src/components/base';
import {
  AppFilledButton,
  AppOutlinedButton,
  Container,
  Input,
} from 'src/components/base';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  input: {
    textAlignVertical: 'top',
    height: 150,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  footerContainer: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  btn: {
    marginLeft: 10,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  btnTitle: {
    fontWeight: '500',
  },
});

const BubbleEditing = ({value: valueProp, onEdit, onCancel}) => {
  const {theme} = useTheme();

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

  const editDisabled = value === valueProp;

  const inputContainerStyle = useMemo(() => {
    return mergeStyles(styles.inputContainer, {
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <Container noBackground flex>
      <Container style={inputContainerStyle}>
        <Input
          ref={refTextInput}
          autoFocus={appConfig.device.isIOS}
          multiline
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
        />
      </Container>
      <Container noBackground row style={styles.footerContainer}>
        <AppOutlinedButton
          typoProps={{type: TypographyType.LABEL_SEMI_MEDIUM}}
          style={styles.btn}
          titleStyle={styles.btnTitle}
          onPress={onCancel}>
          {t('cancel')}
        </AppOutlinedButton>
        <AppFilledButton
          typoProps={{type: TypographyType.LABEL_SEMI_MEDIUM}}
          disabled={editDisabled}
          style={styles.btn}
          titleStyle={styles.btnTitle}
          onPress={handlePressEdit}>
          {t('edit')}
        </AppFilledButton>
      </Container>
    </Container>
  );
};

export default React.memo(BubbleEditing);
