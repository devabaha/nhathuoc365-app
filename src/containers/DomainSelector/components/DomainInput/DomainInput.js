import React, {useCallback} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: appConfig.colors.primary,
    backgroundColor: '#fafafa',
  },
  textInput: {
    paddingVertical: appConfig.device.isIOS ? 15 : 7,
    paddingHorizontal: 10,
    flex: 1,
  },
  closeIconContainer: {
    marginRight: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#ededed',
  },
});

const DomainInput = ({
  innerRef,
  value,
  placeholder,
  containerStyle,
  onPressShowMore,
  onClearText = () => {},
  onChangeText = () => {},
  onSubmitEditing = () => {},
}) => {
  const handlePressShowMore = useCallback(() => {
    Keyboard.dismiss();
    onPressShowMore();
  }, []);

  return (
    <View ref={innerRef} style={[styles.inputContainer, containerStyle]}>
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={value}
        placeholder={placeholder}
      />

      {!!value && (
        <TouchableOpacity
          onPress={onClearText}
          style={styles.closeIconContainer}>
          <MaterialIcons name="close" />
        </TouchableOpacity>
      )}

      {!!onPressShowMore && (
        <TouchableOpacity
          onPress={handlePressShowMore}
          style={styles.closeIconContainer}>
          <MaterialIcons name="keyboard-arrow-down" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(DomainInput);
