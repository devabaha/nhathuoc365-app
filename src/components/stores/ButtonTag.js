import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import appConfig from 'app-config';

function ButtonTag({text, onPress, checked}) {
  const [isChecked, setChecked] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.containerStyleTag,
        {
          backgroundColor: isChecked ? appConfig.primaryColor : '#ECF4FF',
        },
      ]}
      onPress={handlePress}>
      <Text style={{color: isChecked ? '#fff' : '#333'}}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerStyleTag: {
    backgroundColor: '#ECF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 3,
  },
});

export default ButtonTag;
