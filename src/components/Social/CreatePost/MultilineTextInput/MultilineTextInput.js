import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
// custom components
import {Input, TypographyType} from 'src/components/base';

const styles = StyleSheet.create({
  input: {
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'top',
  },
  inputClone: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
    textAlignVertical: 'top',
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
      <Input
        type={TypographyType.LABEL_LARGE}
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

      <Input
        type={TypographyType.LABEL_LARGE}
        onLayout={handleInputCloneLayout}
        multiline
        pointerEvents="none"
        style={[styles.input, styles.inputClone]}>
        {contentVisibleText}
      </Input>
    </>
  );
};

export default React.memo(MultilineTextInput);
