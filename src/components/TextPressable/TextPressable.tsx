import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {TextPressableProps} from '.';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  highlight: {
    // @ts-ignore
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.2),
  },
});

const TextPressable = ({children, ...textProps}: TextPressableProps) => {
  const [isHighlight, setHighlight] = useState(false);

  const handleLongPress = useCallback(() => {
    setHighlight(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setHighlight(false);
  }, []);

  return (
    <TouchableWithoutFeedback
      onLongPress={handleLongPress}
      delayLongPress={100}
      onPressOut={handlePressOut}>
      <Text
        suppressHighlighting
        style={isHighlight && styles.highlight}
        {...textProps}>
        {children}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(TextPressable);
