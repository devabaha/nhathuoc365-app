import React, {useRef} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';

import SectionContainer from '../SectionContainer';

const MIN_ADDRESS_HEIGHT = 50;
const MAX_ADDRESS_HEIGHT = MIN_ADDRESS_HEIGHT * 4;
const MAX_LENGTH = 250;

const styles = StyleSheet.create({
  input_label_help: {
    fontSize: 12,
    marginTop: 2,
    color: '#666666',
  },
  input_address_text: {
    width: '100%',
    color: '#333',
    fontSize: 14,
    marginTop: 4,
    minHeight: MIN_ADDRESS_HEIGHT,
    maxHeight: MAX_ADDRESS_HEIGHT,
    paddingLeft: 22,
  },
  notEditable: {
    minHeight: undefined,
  },
  noNote: {
    fontStyle: 'italic',
  },
});

const NoteSection = ({
  refInput,

  siteId,
  cartId,

  title,
  isShowActionTitle,
  value = '',
  editable = true,

  onChangeText = () => {},
  onContentSizeChange = () => {},
  onBlur = () => {},
  onNoteUpdated = () => {},
  onPressActionBtn,
}) => {
  const {t} = useTranslation(['orders', 'confirm', 'common']);
  const refModalInput = useRef();

  const handlePressActionBtn = () => {
    typeof onPressActionBtn === 'function'
      ? onPressActionBtn()
      : openEditNote();
  };

  const openEditNote = () => {
    Actions.push(appConfig.routes.modalInput, {
      backdropPressToClose: true,
      title: t('confirm.note.title'),
      btnTitle: t('confirm.change'),
      value,
      textInputProps: {
        autoFocus: true,
        multiline: true,
        placeholder: t('confirm.note.placeholder'),
      },
      textInputStyle: {
        minHeight: 60,
      },
      onSubmit: (note) => handleUpdateNote(note),
      refModal: (inst) => (refModalInput.current = inst),
    });
  };

  const handleUpdateNote = async (note) => {
    if (refModalInput.current) {
      refModalInput.current.close();
    }

    const data = {user_note: note};

    try {
      const response = await APIHandler.edit_user_note(siteId, cartId, data);

      if (response?.status === STATUS_SUCCESS) {
        onNoteUpdated(note);
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('edit_user_note ' + e);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    }
  };

  return (
    <SectionContainer
      marginTop
      iconName="pen-square"
      title={
        title || (
          <>
            <Text>{`${t('confirm.note.title')} `}</Text>
            <Text style={styles.input_label_help}>
              ({t('confirm.note.description')})
            </Text>
          </>
        )
      }
      actionBtnTitle={isShowActionTitle && t('confirm.change')}
      onPressActionBtn={handlePressActionBtn}>
      <View pointerEvents={editable ? 'auto' : 'none'}>
        <TextInput
          ref={refInput}
          style={[
            styles.input_address_text,
            !editable && styles.notEditable,
            !editable && !value && styles.noNote,
          ]}
          maxLength={MAX_LENGTH}
          placeholder={t('confirm.note.placeholder')}
          multiline
          onChangeText={onChangeText}
          value={editable ? value : value || t('confirm.note.noNote')}
          onContentSizeChange={onContentSizeChange}
          onBlur={onBlur}
        />
      </View>
    </SectionContainer>
  );
};

export default React.memo(NoteSection);
