import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  actionBarText: {
    padding: 15,
    textAlign: 'center',
  },
});

export const ActionBarText = ({title, style}) => {
  return (
    <Typography
      type={TypographyType.LABEL_MEDIUM}
      style={[styles.actionBarText, style]}>
      {title}
    </Typography>
  );
};

export default memo(ActionBarText);
