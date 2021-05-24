import React, {useRef, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 15,
  },
  inputClone: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
  },
});

const MultilineTextInput = ({onContentLayout = () => {}}) => {
  const {t} = useTranslation('social');

  const isFocus = useRef(0);
  const contentHeight = useRef(0);
  const textInputOffsetY = useRef(0);
  const textInputCursorEnd = useRef(0);
  const tempContentVisibleText = useRef('');

  const timeoutSelectionChange = useRef();

  const [contentText, setContentText] = useState('');
  const [contentVisibleText, setContentVisibleText] = useState('');

  const handleInputLayout = (e) => {
    textInputOffsetY.current = e.nativeEvent.layout.y;
  };

  const handleFocus = (e) => {
    isFocus.current = true;
    handleSelectionChange({
      nativeEvent: {
        selection: {
          start: 1,
          end: textInputCursorEnd.current,
        },
      },
    });
  };

  const handleChangeText = (text) => {
    const visibleText = text.slice(0, textInputCursorEnd.current);
    setContentText(text);

    setContentVisibleText(visibleText);
    tempContentVisibleText.current = visibleText;
  };

  const handleSelectionChange = (e) => {
    clearTimeout(timeoutSelectionChange.current);
    const {start, end} = e.nativeEvent.selection;
    textInputCursorEnd.current = end;

    if (isFocus.current) {
      const visibleText = contentText.slice(0, textInputCursorEnd.current);
      if (visibleText !== tempContentVisibleText.current) {
        setContentVisibleText(visibleText);
        tempContentVisibleText.current = visibleText;
      } else {
        timeoutSelectionChange.current = setTimeout(() => {
          // console.log('a')
          setContentVisibleText(contentVisibleText);
          tempContentVisibleText.current = contentVisibleText;
          //   onContentLayout(contentHeight.current + textInputOffsetY.current);
        });
      }
      isFocus.current = false;
    }
  };

  const handleInputCloneLayout = (e) => {
    contentHeight.current = e.nativeEvent.layout.height;
    console.log(contentHeight.current);
    onContentLayout(contentHeight.current + textInputOffsetY.current);
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={t('pleasePost')}
        multiline
        scrollEnabled={false}
        autoFocus
        onFocus={handleFocus}
        onBlur={() => setContentVisibleText('')}
        onLayout={handleInputLayout}
        onChangeText={handleChangeText}
        onSelectionChange={handleSelectionChange}
        // value={contentText}
      />
      <TextInput
        onLayout={handleInputCloneLayout}
        multiline
        pointerEvents="none"
        style={[styles.input, styles.inputClone]}>
        {contentVisibleText}
      </TextInput>
    </>
  );
};

export default React.memo(MultilineTextInput);
