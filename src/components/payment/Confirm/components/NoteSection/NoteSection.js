import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
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

  title,
  status,
  value = '',
  editable = true,

  onChangeText = () => {},
  onContentSizeChange = () => {},
  onBlur = () => {},
  onPressActionBtn = () => {},
}) => {
  const {t} = useTranslation(['orders', 'confirm']);

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
      actionBtnTitle={status == CART_STATUS_READY && t('confirm.change')}
      onPressActionBtn={onPressActionBtn}
      >
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
