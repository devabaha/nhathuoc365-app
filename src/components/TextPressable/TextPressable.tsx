import React, {useCallback, useMemo, useState} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
// types
import {TextPressableProps} from '.';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Typography, TypographyType} from '../base';

const TextPressable = ({children, ...textProps}: TextPressableProps) => {
  const {theme} = useTheme();

  const [isHighlight, setHighlight] = useState(false);

  const highlightStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.primary20,
    };
  }, [theme]);

  const handleLongPress = useCallback(() => {
    setHighlight(true);
  }, []);

  const handlePressOut = useCallback(() => {
    setHighlight(false);
  }, []);

  return (
    <TouchableWithoutFeedback
      //@ts-ignore
      hitSlop={HIT_SLOP}
      onLongPress={handleLongPress}
      delayLongPress={100}
      onPressOut={handlePressOut}>
      <Typography
        type={TypographyType.LABEL_MEDIUM}
        suppressHighlighting
        {...textProps}
        // @ts-ignore
        style={[isHighlight ? highlightStyle : {}, textProps.style]}>
        {children}
      </Typography>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(TextPressable);
