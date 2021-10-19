import React, {useState, useEffect, useRef} from 'react';
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
import appConfig from 'app-config';

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
  backdropPressToClose = false,
}) {
  const [text, setPrice] = useState(value);
  let ref_modal = null;
  let ref_input = useRef();

  useEffect(() => {
    if (textInputProps?.autoFocus) {
      setTimeout(() => {
        if (ref_input.current) {
          ref_input.current.focus();
        }
      });
    }
  }, []);

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
        {!!description && <Text style={styles.description}>{description}</Text>}
        <View style={[styles.textInputContainer, textInputContainerStyle]}>
          <TextInput
            ref={ref_input}
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
    borderBottomWidth: 2,
    borderBottomColor: appConfig.colors.primary,
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
    paddingTop: 20,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  textInputContainer: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: appConfig.device.ratio * 3,
    paddingHorizontal: 15,
    paddingBottom: appConfig.device.ratio * 3 + 1,
    marginBottom: 0
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
