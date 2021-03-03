import React, {useState, useRef} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from '../components/Button';
import {Actions} from 'react-native-router-flux';

function ModalInput({
  refModal = () => {},
  title,
  description,
  btnTitle,
  valueExecutor,
  btnDisabled,
  textInputProps,
  textInputContainerStyle,
  textInputStyle,
  value,
  onClosedModal,
  onSubmit = () => {},
  extraInput = null,
  backdropPressToClose = false
}) {
  const [text, setPrice] = useState(value);
  let ref_modal = null;

  function onChangeText(text) {
    setPrice(text);
  }

  function onClosing() {
    if (ref_modal) {
      ref_modal.close();
    }
  }

  function onClosed() {
    if (onClosedModal) {
      onClosedModal();
    } else {
      Actions.pop();
    }
  }

  function handleSubmit() {
    onSubmit(text.trim());
  }

  function getFormattedText() {
    return valueExecutor ? valueExecutor(text) : text;
    return value === undefined
      ? valueExecutor
        ? valueExecutor(text)
        : text
      : value;
  }

  function handleRef(ref) {
    ref_modal = ref;
    refModal(ref);
  }

  return (
    <ModalBox
      entry="top"
      position="center"
      style={[styles.modal]}
      backButtonClose
      ref={handleRef}
      isOpen
      onClosed={onClosed}
      useNativeDriver
      swipeToClose={false}
      backdropPressToClose={backdropPressToClose}>
      <View style={styles.headingContainer}>
        <TouchableOpacity onPress={onClosing} style={styles.iconContainer}>
          <Icon name="close" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{title}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>{description}</Text>
        <View style={[styles.textInputContainer, textInputContainerStyle]}>
          <TextInput
            value={getFormattedText()}
            onChangeText={onChangeText}
            {...textInputProps}
            style={[styles.textInput, textInputStyle]}
          />
          {extraInput}
        </View>
      </View>

      <Button
        disabled={
          btnDisabled !== undefined
            ? btnDisabled
            : !getFormattedText() || getFormattedText() == 0
        }
        title={btnTitle}
        onPress={handleSubmit}
        containerStyle={styles.btnContainer}
      />
    </ModalBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    maxWidth: '80%',
    height: undefined,
    borderRadius: 8,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
  },
  icon: {
    fontSize: 18,
    color: '#666',
  },
  headingContainer: {
    padding: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc',
  },
  heading: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  body: {
    padding: 15,
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
  textInputContainer: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    margin: 15,
  },
  textInput: {
    color: '#242424',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  btnContainer: {
    paddingBottom: 15,
  },
});

export default ModalInput;
