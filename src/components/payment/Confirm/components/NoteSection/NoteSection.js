import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// routing
import {push} from 'app-helper/routing';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import {Input, Typography} from 'src/components/base';

const MIN_ADDRESS_HEIGHT = 50;
const MAX_ADDRESS_HEIGHT = MIN_ADDRESS_HEIGHT * 4;
const MAX_LENGTH = 250;
const INPUT_HEIGHT = 60;

const styles = StyleSheet.create({
  input_label_help: {
    marginTop: 2,
  },
  input_address_text: {
    width: '100%',
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
    push(appConfig.routes.modalInput, {
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
        height: INPUT_HEIGHT,
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
            {`${t('confirm.note.title')} `}
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM}
              style={styles.input_label_help}>
              ({t('confirm.note.description')})
            </Typography>
          </>
        )
      }
      actionBtnTitle={isShowActionTitle && t('confirm.change')}
      onPressActionBtn={handlePressActionBtn}>
      <View pointerEvents={editable ? 'auto' : 'none'}>
        <Input
          type={TypographyType.LABEL_MEDIUM}
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
