import React, {useCallback} from 'react';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import appConfig from 'app-config';
import DomainTag from '../DomainTag';

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: appConfig.colors.primary,
    backgroundColor: '#fafafa',
  },
  leftIcon: {
    marginLeft: 10,
    fontSize: 16,
  },
  textInput: {
    paddingVertical: appConfig.device.isIOS ? 15 : 7,
    paddingHorizontal: 10,
    flex: 1,
    fontSize: 13,
  },
  closeIconContainer: {
    marginRight: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#ededed',
  },
  tag: {
    marginRight: 10,
  },
});

const DomainInput = ({
  innerRef,
  value,
  iconName,
  iconColor,
  tag,
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
      {!!iconName && (
        <MaterialIcons
          name={iconName}
          style={styles.leftIcon}
          color={iconColor}
        />
      )}
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={value}
        placeholder={placeholder}
      />

      {!!tag?.label && (
        <DomainTag
          label={tag?.label}
          containerStyle={[
            styles.tag,
            {backgroundColor: tag?.color || undefined},
          ]}
        />
      )}

      {!!value && (
        <TouchableOpacity
          onPress={onClearText}
          style={styles.closeIconContainer}>
          <MaterialIcons name="close" />
        </TouchableOpacity>
      )}

      {!!onPressShowMore && (
        <TouchableOpacity
          hitSlop={HIT_SLOP}
          onPress={handlePressShowMore}
          style={styles.closeIconContainer}>
          <MaterialIcons name="keyboard-arrow-down" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(DomainInput);
