import React, {useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputClone: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
  },
});

const MultilineTextInput = ({
  editable,
  value,
  style,
  autoFocus = true,
  onChangeText = () => {},
  onContentLayout = () => {},
}) => {
  const {t} = useTranslation('social');

  const isFocus = useRef(0);
  const contentHeight = useRef(0);
  const textInputOffsetY = useRef(0);
  const textInputCursorEnd = useRef(0);

  const timeoutSelectionChange = useRef();

  const [contentText, setContentText] = useState(value);
  const [contentVisibleText, setContentVisibleText] = useState('');

  const handleInputLayout = (e) => {
    textInputOffsetY.current = e.nativeEvent.layout.y;
  };

  const handleFocus = (e) => {
    isFocus.current = true;
    const text = contentText;
    setContentText(' ' + text);
    // setContentText(text + ' ');
    setTimeout(() => {
      setContentText(text);
      setTimeout(() => (isFocus.current = false), 300);
    });
  };

  const handleBlur = () => {
    setContentVisibleText('');
  };

  const handleChangeText = (text) => {
    onChangeText(text);
    setContentText(text);

    const visibleText = text.slice(0, textInputCursorEnd.current);
    setContentVisibleText(visibleText);
  };

  const handleSelectionChange = (e) => {
    const {start, end} = e.nativeEvent.selection;
    textInputCursorEnd.current = end;

    if (isFocus.current) {
      const visibleText = contentText.slice(0, textInputCursorEnd.current);

      if (visibleText !== contentVisibleText) {
        clearTimeout(timeoutSelectionChange.current);
        timeoutSelectionChange.current = setTimeout(() => {
          setContentVisibleText(visibleText);
        }, 100);
      }
    }
  };
  // console.log('render');
  const handleInputCloneLayout = (e) => {
    contentHeight.current = e.nativeEvent.layout.height;
    onContentLayout(contentHeight.current + textInputOffsetY.current);
  };

  return (
    <>
      <TextInput
        style={[styles.input, style]}
        placeholder={t('pleasePost')}
        multiline
        scrollEnabled={false}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onLayout={handleInputLayout}
        onChangeText={handleChangeText}
        onSelectionChange={handleSelectionChange}
        editable={editable}
        value={contentText}
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
